'use strict';
var Framework = (function (Framework) {
    /**
     * 2D coordinate, also use as a pair structure
     * 提供二維座標的儲存功能
     *
     * @class {Framework.Point}
     * @property {Number} x
     * @property {Number} y
     * @property {Number} z
     */
    Framework.Point = class Point {

        /**
         * Set Point
         *
         * @param {Number} x X axis coordinates
         * @param {Number} y y axis coordinates
         */
        constructor(x, y) {
            /**
             *
             * @type {Number}
             */
            this._x = floatval(x);

            /**
             *
             * @type {Number}
             */
            this._y = floatval(y);
        }

        /**
         * Write point to target
         *
         * @param {Point} target
         */
        writeTo(target) {
            if(target instanceof Point){
                target.x = this.x;
                target.y = this.y;
            }else{
                throw new ReferenceError('Target is not an instance of Point');
            }
        }

        /**
         * get first data
         * @returns {Number}
         */
        get first() {
            return this._x;
        }

        /**
         * get second data
         * @returns {Number}
         */
        get second() {
            return this._y;
        }

        /**
         * Gets the x coordinate.
         *
         * @return  {Number}   x.
         */
        get x() {
            return this._x;
        }

        /**
         * Is origin
         *
         * @returns {boolean}
         */
        get isZero() {
            return this._x === 0 && this._x === this._y;
        }

        /**
         * X coordinates the given value.
         *
         * @param  {Number} value   The value.
         *
         * @return  {void}
         */
        set x(value) {
            this._x = floatval(value);
        }

        /**
         * Clone
         * @returns {Point}
         */
        clone() {
            return new Point(this.x, this.y);
        }

        /**
         *
         * @param {Number} x
         * @param {Number} y
         * @returns {Point}
         */
        offset(x, y) {
            this.x += floatval(x);
            this.y += floatval(y);

            return this;
        }

        /**
         * Gets the y coordinate.
         *
         * @return  {Number} y.
         */
        get y() {
            return this._y;
        }

        /**
         * Y coordinates the given value.
         *
         * @param  {Number} value   The value.
         *
         * @return  {void}.
         */
        set y(value) {
            this._y = floatval(value);
        }

        toString() {
            return `(${this._x}, ${this._y})`;
        }

    };

    return Framework;
})(Framework || {});