"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Bound = lf2.Bound;
    const ItrKind = lf2.ItrKind;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const Effect = lf2.Effect;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    const Point3D = Framework.Point3D;
    const KeyboardConfig = lf2.KeyboardConfig;
    const FrameStage = lf2.FrameStage;
    const DIRECTION = GameItem.DIRECTION;
    const NONE = GameItem.NONE;
    const DRAW_BLOOD_PERCENTAGE = 100 / 3;
    const HIDE_FLASH_TIME = 60;

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
    CHANGE_TO_FALLING_INDEX.sort((a, b) => a - b);
    Object.freeze(CHANGE_TO_FALLING_INDEX);

    const GOD_MODE_TIME = 40;
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
    acceptForceChangeStatus.sort((a, b) => a - b);

    const RECOVERY = {
        HP: {
            value: 10,
            interval: 5000,
        },
        MP: {
            value: (player) => 1 + ((player.hp / 100) | 0),
            interval: 500,
        },
        FALL: {value: -0.45},
        BDEFEND: {value: -0.5},
    };
    for (let k in RECOVERY) Object.freeze(RECOVERY[k]);
    Object.freeze(RECOVERY);

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
            this._hideRemainderTime = 0;
            this._fall = 0;
            this._godModeTime = 0;

            this._upKey = -1;

            this._lastRecoverHPTime = -1;
            this._lastRecoverMPTime = -1;

        }


        /**
         *
         * @returns {Number}
         * @private
         * @override
         */
        _getNextFrameId() {
            if (this._frameForceChangeId !== NONE) return this._frameForceChangeId;

            const curState = this.currentFrame.state;
            let next = this.currentFrame.nextFrameId;
            const nextKind = (next / 100) | 0;
            const funcKeyWoArrow = this._curFuncKey & ~((KeyboardConfig.KEY_MAP.LEFT | KeyboardConfig.KEY_MAP.RIGHT) & ~KeyboardConfig.KEY_MAP.FRONT);
            const fc = acceptForceChangeStatus.binarySearch(curState) !== -1;

            if (next === 205 && this._currentFrameIndex === next + 1) next = LYING1_FRAME_ID;
            if (next === 203 && this._currentFrameIndex === next + 1) next = next + 2;

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
                this._hideRemainderTime = next - 1000;
                this._allowDraw = false;
                next = 0;
            }

            if (curState === FrameStage.LYING) {
                this._fall = 0;
                if (this.belongTo.isAlive) this._godModeTime = GOD_MODE_TIME;
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
                                (this.containsKey(KeyboardConfig.KEY_MAP.LEFT) && this._direction === DIRECTION.RIGHT) ||
                                (this.containsKey(KeyboardConfig.KEY_MAP.RIGHT) && this._direction === DIRECTION.LEFT)
                            ) {
                                next = STOP_RUNNING_FRAME_ID;
                                this._nextDirection = null;
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


            return next;
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

                default:
                    x = this.currentFrame.velocity.x;
                    y = this.currentFrame.velocity.y;
                    z = this.currentFrame.velocity.z;
            }

            if (this._itrItem) {
                let ITR = this._itrItemFrame.itr;
                if (!ITR) throw "Some wrong";
                ITR = ITR[0];
                switch (ITR.kind) {
                    case ItrKind.THREE_D_OBJECTS:
                        x = z = 0;
                        break;
                }
            }
            this._charVel = this._charVel || new Framework.Point3D(0, 0, 0);
            this._charVel.x = x;
            this._charVel.y = y;
            this._charVel.z = z;

            return this._charVel;
        }

        /**
         * Applies the friction.
         *
         * @return  .
         */
        _getFrameOffset() {
            const o = super._getFrameOffset();
            let x, y, z;
            x = o.x;
            y = o.y;
            z = 0;
            switch (this.currentFrame.state) {
                case FrameStage.WALK:

                    if (this.containsKey(KeyboardConfig.KEY_MAP.DOWN)) {
                        z = this.obj.walking_speedz;
                    } else if (this.containsKey(KeyboardConfig.KEY_MAP.UP)) {
                        z = -this.obj.walking_speedz;
                    }

                    if (
                        this.containsKey(KeyboardConfig.KEY_MAP.RIGHT) ||
                        this.containsKey(KeyboardConfig.KEY_MAP.LEFT)
                    ) {
                        x = this.obj.walking_speed;
                    }

                    break;
                case FrameStage.RUN:
                case FrameStage.BURN_RUN:

                    if (this.containsKey(KeyboardConfig.KEY_MAP.DOWN)) {
                        z = this.obj.running_speedz;
                    } else if (this.containsKey(KeyboardConfig.KEY_MAP.UP)) {
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
                default: {
                    const v = this._getVelocity();
                    if (v.z !== 0 && v.z !== this.STOP_ALL_MOVE_DV) {
                        if (this.containsKey(KeyboardConfig.KEY_MAP.DOWN)) {
                            z = v.z;
                        } else if (this.containsKey(KeyboardConfig.KEY_MAP.UP)) {
                            z = -v.z;
                        }
                    }
                }
                    break;
            }
            if (x !== undefined) this._velocity.x = x;
            if (y !== undefined) this._velocity.y = y;
            if (z !== undefined) this._velocity.z = z;

            return new Point3D(x, y, z);
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
            const curFrame = this.currentFrame;

            if (this._allowDraw && this.belongTo && this.belongTo.status) {
                const status = this.belongTo.status;
                if (curFrame.bpoint) {
                    if (status.HPRadio <= DRAW_BLOOD_PERCENTAGE) {
                        const targetPoint = this.transferPoint(curFrame.bpoint.point);
                        ctx.fillStyle = "#FF3333";
                        ctx.fillRect(targetPoint.x - 1, targetPoint.y, 2, 5);
                    }
                }

            }


        }

        /**
         * startRun()
         *
         * Starts a run.
         *
         * @return  .
         */
        startRun() {
            const curState = this.currentFrame.state;

            //Is running
            if (this._currentFrameIndex.inRange(RUN_FRAME_RANGE.min, RUN_FRAME_RANGE.max)) return;
            if (acceptForceChangeStatus.binarySearch(curState) !== -1) {
                this.setFrameById(RUN_FRAME_RANGE.min);
            }
        }

        /**
         * Is move key pressed
         * @returns {boolean}
         * @private
         */
        _isArrowKeyOnly() {
            return (
                this.containsKey(KeyboardConfig.KEY_MAP.UP) ||
                this.containsKey(KeyboardConfig.KEY_MAP.DOWN) ||
                this.containsKey(KeyboardConfig.KEY_MAP.LEFT) ||
                this.containsKey(KeyboardConfig.KEY_MAP.RIGHT)
            );
        }

        /**
         *
         * @param {Number} key KeyboardConfig.KEY_MAP
         * @returns {boolean}
         * @private
         */
        containsKey(key) {
            return this.belongTo.containsKey(key);
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
            if ((bound & Bound.LEFT) > 0) this.position.x = 0;
            if ((bound & Bound.RIGHT) > 0) this.position.x = map.width;
            if ((bound & Bound.TOP) > 0) this.position.y = map.zBoundary.first;
            if ((bound & Bound.BOTTOM) > 0) this.position.y = map.zBoundary.second;
        }

        /**
         * update()
         *
         * Updates this object.
         *
         */
        update() {
            super.update();

            const NOW = Date.now();
            const state = this.currentFrame.state;
            const frameKind = (state / 100) | 0;

            if (this.isFuncKeyChanged && acceptForceChangeStatus.binarySearch(state) !== -1) {
                this._lastFuncKey = this._curFuncKey;
                this._frameForceChange = true;
            }

            if (this.belongTo.isAlive && (NOW - this._lastRecoverHPTime) >= RECOVERY.HP.interval) {
                this.belongTo.addHp(RECOVERY.HP.value);
                this._lastRecoverHPTime = NOW;
            }

            if ((NOW - this._lastRecoverMPTime) >= RECOVERY.MP.interval) {
                this.belongTo.addMp(RECOVERY.MP.value(this.belongTo));
                this._lastRecoverMPTime = NOW;
            }
            this.addFall(RECOVERY.FALL.value);

            if (state === FrameStage.ICE) {
                this.freeze();
            }

            if (
                this.currentFrame.mp &&
                this.previousFrame && this.currentFrame &&
                this.previousFrame.nextFrameId === this._currentFrameIndex
            ) {
                if (!this.belongTo.requestMp(-this.currentFrame.mp)) {
                    this.setNextFrame(this.currentFrame.hit.d);
                }
            }

            //治癒自己
            if (state === FrameStage.CURE_SELF) {
                this.belongTo.addHp(100);
            }

            //變身
            if (frameKind === 80 || state === 9995) {
                let newCharId = state % 1000;
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
                if (this._hideRemainderTime <= HIDE_FLASH_TIME) {
                    this._hideRemainderTime = 0;
                    this._allowDraw = true;

                    this._godModeTime = HIDE_FLASH_TIME;
                }
            }

            if (this._godModeTime > 0) {
                this._flashing = true;
                this._godModeTime--;

                if (this._godModeTime === 0) {
                    this._flashing = false;
                    this._flashCounter = false;
                }
            }
        }

        /**
         * Freezes this object.
         *
         * @return  .
         */
        freeze() {
            this._velocity.x
                = this._velocity.z
                = 0;
        }

        /**
         *
         * @param {Number} frameId
         * @override
         */
        setFrameById(frameId) {
            super.setFrameById(frameId);


            const fc = acceptForceChangeStatus.binarySearch(this.currentFrame.state) !== -1;

            if (fc) {
                const keywoFront = this._curFuncKey & ~KeyboardConfig.KEY_MAP.FRONT;

                if (this._previousFrameIndex === STOP_RUNNING_FRAME_ID) {
                    this.belongTo._currentKey &= ~KeyboardConfig.KEY_MAP.FRONT;
                } else if ((keywoFront & KeyboardConfig.KEY_MAP.LEFT) !== 0) {
                    this.setNextDirection(DIRECTION.LEFT);
                } else if ((keywoFront & KeyboardConfig.KEY_MAP.RIGHT) !== 0) {
                    this.setNextDirection(DIRECTION.RIGHT);
                }
            }
        }

        /**
         * Can damage by.
         *
         * @param   item    The item.
         * @param   ITR     The itr.
         *
         * @return  .
         */
        canDamageBy(item, ITR) {
            const parentRet = super.canDamageBy(item, ITR);
            if (!parentRet) return parentRet;

            if (this.currentFrame.state === FrameStage.BURN_RUN && ITR.kind === ItrKind.NORMAL_HIT) {
                if (
                    ITR.effect === Effect.FIRE ||
                    ITR.effect === Effect.FIXED_FIRE_0 ||
                    ITR.effect === Effect.FIXED_FIRE_1 ||
                    ITR.effect === Effect.FIXED_FIRE_2
                ) return false;
            }

            return parentRet;
        }

        /**
         *
         * @param {lf2.GameItem} item
         * @param {lf2.Interaction} itr
         */
        notifyDamageBy(item, itr) {
            super.notifyDamageBy(item, itr);
            const ITR = itr;
            const DV = ITR.dv;
            const curState = this.currentFrame.state;

            const CAN_ATTACK = this.canDamageBy(item, ITR);

            if (ITR.kind === ItrKind.HEAL_BALL) {
                if (CAN_ATTACK) return false;

                item.setNextFrame(40);
                this.belongTo.addHp(ITR.injury);
                return true;
            }

            if (!CAN_ATTACK) return false;

            //Accept injury
            switch (ITR.kind) {
                case ItrKind.NORMAL_HIT:
                case ItrKind.REFLECTIVE_SHIELD:
                case ItrKind.SONATA_OF_DEATH_1:
                case ItrKind.SONATA_OF_DEATH_2:
                case ItrKind.WHIRLWIND_WIND:
                case ItrKind.WHIRLWIND_ICE:

                    this.belongTo.hurtPlayer(ITR.injury);
                    item.belongTo.addAttackCount(ITR.injury);

                    break;
                case ItrKind.THREE_D_OBJECTS:
                    this._velocity.x = this._velocity.y = 0;

                    return false;
                    break;
                default:
                    this._arestCounter = this._vrestCounter = 0;
                    return false;
                    break;
            }


            if (ItrKind.ITR_ALLOW_FALL.binarySearch(ITR.kind) !== -1) {
                this._velocity.x = DV.x;
                this._velocity.y = DV.y;

                this.addFall(ITR.fall);
            }

            if (ITR.kind === ItrKind.WHIRLWIND_WIND) {
                this._velocity.y = DV.y;
                const MASS = 1;
                //lift
                this._velocity.y -= 2 / MASS;

                const sign = (x) => x > 0 ? 1 : -1;
                const cx = ITR.rect.position.x + DV.x + (ITR.rect.width >> 1);
                const cz = DV.y;

                this._velocity.x -= sign(this.position.x - cx) * 2 / MASS;
                console.log(sign(this.position.y - cz) * 0.5 / MASS);
                this._velocity.y += sign(this.position.y - cz) * 0.5 / MASS;
            }


            let face = this._direction !== item._direction;

            if (face) {
                this._velocity.x = -1 * this._velocity.x;
            }
            // console.log(this._velocity.x);
            let isFallDown = this.belongTo.hp <= 0;

            const fallDown = () => {
                if (face) {
                    this.setNextFrame(FALLING1_FRAME_RANGE.min);
                } else {
                    this.setNextFrame(FALLING2_FRAME_RANGE.min);
                }
                isFallDown = true;
            };

            if (curState === FrameStage.ICE) {
                fallDown();
            } else {
                if (this._fall.inRange(1, 20)) {
                    this.setNextFrame(220);
                } else if (this._fall.inRange(21, 30)) {
                    this.setNextFrame(222);
                } else if (this._fall.inRange(31, 40)) {
                    this.setNextFrame(224);
                } else if (this._fall.inRange(41, 60)) {
                    this.setNextFrame(226);
                } else if (this._fall >= 60) {
                    fallDown();
                }
            }

            switch (ITR.kind) {
                case ItrKind.NORMAL_HIT:
                    switch (ITR.effect) {
                        case Effect.FIXED_FIRE_0:
                        case Effect.FIXED_FIRE_1:
                        case Effect.FIXED_FIRE_2:
                            this.freeze();
                        case Effect.FIRE:
                            // case Effect.FIXED_FIRE_3:
                            this.setNextFrame(203);
                            break;
                        case Effect.FIXED_ICE:
                            this.freeze();
                        case Effect.ICE:
                            this.setNextFrame(200);
                            break;
                    }
                    //Play effect sound
                    this.playEffectSound(ITR.effect, isFallDown);
                    break;
                case ItrKind.WHIRLWIND_ICE:
                case ItrKind.WHIRLWIND_WIND:
                    this.setNextFrame(200);
                    this.playEffectSound(Effect.ICE, isFallDown);
                    break;
                case ItrKind.THREE_D_OBJECTS:
                    this.freeze();
                    break;
            }

            //Play effect sound
            if (curState === FrameStage.ICE) {
                this.playEffectSound(Effect.ICE, isFallDown);
            } else {
                switch (ITR.kind) {
                    case ItrKind.NORMAL_HIT:
                        //Play effect sound
                        this.playEffectSound(ITR.effect, isFallDown);
                        break;
                    case ItrKind.WHIRLWIND_ICE:
                    case ItrKind.WHIRLWIND_WIND:
                        this.playEffectSound(Effect.ICE, isFallDown);
                        break;
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

        }

        /**
         * Play effect sound.
         *
         * @param   effectCode  The effect code.
         * @param   fall        The fall.
         *
         * @return  .
         */
        playEffectSound(effectCode, fall) {
            const soundPath = Effect.sound.getSoundPath(effectCode, fall);
            if (soundPath) {
                this._audio.play(soundPath);
            }
        }

        /**
         *
         * @param {Number} num
         */
        addFall(num) {
            this._fall += num;

            if (this._fall < 0) {
                this._fall = 0;
            } else if (this._fall > 100) {
                this._fall = 100;
            }
        }

        /**
         * Current function key.
         *
         * @return  {Number}   A get.
         */
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