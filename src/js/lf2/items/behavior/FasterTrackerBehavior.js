"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    const MIN_V = 1;
    const GameItem = lf2.GameItem;
    const Utils = lf2.Utils;
    /**
     * FasterTrackerBehavior
     *
     * @class {lf2.FasterTrackerBehavior}
     * @implements {lf2.Behavior}
     */
    lf2.FasterTrackerBehavior = class FasterTrackerBehavior {
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

            this._maxVelocity = new Framework.Point3D(12, 0, 0);

            /**
             *
             * @type {lf2.GameItem}
             * @private
             */
            this._target = null;
        }

        /**
         *
         * @returns {Framework.Point3D}
         */
        getVelocity() {
            let vx = this._ball._velocity.x;

            vx += vx * 0.25;

            return new Point3D(vx, 0, 0);
        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            if (this._target && !this._target.alive) this._target = null;
            if (this._target !== null) return this._target;

            this._target = this._world.getEnemy(this._ball.belongTo);

            this._maxVelocity = this._ball._prevVelocity.clone();

            return this._target;
        }

        get FA() {
            return 10;
        }

        toString(){
            return 'lf2.FasterTrackerBehavior';
        }
    };


    return lf2;
})(lf2 || {});