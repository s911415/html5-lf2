"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    /**
     * Rectangle
     *
     * @type {Rectangle}
     * @class lf2.Rectangle
     */
    lf2.Rectangle = class Rectangle{
        constructor(width, height, px, py) {
            this.width = parseInt(width, 10);
            this.height = parseInt(height, 10);
            this.position = new Point(px, py);
        }
    };


    return lf2;
})(lf2 || {});