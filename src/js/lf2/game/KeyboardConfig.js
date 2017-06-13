"use strict";
var lf2 = (function (lf2) {
    /**
     * define KEY MAP
     */
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

    KEY_MAP.REVERT_MAP = {};
    for (let k in KEY_MAP) {
        if (isFinite(KEY_MAP[k])) KEY_MAP.REVERT_MAP[KEY_MAP[k]] = k;
    }
    Object.freeze(KEY_MAP.REVERT_MAP);
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

        _up: KEY_MAP.UP,
        _down: KEY_MAP.DOWN,
        _left: KEY_MAP.LEFT,
        _right: KEY_MAP.RIGHT,

        _ul: KEY_MAP.UP | KEY_MAP.LEFT,
        _ur: KEY_MAP.UP | KEY_MAP.RIGHT,
        _dl: KEY_MAP.DOWN | KEY_MAP.LEFT,
        _dr: KEY_MAP.DOWN | KEY_MAP.RIGHT,
        //_front: KEY_MAP.FRONT,

        HIT_LIST: [
            "ja",
            "Fj", "Fa",
            "Dj", "Da",
            "Uj", "Ua",
            "j", "d", "a",

            "_ul", "_ur", "_dl", "_dr",
            "_up", "_down", "_left", "_right",
        ],
    };
    Object.freeze(HIT_KEY);

    const DEFAULT_CONFIG = [
        {
            "NAME": "Player1",
            "UP": 38,
            "DOWN": 40,
            "LEFT": 37,
            "RIGHT": 39,
            "ATTACK": 67,
            "JUMP": 88,
            "DEFEND": 90
        },
        {
            "NAME": "Player2",
            "UP": 104,
            "DOWN": 98,
            "LEFT": 100,
            "RIGHT": 102,
            "ATTACK": 187,
            "JUMP": 189,
            "DEFEND": 48
        },
        /*{
         "NAME": "Player3",
         "UP": 87,
         "DOWN": 83,
         "LEFT": 65,
         "RIGHT": 68,
         "ATTACK": 72,
         "JUMP": 71,
         "DEFEND": 70
         }*/
    ];
    Object.freeze(DEFAULT_CONFIG);

    let keyConfig = undefined;

    /**
     * Custom class
     *
     * @type {KeyboardConfig}
     * @class lf2.KeyboardConfig
     */
    lf2.KeyboardConfig = class KeyboardConfig {
        /**
         *
         * @param {Number} playerId
         */
        constructor(playerId) {
            if (playerId < 0 || playerId >= define.PLAYER_COUNT) throw new RangeError(`Player Id (${playerId}) Out of range`);

            this.playerId = playerId;
            this.config = lf2.KeyboardConfig.getKeyConfig()[playerId] || {};
            this.keyMap = new Map();
            //{"NAME":"Player1","UP":38,"DOWN":40,"LEFT":37,"RIGHT":39,"ATTACK":68,"JUMP":83,"DEFEND":65}
            KEY_MAP.KEY_LIST.forEach((keyName) => {
                this.keyMap.set(this.config[keyName], KEY_MAP[keyName]);
            });
        }

        /**
         * Get Key config
         * @returns {Array}
         */
        static getKeyConfig() {
            if (keyConfig === undefined) {
                /**
                 * @type {Array}
                 */
                keyConfig = JSON.parse(localStorage.getItem(define.KEYBOARD_CONFIG_KEY));
            }
            if (!keyConfig) keyConfig = DEFAULT_CONFIG;

            return keyConfig;
        }

        static clearConfigCache() {
            keyConfig = undefined;
        }
    };

    lf2.KeyboardConfig.prototype.KEY_MAP
        = lf2.KeyboardConfig.KEY_MAP
        = KEY_MAP;

    lf2.KeyboardConfig.prototype.HIT_KEY
        = lf2.KeyboardConfig.HIT_KEY
        = HIT_KEY;

    lf2.KeyboardConfig.prototype.DEFAULT_CONFIG
        = lf2.KeyboardConfig.DEFAULT_CONFIG
        = DEFAULT_CONFIG;

    return lf2;
})(lf2 || {});