'use strict';
var Framework = (function (Framework) {

    /**
     *
     * @class {Point3D}
     * @extends {Framework.Point}
     */
    Framework.Point3D = class Point3D extends Framework.Point {

        /**
         * Set Point
         *
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        constructor(x, y, z) {
            super(x, y);
            this._z = intval(z);
        }

        /**
         * Gets the z coordinate.
         *
         * @return  {Number}   z.
         */
        get z() {
            return this._z;
        }

        /**
         * Z coordinates the given value.
         *
         * @param  {Number} value   The value.
         *
         * @return  {void}
         */
        set z(value) {
            this._z =intval (value);
        }

        /**
         * Clone
         *
         * @override
         * @returns {Point3D}
         */
        clone() {
            return new Point3D(this.x, this.y, this.z);
        }
    };

    return Framework;
})(Framework || {});