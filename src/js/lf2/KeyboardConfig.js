"use strict";
var lf2 = (function (lf2) {
    const KEY_MAP = {
        UP: 1,
        DOWN: 2,
        LEFT: 4 | 16,
        RIGHT: 8 | 16,
        FRONT: 16,

        ATTACK: 256,
        JUMP: 512,
        DEFEND: 1024,
        KEY_LIST: ["UP", "DOWN", "LEFT", "RIGHT", "ATTACK", "JUMP", "DEFEND"],
    };
    Object.freeze(KEY_MAP);
    const HIT_KEY = {
        ja: KEY_MAP.DEFEND | KEY_MAP.JUMP | KEY_MAP.ATTACK,     // 防跳攻

        Fj: KEY_MAP.DEFEND | KEY_MAP.FRONT | KEY_MAP.JUMP,      // 防前跳
        Fa: KEY_MAP.DEFEND | KEY_MAP.FRONT | KEY_MAP.ATTACK,    // 防前攻

        Dj: KEY_MAP.DEFEND | KEY_MAP.DOWN | KEY_MAP.JUMP,    // 防下跳
        Da: KEY_MAP.DEFEND | KEY_MAP.DOWN | KEY_MAP.ATTACK,    // 防下攻

        Uj: KEY_MAP.DEFEND | KEY_MAP.UP | KEY_MAP.JUMP,    // 防上跳
        Ua: KEY_MAP.DEFEND | KEY_MAP.UP | KEY_MAP.ATTACK,    // 防上攻

        j: KEY_MAP.JUMP,
        d: KEY_MAP.DEFEND,
        a: KEY_MAP.ATTACK,

        HIT_LIST: [
            "ja",
            "Fj", "Fa",
            "Dj", "Da",
            "Uj", "Ua",
            "j", "d", "a",
        ],
    };
    Object.freeze(HIT_KEY);


    /**
     * Custom class
     *
     * @type {KeyboardConfig}
     * @class lf2.KeyboardConfig
     */
    lf2.KeyboardConfig = class KeyboardConfig {
        /**
         *
         * @param {lf2.Rectangle} rect
         * @param {Image} imgObj
         */
        constructor(rect, imgObj) {
            this._img = imgObj;
            this._rect = rect;
        }

        /**
         * Get Image object
         * @returns {Image}
         */
        get img() {
            return this._img;
        }

        /**
         * Get Rect Object
         * @returns {lf2.Rectangle}
         */
        get rect() {
            return this._rect;
        }
    };

    lf2.KeyboardConfig.prototype.KEY_MAP
        = lf2.KeyboardConfig.KEY_MAP
        = KEY_MAP;

    lf2.KeyboardConfig.prototype.HIT_KEY
        = lf2.KeyboardConfig.HIT_KEY
        = HIT_KEY;

    return lf2;
})(lf2 || {});