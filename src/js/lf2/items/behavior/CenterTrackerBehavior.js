"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    const MIN_V = 1;
    const GameItem = lf2.GameItem;
    const Utils = lf2.Utils;
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
            const TARGET = this.getTarget();

            let vx, vy, vz;
            vx = vy = vz = 0;

            if (TARGET !== null) {
                const IS_FRONT = TARGET.isFrontOf(this._ball);
                const RADIUS = this._ball._velocity.x;

                if (IS_FRONT) {
                    const p1 = new Point(this._ball.position.x, this._ball.position.y);
                    const p2 = new Point(TARGET.position.x, TARGET.position.y);
                    const RAD = Utils.GetRadBasedOnPoints(p1, p2);
                    let dz = this._ball.position.z - TARGET.position.z;//32 - 0
                    if (Math.abs(dz) < MIN_V) dz = 0;

                    vx = RADIUS * Math.cos(RAD);
                    vz = RADIUS * Math.sin(RAD);
                    console.log('dz', dz);
                    vy = dz === 0 ? 0 : (dz > 0 ? -1 : 1);
                } else {
                    //減速轉向
                    vx = GameItem.ApplyFriction(this._ball._velocity.x);

                    if (Math.abs(vx) < MIN_V) {
                        //轉向
                        this._ball._direction = !this._ball._direction;
                        vx = this._maxVelocity.x;
                    }
                }


                if (vx > this._maxVelocity.x) vx = this._maxVelocity.x;
                if (vy > this._maxVelocity.y) vy = this._maxVelocity.y;
                if (vz > this._maxVelocity.z) vz = this._maxVelocity.z;
                if (Math.abs(vx) < MIN_V) vx = 0;
                if (Math.abs(vy) < MIN_V) vy = 0;
                if (Math.abs(vz) < MIN_V) vz = 0;
            }
            console.log('vy', vy);

            return new Point3D(vx, vy, vz);
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
            this._maxVelocity.x = Math.abs(this._maxVelocity.x);
            this._maxVelocity.y = Math.abs(this._maxVelocity.y);
            this._maxVelocity.z = Math.abs(this._maxVelocity.z);

            return this._target;
        }

        get FA() {
            return 1;
        }

        toString() {
            return 'lf2.CenterTrackerBehavior';
        }
    };


    return lf2;
})(lf2 || {});