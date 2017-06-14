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
     * CenterTrackerBehavior
     *
     * @class {lf2.CenterTrackerBehavior}
     * @extends lf2.AbstractBehavior
     */
    lf2.CenterTrackerBehavior = class CenterTrackerBehavior extends lf2.AbstractBehavior{
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {
            super(ball, world);


            this._maxVelocity = new Framework.Point3D(MIN_SPEED, 0, 5);

            this._targetCatched = false;

            this._radius = 0;
        }

        /**
         * Updates this object.
         *
         * @return  .
         */
        update() {
            super.update();

            if (this._radius < this._maxVelocity.x) {
                this._radius += GRAVITY;
            } else if (this._radius > this._maxVelocity.x) {
                this._radius = this._maxVelocity.x;
            }
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
                let IS_FRONT = this._ball.isFront(TARGET);

                if (IS_FRONT) {
                    const p1 = new Point(this._ball.position.x, this._ball.position.y);
                    const p2 = new Point(TARGET.position.x, TARGET.position.y);
                    const RAD = Utils.GetRadBasedOnPoints(p1, p2);

                    vx = this._radius * Math.cos(RAD);
                    vz = (this._radius * .5 ) * Math.sin(RAD);

                    if (this._ball._direction === GameItem.DIRECTION.LEFT) vx *= -1;
                } else {
                    //轉向
                    this._ball._direction = !this._ball._direction;
                    this._radius = -this._maxVelocity.x;
                    vx = this._radius;
                }

                const dz = this._ball.position.z - (TARGET.position.z); //dz > 0 ? UPPER : LOWER
                if (Math.abs(dz) < MIN_V) {
                    vy = 0;
                } else {
                    vy = dz === 0 ? 0 : (dz > 0 ? -1 : 1);
                    vy *= GRAVITY;
                }


                if (Math.abs(vy) > this._maxVelocity.y && this._maxVelocity.y !== 0) vy = Math.sign(vy) * this._maxVelocity.y;
            }

            // if(Math.abs(vx) < MIN_SPEED) vx = Math.sign(vx) * MIN_SPEED;

            return new Point3D(vx, vy, vz);
        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            if(!this._world) return null;

            let target = this._world.getEnemy(this.belongTo);

            if (!this._targetCatched) {
                this._maxVelocity = this._ball._prevVelocity.clone();
                this._maxVelocity.x = Math.abs(this._maxVelocity.x);
                this._maxVelocity.y = Math.abs(this._maxVelocity.y);
                this._maxVelocity.z = Math.abs(this._maxVelocity.z);
                Object.freeze(this._maxVelocity);
                this._radius = this._maxVelocity.x;
            }
            this._targetCatched = true;

            return target;
        }

        /**
         * Gets the fa.
         *
         * @return  {Number}   A get.
         */
        get FA() {
            return 1;
        }

        /**
         * Convert this object into a string representation.
         *
         * @return  An unknown that represents this object.
         */
        toString() {
            return 'lf2.CenterTrackerBehavior';
        }
    };


    return lf2;
})(lf2 || {});