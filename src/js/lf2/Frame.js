"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const BDY_START_TAG = 'bdy:';
    const BDY_END_TAG = 'bdy_end:';
    const ITR_START_TAG = 'itr:';
    const ITR_END_TAG = 'itr_end:';

    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    /**
     * Frame
     *
     * @type {Frame}
     * @class lf2.Frame
     */
    lf2.Frame = class {
        /**
         *
         * @param {String} context
         */
        constructor(context) {
            this.sourceCode = context;
            let lines = context.lines();
            let infoArr = lines[0].split(/\s+/);

            this.id = parseInt(infoArr[0], 10);
            this.name = infoArr[1];

            this.data = Utils.parseDataLine(lines[1]);

            this.itr = new Interaction(context.getStringBetween(ITR_START_TAG, ITR_END_TAG));
            this.bdy = new Body(context.getStringBetween(BDY_START_TAG, BDY_END_TAG));
        }
    };


    return lf2;
})(lf2 || {});