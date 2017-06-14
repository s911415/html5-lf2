"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    const Utils = lf2.Utils;
    const GameItem = lf2.GameItem;
    const MIN_V = GameItem.MIN_V;
    const GRAVITY = GameItem.GRAVITY;
    const FRICTION = GameItem.FRICTION;
    /**
     * FasterTrackerBehavior
     *
     * @class {lf2.FasterTrackerBehavior}
     * @extends {lf2.AbstractBehavior}
     */
    lf2.FasterTrackerBehavior = class FasterTrackerBehavior extends lf2.AbstractBehavior{
        /**
         *
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {
            super(ball, world);

            this._maxVelocity = new Framework.Point3D(12, 0, 0);

            /**
             *
             * @type {lf2.GameItem}
             * @private
             */
            this._target = null;
        }

        /**
         * Updates this object.
         *
         * @return  .
         */
        update() {
            super.update();
        }

        /**
         *
         * @returns {Framework.Point3D}
         */
        getVelocity() {
            let vx = this._ball._velocity.x;

            vx += vx * FRICTION;

            return new Point3D(vx, 0, 0);
        }

        /**
         *
         * @returns {lf2.GameItem}
         */
        getTarget() {
            if (this._target && !this._target.alive) this._target = null;
            if (this._target !== null) return this._target;

            this._target = this._world.getEnemy(this.belongTo);

            this._maxVelocity = this._ball._prevVelocity.clone();

            return this._target;
        }

        /**
         * Gets the fa.
         *
         * @return  {Number}   A get.
         */
        get FA() {
            return 10;
        }

        /**
         * Convert this object into a string representation.
         *
         * @return  An unknown that represents this object.
         */
        toString() {
            return 'lf2.FasterTrackerBehavior';
        }
    };


    return lf2;
})(lf2 || {});