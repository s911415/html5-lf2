"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const ItrKind = lf2.ItrKind;
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
    const ALLOW_FALL_DOWN_ID = [220, 221, 222];

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

            this._behavior = null;
        }


        /**
         *
         * @returns {Number}
         * @private
         * @override
         */
        _getNextFrameId() {
            if (this._frameForceChangeId !== NONE) return this._frameForceChangeId;

            if (this._isOut) return lf2.GameItem.DESTROY_ID;
            const curF = this.currentFrame;
            let next = curF.nextFrameId;
            const hit = curF.hit;

            if (this._remainderTime <= 0 && hit.a !== 0 && hit.d !== 0) {
                next = hit.d;
            }

            if (next === 0) {
                next = this._currentFrameIndex;
            }

            switch (hit.Fa) {
                case 7:
                    if (next !== this.DESTROY_ID && this.position.z >= -10 && ALLOW_FALL_DOWN_ID.indexOf(this.obj.id) !== -1) {
                        next = 60;
                    }
                    break;
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
            if (bound & Bound.TOP) this.position.y = map.zBoundary.first;
            if (bound & Bound.BOTTOM) this.position.y = map.zBoundary.second;
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            const hit = this.currentFrame.hit;
            super.update();

            if (this._behavior) {
                this._behavior.update();
            }

            if (this.isFrameChanged) {
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

        _getVelocity() {
            let v = super._getVelocity();
            const hit = this.currentFrame.hit;

            if (hit.j) {
                v.z = hit.j - 50;
            }

            if (hit.Fa !== 0 && this._remainderTime > 0) {
                if (this._behavior) {
                    if (this._remainderTime <= 0) {
                        this.velocity = this._behavior._maxVelocity;
                        this._behavior = null;
                        if (Math.abs(this.velocity.x) < 1) {
                            this.velocity.x = 10;
                        }
                        return this.velocity;
                    }

                    if (this._behavior.FA === hit.Fa) {
                        return this._behavior.getVelocity();
                    }
                    // }else{
                    //     if(this._behavior){
                    //         this._velocity = this._behavior._maxVelocity.clone();
                    //     }
                }

                switch (hit.Fa) {
                    case 1: //追敵人的center(因為敵人站在地面，所以會下飄)
                    case 14: //追敵人的center(因為敵人站在地面，所以會下飄)
                        this._behavior = new lf2.CenterTrackerBehavior(this, this.spriteParent);
                        break;
                    case 2: //水平追敵
                    case 3: //加速法追敵(追縱力較差)
                        this._behavior = new lf2.HorizontalTrackerBehavior(this, this.spriteParent);
                        break;

                    case 10:
                        this._behavior = new lf2.FasterTrackerBehavior(this, this.spriteParent);
                        break;

                    case 7:
                        this._behavior = new lf2.FirzenDisasterFallDownBehavior(this, this.spriteParent);

                        //return new Framework.Point3D(20, 5, 0);
                        break;

                    case 9:
                        this._behavior = new lf2.FirzenDisasterFallDownBeginBehavior(this, this.spriteParent);
                        break;

                    case 13:
                        this._behavior = new lf2.JulianBallBeginBehavior(this, this.spriteParent);
                        break;


                    default:
                        return new Framework.Point3D(10, 0, 0);
                }

                this._behavior.update();
                if (this._behavior) {
                    return this._behavior.getVelocity();
                }

            } else {
                this._behavior = null;
            }

            return v;
        }

        updateVelocity() {
            const getVelocityVal = (cur, next) => {
                if (next === 0) return cur;
                return next;
            };

            this._prevVelocity = this._velocity.clone();
            const v = this._getVelocity();

            this._velocity.x = getVelocityVal(this._velocity.x, v.x);
            this._velocity.y = getVelocityVal(this._velocity.y, v.y);
            this._velocity.z = getVelocityVal(this._velocity.z, v.z);
        }

        applyFriction() {
            super.applyFriction();
            this._velocity.z -= lf2.GameItem.ApplyFriction(this._velocity.z);
        }


        /**
         *
         * @param {lf2.GameItem} item
         */
        notifyDamageBy(item) {
            super.notifyDamageBy(item);
            const ITR = item.currentFrame.itr;
            const DV = ITR.dv;

            if (
                ITR.kind === ItrKind.REFLECTIVE_SHIELD ||
                (item instanceof lf2.Character && item.currentFrame.state === FrameStage.PUNCH)
            ) {
                this._velocity.x = 0;
                this.setNextFrame(30); //Rebounding
                this.obj.playHitSound();
                this.belongTo = item.belongTo; //Change owner
            }

            if (this.belongTo === item.belongTo && item.currentFrame.state !== FrameStage.FIRE) return false;

            switch (item.currentFrame.state) {
                case FrameStage.BALL_WIND_FLYING:
                    this.obj.playHitSound();
                    if (
                        item.currentFrame.state === FrameStage.BALL_WIND_FLYING
                    ) {
                        this.setNextFrame(20);
                        this.freeze();
                    }
                    break;
                case FrameStage.BALL_HIT_HEART:
                    this.obj.playHitSound();

                    if (
                        item.currentFrame.state === FrameStage.BALL_WIND_FLYING ||
                        item.currentFrame.state === FrameStage.BALL_HIT_HEART
                    ) {
                        this.setNextFrame(20);
                        this.freeze();
                    }
                    break;
                default:
                    if (
                        item.currentFrame.state !== FrameStage.BALL_WIND_FLYING &&
                        item.currentFrame.state !== FrameStage.BALL_HIT_HEART
                    ) {
                        this.setNextFrame(20);
                        this.freeze();
                    }

            }

            return true;
        }

        /**
         *
         * @param {lf2.GameItem[]} gotDamageItems
         */
        postDamageItems(gotDamageItems) {
            super.postDamageItems(gotDamageItems);
            const state = this.currentFrame.state;
            const ITR = this.currentFrame.itr;

            //打中敵軍
            const HIT_ENEMY = gotDamageItems.some((damagedItem) => damagedItem.belongTo !== this.belongTo);

            //打自己人
            const HIT_SAME_GROUP = gotDamageItems.some((damagedItem) => damagedItem.belongTo === this.belongTo);

            switch (state) {
                case FrameStage.BALL_FLYING:
                    if (HIT_ENEMY) {
                        this.setNextFrame(20);
                        this.obj.playHitSound();
                        this.freeze();
                    } else if (HIT_SAME_GROUP) {
                        this.setNextFrame(10);
                        this.obj.playHitSound();
                        this.freeze();
                    }
                    break;

                case FrameStage.BALL_HITTING:
                    if (HIT_ENEMY) {
                        this.obj.playHitSound();
                        this.setNextFrame(20);
                        this.freeze();
                    }
                    break;

                case FrameStage.BALL_CANCELED:
                    if (HIT_ENEMY) {
                        this.obj.playHitSound();
                        if (ITR.kind === ItrKind.REFLECTIVE_SHIELD) {
                            if (gotDamageItems[0] instanceof lf2.Character) this.setNextFrame(20);
                        } else {
                            this.setNextFrame(20);
                            this.freeze();
                        }
                    }
                    break;
                case FrameStage.BALL_WIND_FLYING:
                    if (HIT_ENEMY) {
                        this.obj.playHitSound();

                        if (
                            gotDamageItems[0].currentFrame.state === FrameStage.BALL_WIND_FLYING
                        ) {
                            this.setNextFrame(20);
                            this.freeze();
                        }
                    }
                    break;
                case FrameStage.BALL_HIT_HEART:
                    if (HIT_ENEMY) {
                        this.obj.playHitSound();

                        if (
                            gotDamageItems[0].currentFrame.state === FrameStage.BALL_WIND_FLYING ||
                            gotDamageItems[0].currentFrame.state === FrameStage.BALL_HIT_HEART
                        ) {
                            this.setNextFrame(20);
                            this.freeze();
                        }
                    }
                    break;

                default:
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