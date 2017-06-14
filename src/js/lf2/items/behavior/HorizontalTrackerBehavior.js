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
     * HorizontalTrackerBehavior
     *
     * @class {lf2.HorizontalTrackerBehavior}
     * @extends {lf2.CenterTrackerBehavior}
     */
    lf2.HorizontalTrackerBehavior = class HorizontalTrackerBehavior extends lf2.CenterTrackerBehavior{
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {
            super(ball, world);
        }

        /**
         * Gets the velocity.
         *
         * @return {Framework.Point3D} The velocity.
         */
        getVelocity() {
            let v = super.getVelocity();
            v.y = 0;

            return v;
        }

        /**
         * Gets the fa.
         *
         * @return  {Number}   A get.
         */
        get FA() {
            return 2;
        }

        /**
         * Convert this object into a string representation.
         *
         * @return  An unknown that represents this object.
         */
        toString() {
            return 'lf2.HorizontalTrackerBehavior';
        }
    };


    return lf2;
})(lf2 || {});