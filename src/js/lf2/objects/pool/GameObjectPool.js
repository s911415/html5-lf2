"use strict";
var lf2 = (function (lf2) {
    /**
     * GameObjectPool
     *
     * @type {GameObjectPool}
     * @class GameObjectPool
     * @extends {Map}
     */
    class GameObjectPool extends Map {
        constructor() {
            super();
        }

        /**
         * Add value to this pool
         * @param {Number} key
         * @param {lf2.GameObject} value
         *
         * @returns {GameObjectPool}
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
     * @type {GameObjectPool}
     */
    lf2.GameObjectPool = new GameObjectPool();

    return lf2;
})(lf2 || {});