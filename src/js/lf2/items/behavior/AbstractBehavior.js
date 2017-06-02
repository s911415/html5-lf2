"use strict";
var lf2 = (function (lf2) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    /**
     * Abstract Behavior
     *
     * @class lf2.AbstractBehavior
     * @abstract
     */
    lf2.AbstractBehavior = class AbstractBehavior {
        /**
         * @constructor
         * @param {lf2.Ball} ball
         * @param {lf2.WorldScene} world
         */
        constructor(ball, world) {

            /**
             *
             * @type {lf2.Ball}
             * @protected
             */
            this._ball = ball;

            /**
             * @type {lf2.Player}
             */
            this.belongTo = ball.belongTo;

            /**
             *
             * @type {lf2.WorldScene}
             * @protected
             */
            this._world = world;
        }

        /**
         *
         * @returns {Framework.Point3D}
         * @abstract
         */
        getVelocity() {
            throw METHOD_NOT_IMPLEMENT;
        }

        /**
         * Updates this object.
         *
         * @return  .
         */
        update() {
            if(this._ball && !this._ball.alive){
                //Remove reference of ball
                this._ball._behavior = null;
                this._ball = null;
            }
        }

        /**
         *
         * @returns {lf2.GameItem}
         * @abstract
         */
        getTarget() {
            throw METHOD_NOT_IMPLEMENT;
        }
    };


    return lf2;
})(lf2 || {});