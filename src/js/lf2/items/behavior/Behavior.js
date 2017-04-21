"use strict";
var lf2 = (function (lf2) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    /**
     * Behavior
     *
     * @interface {lf2.Behavior}
     */
    lf2.Behavior = class Behavior {

        /**
         *
         * @returns {Framework.Point3D}
         * @abstract
         */
        getVelocity() {
            throw METHOD_NOT_IMPLEMENT;
        }

        /**
         *
         * @returns {lf2.GameItem}
         * @abstract
         */
        getTarget() {
            throw METHOD_NOT_IMPLEMENT;
        }
    };


    return lf2;
})(lf2 || {});