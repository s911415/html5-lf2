"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    const Rectangle = lf2.Rectangle;
    /**
     * Interaction
     *
     * @class lf2.Interaction
     */
    lf2.Interaction = class Interaction {
        /**
         *
         * @param {String} content
         */
        constructor(content) {
            this.info = Utils.parseDataLine(content.replace(/\r?\n/g, ""));
            this.kind = this.info.get('kind');
            this.rect = new Rectangle(
                intval(this.info.get('w')), intval(this.info.get('h')),
                intval(this.info.get('x')), intval(this.info.get('y'))
            );

            this.zwidth = intval(this.info.get('zwidth') || 0);

            this.dv = new Point(
                intval(this.info.get('dvx') || 0),
                intval(this.info.get('dvy') || 0)
            );

            this.fall = intval(this.info.get('fall') || 100);

            this.vrest = intval(this.info.get('vrest') || 1);
            this.arest = intval(this.info.get('arest') || 1);

            this.injury = intval(this.info.get('injury') || 0);
            this.bdefend = intval(this.info.get('bdefend') || 0);

            this.effect = intval(this.info.get('effect') || 0);
        }
    };


    return lf2;
})(lf2 || {});