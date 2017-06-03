"use strict";
var lf2 = (function (lf2) {
    const _FIGHT_CONTAINER_ID = "__fight_container";
    const SEC_PER_MIN = 60;
    const PLAYER_TAG = 'data-player';
    const Point = Framework.Point;
    const Game = Framework.Game;
    const Sprite = Framework.Sprite;
    const Character = lf2.Character;
    const Practice = lf2.Practice;
    const GameMap = lf2.GameMap;
    const Fighter = lf2.Fighter;
    const KeyboardConfig = lf2.KeyboardConfig;
    const Player = lf2.Player;
    const WorldScene = lf2.WorldScene;
    const ResourceManager = Framework.ResourceManager;
    const PlayerStatusPanel = lf2.PlayerStatusPanel;

    const GAME_STATUS_WIN = 'win';
    const GAME_STATUS_LOSE = 'lose';
    const GAME_STATUS_DRAW = 'draw';

    /**
     * @class lf2.FightLevel
     * @extends {Framework.Level}
     * @implements Framework.MouseEventInterface
     * @implements Framework.KeyboardEventInterface
     */
    lf2.FightLevel = class FightLevel extends Framework.Level {
        constructor() {
            super();

            this.html = '';
            //Load Setting view
            this._htmlLoader = ResourceManager.loadResource(define.DATA_PATH + 'FightScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
            });
        }

        /**
         * 接收傳遞的資料
         *
         * @override
         * @param extraData
         */
        receiveExtraDataWhenLevelStart(extraData) {
            this.config = {
                players: [],
                mapId: extraData.mapId,
            };

            for (let playerId in extraData.players) {
                playerId = intval(playerId);
                if (isNaN(playerId)) continue;
                const Data = extraData.players[playerId];

                this.config.players[playerId] = new Player(playerId, Data.charId, Data.teamId);
            }
        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load() {
            super.load();

            //Play bgm
            lf2['!MainGame'].playBgm();

            this.world = new WorldScene(this.config);
            this.rootScene.attach(this.world);

            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            this.audio = new Framework.Audio({
                end: define.MUSIC_PATH + 'm_end.m4a',
            });

            this._statusPanels = new Array(define.SHOW_PLAYER_COUNT);

            //attach player's character
            const halfWorldWidth = this.world.map.width >> 1;
            const worldHeightDiff = (this.world.map.zBoundary.second - this.world.map.zBoundary.first);
            const halfScreenWidth = Framework.Config.canvasWidth >> 1;
            this.config.players.forEach((player, i) => {
                player.character.position = new Framework.Point3D(
                    (halfWorldWidth - halfScreenWidth) + ((Math.random() * Framework.Config.canvasWidth) | 0),
                    ((Math.random() * worldHeightDiff) | 0) + this.world.map.zBoundary.first,
                    0
                );
                // player.status.setElem(this._statusPanels[i]);
            });

            this._funcStatus = {
                'F6': 0,
                'F7': 0,
            };

            this._anyFuncPressed = false;

            this._container = undefined;
            this._htmlLoader.then(() => {
                this.showPanel();
            });


            this._startTime = Date.now();
            this._gameOver = false;
            this._gameOverPanelShown = false;
            this._teamInfoCache = undefined;
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

            //update each player status
            this.config.players.forEach((player) => {
                player.update();
                player.status.update();
            });

            if (this.checkGameOver()) {
                this._gameOver = true;
                this._gameOverTime = Date.now();
                setTimeout(() => this.showGameOverPanel(), 2000);
            }
        }

        /**
         * draw(ctx)
         *
         * Draws the given context.
         *
         * @param   ctx The context.
         *
         * @return  .
         */
        draw(ctx) {
            super.draw(ctx);


            //Draw each player status
            this.config.players.forEach((player) => {
                player.status.draw(ctx);
            });

            if (this._anyFuncPressed) {
                let funcStr = 'Function Keys Used:\x20';
                for (let k in this._funcStatus) {
                    if (!this._funcStatus.hasOwnProperty(k)) continue;
                    funcStr += `　${k}: ${this._funcStatus[k]}\x20time(s)`;
                }

                this._funcBar.textContent = funcStr;

                // ctx.textAlign = "start";
                // ctx.font = "12px Arial";
                // ctx.textBaseline = "middle";
                // ctx.fillStyle = "#FFF";
                // ctx.fillText(funcStr, 3, 120);
            }
        }

        /**
         * keydown(e, list, oriE)
         *
         * Keydowns.
         *
         * @param   e       The unknown to process.
         * @param   list    The list.
         * @param   oriE    The ori e.
         *
         * @return  .
         */
        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);
            this.config.players.forEach((player) => {
                player.keydown(oriE);
            });

            let curCount = (this._funcStatus[e.key] !== undefined) ? ++this._funcStatus[e.key] : 0;
            //Handle func key
            switch (e.key) {
                case 'F4'://Restart Game
                    Framework.Game.goToLevel('selection');
                    break;
                case 'F6'://INF MP
                    let infMpStatus = curCount % 2 === 1;
                    this.config.players.forEach((player) => {
                        player.setInfMp(infMpStatus);
                    });
                    break;
                case 'F7'://Recover players
                    this.config.players.forEach((player) => {
                        player.addHp(500);
                        player.addMp(500);
                    });
                    break;
                default:
            }

            if (curCount !== 0) this._anyFuncPressed = true;

            this.world.keydown(oriE);
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
        }

        keypress(e, list, oriE) {
        }

        /**
         * click(e)
         *
         * Clicks the given e.
         *
         * @param   e   The unknown to process.
         *
         * @return  .
         */
        click(e) {

        }

        /**
         * Autodeletes this object.
         *
         * @return  .
         */
        autodelete() {
            super.autodelete();

            if (this._container) {
                this._container.remove();
                this._container = undefined;
            }
        }

        /**
         * Shows the panel.
         *
         * @return  .
         */
        showPanel() {
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._container) {
                $("#" + _FIGHT_CONTAINER_ID).remove();

                this._container = $(this.html);
                this._container.attr("id", _FIGHT_CONTAINER_ID);
                this._funcBar = this._container.find("#funcKeyStatus")[0];


                const _statusPanelsTarget = this._container.find("#statusPanels");

                let statusPanelTemplate = _statusPanelsTarget.find(".status");
                for (let i = 0; i < define.SHOW_PLAYER_COUNT; i++) {
                    this._statusPanels[i] = statusPanelTemplate.clone()[0];
                    this._statusPanels[i].setAttribute(PLAYER_TAG, i.toString());
                    this._statusPanels[i].hp = this._statusPanels[i].querySelector('.hp');
                    this._statusPanels[i].mp = this._statusPanels[i].querySelector('.mp');
                    this._statusPanels[i].small = this._statusPanels[i].querySelector('.small');
                    this._statusPanels[i].flag = this._statusPanels[i].querySelector('.flag');

                    _statusPanelsTarget.append(this._statusPanels[i]);
                    if (this.config.players[i]) {
                        this.config.players[i].status.setElem(this._statusPanels[i]);
                    }
                }
                statusPanelTemplate.remove();

                this._gameOverPanel = this._container.find('#gameOverPanel');
                this._gameOverTimeVal = this._container.find('.time-value');
                this._gameOverPanelPlayerRows = [];
                const _gameOverPanelPlayerRow = this._gameOverPanel.find('.player-row');
                const _gameOverPanelTarget = _gameOverPanelPlayerRow.parent();
                this.config.players.forEach((player, i) => {
                    let panel = _gameOverPanelPlayerRow.clone();

                    panel.attr(PLAYER_TAG, i);
                    panel.find('img.small').attr('src', player.character.obj.small.src);
                    panel.find('.player-text').text('P' + (i + 1));
                    panel[0]._attackVal = panel.find('.cell-attack>.value');
                    panel[0]._hpVal = panel.find('.cell-hp>.value');
                    panel[0]._mpVal = panel.find('.cell-mp>.value');
                    panel[0]._status = panel.find('.cell-status');

                    this._gameOverPanelPlayerRows[i] = panel[0];
                    _gameOverPanelTarget.append(panel);
                });
                _gameOverPanelPlayerRow.remove();

                $("body").append(this._container);
                Game.resizeEvent();
            }
        }

        /**
         * Check game over.
         *
         * @return  .
         */
        checkGameOver() {
            if (this._gameOver) return true;
            const TeamInfo = this.getTeamInfo();
            let isGameOver = false;

            TeamInfo.forEach(v => {
                if (v.status !== undefined) isGameOver = true;
            });


            return isGameOver;
        }

        /**
         * Gets team information.
         *
         * @return  The team information.
         */
        getTeamInfo() {
            // if (this._teamInfoCache !== undefined) return this._teamInfoCache;

            let teamMap = new Map();
            let playerCount = 0;
            this.config.players.forEach((player, i) => {
                const team = player.team;
                let mapObj = teamMap.get(team);
                playerCount++;

                if (mapObj === undefined) {
                    mapObj = {
                        alive: 0,
                        dead: 0,
                        total: 0,
                        status: undefined,
                    };
                    teamMap.set(team, mapObj);
                }

                mapObj.total++;

                if (player.hp > 0) {
                    mapObj.alive++;
                } else {
                    mapObj.dead++;
                }
            });

            let tmpArr = [];
            teamMap.forEach((obj) => {
                tmpArr.push(obj);
            });

            // 依活著人數由大到小排序
            tmpArr.sort((x, y) => y.alive - x.alive);

            const first = tmpArr[0];
            if (first.total === playerCount) {
                // 沒有其他隊伍所以平手
                first.status = GAME_STATUS_DRAW;
            } else if (first.alive === 0) {
                //沒有人活著
                tmpArr.forEach(v => v.status = GAME_STATUS_DRAW);
            } else if (first.alive > 0 && tmpArr[1].alive === 0) {
                tmpArr.forEach(v => v.status = GAME_STATUS_LOSE);
                first.status = GAME_STATUS_WIN;
            }

            // this._teamInfoCache = teamMap;

            return teamMap;
        }

        /**
         * Clears the team information cache.
         *
         * @return  .
         */
        clearTeamInfoCache() {
            this._teamInfoCache = undefined;
        }

        /**
         * Shows the game over panel.
         *
         * @return  .
         */
        showGameOverPanel() {
            if (this._gameOverPanelShown) return;
            const TeamInfo = this.getTeamInfo();

            this._gameOverPanel.removeAttr('hidden');

            this.config.players.forEach((player, i) => {
                const panel = this._gameOverPanelPlayerRows[i];
                panel._attackVal.text(player.attackSum);
                panel._hpVal.text(player.hpLost);
                panel._mpVal.text(player.mpCost);
                panel._status.attr('data-game-status', TeamInfo.get(player.team).status);
                panel._status.attr('data-char-status', player.hp > 0 ? 'alive' : 'dead');
            });

            const costTime = ((this._gameOverTime - this._startTime) / 1000) | 0;
            const ss = costTime % SEC_PER_MIN;
            const mm = (costTime - ss) / SEC_PER_MIN;

            this._gameOverTimeVal.text(`${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`);

            this.audio.play('end');
            this._gameOverPanelShown = true;
        }
    };

    return lf2;
})(lf2 || {});
