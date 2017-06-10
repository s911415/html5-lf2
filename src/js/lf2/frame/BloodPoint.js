"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    /**
     * BloodPoint
     * 提供Frame流血位置資訊儲存功能
     * @example
     * ◎bpoint解說◎
     * bpoint:
     * x: 43  y: 38
     * bpoint_end:
     * bpoint: 流血指令開始
     * x: y: 嘴角的位置
     * bpoint_end: 流血指令結束
     *   ※hp少於1/3時，嘴角才會流血。
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