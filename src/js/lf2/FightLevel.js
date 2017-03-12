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
    const PLAYER_COUNT = 8;
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
            this._statusPanels = new Array(PLAYER_COUNT);
            for (let i = 0; i < PLAYER_COUNT; i++) {
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

            this.world = new WorldScene(this.config);


            this.rootScene.attach(this.world);
            //attach player's character
            this.config.players.forEach((player, i) => {

                //TODO: debug use
                player.character.position = new Framework.Point3D(Framework.Config.canvasWidth / 2, Framework.Config.canvasHeight / 2, 0);
                //Framework.Game._currentLevel.config.players[0].character.setFrameById(210);
            });

            //TODO: debug use
            Framework.Game._currentLevel.config.players[0].character.position = new Point(100, 300);
            Framework.Game._currentLevel.config.players[1].character.position = new Point(800, 300);
        }

        initialize() {
        }

        update() {
            super.update();
        }

        draw(parentCtx) {
            super.draw(parentCtx);

        }

        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);

            this.config.players.forEach((player) => {
                player.keydown(e, list, oriE);
            });

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
