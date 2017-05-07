"use strict";
var lf2 = (function (lf2) {
    /**
     * GameMapPool
     *
     * @type {GameMapPool}
     * @class GameMapPool
     * @extends {Map}
     */
    class GameMapPool extends Map {
        constructor() {
            super();
        }

        /**
         * Add value to this pool
         * @param {Number} key
         * @param {lf2.GameMap} value
         *
         * @returns {GameMapPool}
         */
        set(key, value) {
            key = intval(key);
            if (isNaN(key)) throw "Key must be an integer";

            super.set(key, value);

            return this;
        }
    }

    /**
     *
     * @type {GameMapPool}
     */
    lf2.GameMapPool = new GameMapPool();

    return lf2;
})(lf2 || {});