'use strict';
var Framework = (function (Framework) {
    const Point = Framework.Point;

    /**
     * 提供三維座標的儲存功能
     * @class {Framework.Point3D}
     * @extends {Framework.Point}
     * @property {Number} z
     */
    Framework.Point3D = class Point3D extends Point {

        /**
         * Set Point
         *
         * @param {Number} x X coordinates
         * @param {Number} y Y coordinates
         * @param {Number} z Z coordinates
         */
        constructor(x, y, z) {
            super(x, y);
            this._z = floatval(z) || 0;
        }

        /**
         * Write point to target
         *
         * @param {Point3D} target
         */
        writeTo(target) {
            super.writeTo(target);
            
            if(target instanceof Point3D){
                target.z = this.z;
            }else{
                throw new ReferenceError('Target is not an instance of Point3D');
            }
        }

        /**
         * Gets the z coordinate.
         *
         * @return  {Number}   z.
         */
        get z() {
            if (isNaN(this._z)) {
                this._z = 0;
            }
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
            this._z = floatval(value);
        }

        /**
         * Clone
         *
         * @override
         * @returns {Point3D}
         */
        clone() {
            return new Point3D(this._x, this._y, this._z);
        }


        /**
         * Is origin
         *
         * @returns {boolean}
         */
        get isZero() {
            return this._x === 0 && this._x === this._y && this._x === this._z;
        }

        /**
         *
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         * @returns {Point3D}
         */
        offset(x, y, z) {
            this.x += floatval(x);
            this.y += floatval(y);
            this.z += floatval(z);

            return this;
        }

        /**
         *
         * @returns {string}
         */
        toString() {
            return `(${this._x}, ${this._y}, ${this._z})`;
        }
    };

    return Framework;
})(Framework || {});