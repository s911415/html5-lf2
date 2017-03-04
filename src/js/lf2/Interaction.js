"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    const Rectangle = lf2.Rectangle;
    /**
     * Interaction
     *
     * @type {Interaction}
     * @class lf2.Interaction
     */
    lf2.Interaction = class Interaction{
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

            this.zwidth = this.info.get('zwidth') || 0;

            this.dv = new Point(
                this.info.get('dvx') || 0,
                this.info.get('dvy') || 0
            );

            this.fall = this.info.get('fall') || 100;

            this.vrest = this.info.get('vrest') || 1;
            this.arest = this.info.get('arest') || 1;

            this.injury = this.info.get('injury') || 0;
            this.bdefend = this.info.get('bdefend') || 0;

            this.effect = this.info.get('effect') || 0;
        }
    };


    return lf2;
})(lf2 || {});