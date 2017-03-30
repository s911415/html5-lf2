"use strict";
var lf2 = (function (lf2) {
    /**
     * Custom class
     *
     * @class lf2.ImageInformation
     */
    lf2.ImageInformation = class ImageInformation {
        /**
         *
         * @param {lf2.Rectangle} rect
         * @param {Image|HTMLCanvasElement} imgObj
         */
        constructor(rect, imgObj) {
            this._img = imgObj;
            this._rect = rect;
            this.canvas = document.createElement('canvas');
            this.canvas.width = this._rect.width;
            this.canvas.height = this._rect.height;

            const ctx = this.canvas.getContext('2d');
            ctx.drawImage(
                this._img,
                this.rect.position.x | 0, this.rect.position.y | 0,
                this.rect.width, this.rect.height,
                0, 0,
                this.rect.width, this.rect.height
            );
        }

        /**
         * Get Image object
         * @returns {Image|HTMLCanvasElement}
         */
        get img() {
            return this.canvas;
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