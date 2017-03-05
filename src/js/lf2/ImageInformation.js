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
         * @param {ImageData} imgObj
         */
        constructor(rect, imgObj) {
            this._img = imgObj;
            this._rect = rect;
        }

        /**
         * Get ImageData object
         * @returns {ImageData}
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