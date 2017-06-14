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
    const MIN_SPEED = 10;

    /**
     * FirzenDisasterFallDownBehavior
     *
     * @class {lf2.FirzenDisasterFallDownBehavior}
     * @extends lf2.AbstractBehavior
     */
    lf2.FirzenDisasterFallDownBehavior = class FirzenDisasterFallDownBehavior extends lf2.AbstractBehavior {
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {
            super(ball, world);


            this._maxVelocity = new Framework.Point3D(MIN_SPEED, 0, 5);

            this._targetCatched = false;
            
            // this._radiusLocked = false;
            // this._prevRadius = 0;

            this._radiusX = 0;
            this._counter = 0;
        }

        /**
         * Updates this object.
         *
         * @return  .
         */
        update() {
            super.update();

            // if (this._radiusX > this._maxVelocity.x) this._radiusX = this._maxVelocity.x;
            // if (this._radiusX < 0) this._radiusX += FRICTION;
            this._counter++;
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
                const IS_FRONT = this._ball.isFront(TARGET);

                if (IS_FRONT) {
                    const p1 = new Point(this._ball.position.x, -this._ball.position.z);
                    const p2 = new Point(TARGET.position.x, -TARGET.position.z);
                    // const RAD = this._radiusLocked ? this._prevRadius : Utils.GetRadBasedOnPoints(p1, p2) + (Math.random() - .5);
                    
                    // this._prevRadius = RAD;
                    let _x = this._counter;
                    let eee = Math.exp(-_x * _x / 1e3);
                    vx = this._radiusX * eee
                    vy = this._maxVelocity.y * (1 - Math.exp(-_x * _x / 50));

                    // if (this._ball._direction === GameItem.DIRECTION.LEFT) vx *= -1;
                    
                    // this._radiusLocked = true;
                } else {
                    //轉向
                    // this._radiusLocked = false;
                    this._ball._direction = !this._ball._direction;
                    // this._radiusX = -this._maxVelocity.x;
                    vx = this._radiusX;
                }

                const dy = this._ball.position.y - (TARGET.position.y); //dy > 0 ? UP : DOWN ; 5 - 20
                const MIN_Y_DIFF = 8;
                vz = dy === 0 ? 0 : (dy > 0 ? -1 : 1);
                if (Math.abs(dy) < MIN_Y_DIFF) {

                } else {

                    vz *= 2;
                }
            }

            // if (Math.abs(vx) < MIN_SPEED) vx = Math.sign(vx) * MIN_SPEED;
            // if (Math.abs(vz) < MIN_SPEED) vz = Math.sign(vz) * MIN_SPEED;
            // if (Math.abs(vy) < Math.abs(this._maxVelocity.y)) vy = Math.abs(this._maxVelocity.y);
            /*vx |= 0;
            vy |= 0;
            vz |= 0;*/

            return new Point3D(vx, vy, vz);
        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            if (!this._world) return null;

            let target = this._world.getEnemy(this.belongTo);

            if (!this._targetCatched) {
                this._maxVelocity = this._ball._prevVelocity.clone();
                this._maxVelocity.x = Math.abs(this._maxVelocity.x) + (((Math.random() * 4) | 0) - 2);
                this._maxVelocity.y = Math.abs(this._maxVelocity.y);
                this._maxVelocity.z = Math.abs(this._maxVelocity.z);
                this._radiusX = Math.abs(this._maxVelocity.x);
                this._radiusY = Math.abs(this._maxVelocity.y);
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
            return 7;
        }

        /**
         * Convert this object into a string representation.
         *
         * @return  An unknown that represents this object.
         */
        toString() {
            return 'lf2.FirzenDisasterFallDownBehavior';
        }
    };


    return lf2;
})(lf2 || {});