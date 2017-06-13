"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardManager = Framework.KeyBoardManager;
    const KeyboardConfig = lf2.KeyboardConfig;
    const GameObjectPool = lf2.GameObjectPool;
    const GameMapPool = lf2.GameMapPool;
    const Team = lf2.Team;
    const _SELECTION_CONTAINER_ID = "__selection_container";
    const PLAYER_TAG = 'data-player';
    const STAGE_TAG = 'data-select-stage';
    const CHAR_TAG = 'data-char';
    const TEAM_TAG = 'data-team';
    const COUNTING_DOWN_CLASS = 'counting-down';
    const REMINING_TIME_TAG = 'data-rt';
    const Player = lf2.Player;
    const START_GAME_MIN_PLAYER_COUNT = 2;
    const SELECTION_STAGE = {
        WAIT_JOIN: 0,
        SELECT_CHARACTER: 1,
        SELECT_TEAM: 2,
        SELECT_DONE: 3,
        ENTERING: 4,
    };
    const RANDOM_ID = -1;
    const RAND_CHAR_ID_MIN = 1;
    const RAND_CHAR_ID_MAX = 24;
    const FREE_CHAR_MIN = -1;
    const FREE_CHAR_MAX = RAND_CHAR_ID_MAX;

    /**
     *
     * @param {Number} currentIndex
     * @param {Number} maxLen
     * @param {Number} offset
     * @returns {Number}
     */
    const setOffsetIndex = (currentIndex, maxLen, offset) => {
        if (offset === 0) return currentIndex;

        return (currentIndex + maxLen + offset) % maxLen;
    };

    const countDonePlayer = (previousValue, curPlayer) => {
        return previousValue + (curPlayer._selectStage === SELECTION_STAGE.SELECT_DONE ? 1 : 0);
    };
    const countNonDonePlayer = (previousValue, curPlayer) => {
        const ss = curPlayer._selectStage;
        return previousValue + (ss !== SELECTION_STAGE.SELECT_DONE && ss !== SELECTION_STAGE.WAIT_JOIN ? 1 : 0);
    };

    /**
     * @class lf2.SelectionLevel
     * @extends Framework.Level
     * @implements Framework.KeyboardEventInterface
     */
    lf2.SelectionLevel = class extends Framework.Level {
        constructor() {
            super();

            this.html = '';
            //Load Selection view
            this._htmlLoader = ResourceManager.loadResource(define.DATA_PATH + 'SelectionScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
            });

            this._cheatMusicPlayed = false;
        }

        load() {
            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            //播放時, 需要給name, 其餘參數可參考W3C
            this.audio = new Framework.Audio({
                ok: define.MUSIC_PATH + 'm_ok.m4a',
                join: define.MUSIC_PATH + 'm_join.m4a',
                cancel: define.MUSIC_PATH + 'm_cancel.m4a',
            });
            this._chectAudio = new Framework.Audio({
                pass: define.MUSIC_PATH + 'm_pass.m4a',
            });

            this.players = [];
            this.playersEle = [];

            for (let playerId = 0; playerId < define.PLAYER_COUNT; playerId++) {
                const p = new Player(playerId);
                p.setSelectStage = function (val) {
                    val |= 0;
                    this._selectStage = val;
                    if (this.elem) this.elem.attr(STAGE_TAG, this._selectStage);
                };
                p.setSelectStage(SELECTION_STAGE.WAIT_JOIN);
                p._charIndex = 0;
                p._teamId = 0;
                this.players[playerId] = p;
            }

            this._attached = false;
            this._selectionContainer = undefined;
            this._htmlLoader.then(() => {
                this.showSelectionPanel();
            });
            this._charIdArray = [RANDOM_ID];
            this._teamInsArray = new Array(define.TEAM_COUNT + 1);
            this._mapIdArray = [RANDOM_ID];
            this._mapIndex = 0;

            GameObjectPool.forEach(obj => {
                if (obj instanceof lf2.GameObjectCharacter) {
                    this._charIdArray.push(obj.id);
                }
            });

            GameMapPool.forEach(obj => {
                if (obj instanceof lf2.GameMap) {
                    this._mapIdArray.push(obj.id);
                }
            });

            for (let i = 0; i <= define.TEAM_COUNT; i++) {
                this._teamInsArray[i] = Team.GetTeamInstance(i);
            }

            this._isEnteringPanelShowed = false;

            this._stopAllMusic();
            this.checkCheat();
        }

        /**
         * initialize()
         *
         * Initializes this object.
         *
         * @return  .
         */
        initialize() {
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            super.update();
        }

        /**
         * draw(parentCtx)
         *
         * Draws the given parent context.
         *
         * @param   parentCtx   Context for the parent.
         *
         * @return  .
         */
        draw(parentCtx) {
            if (!this._selectionContainer) {
                console.warn('html not loaded');
                return;
            }

            super.draw(parentCtx);
            console.log('selection draw');

            for (let i = 0; i < define.SHOW_PLAYER_COUNT; i++) {
                const player = this.players[i] || {};

                let elem = player.elem || this.playersEle[i];
                let stage = intval(player._selectStage || 0);

                const playerName = elem.find('.player-name'),
                    fighterName = elem.find('.fighter-name'),
                    teamName = elem.find('.team-name');

                //Remove all flashing text
                elem.find('.flashing').removeClass('flashing');
                switch (stage) {
                    case SELECTION_STAGE.WAIT_JOIN:
                        playerName.addClass('flashing');
                        elem.removeAttr(CHAR_TAG);
                        elem.removeAttr(TEAM_TAG);
                        break;
                    case SELECTION_STAGE.SELECT_CHARACTER:
                        fighterName.addClass('flashing');
                        break;
                    case SELECTION_STAGE.SELECT_TEAM:
                        teamName.addClass('flashing');
                        teamName.text(this._teamInsArray[player._teamId].toString());
                        break;
                    case SELECTION_STAGE.SELECT_DONE:
                        if (this._countDownTimer !== undefined) {
                            this._selectionPanel.attr(REMINING_TIME_TAG, this._remainingTime);
                        }
                        break;
                }
            }

            if (this._isEnteringPanelShowed) {
                this._enteringPanelItems.removeClass('current');
                this._enteringPanelItems[this._enteringIndex].classList.add('current');

                let mapId = this._mapIdArray[this._mapIndex];
                let mapName = "";
                if (mapId === RANDOM_ID) {
                    mapName = "Random";
                } else {
                    mapName = GameMapPool.get(mapId).name;
                }
                $(this._enteringPanelItems[3]).find('.input').text(mapName);
            }

        }

        /**
         * keypress(e, list, oriE)
         *
         * Keypress.
         *
         * @param   e       The unknown to process.
         * @param   list    The list.
         * @param   oriE    The ori e.
         *
         * @return  .
         */
        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);

            this.players.forEach((player) => {
                if (player.keydown(oriE)) {
                    this._handlePlayerKeypress(player);
                }
            });

            if (!this._isEnteringPanelShowed && this._isMinPlayerEntered()) {
                console.log('All player entered');
                this._startCountDown();
            }

            this.forceDraw();
        }

        /**
         * keyup(e, list, oriE)
         *
         * Keyups.
         *
         * @param   e       The unknown to process.
         * @param   list    The list.
         * @param   oriE    The ori e.
         *
         * @return  .
         */
        keyup(e, list, oriE) {
            super.keyup(e, list, oriE);

            this.players.forEach((player) => {
                player.keyup(e, list, oriE);
            });

            this.checkCheat();

            //this.forceDraw();
        }

        /**
         * Handle player key press
         *
         * @param player
         * @private
         */
        _handlePlayerKeypress(player) {
            let elem = player.elem;
            let stage = intval(player._selectStage || 0);
            const prevStage = stage;

            if (this._countDownTimer === undefined && !this._isEnteringPanelShowed) {
                if (player.isKeyPressed(KeyboardConfig.KEY_MAP.ATTACK)) {
                    console.log(`Player: ${player.playerId}, Attack pressed`);
                    stage++;
                } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.JUMP)) {
                    console.log(`Player: ${player.playerId}, Jump pressed`);
                    stage--;
                }
            } else if (this._countDownTimer !== undefined) {
                if (player.isKeyPressed(KeyboardConfig.KEY_MAP.ATTACK) && stage === SELECTION_STAGE.WAIT_JOIN) {
                    this._stopCountDown();
                    stage++;
                }
            }

            if (stage < SELECTION_STAGE.WAIT_JOIN) stage = SELECTION_STAGE.WAIT_JOIN;
            if (stage > SELECTION_STAGE.SELECT_DONE) stage = SELECTION_STAGE.SELECT_DONE;

            if (this._isEnteringPanelShowed) {
                stage = SELECTION_STAGE.ENTERING;
            }


            switch (stage) {
                case SELECTION_STAGE.SELECT_CHARACTER: {
                    let charIdxOffset = 0;
                    if (player.isKeyPressed(KeyboardConfig.KEY_MAP.LEFT)) {
                        charIdxOffset = -1;
                    } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.RIGHT)) {
                        charIdxOffset = 1;
                    } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.UP)) {
                        charIdxOffset = -player._charIndex;
                    }
                    if (charIdxOffset !== 0) {
                        //player._charIndex = setOffsetIndex(player._charIndex, this._charIdArray.length, charIdxOffset);
                        player._charIndex = this.getCharIdInRange(player._charIndex, charIdxOffset);
                    }

                    if (this._charIdArray[player._charIndex] === RANDOM_ID) {
                        player._isRandomChar = true;
                    } else {
                        player._isRandomChar = false;
                    }


                    elem.attr(CHAR_TAG, this._charIdArray[player._charIndex]);
                }
                    break;
                case SELECTION_STAGE.SELECT_TEAM: {
                    let teamIdxOffset = 0;
                    if (player.isKeyPressed(KeyboardConfig.KEY_MAP.LEFT)) {
                        teamIdxOffset = -1;
                    } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.RIGHT)) {
                        teamIdxOffset = 1;
                    }
                    if (teamIdxOffset !== 0) {
                        //player._charIndex = setOffsetIndex(player._charIndex, this._charIdArray.length, charIdxOffset);
                        player._teamId = this.getTeamIdInRange(player._teamId, teamIdxOffset);
                    }

                    elem.attr(TEAM_TAG, player._teamId);
                }
                    break;
                case SELECTION_STAGE.SELECT_DONE: {
                    if (this._remainingTime !== undefined) {
                        this._timerTick();
                        this._selectionPanel.attr(REMINING_TIME_TAG, this._remainingTime);
                    }
                }
                    break;
                case SELECTION_STAGE.ENTERING: {
                    let itemOffset = 0;
                    if (player.isKeyPressed(KeyboardConfig.KEY_MAP.UP)) {
                        itemOffset = -1;
                    } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.DOWN)) {
                        itemOffset = 1;
                    } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.ATTACK)) {
                        switch (this._enteringIndex) {
                            case 0: //START GAME
                                let _passData = {
                                    players: [],
                                    mapId: RANDOM_ID,
                                };

                                this.players.forEach(p => {
                                    if (p._selectStage !== SELECTION_STAGE.ENTERING) return;

                                    _passData.players[p.playerId] = {
                                        charId: this._charIdArray[p._charIndex],
                                        teamId: p._teamId,
                                    };
                                });
                                _passData.mapId = this._mapIdArray[this._mapIndex];
                                if (_passData.mapId === RANDOM_ID) {
                                    let tmpArr = this._mapIdArray.filter(x => x !== RANDOM_ID);
                                    _passData.mapId = tmpArr[(Math.random() * tmpArr.length) | 0];
                                }

                                console.log('start fight', _passData);
                                this._stopAllMusic();
                                Game.goToLevel('fight', _passData);
                                break;
                            case 1: //RESET SELECTION
                                Framework.Game.goToLevel('selection');
                                break;
                            case 2: //RESET RANDOM
                                this._randomAllSelectChar();
                                break;
                            case 3://SELECT MAP
                                this._mapIndex = setOffsetIndex(this._mapIndex, this._mapIdArray.length, 1);

                                break;
                            case 4:
                                window.open(atob(lf2.Egg._EGG_CONTENT._JOIN_APPLICATION_FORM_URL));
                                break;
                        }

                        this.audio.play('ok');
                    }

                    if (itemOffset !== 0) {
                        this._enteringIndex = setOffsetIndex(this._enteringIndex, this._enteringIndexMax, itemOffset);
                    }

                }
                    break;

            }


            if (prevStage !== stage && !this._isEnteringPanelShowed) {
                if (player.isKeyPressed(KeyboardConfig.KEY_MAP.ATTACK)) {
                    this.audio.play('join');
                } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.JUMP)) {
                    this.audio.play('cancel');
                }
            }

            if (!this._isEnteringPanelShowed) {
                player.setSelectStage(stage);
            }
        }

        /**
         * _randomSelectChar(player)
         *
         * Random select character.
         *
         * @param   player  The player.
         *
         * @return  .
         */
        _randomSelectChar(player) {
            let charId = this._charIdArray[player._charIndex];
            if (player._isRandomChar) {
                let tmpArr = this._charIdArray.filter(x => x.inRange(RAND_CHAR_ID_MIN, RAND_CHAR_ID_MAX));
                let idx = (Math.random() * tmpArr.length) | 0;
                charId = tmpArr[idx];

                player._charIndex = this._charIdArray.indexOf(charId);
            }

            player.elem.attr(CHAR_TAG, charId);
        }

        /**
         * _randomAllSelectChar()
         *
         * Random all select character.
         *
         * @return  .
         */
        _randomAllSelectChar() {
            this.players.forEach(p => {
                this._randomSelectChar(p);
            });
        }

        /**
         * showSelectionPanel()
         *
         * Shows the selection panel.
         *
         * @return  .
         */
        showSelectionPanel() {
            if (!this.isCurrentLevel) return;

            if (this.html !== "" && !this._selectionContainer) {
                $("#" + _SELECTION_CONTAINER_ID).remove();

                this._selectionContainer = $(this.html);
                this._selectionContainer.attr("id", _SELECTION_CONTAINER_ID);
                this.forceDraw();
                this._selectionContainer.find("#selection_ctr_note").click(() => {
                    Game.goToLevel('control');
                });

                let playerElement = this._selectionContainer.find(".player:first");
                let playerContainer = this._selectionContainer.find(".players");
                let appendStyleText = "";

                for (let i = 0; i < define.SHOW_PLAYER_COUNT; i++) {
                    this.playersEle[i] = playerElement.clone();
                    this.playersEle[i].attr(PLAYER_TAG, i);
                    if (this.players[i]) this.players[i].elem = this.playersEle[i];
                    playerContainer.append(this.playersEle[i]);

                    const playerName = this.players[i] ? this.players[i].keyboardConfig.config.NAME : "";
                    appendStyleText += `.player[${PLAYER_TAG}="${i}"]\x20.player-name:before{content: "${playerName}";}\n`;
                }

                this._charIdArray.forEach(objId => {
                    if (objId === RANDOM_ID) return;

                    const obj = GameObjectPool.get(objId);
                    appendStyleText += `.player[${CHAR_TAG}="${obj.id}"]\x20.player-cover{background-image: url(${obj.head.src});}\n`;
                    appendStyleText += `.player[${CHAR_TAG}="${obj.id}"]\x20.fighter-name:before{content: "${obj.name}";}\n`;
                });

                appendStyleText = '<style type="text/css">' + appendStyleText + '</style>';
                this._selectionContainer.append(appendStyleText);

                playerElement.remove();
                $("body").append(this._selectionContainer);
                this._selectionPanel = this._selectionContainer.find("#selection_panel");
                this._enteringPanel = this._selectionContainer.find("#selection_entering_panel");
                this._enteringPanelItems = this._enteringPanel.find("li.item");
                this._attached = true;

                this._enteringIndexMax = this._enteringPanelItems.length;

                Game.resizeEvent();
            }
        }

        /**
         * _isMinPlayerEntered()
         *
         * Is minimum player entered.
         *
         * @return  .
         */
        _isMinPlayerEntered() {
            return this.players.reduce(countDonePlayer, 0) >= START_GAME_MIN_PLAYER_COUNT &&
                this.players.reduce(countNonDonePlayer, 0) === 0;
        }

        /**
         * _isAllPlayerEntered()
         *
         * Is all player entered.
         *
         * @return  .
         */
        _isAllPlayerEntered() {
            return this.players.reduce(countNonDonePlayer, 0) === 0;
        }

        /**
         * _startCountDown()
         *
         * Starts count down.
         *
         * @return  .
         */
        _startCountDown() {
            if (this._countDownTimer !== undefined) return;

            this._remainingTime = 5;
            this._selectionPanel.attr(REMINING_TIME_TAG, this._remainingTime);
            this._selectionPanel.addClass(COUNTING_DOWN_CLASS);
            this._countDownTimer = setInterval(() => {
                this._timerTick();
            }, 1000);
        }

        /**
         * _stopCountDown()
         *
         * Stops count down.
         *
         * @return  .
         */
        _stopCountDown() {
            this._selectionPanel.removeClass(COUNTING_DOWN_CLASS);
            clearInterval(this._countDownTimer);
            this._countDownTimer = undefined;
        }

        /**
         * _timerTick()
         *
         * Timer tick.
         *
         * @return  .
         */
        _timerTick() {
            if (this._countDownTimer === undefined) return;

            if (this._remainingTime <= 1) {
                this._stopCountDown();
                this._showEnteringPanel();
                this.forceDraw();
                return;
            }

            this.forceDraw();

            this._remainingTime--;
        }

        /**
         * _showEnteringPanel()
         *
         * Shows the entering panel.
         *
         * @return  .
         */
        _showEnteringPanel() {
            this._isEnteringPanelShowed = true;
            this._selectionPanel.addClass('entering-shown');
            this._enteringPanel.addClass('show');
            this._randomAllSelectChar();
            this.players.forEach((p) => {
                if (p._selectStage === SELECTION_STAGE.WAIT_JOIN) return;

                if (p._selectStage === SELECTION_STAGE.SELECT_DONE) {
                    p.setSelectStage(SELECTION_STAGE.ENTERING);

                } else {
                    console.error("asdf", p._selectStage);
                }
            });

            this._enteringIndex = 0;
        }

        /**
         * autodelete()
         *
         * Autodeletes this object.
         *
         * @return  .
         */
        autodelete() {
            if (this._selectionContainer) {
                this._stopCountDown();
                this._selectionContainer.remove();
                this._selectionContainer = undefined;
            }
        }

        /**
         * Check cheat.
         *
         * @return  .
         */
        checkCheat() {
            if (this._cheatMusicPlayed) return true;
            if (lf2['!MainGame'].cheat) {
                this._chectAudio.play('pass');

                this._cheatMusicPlayed = true;

                return true;
            }

            return false;
        }

        /**
         * Finds the charidinrange of the given arguments.
         *
         * @param   currentIndex    The current index.
         * @param   offset          The offset.
         *
         * @return  The calculated character identifier in range.
         */
        getCharIdInRange(currentIndex, offset) {
            if (offset === 0) return currentIndex;

            const newIndex = setOffsetIndex(currentIndex, this._charIdArray.length, offset);

            if (lf2['!MainGame'].cheat || this._charIdArray[newIndex].inRange(FREE_CHAR_MIN, FREE_CHAR_MAX)) return newIndex;

            return this.getCharIdInRange(newIndex, offset);
        }

        /**
         * Finds the teamidinrange of the given arguments.
         *
         * @param   currentIndex    The current index.
         * @param   offset          The offset.
         *
         * @return  The calculated team identifier in range.
         */
        getTeamIdInRange(currentIndex, offset) {
            if (offset === 0) return currentIndex;

            return setOffsetIndex(currentIndex, this._teamInsArray.length, offset);
        }

        /**
         * Stops all music.
         *
         * @return  .
         */
        _stopAllMusic() {
            lf2.Egg.stop();
            // Framework.Audio.stopAll();
        }
    };

    return lf2;
})(lf2 || {});
