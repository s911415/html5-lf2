'use strict';
var Framework = (function (Framework) {

    Framework.Point = class Point{

        /**
         * Set Point
         *
         * @param {Number} x
         * @param {Number} y
         */
        constructor(x, y) {
            this._x = Math.floor(x);
            this._y = Math.floor(y);
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
         * X coordinates the given value.
         *
         * @param  {Number} value   The value.
         *
         * @return  {void}
         */
        set x(value) {
            this._x = Math.floor(value);
        }

        /**
         * Clone
         * @returns {Point}
         */
        clone(){
            return new Point(this.x, this.y);
        }

        /**
         *
         * @param {Number} x
         * @param {Number} y
         * @returns {Point}
         */
        offset(x, y){
            this.x+=x;
            this.y+=y;

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
            this._y = Math.floor(value);
        }

    };

    return Framework;
})(Framework || {});