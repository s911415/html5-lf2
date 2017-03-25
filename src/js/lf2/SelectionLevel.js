﻿"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardManager = Framework.KeyBoardManager;
    const KeyboardConfig = lf2.KeyboardConfig;
    const GameObjectPool = lf2.GameObjectPool;
    const GameMapPool = lf2.GameMapPool;
    const _SELECTION_CONTAINER_ID = "__selection_container";
    const PLAYER_TAG = 'data-player';
    const STAGE_TAG = 'data-select-stage';
    const CHAR_TAG = 'data-char';
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

    /**
     * @class lf2.SelectionLevel
     * @extends Framework.Level
     * @implements Framework.KeyboardEventInterface
     */
    lf2.SelectionLevel = class extends Framework.Level {
        constructor() {
            super();
        }

        load() {
            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            //播放時, 需要給name, 其餘參數可參考W3C
            this.audio = new Framework.Audio({
                ok: {
                    ogg: define.MUSIC_PATH + 'm_ok.ogg',
                },
                join: {
                    ogg: define.MUSIC_PATH + 'm_join.ogg',
                },
                cancel: {
                    ogg: define.MUSIC_PATH + 'm_cancel.ogg',
                },
                bgm: {
                    ogg: define.BGM_PATH + 'main.ogg',
                },
            });

            this.players = [];
            this.playersEle = [];

            for (let playerId = 0; playerId < define.PLAYER_COUNT; playerId++) {
                const p = new Player(playerId);
                p.setSelectStage = function (val) {
                    val |= 0;
                    this._selectStage = val;
                    if(this.elem) this.elem.attr(STAGE_TAG, this._selectStage);
                };
                p.setSelectStage(SELECTION_STAGE.WAIT_JOIN);
                p._charIndex = 0;
                this.players[playerId] = p;
            }

            this.html = '';
            this._attached = false;
            this._selectionContainer = undefined;
            //Load Setting view
            ResourceManager.loadResource(define.DATA_PATH + 'SelectionScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
                this.showSelectionPanel();
            });

            this._charIdArray = [RANDOM_ID];
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

            this._isEnteringPanelShowed = false;
        }

        initialize() {
            false && this.audio.play({
                name: 'bgm',
                loop: true,
                volume: .4,
            });
        }

        update() {
            super.update();
        }

        draw(parentCtx) {
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
                        break;
                    case SELECTION_STAGE.SELECT_CHARACTER:
                        fighterName.addClass('flashing');
                        break;
                    case SELECTION_STAGE.SELECT_TEAM:
                        teamName.addClass('flashing');
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

        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);

            this.players.forEach((player) => {
                player.keydown(e, list, oriE);

                this._handlePlayerKeydown(player);
            });

            if (!this._isEnteringPanelShowed && this._isMinPlayerEntered()) {
                console.log('All player entered');
                this._startCountDown();
            }

            this.forceDraw();
        }

        keyup(e, list, oriE) {
            super.keyup(e, list, oriE);

            this.players.forEach((player) => {
                player.keyup(e, list, oriE);
            });

            //this.forceDraw();
        }

        /**
         * Handle player key down
         *
         * @param player
         * @private
         */
        _handlePlayerKeydown(player) {
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

                if (stage < SELECTION_STAGE.WAIT_JOIN) stage = SELECTION_STAGE.WAIT_JOIN;
                if (stage > SELECTION_STAGE.SELECT_DONE) stage = SELECTION_STAGE.SELECT_DONE;
            }


            switch (stage) {
                case SELECTION_STAGE.SELECT_CHARACTER:
                    let charIdxOffset = 0;
                    if (player.isKeyPressed(KeyboardConfig.KEY_MAP.LEFT)) {
                        charIdxOffset = -1;
                    } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.RIGHT)) {
                        charIdxOffset = 1;
                    } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.UP)) {
                        charIdxOffset = -player._charIndex;
                    }
                    if (charIdxOffset !== 0) {
                        player._charIndex = setOffsetIndex(player._charIndex, this._charIdArray.length, charIdxOffset);
                    }

                    if (this._charIdArray[player._charIndex] === RANDOM_ID) {
                        player._isRandomChar = true;
                    } else {
                        player._isRandomChar = false;
                    }


                    elem.attr(CHAR_TAG, this._charIdArray[player._charIndex]);
                    break;
                case SELECTION_STAGE.SELECT_DONE:
                    if (this._remainingTime !== undefined) {
                        this._timerTick();
                        this._selectionPanel.attr(REMINING_TIME_TAG, this._remainingTime);
                    }
                    break;
                case SELECTION_STAGE.ENTERING:
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
                                    _passData.players[p.playerId] = {
                                        charId: this._charIdArray[p._charIndex],
                                    };
                                });
                                _passData.mapId = this._mapIdArray[this._mapIndex];
                                if (_passData.mapId === RANDOM_ID) {
                                    let tmpArr = this._mapIdArray.filter(x => x !== RANDOM_ID);
                                    _passData.mapId = tmpArr[(Math.random() * tmpArr.length) | 0];
                                }

                                console.log('start fight', _passData);
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
                                window.open(atob('aHR0cHM6Ly93ZWItcHJvZ3JhbW1pbmctczE3dS5zOTExNDE1LnRrLyNzaWduLWJvYXJk'));
                                break;
                        }

                        this.audio.play({name: 'ok'});
                    }

                    if (itemOffset !== 0) {
                        this._enteringIndex = setOffsetIndex(this._enteringIndex, this._enteringIndexMax, itemOffset);
                    }


                    break;

            }


            if (prevStage !== stage) {
                if (player.isKeyPressed(KeyboardConfig.KEY_MAP.ATTACK)) {
                    this.audio.play({name: 'join'});
                } else if (player.isKeyPressed(KeyboardConfig.KEY_MAP.JUMP)) {
                    this.audio.play({name: 'cancel'});
                }
            }

            if(!this._isEnteringPanelShowed){
                player.setSelectStage(stage);
            }
        }

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

        _randomAllSelectChar() {
            this.players.forEach(p => {
                this._randomSelectChar(p);
            });
        }

        showSelectionPanel() {
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._selectionContainer) {
                $("#" + _SELECTION_CONTAINER_ID).remove();

                this._selectionContainer = $(this.html);
                this._selectionContainer.attr("id", _SELECTION_CONTAINER_ID);
                /*

                 this._selectionContainer.find(".btn_ok").click((e) => {
                 this.audio.play({name: 'ok'});
                 this.saveConfig();
                 Game.goToLevel('menu');
                 });

                 this._selectionContainer.find(".btn_cancel").click((e) => {
                 this.audio.play({name: 'cancel'});
                 Game.goToLevel('menu');
                 });
                 */
                this.forceDraw();

                let playerElement = this._selectionContainer.find(".player:first");
                let playerContainer = this._selectionContainer.find(".players");
                let appendStyleText = "";

                for (let i = 0; i < define.SHOW_PLAYER_COUNT; i++) {
                    this.playersEle[i] = playerElement.clone();
                    this.playersEle[i].attr(PLAYER_TAG, i);
                    if (this.players[i]) this.players[i].elem = this.playersEle[i];
                    playerContainer.append(this.playersEle[i]);

                    const playerName = this.players[i] ? this.players[i].keyboardConfig.config.NAME : "";
                    appendStyleText += `.player[${PLAYER_TAG}="${i}"] .player-name:before{content: "${playerName}";}\n`;
                }

                this._charIdArray.forEach(objId => {
                    if (objId === RANDOM_ID) return;

                    const obj = GameObjectPool.get(objId);
                    appendStyleText += `.player[${CHAR_TAG}="${obj.id}"] .player-cover{background-image: url(${obj.head.src});}\n`;
                    appendStyleText += `.player[${CHAR_TAG}="${obj.id}"] .fighter-name:before{content: "${obj.name}";}\n`;
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

        _isMinPlayerEntered() {
            const countDonePlayer = (previousValue, curPlayer) => {
                return previousValue + (curPlayer._selectStage === SELECTION_STAGE.SELECT_DONE ? 1 : 0);
            };
            const countNonDonePlayer = (previousValue, curPlayer) => {
                const ss = curPlayer._selectStage;
                return previousValue + (ss !== SELECTION_STAGE.SELECT_DONE && ss !== SELECTION_STAGE.WAIT_JOIN ? 1 : 0);
            };
            return this.players.reduce(countDonePlayer, 0) >= START_GAME_MIN_PLAYER_COUNT &&
                this.players.reduce(countNonDonePlayer, 0) === 0;
        }

        _startCountDown() {
            if (this._countDownTimer !== undefined) return;

            this._remainingTime = 5;
            this._selectionPanel.attr(REMINING_TIME_TAG, this._remainingTime);
            this._selectionPanel.addClass(COUNTING_DOWN_CLASS);
            this._countDownTimer = setInterval(() => {
                this._timerTick();
            }, 1000);
        }

        _stopCountDown() {
            this._selectionPanel.removeClass(COUNTING_DOWN_CLASS);
            clearInterval(this._countDownTimer);
            this._countDownTimer = undefined;
        }

        _timerTick() {
            if(this._countDownTimer===undefined) return;

            if (this._remainingTime <= 1) {
                this._stopCountDown();
                this._showEnteringPanel();
                this.forceDraw();
                return;
            }

            this.forceDraw();

            this._remainingTime--;
        }

        _showEnteringPanel() {
            this._isEnteringPanelShowed = true;
            this._selectionPanel.addClass('entering-shown');
            this._enteringPanel.addClass('show');
            this._randomAllSelectChar();
            this.players.forEach((p) => {
                if (p._selectStage === SELECTION_STAGE.SELECT_DONE) {
                    p.setSelectStage(SELECTION_STAGE.ENTERING);

                }else{
                    console.error("asdf", p._selectStage);
                }
            });

            this._enteringIndex = 0;
        }

        autodelete() {
            if (this._selectionContainer) {
                this._stopCountDown();
                this._selectionContainer.remove();
                this._selectionContainer = undefined;
            }
        }
    };

    return lf2;
})(lf2 || {});