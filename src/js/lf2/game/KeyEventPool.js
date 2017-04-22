"use strict";
var lf2 = (function (lf2) {
    const KEY_KEEP_COUNT = 5;

    /**
     * KeyEvent Pool
     *
     * @class lf2.KeyEventPool
     */
    lf2.KeyEventPool = class KeyEventPool extends Array {
        /**
         *
         * @param {Number} [size]
         */
        constructor(size) {
            if(!size) size = KEY_KEEP_COUNT;
            super(size);

            this._size = size;
        }

        _shiftOne() {
            for (let i = this._size - 2; i >= 0; i--) {
                this[i + 1] = this[i];
            }
        }

        push(value) {
            this._shiftOne();
            this[0] = value;
        }
    };

    lf2.KeyEventPool.KEY_KEEP_COUNT = KEY_KEEP_COUNT;

    return lf2;
})(lf2 || {});