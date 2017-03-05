"use strict";
var lf2 = (function (lf2) {
    /**
     * Custom class
     *
     * @type {ImageInformation}
     * @class lf2.ImageInformation
     */
    lf2.ImageInformation = class ImageInformation {
        /**
         *
         * @param {lf2.Rectangle} rect
         * @param {Image} imgObj
         */
        constructor(rect, imgObj) {
            this._img = imgObj;
            this._rect = rect;
        }

        /**
         * Get Image object
         * @returns {Image}
         */
        get img() {
            return this._img;
        }

        /**
         * Get Rect Object
         * @returns {lf2.Rectangle}
         */
        get rect() {
            return this._rect;
        }
    };

    return lf2;
})(lf2 || {});