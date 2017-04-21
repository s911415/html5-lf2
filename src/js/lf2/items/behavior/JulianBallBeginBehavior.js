"use strict";
var lf2 = (function (lf2) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    const Point3D = Framework.Point3D;
    /**
     * JulianBallBeginBehavior
     *
     * @class lf2.JulianBallBeginBehavior
     * @extends lf2.AbstractBehavior
     */
    lf2.JulianBallBeginBehavior = class JulianBallBeginBehavior extends lf2.AbstractBehavior {
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


        update() {
            super.update();
            if(this._attached) return;

            let opoint = new lf2.ObjectPoint(`kind: 1  x: 0  y: 5  action: 0  dvx: 20  dvy: 0  oid: 228  facing: 0`);

            this._ball.belongTo.addBall(opoint, this._ball);
            this._attached = true;
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