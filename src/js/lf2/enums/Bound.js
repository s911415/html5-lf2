"use strict";
var lf2 = (function (lf2) {
    /**
     * Bound
     * 定義邊框的列舉型別，有上、下、左、右邊界
     *
     * @class lf2.Bound
     */
    lf2.Bound = {
        NONE: 0,
        TOP: 1,
        RIGHT: 2,
        BOTTOM: 4,
        LEFT: 8
    };

    Object.freeze(lf2.Bound);

    return lf2;
})(lf2 || {});