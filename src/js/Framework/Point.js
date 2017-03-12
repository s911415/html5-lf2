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
            if(typeof x =="string"){
                debugger;
            }
            this._x = (x);
            this._y = (y);
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
            this._x = (value);
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
            this._y = (value);
        }

    };

    return Framework;
})(Framework || {});