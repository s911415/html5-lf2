"use strict";
var lf2 = (function (lf2) {
    /**
     * Bound
     *
     * @class lf2.Bound
     */
    lf2.Bound = {
        TOP: 1,
        RIGHT: 2,
        BOTTOM: 4,
        LEFT: 8
    };

    Object.freeze(lf2.Bound);

    return lf2;
})(lf2 || {});