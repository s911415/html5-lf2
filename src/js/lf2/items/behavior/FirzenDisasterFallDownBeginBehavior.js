"use strict";
var lf2 = (function (lf2) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    const Point3D = Framework.Point3D;
    /**
     * FirzenDisasterFallDownBeginBehavior
     *
     * @class lf2.FirzenDisasterFallDownBeginBehavior
     * @extends lf2.AbstractBehavior
     */
    lf2.FirzenDisasterFallDownBeginBehavior = class FirzenDisasterFallDownBeginBehavior extends lf2.AbstractBehavior {
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {
            super(ball, world);
            this._attached = false
        }

        /**
         *
         * @returns {Framework.Point3D}
         */
        getVelocity() {
            return new Point3D(0, 0, 0);
        }

        /**
         * Updates this object.
         *
         * @return  .
         */
        update() {
            if (this._ball && !this._ball.alive && this._attached) {
                //Remove reference of ball
                this._ball._behavior = null;
                this._ball = null;
            }

            if (this._attached) return;

            let N = this._world.attachArray.filter(x=>x instanceof lf2.Character).length;
            let ops = [
                new lf2.ObjectPoint(`kind: 1  x: 0  y: 0  action: 0  dvx: 15  dvy: -8  oid: 221  facing: ${N}0`),
                new lf2.ObjectPoint(`kind: 1  x: 0  y: 0  action: 0  dvx: 13  dvy: -10  oid: 222  facing: ${N}0`),
            ];

            ops.forEach(opoint=>{
                let ball = this.belongTo.addBall(opoint, this._ball);
            });

            this._attached = true;
        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            return null;
        }

        /**
         * Gets the fa.
         *
         * @return  {Number}   A get.
         */
        get FA() {
            return 9;
        }
    };


    return lf2;
})(lf2 || {});