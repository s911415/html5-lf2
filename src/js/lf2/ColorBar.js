"use strict";
var lf2 = (function (lf2) {
    /**
     * Color bar
     *
     * @class lf2.ColorBar
     * @extends Framework.GameObject
     * @implements Framework.AttachableInterface
     */
    lf2.ColorBar = class ColorBar extends Framework.GameObject {
        /**
         *
         * @param {String} color
         * @param {Number} width
         * @param {Number} height
         */
        constructor(color, width, height) {
            super();
            this._color = color;
            this._width = width;
            this._height = height;
        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load() {

        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {

        }

        /**
         * draw(ctx)
         *
         * Draws the given context.
         *
         * @param   ctx The context.
         *
         * @return  .
         */
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.position.x, this.position.y,
                this.width, this.height
            );
        }

        /**
         * @returns {Number} width
         */
        get width(){
            return this._width;
        }

        /**
         *
         * @param {Number} v
         */
        set width(v){
            this._width = v;
        }

        /**
         * @returns {Number} width
         */
        get height(){
            return this._height;
        }

        /**
         *
         * @param {Number} v
         */
        set height(v){
            this._height = v;
        }

        /**
         * @returns {String} width
         */
        get color(){
            return this._color;
        }

        /**
         *
         * @param {String} v
         */
        set color(v){
            this._color = v;
        }
    };

    return lf2;
})(lf2 || {});