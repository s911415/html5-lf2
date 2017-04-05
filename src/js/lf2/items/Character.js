"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Bound = lf2.Bound;
    const ItrKind = lf2.ItrKind;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const KeyboardConfig = lf2.KeyboardConfig;
    const FrameStage = lf2.FrameStage;
    const DIRECTION = GameItem.DIRECTION;
    const NONE = GameItem.NONE;

    const STAND_FRAME_RANGE = {
        min: 0,
        max: 4
    };
    Object.freeze(STAND_FRAME_RANGE);

    const WALK_FRAME_RANGE = {
        min: 5,
        max: 8
    };
    Object.freeze(WALK_FRAME_RANGE);

    const RUN_FRAME_RANGE = {
        min: 9,
        max: 11
    };
    Object.freeze(RUN_FRAME_RANGE);

    const FALLING1_FRAME_RANGE = {
        min: 180,
        max: 185
    };
    Object.freeze(FALLING1_FRAME_RANGE);

    const FALLING2_FRAME_RANGE = {
        min: 186,
        max: 191
    };
    Object.freeze(FALLING2_FRAME_RANGE);

    const HIDE_FRAME_RANGE = {
        min: 1100,
        max: 1299
    };
    Object.freeze(HIDE_FRAME_RANGE);

    const CHANGE_TO_FALLING_INDEX = [
        FrameStage.STAND, FrameStage.WALK, FrameStage.RUN
    ];
    CHANGE_TO_FALLING_INDEX.sort();
    Object.freeze(CHANGE_TO_FALLING_INDEX);

    const PUNCH1_FRAME_ID = 60;
    const PUNCH2_FRAME_ID = 65;
    const JUMP_FRAME_ID = 210;
    const FALLING_ID = 212;
    const DEFEND_FRAME_ID = 110;
    const STOP_RUNNING_FRAME_ID = 218;
    const ROWING_FRAME_ID = 102;
    const RUN_ATTACK_FRAME_ID = 85;
    const JUMP_ATTACK_FRAME_ID = 80;
    const LYING1_FRAME_ID = 230;
    const LYING2_FRAME_ID = 231;


    const getRand = (arr) => {
        let idx = (arr.length * Math.random()) | 0;
        return arr[idx];
    };

    const getPunchId = () => getRand([PUNCH1_FRAME_ID, PUNCH2_FRAME_ID]);
    const getLyingId = () => getRand([LYING1_FRAME_ID, LYING2_FRAME_ID]);

    const DEFAULT_KEY = {};
    let acceptForceChangeStatus = [];

    DEFAULT_KEY[FrameStage.STAND] = {
        d: DEFEND_FRAME_ID,
        j: JUMP_FRAME_ID,
        a: getPunchId,
    };
    DEFAULT_KEY[FrameStage.WALK] = {
        d: DEFEND_FRAME_ID,
        j: JUMP_FRAME_ID,
        a: DEFAULT_KEY[FrameStage.STAND].a,
    };
    DEFAULT_KEY[FrameStage.RUN] = {
        d: ROWING_FRAME_ID,
        j: JUMP_FRAME_ID,
        a: RUN_ATTACK_FRAME_ID,
    };
    DEFAULT_KEY[FrameStage.JUMP] = {
        a: JUMP_ATTACK_FRAME_ID,
    };

    for (let k in DEFAULT_KEY) {
        let t = DEFAULT_KEY[k];
        KeyboardConfig.HIT_KEY.HIT_LIST.forEach(key => {
            if (t[key]) {
                t[KeyboardConfig.HIT_KEY[key]] = t[key];
            }
        });
        acceptForceChangeStatus.push(intval(k));
        Object.freeze(DEFAULT_KEY[k]);
    }
    Object.freeze(DEFAULT_KEY);

    const RECOVER_MP_INTERVAL = 1000;
    const RECOVER_MP_VALUE = 5;

    /**
     * Character
     *
     * @class lf2.Character
     * @extends lf2.GameItem
     * @implements {Framework.AttachableInterface}
     */
    lf2.Character = class Character extends lf2.GameItem {
        /**
         *
         * @param charId ID of character
         * @param {lf2.Player} player
         */
        constructor(charId, player) {
            super(charId, player);
            this.charId = charId;
            this.head = this.obj.head;
            this.small = this.obj.small;
            this._lastFuncKey = 0;

            this._walk_dir = DIRECTION.RIGHT;
            this._run_dir = DIRECTION.RIGHT;
            this._punch_dir = DIRECTION.RIGHT;
            this._lastRecoverMPTime = -1;
            this._hideRemainderTime = 0;

            this._upKey = -1;
        }


        /**
         *
         * @returns {Number}
         * @private
         * @override
         */
        _getNextFrameId() {
            if (this._frameForceChangeId !== NONE) return this._frameForceChangeId;

            const hitList = this.currentFrame.hit;
            const curState = this.currentFrame.state;
            let next = this.currentFrame.nextFrameId;
            const nextKind = (next / 100) | 0;
            const funcKeyWoArrow = this._curFuncKey & ~((KeyboardConfig.KEY_MAP.LEFT | KeyboardConfig.KEY_MAP.RIGHT) & ~KeyboardConfig.KEY_MAP.FRONT);
            const fc = acceptForceChangeStatus.indexOf(curState) !== -1;
            if (hitList[funcKeyWoArrow]) {
                next = hitList[funcKeyWoArrow];
            }
            if ((fc || next === 0 || next === 999) && DEFAULT_KEY[curState]) {
                const _next = DEFAULT_KEY[curState][funcKeyWoArrow];
                if (_next) {
                    if (typeof _next === 'function') {
                        next = _next();
                    } else {
                        next = _next;
                    }
                }
            }

            const IS_ARR_ONLY = this._isArrowKeyOnly();

            if (fc) {
                if (
                    next !== 0 &&
                    next.inRange(
                        STAND_FRAME_RANGE.min, STAND_FRAME_RANGE.max
                    ) && (IS_ARR_ONLY)
                ) {
                    next = 999;
                }
            }

            if (next.inRange(HIDE_FRAME_RANGE.min, HIDE_FRAME_RANGE.max)) {
                this._hideRemainderTime = next;
                this._allowDraw = false;
                next = 0;
            }

            if (this.belongTo.hp <= 0) {
                this._allowDraw = true;
                this._hideRemainderTime = 0;
                switch (curState) {
                    case FrameStage.LYING:
                        next = this.currentFrame.id;
                        break;
                    default:
                        next = getLyingId();
                }
            } else {
                // 強制換成掉落動畫
                if (this.position.z < 0 && CHANGE_TO_FALLING_INDEX.binarySearch(curState) !== -1) {
                    next = FALLING_ID;
                }

                if (next === 0) {
                    switch (curState) {
                        case FrameStage.RUN:
                        case FrameStage.BURN_RUN:
                            if (this._run_dir === DIRECTION.RIGHT) {
                                next = this.currentFrame.id + 1;
                                //Loop run action
                                if (next > RUN_FRAME_RANGE.max) {
                                    next -= 2;
                                    this._run_dir = DIRECTION.LEFT;
                                }
                            } else {
                                next = this.currentFrame.id - 1;
                                //Loop run action
                                if (next < RUN_FRAME_RANGE.min) {
                                    next += 2;
                                    this._run_dir = DIRECTION.RIGHT;
                                }
                            }

                            if (
                                (this._containsKey(KeyboardConfig.KEY_MAP.LEFT) && this._direction === DIRECTION.RIGHT) ||
                                (this._containsKey(KeyboardConfig.KEY_MAP.RIGHT) && this._direction === DIRECTION.LEFT)
                            ) {
                                next = STOP_RUNNING_FRAME_ID;
                            }

                            break;
                        case FrameStage.FALL: {
                            let face = -1;
                            if (this._currentFrameIndex.inRange(FALLING1_FRAME_RANGE.min, FALLING1_FRAME_RANGE.max)) {
                                face = true; //前
                                next = (this._currentFrameIndex + 1);

                                if (next > FALLING1_FRAME_RANGE.max) next = FALLING1_FRAME_RANGE.max;
                                else if (next < FALLING1_FRAME_RANGE.min) next = FALLING1_FRAME_RANGE.min;


                            } else if (this._currentFrameIndex.inRange(FALLING2_FRAME_RANGE.min, FALLING2_FRAME_RANGE.max)) {
                                face = false; //後
                                next = (this._currentFrameIndex + 1);

                                if (next > FALLING2_FRAME_RANGE.max) next = FALLING2_FRAME_RANGE.max;
                                else if (next < FALLING2_FRAME_RANGE.min) next = FALLING2_FRAME_RANGE.min;
                            }

                            if (this.isStopping) {
                                if (face) {
                                    next = LYING1_FRAME_ID;
                                } else {
                                    next = LYING2_FRAME_ID;
                                }
                            }
                        }
                            break;
                        default:
                            next = 0;
                            if (this.position.z < 0) {
                                next = FALLING_ID;
                            }
                    }
                } else if (next === 999) {
                    switch (curState) {
                        case FrameStage.STAND:
                            if (IS_ARR_ONLY) {
                                next = WALK_FRAME_RANGE.min;
                                this._walk_dir = DIRECTION.RIGHT;
                            }

                            break;

                        case FrameStage.WALK:
                            //hold left or right key
                            if (IS_ARR_ONLY || this.belongTo._isHoldingLastKey()) {
                                if (this._walk_dir === DIRECTION.RIGHT) {
                                    next = this.currentFrame.id + 1;
                                    //Loop walk action
                                    if (next > WALK_FRAME_RANGE.max) {
                                        next -= 2;
                                        this._walk_dir = DIRECTION.LEFT;
                                    }
                                } else {
                                    next = this.currentFrame.id - 1;
                                    //Loop walk action
                                    if (next < WALK_FRAME_RANGE.min) {
                                        next += 2;
                                        this._walk_dir = DIRECTION.RIGHT;
                                    }
                                }
                            }
                            break;
                        default:
                            next = 0;
                            if (this.position.z < 0) {
                                next = FALLING_ID;
                            }
                    }
                    if (next === 999) next = 0;

                }
            }

            //Check mp request
            const nextFrame = this.obj.frames[next];
            if (!this.frameExist(next)) {
                throw new RangeError(`Character (${this.obj.id}) Frame (${next}) not found`);
            }

            const reqMp = intval(nextFrame.mp);
            if (this.belongTo.requestMp(reqMp)) {
                return next;
            } else {
                return 0;
            }
        }


        /**
         *
         * @returns {Framework.Point3D}
         * @override
         * @protected
         */
        _getVelocity() {
            let x, y, z;
            x = y = z = 0;
            switch (this.currentFrame.state) {
                case FrameStage.WALK:

                    if (this._containsKey(KeyboardConfig.KEY_MAP.DOWN)) {
                        z = this.obj.walking_speedz;
                    } else if (this._containsKey(KeyboardConfig.KEY_MAP.UP)) {
                        z = -this.obj.walking_speedz;
                    }

                    if (
                        this._containsKey(KeyboardConfig.KEY_MAP.RIGHT) ||
                        this._containsKey(KeyboardConfig.KEY_MAP.LEFT)
                    ) {
                        x = this.obj.walking_speed;
                    }

                    break;
                case FrameStage.RUN:
                case FrameStage.BURN_RUN:

                    if (this._containsKey(KeyboardConfig.KEY_MAP.DOWN)) {
                        z = this.obj.running_speedz;
                    } else if (this._containsKey(KeyboardConfig.KEY_MAP.UP)) {
                        z = -this.obj.running_speedz;
                    }

                    x = this.obj.running_speed;

                    break;
                case FrameStage.JUMP:
                    if (this._currentFrameIndex !== FALLING_ID) {
                        y = this.obj.jump_height;
                    } else {

                    }
                    break;
                default:
                    x = this.currentFrame.velocity.x;
                    y = this.currentFrame.velocity.y;
                    z = this.currentFrame.velocity.z;
            }

            return new Framework.Point3D(x, y, z);
        }

        /**
         *
         * @returns {Framework.Point3D}
         * @protected
         */
        _getFrameOffset() {
            let pRet = super._getFrameOffset();


            return pRet;
        }


        /**
         * Draw object
         *
         * @param {CanvasRenderingContext2D} ctx
         *
         * @override
         */
        draw(ctx) {
            super.draw(ctx);
        }

        /**
         * startRun()
         *
         * Starts a run.
         *
         * @return  .
         */
        startRun() {
            //Is running
            if (this._currentFrameIndex.inRange(RUN_FRAME_RANGE.min, RUN_FRAME_RANGE.max)) return;

            this.setFrameById(RUN_FRAME_RANGE.min);
        }

        /**
         * Is move key pressed
         * @returns {boolean}
         * @private
         */
        _isArrowKeyOnly() {
            return (
                this._containsKey(KeyboardConfig.KEY_MAP.UP) ||
                this._containsKey(KeyboardConfig.KEY_MAP.DOWN) ||
                this._containsKey(KeyboardConfig.KEY_MAP.LEFT) ||
                this._containsKey(KeyboardConfig.KEY_MAP.RIGHT)
            );
        }

        /**
         *
         * @param {Number} key KeyboardConfig.KEY_MAP
         * @returns {boolean}
         * @private
         */
        _containsKey(key) {
            return this.belongTo._containsKey(key);
        }

        /**
         * Destroy character
         * @override
         */
        onDestroy() {
            const ERR_MSG = 'Cannot destroy character';
            if (this.spriteParent) {
                this.spriteParent.detach(this);
            } else {
                throw ERR_MSG;
            }
        }

        /**
         * get isFuncKeyChanged()
         *
         * Is function key changed.
         *
         * @return  {Boolean}   A get.
         */
        get isFuncKeyChanged() {
            return this._curFuncKey !== this._lastFuncKey;
        }

        /**
         *
         * @param {Number} bound
         * @param {lf2.GameMap} map
         */
        onOutOfBound(bound, map) {
            if (bound & Bound.LEFT) this.position.x = 0;
            if (bound & Bound.RIGHT) this.position.x = map.width;
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
            super.update();

            const NOW = Date.now();
            const state = this.currentFrame.state;
            const frameKind = (state / 100) | 0;

            if (this.isFuncKeyChanged) {
                console.log(this.charId, this._curFuncKey, this._currentFrameIndex);

                this._lastFuncKey = this._curFuncKey;
                this._frameForceChange = true;
            }


            if ((NOW - this._lastRecoverMPTime) >= RECOVER_MP_INTERVAL) {
                this.belongTo.addMp(RECOVER_MP_VALUE);
                this._lastRecoverMPTime = NOW;
            }

            //變身

            if (frameKind === 80 || state === 9995) {
                let newCharId = this.currentFrame.state % 1000;
                if (state === 9995) {
                    newCharId = 50;
                }

                this.belongTo.charId = newCharId;
                this.obj = GameObjectPool.get(newCharId);

                this.head = this.obj.head;
                this.small = this.obj.small;
                this._currentFrameIndex = 0;
            }

            if (!this._allowDraw) {
                this._hideRemainderTime--;
                if (this._hideRemainderTime <= 0) {
                    this._hideRemainderTime = 0;
                    this._allowDraw = true;
                }
            }
        }

        /**
         *
         * @param {Number} frameId
         * @override
         */
        setFrameById(frameId) {
            super.setFrameById(frameId);


            const fc = acceptForceChangeStatus.indexOf(this.currentFrame.state) !== -1;

            if (fc) {
                const keywoFront = this._curFuncKey & ~KeyboardConfig.KEY_MAP.FRONT;

                if ((keywoFront & KeyboardConfig.KEY_MAP.LEFT) !== 0) {
                    this._direction = DIRECTION.LEFT;
                } else if ((keywoFront & KeyboardConfig.KEY_MAP.RIGHT) !== 0) {
                    this._direction = DIRECTION.RIGHT;
                }
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

            switch (ITR.kind) {

            }

            this.belongTo.hurtPlayer(ITR.injury);
            this._velocity.x = DV.x;
            this._velocity.y = DV.y;
            let face = this._direction !== item._direction;

            if (face) {
                this._velocity.x = -1 * this._velocity.x;
            }

            const fallDown = () => {
                if (face) {

                    this.setNextFrame(FALLING1_FRAME_RANGE.min);
                } else {
                    this.setNextFrame(FALLING2_FRAME_RANGE.min);
                }
            };

            if (Utils.triggerInProbability(ITR.fall) && ItrKind.ITR_ALLOW_FALL.binarySearch(ITR.kind) !== -1) {
                fallDown();
            }
        }

        get _curFuncKey() {
            return this.belongTo._currentKey;
        }

        /**
         * Set up key
         * @param {Number} key
         */
        setUpKey(key) {
            this._upKey = key;
        }
    };


    return lf2;
})(lf2 || {});