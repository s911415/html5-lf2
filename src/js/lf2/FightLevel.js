"use strict";
var lf2 = (function (lf2) {
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
    const PlayerStatusPanel = lf2.PlayerStatusPanel;
    /**
     * @class lf2.FightLevel
     * @extends {Framework.Level}
     * @implements Framework.MouseEventInterface
     * @implements Framework.KeyboardEventInterface
     */
    lf2.FightLevel = class FightLevel extends Framework.Level {
        constructor() {
            super();
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

                this.config.players[playerId] = new Player(playerId, extraData.players[playerId].charId);
            }
        }

        load() {
            this.world = new WorldScene(this.config);
            this.rootScene.attach(this.world);

            this._statusPanels = new Array(define.SHOW_PLAYER_COUNT);
            for (let i = 0; i < define.SHOW_PLAYER_COUNT; i++) {
                const PANEL_SIZE = PlayerStatusPanel.PANEL_SIZE;
                const _ROW = (i / PlayerStatusPanel.PANEL_PER_ROW_COUNT) | 0;
                const _COL = (i % PlayerStatusPanel.PANEL_PER_ROW_COUNT);
                let panel = new Sprite(define.IMG_PATH + "player_status_panel.png");
                panel.position = new Point(
                    _COL * PANEL_SIZE.x + PANEL_SIZE.x / 2,
                    _ROW * PANEL_SIZE.y + PANEL_SIZE.y / 2
                );
                this._statusPanels[i] = panel;
                this.rootScene.attach(panel);
            }

            //attach player's character
            this.config.players.forEach((player, i) => {
                //TODO: debug use
                player.character.position = new Framework.Point3D(Framework.Config.canvasWidth / 2, Framework.Config.canvasHeight / 2, 0);
                //Framework.Game._currentLevel.config.players[0].character.setFrameById(210);
            });

            this._funcStatus = {
                'F6': 0,
                'F7': 0,
            };

            this._anyFuncPressed = false;

            //TODO: debug use
            this.config.players[0].character.position = new Point(100, 360);
            //this.config.players[1].character.position = new Point(800, 300);
        }

        initialize() {
        }

        update() {
            super.update();

            //update each player status
            this.config.players.forEach((player) => {
                player.status.update();
            });
        }

        draw(ctx) {
            super.draw(ctx);


            //Draw each player status
            this.config.players.forEach((player) => {
                player.status.draw(ctx);
            });

            if (this._anyFuncPressed) {
                let funcStr = 'Function Keys Used: ';
                for (let k in this._funcStatus) {
                    funcStr += `  ${k}: ${this._funcStatus[k]} time(s)`;
                }

                ctx.textAlign = "start";
                ctx.font = "12px Arial";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#FFF";
                ctx.fillText(funcStr, 3, 120);
            }
        }

        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);

            this.config.players.forEach((player) => {
                player.keydown(e, list, oriE);
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
        }

        keyup(e, list, oriE) {
            super.keyup(e, list, oriE);

            this.config.players.forEach((player) => {
                player.keyup(e, list, oriE);
            });

        }

        click(e) {

        }
    };

    return lf2;
})(lf2 || {});
