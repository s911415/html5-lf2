"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    const GameItem = lf2.GameItem;
    const MIN_V = GameItem.MIN_V;
    const GRAVITY = GameItem.GRAVITY;
    const Utils = lf2.Utils;
    const MIN_SPEED = 10;

    /**
     * JulianBallTrackerBehavior
     *
     * @class {lf2.JulianBallTrackerBehavior}
     * @extends lf2.AbstractBehavior
     */
    lf2.JulianBallTrackerBehavior = class JulianBallTrackerBehavior extends lf2.CenterTrackerBehavior{
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {
            super(ball, world);

        }

        get FA() {
            return 14;
        }

        toString() {
            return 'lf2.JulianBallTrackerBehavior';
        }
    };


    return lf2;
})(lf2 || {});