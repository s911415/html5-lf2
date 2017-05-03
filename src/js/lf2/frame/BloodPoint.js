"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    /**
     * BloodPoint
     *
     * @class lf2.BloodPoint
     */
    lf2.BloodPoint = class BloodPoint {
        /**
         *
         * @param {String} content
         */
        constructor(content) {
            this.info = Utils.parseDataLine(content.replace(/\r?\n/g, ""));
            this.point = new Point(
                intval(this.info.get('x')), intval(this.info.get('y')),
            );
        }
    };


    return lf2;
})(lf2 || {});