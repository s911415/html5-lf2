"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    const Rectangle = lf2.Rectangle;
    /**
     * Body
     *
     * @class lf2.Body
     */
    lf2.Body = class Body {
        /**
         *
         * @param {String} content
         */
        constructor(content) {
            this.info = Utils.parseDataLine(content.replace(/\r?\n/g, ""));
            this.kind = intval(this.info.get('kind') || 0);
            this.rect = new Rectangle(
                intval(this.info.get('w')), intval(this.info.get('h')),
                intval(this.info.get('x')), intval(this.info.get('y'))
            );
        }
    };


    return lf2;
})(lf2 || {});