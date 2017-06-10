"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    const Rectangle = lf2.Rectangle;
    /**
     * Body
     * 提供Frame可傷害範圍資訊儲存功能
     * ◎bdy解說◎
         bdy: =身體(受攻擊的部分)開始

         kind: 0 特殊特技

         x: 26 w: 35 =受攻擊前~後的距離   y: 12 h: 66=受攻擊上~下的距離

         bdy_end:=身體結束
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