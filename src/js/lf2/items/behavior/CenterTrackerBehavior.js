"use strict";
var lf2 = (function (lf2) {
    const Point3D = Framework.Point3D;
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

            this._maxVelocity = new Framework.Point3D(12, 0, 5);

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
                

                if (vx > this._maxVelocity.x) vx = this._maxVelocity.x;
                if (vy > this._maxVelocity.y) vx = this._maxVelocity.y;
                if (vz > this._maxVelocity.z) vx = this._maxVelocity.z;
            }

            return new Point3D(vx, vy, vz);
        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            if (!this._target.alive) this._target = null;
            if (this._target !== null) return this._target;

            this._target = this._world.getEnemy(this._ball.belongTo);

            if (this._target !== null) {
                this._maxVelocity = this._target._prevVelocity.clone();
            }

            return this._target;
        }
    };


    return lf2;
})(lf2 || {});