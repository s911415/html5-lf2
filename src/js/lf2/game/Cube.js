"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    /**
     * Cube
     *
     * @type {Cube}
     * @class lf2.Cube
     */
    lf2.Cube = class Cube {
        constructor(width, height, depth, px, py) {
            this.width = intval(width);
            this.height = intval(height);
            this.depth = depth;
            this._depthHalf = (depth / 2) | 0;
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
                this.position.x - this._depthHalf, this.position.y + this._depthHalf + z,
                this.width, this.height
            );
            ctx.strokeRect(
                this.position.x + this._depthHalf, this.position.y - this._depthHalf + z,
                this.width, this.height
            );

            //left-top
            ctx.beginPath();
            ctx.moveTo(this.position.x - this._depthHalf, this.position.y + this._depthHalf + z);
            ctx.lineTo(this.position.x + this._depthHalf, this.position.y - this._depthHalf + z);
            ctx.stroke();

            //right-top
            ctx.beginPath();
            ctx.moveTo(this.position.x - this._depthHalf + this.width, this.position.y + this._depthHalf + z);
            ctx.lineTo(this.position.x + this._depthHalf + this.width, this.position.y - this._depthHalf + z);
            ctx.stroke();

            //left-bottom
            ctx.beginPath();
            ctx.moveTo(this.position.x - this._depthHalf, this.position.y + this.height + this._depthHalf + z);
            ctx.lineTo(this.position.x + this._depthHalf, this.position.y + this.height - this._depthHalf + z);
            ctx.stroke();

            //right-bottom
            ctx.beginPath();
            ctx.moveTo(this.position.x - this._depthHalf + this.width, this.position.y + this.height + this._depthHalf + z);
            ctx.lineTo(this.position.x + this._depthHalf + this.width, this.position.y + this.height - this._depthHalf + z);
            ctx.stroke();
        }
    };


    return lf2;
})(lf2 || {});