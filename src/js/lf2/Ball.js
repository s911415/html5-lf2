"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const FrameStage = lf2.FrameStage;
    const KeyboardConfig = lf2.KeyboardConfig;
    const Bound = lf2.Bound;
    const INIT_TIME = 500;
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
            this._remainderTime = INIT_TIME;
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
            const hit = this.currentFrame.hit;

            if (this._remainderTime <= 0 && hit.a != 0 && hit.d != 0) {
                next = hit.d;
            }

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
            //if (bound & Bound.TOP) this.position.y = map.zBoundary.first;
            //if (bound & Bound.BOTTOM) this.position.y = map.zBoundary.second;
        }

        update() {
            super.update();
            if (this.isFrameChanged) {
                const hit = this.currentFrame.hit;
                if (hit.a > 0) {
                    this._remainderTime -= hit.a;
                }
            }
        }

        /**
         *
         * @override
         */
        onDestroy() {
            const ERR_MSG = 'Cannot destroy ball';

            let indexOfBall = this.belongTo.balls.indexOf(this);

            //Remove ball from balls list
            if (indexOfBall !== -1) {
                this.belongTo.balls.splice(indexOfBall, 1);
            } else {
                throw ERR_MSG;
            }


            if (this.spriteParent) {
                this.spriteParent.detach(this);
            } else {
                throw ERR_MSG;
            }
        }
    };


    return lf2;
})(lf2 || {});