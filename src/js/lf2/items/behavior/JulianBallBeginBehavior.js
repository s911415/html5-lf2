"use strict";
var lf2 = (function (lf2) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    /**
     * JulianBallBeginBehavior
     *
     * @class lf2.JulianBallBeginBehavior
     * @implements lf2.Behavior
     */
    lf2.JulianBallBeginBehavior = class JulianBallBeginBehavior {
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {

            /**
             *
             * @type {lf2.Ball}
             * @private
             */
            this._ball = ball;

            /**
             *
             * @type {lf2.WorldScene}
             * @private
             */
            this._world = world;

            this._maxVelocity = new Framework.Point3D(12, 0, 5);

            this._targetCatched = false;

            this._radius = 0;
        }

        /**
         *
         * @returns {Framework.Point3D}
         */
        getVelocity() {
            throw METHOD_NOT_IMPLEMENT;
        }
        /**
         *
         * @abstract
         */
        update() {

        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            return null;
        }
    };


    return lf2;
})(lf2 || {});