"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const Bound = lf2.Bound;
    /**
     * Ball
     *
     * @class lf2.Ball
     * @extends lf2.GameItem
     * @implements Framework.AttachableInterface
     */
    lf2.Ball = class Ball extends lf2.GameItem {
        /**
         *
         * @param ballId ID of character
         * @param {lf2.Player} player of this ball belong to
         */
        constructor(ballId, player) {
            super(ballId, player);

            this._isOut = false;

        }


        /**
         *
         * @returns {Number}
         * @private
         * @override
         */
        _getNextFrameId() {
            if (this._isOut) return lf2.GameItem.DESTROY_ID;
            let next = this.currentFrame.nextFrameId;
            if (next == 0) {
                switch (this.currentFrame.state) {
                    case 0:
                        next = 0;
                        break;
                    case 1:
                        break;

                    default:
                        next = 0;
                }
            }
            if (next == 999) return 0;

            return next;
        }

        /**
         *
         * @param {Number} bound
         * @param {lf2.GameMap} map
         */
        onOutOfBound(bound, map) {
            if (
                (bound & Bound.LEFT) || (bound & Bound.RIGHT)
            ) this._isOut = true;
            if (bound & Bound.TOP) this.position.y = map.zBoundary.first;
            if (bound & Bound.BOTTOM) this.position.y = map.zBoundary.second;
        }

        /**
         *
         * @override
         */
        onDestroy() {
            let indexOfBall = this.belongTo.balls.indexOf(this);

            //Remove ball from balls list
            if (indexOfBall !== -1) {
                this.belongTo.balls.splice(indexOfBall, 1);
            }
        }
    };


    return lf2;
})(lf2 || {});