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
                this.config.players[playerId] = new Player(playerId, extraData.players[playerId].charId);
            }
        }

        load() {
            //attach player's character
            this.config.players.forEach((player) => {
                this.rootScene.attach(player.character);

                //TODO: debug use
                player.character.position = new Framework.Point3D(Framework.Config.canvasWidth / 2, Framework.Config.canvasHeight, 0);
            });
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
            super.keydown(e);

        }

        click(e) {

        }
    };

    return lf2;
})(lf2 || {});
