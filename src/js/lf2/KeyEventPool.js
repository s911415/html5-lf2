"use strict";
var lf2 = (function (lf2) {
    const KEY_KEEP_COUNT = 4;

    /**
     * KeyEvent Pool
     *
     * @class lf2.KeyEventPool
     */
    lf2.KeyEventPool = class KeyEventPool extends Array {
        constructor() {
            super(KEY_KEEP_COUNT);
        }

        _shiftOne() {
            for (let i = KEY_KEEP_COUNT - 2; i >= 0; i--) {
                this[i + 1] = this[i];
            }
        }

        push(value) {
            console.log(this);
            this._shiftOne();
            this[0] = value;

            console.log(this);
        }

    };

    lf2.KeyEventPool.KEY_KEEP_COUNT = KEY_KEEP_COUNT;

    return lf2;
})(lf2 || {});