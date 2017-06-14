"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    const GameItem = lf2.GameItem;
    const MIN_V = GameItem.MIN_V;
    const GRAVITY = GameItem.GRAVITY;
    const FRICTION = GameItem.FRICTION;
    const Utils = lf2.Utils;

    /**
     * SpeedUpTrackerBehavior
     *
     * @class {lf2.SpeedUpTrackerBehavior}
     * @extends {lf2.CenterTrackerBehavior}
     */
    lf2.SpeedUpTrackerBehavior = class SpeedUpTrackerBehavior extends lf2.HorizontalTrackerBehavior{
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {
            super(ball, world);
        }

        /**
         * Gets the fa.
         *
         * @return  {Number}   A get.
         */
        get FA() {
            return 3;
        }

        /**
         * Convert this object into a string representation.
         *
         * @return  An unknown that represents this object.
         */
        toString() {
            return 'lf2.SpeedUpTrackerBehavior';
        }
    };


    return lf2;
})(lf2 || {});