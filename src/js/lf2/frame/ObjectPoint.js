"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;

    /**
     * Object point
     * 提供Frame新增氣功波的資訊儲存功能
     * ◎opoint解說◎
         若要在某個動作加入發出氣功波類型的絕技，只要在frame裏加入以下即可：
         opoint:
         kind: ? x: ? y: ? action: ? dvx: ? dvy: ? oid: ? facing: ?
         opoint_end:

         opoint: objectpoint開始

         kind: 1=發出氣功波

         x:發出的氣功的前後位置
         y:發出的氣功的天地位置

         action: 招式的第幾個frame

         dvx:向前後飛行的速度
         dvy:向天地飛行的速度

         oid:氣功波的id(請參考data/data_list.json)

         facing:數量及正反 (如數量是1個,正向→facing: 0；2個,正向→facing:20 ；
         1個,反向→facing:1 ； 2個,反向→facing: 21)
         前面數字是數量，數量若為1則不須填，但2以上就須填了；後面數字為正反向，
         偶數是正向，奇數是反向。

         opoint_end: objectpoint結束
     *
     * @class lf2.ObjectPoint
     */
    lf2.ObjectPoint = class ObjectPoint {
        /**
         *
         * @param {String} content
         */
        constructor(content) {
            this.info = Utils.parseDataLine(content.replace(/\r?\n/g, ""));
            this.kind = intval(this.info.get('kind') || 1);
            this.appearPoint = new Point(
                intval(this.info.get('x') || 0),
                intval(this.info.get('y') || 0)
            );
            this.action = intval(this.info.get('action'));
            this.dv = new Point(
                intval(this.info.get('dvx') || 0),
                intval(this.info.get('dvy') || 0)
            );
            this.objectId = intval(this.info.get('oid') || 0);
            this.facing = intval(this.info.get('facing') || 0);
            this.count = (this.facing / 10) | 0;
            this.dir = this.facing % 2 === 0 ? lf2.GameItem.DIRECTION.RIGHT : lf2.GameItem.DIRECTION.LEFT;
            if (this.count <= 0) {
                this.count = 1;
            }
        }
    };

    return lf2;
})(lf2 || {});