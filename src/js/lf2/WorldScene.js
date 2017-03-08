"use strict";
var lf2 = (function (lf2) {
    const GameMapPool = lf2.GameMapPool;
    /**
     * World Scene
     *
     * @class lf2.WorldScene
     * @extends {Framework.Scene}
     * @implements {Framework.AttachableInterface}
     */
    lf2.WorldScene = class WorldScene extends Framework.Scene {
        constructor(config) {
            super();
            this.config = config;

            this.map = GameMapPool.get(this.config.mapId);

            this.addCharacters(this.config.players);
        }


        /**
         *
         * @param {lf2.Player[]} playerArray
         */
        addCharacters(playerArray) {
            playerArray.forEach((player) => {
                this.attach(player.character);
            });
        }

        /**
         *
         * @param ctx
         * @override
         */
        draw(ctx) {
            super.draw(ctx);


        }
    };

    return lf2;
})(lf2 || {});