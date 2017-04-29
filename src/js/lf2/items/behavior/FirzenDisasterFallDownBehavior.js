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

            this._radiusX = 0;
            this._radiusY = 0;
        }

        update() {
            super.update();

            if (this._radiusX > this._maxVelocity.x) this._radiusX = this._maxVelocity.x;
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
                    const RAD = Utils.GetRadBasedOnPoints(p1, p2);

                    vx = this._radiusX * Math.cos(RAD);
                    vy = this._radiusX * Math.sin(RAD) * -1;

                    if (this._ball._direction === GameItem.DIRECTION.LEFT) vx *= -1;
                } else {
                    //轉向
                    this._ball._direction = !this._ball._direction;
                    this._radiusX = -this._maxVelocity.x;
                    vx = this._radiusX;
                }

                const dy = this._ball.position.y - (TARGET.position.y); //dz > 0 ? UPPER : LOWER
                if (Math.abs(dy) < MIN_V) {
                    vz = 0;
                } else {
                    vz = dy === 0 ? 0 : (dy > 0 ? -1 : 1);
                    vz *= GRAVITY;
                }


                if (Math.abs(vz) > this._maxVelocity.z && this._maxVelocity.z !== 0) vz = Math.sign(vz) * this._maxVelocity.z;
            }

            if (Math.abs(vx) < MIN_SPEED) vx = Math.sign(vx) * MIN_SPEED;
            if (Math.abs(vz) < MIN_SPEED) vz = Math.sign(vz) * MIN_SPEED;
            if (Math.abs(vy) < Math.abs(this._maxVelocity.y)) vy = Math.abs(this._maxVelocity.y);
            vx |= 0;
            vy |= 0;
            vz |= 0;

            console.log(vy);
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
                this._maxVelocity.x = Math.abs(this._maxVelocity.x);
                this._maxVelocity.y = Math.abs(this._maxVelocity.y);
                this._maxVelocity.z = Math.abs(this._maxVelocity.z);
                this._radiusX = Math.abs(this._maxVelocity.x);
                this._radiusY = Math.abs(this._maxVelocity.y);
            }
            this._targetCatched = true;

            return target;
        }

        get FA() {
            return 1;
        }

        toString() {
            return 'lf2.FirzenDisasterFallDownBehavior';
        }
    };


    return lf2;
})(lf2 || {});