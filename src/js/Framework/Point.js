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
            this._x = intval(x);
            this._y = intval(y);
        }

        /**
         *
         * @returns {Number}
         */
        get first(){
            return this._x;
        }

        /**
         *
         * @returns {Number}
         */
        get second(){
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
         * X coordinates the given value.
         *
         * @param  {Number} value   The value.
         *
         * @return  {void}
         */
        set x(value) {
            this._x = intval(value);
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
            this.x+=intval(x);
            this.y+=intval(y);

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
            this._y = intval(value);
        }

    };

    return Framework;
})(Framework || {});