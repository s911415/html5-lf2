"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    const Rectangle = lf2.Rectangle;
    /**
     * Body
     *
     * @type {Body}
     * @class lf2.Body
     */
    lf2.Body = class Body{
        /**
         *
         * @param {String} content
         */
        constructor(content) {
            this.info = Utils.parseDataLine(content.replace(/\r?\n/g, ""));
            this.kind = this.info.get('kind');
            this.rect = new Rectangle(
                this.info.get('w'),this.info.get('h'),
                this.info.get('x'),this.info.get('y')
            );
        }
    };


    return lf2;
})(lf2 || {});