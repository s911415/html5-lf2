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
            this.kind = intval(this.info.get('kind') || 0);
            this.rect = new Rectangle(
                intval(this.info.get('w')), intval(this.info.get('h')),
                intval(this.info.get('x')), intval(this.info.get('y'))
            );

            this.zwidth = intval(this.info.get('zwidth') || 12);

            this.dv = new Point(
                intval(this.info.get('dvx') || 0),
                intval(this.info.get('dvy') || 0)
            );

            this.fall = intval(this.info.get('fall') || 20);

            this.vrest = intval(this.info.get('vrest') || -1);
            this.arest = intval(this.info.get('arest') || 7);

            this.injury = intval(this.info.get('injury') || 0);
            this.bdefend = intval(this.info.get('bdefend') || 0);

            this.effect = intval(this.info.get('effect') || 0);

            this._filterFall();
        }

        _filterFall() {
            switch (this.fall) {
                case 70:
                    this.fall = 100;
                    break;
                case 60:
                    this.fall = 70;
                    break;
                case 40:
                    this.fall = 50;
                    break;
                case 30:
                    this.fall = 30;
                    break;
            }
        }
    };


    return lf2;
})(lf2 || {});