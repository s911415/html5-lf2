"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    /**
     * Rectangle
     *
     * @type {Rectangle}
     * @class lf2.Rectangle
     */
    lf2.Rectangle = class Rectangle {
        constructor(width, height, px, py) {
            this.width = intval(width);
            this.height = intval(height);
            this.position = new Point(px, py);
        }

        /**
         *
         * @param {CanvasRenderingContext2D} ctx
         * @param {Number} [z]
         */
        draw(ctx, z) {
            if (z === undefined) z = 0;

            ctx.strokeRect(
                this.position.x, this.position.y + z,
                this.width, this.height
            );
        }

        /**
         *
         * @param {lf2.Rectangle} rect
         * @returns {boolean}
         */
        isIntersect(rect) {
            return this.position.x < rect.position.x + rect.width &&
                this.position.x + this.width > rect.position.x &&
                this.position.y < rect.position.y + rect.height &&
                this.height + this.position.y > rect.position.y;
        }

        /**
         *
         * @param {lf2.Rectangle} rect1
         * @param {lf2.Rectangle} rect2
         * @returns {lf2.Rectangle}
         */
        static merge(rect1, rect2) {
            const
                x1 = Math.min(rect1.position.x, rect2.position.x),
                y1 = Math.min(rect1.position.y, rect2.position.y),
                x2 = Math.max(rect1.position.x + rect1.width, rect2.position.x + rect2.width),
                y2 = Math.max(rect1.position.y + rect1.height, rect2.position.y + rect2.height);

            return new lf2.Rectangle(
                x2 - x1, y2 - y1,
                x1, y1
            );
        }
    };


    return lf2;
})(lf2 || {});