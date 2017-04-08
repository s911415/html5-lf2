"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const Point3D = Framework.Point3D;
    const FrameStage = lf2.FrameStage;
    const KeyboardConfig = lf2.KeyboardConfig;
    const Bound = lf2.Bound;
    const INIT_TIME = 500;
    const DIRECTION = lf2.GameItem.DIRECTION;
    const NONE = lf2.GameItem.NONE;
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
            this._affectByFriction = false;
        }


        /**
         *
         * @returns {Number}
         * @private
         * @override
         */
        _getNextFrameId() {
            if(this._frameForceChangeId!==NONE) return this._frameForceChangeId;

            if (this._isOut) return lf2.GameItem.DESTROY_ID;
            const curF = this.currentFrame;
            let next = curF.nextFrameId;
            const hit = curF.hit;

            if (this._remainderTime <= 0 && hit.a !== 0 && hit.d !== 0) {
                next = hit.d;
            }

            if (next === 0) {
                switch (curF.state) {
                    case 0:
                        next = 0;
                        break;
                    case 1:
                        break;

                    default:
                        next = 0;
                }
            }
            if (next === 999) return 0;


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

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
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

            if (this.spriteParent) {
                this.spriteParent.detach(this);
            } else {
                throw ERR_MSG;
            }
        }


        /**
         *
         * @param {lf2.GameItem} item
         */
        notifyDamageBy(item) {
            super.notifyDamageBy(item);
            const ITR = item.currentFrame.itr;
            const DV = ITR.dv;

            return true;
        }

        /**
         *
         * @param {lf2.GameItem[]} gotDamageItems
         */
        postDamageItems(gotDamageItems) {
            super.postDamageItems(gotDamageItems);
            const state = this.currentFrame.state;

            //打中敵軍
            const HIT_ENEMY = gotDamageItems.some((damagedItem) => damagedItem.belongTo !== this.belongTo);

            //打自己人
            const HIT_SAME_GROUP = gotDamageItems.some((damagedItem) => damagedItem.belongTo === this.belongTo);

            switch (state) {
                case FrameStage.BALL_FLYING:
                    if (HIT_ENEMY) {
                        this.setNextFrame(20);
                    } else if (HIT_SAME_GROUP) {
                        this.setNextFrame(10);
                    }
                    break;
                case FrameStage.BALL_HITTING:
                    if (HIT_ENEMY) {
                        this.setNextFrame(20);
                    }
                case FrameStage.BALL_CANCELED:
                    if (HIT_ENEMY) {
                        this.setNextFrame(20);
                    }
                    break;
            }


        }

        /**
         * get leftTopPoint()
         *
         * Left top point.
         *
         * @return  {get}   A get.
         */
        get __leftTopPoint__lol() {
            const center = this.currentFrame.center;
            let leftTopPoint = new Point3D(
                this.position.x - center.x,
                this.position.y - this.height + center.y,
                this.position.z
            );

            if (this._direction === DIRECTION.LEFT) {
                leftTopPoint.x = this.position.x - (this.width - center.x);
            }

            return leftTopPoint;
        }
    };


    return lf2;
})(lf2 || {});