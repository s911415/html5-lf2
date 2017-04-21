"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point3D;
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    /**
     * CenterTrackerBehavior
     *
     * @class {lf2.CenterTrackerBehavior}
     * @implements {lf2.Behavior}
     */
    lf2.CenterTrackerBehavior = class CenterTrackerBehavior {
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
            /**
             *
             * @type {lf2.GameItem}
             */
            const item = this.getTarget();
            let vx, vy, vz;
            vx = vy = vz = 0;

            if (item !== null) {

            }
        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            if (!this._target.alive) this._target = null;
            if (this._target !== null) return this._target;

            this._target = this._world.getEnemy(this._ball.belongTo);

            return this._target;
        }
    };


    return lf2;
})(lf2 || {});