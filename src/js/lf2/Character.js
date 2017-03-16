"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Bound = lf2.Bound;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const KeyboardConfig = lf2.KeyboardConfig;
    const FrameStage = lf2.FrameStage;
    const DIRECTION = GameItem.DIRECTION;


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

    const PUNCH1_FRAME_ID = 60;
    const PUNCH2_FRAME_ID = 65;
    const JUMP_FRAME_ID = 210;
    const DEFEND_FRAME_ID = 110;


    const DEFAULT_KEY = {};
    let acceptForceChangeStatus = [];

    DEFAULT_KEY[FrameStage.STAND] = {
        d: DEFEND_FRAME_ID,
        j: JUMP_FRAME_ID,
        a: PUNCH1_FRAME_ID,
    };
    DEFAULT_KEY[FrameStage.WALK] = {
        d: DEFEND_FRAME_ID,
        j: JUMP_FRAME_ID,
        a: PUNCH1_FRAME_ID,
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

    /**
     * Character
     *
     * @type {Character}
     * @class lf2.Character
     * @extends lf2.GameItem
     * @implements {Framework.AttachableInterface}
     */
    lf2.Character = class Character extends GameItem {
        /**
         *
         * @param charId ID of character
         * @param {lf2.Player} player
         */
        constructor(charId, player) {
            super(charId);
            this.charId = charId;
            this.head = this.obj.head;
            this.small = this.obj.small;
            this._curFuncKey = 0;
            this._lastFuncKey = 0;
            this.belongTo = player;

            this._walk_dir = DIRECTION.RIGHT;
            this._run_dir = DIRECTION.RIGHT;
            this._punch_dir = DIRECTION.RIGHT;

        }


        /**
         *
         * @returns {Number}
         * @private
         * @override
         */
        _getNextFrameId() {
            const hitList = this.currentFrame.hit;
            let next = this.currentFrame.nextFrameId;
            const funcKeyWoArrow = this._curFuncKey & ~((KeyboardConfig.KEY_MAP.LEFT | KeyboardConfig.KEY_MAP.RIGHT) & ~KeyboardConfig.KEY_MAP.FRONT);
            const fc = acceptForceChangeStatus.indexOf(this.currentFrame.state) !== -1;
            if (hitList[funcKeyWoArrow]) {
                next = hitList[funcKeyWoArrow];
            }
            if ((fc || next === 0 || next === 999) && DEFAULT_KEY[this.currentFrame.state]) {
                if (DEFAULT_KEY[this.currentFrame.state][funcKeyWoArrow]) {
                    next = DEFAULT_KEY[this.currentFrame.state][funcKeyWoArrow];
                }
            }

            const IS_ARR_ONLY = this._isArrowKeyOnly();

            if (fc) {
                if (
                    next.inRange(
                        STAND_FRAME_RANGE.min, STAND_FRAME_RANGE.max
                    ) && IS_ARR_ONLY
                ) {
                    next = 999;
                }
            }

            if (next == 0) {
                switch (this.currentFrame.state) {
                    default:
                        next = 0;
                }
            } else if (next == 999) {
                switch (this.currentFrame.state) {
                    case FrameStage.STAND:
                        if (IS_ARR_ONLY) {
                            next = WALK_FRAME_RANGE.min;
                        }
                        break;

                    case FrameStage.WALK:
                        //hold left or right key
                        if (IS_ARR_ONLY) {
                            if (this._walk_dir == DIRECTION.RIGHT) {
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
                }
                if (next === 999) next = 0;

            }

            //Check mp request
            const nextFrame = this.obj.frames[next];
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
         * @private
         */
        _getFrameOffset() {
            switch (this.currentFrame.state) {
                case FrameStage.WALK:
                    let x, y;
                    x = y = 0;

                    if (this._containsKey(KeyboardConfig.KEY_MAP.DOWN)) {
                        y = this.obj.walking_speedz;
                    } else if (this._containsKey(KeyboardConfig.KEY_MAP.UP)) {
                        y = -this.obj.walking_speedz;
                    }

                    if (
                        this._containsKey(KeyboardConfig.KEY_MAP.RIGHT) ||
                        this._containsKey(KeyboardConfig.KEY_MAP.LEFT)
                    ) {
                        x = this.obj.walking_speed;
                    }

                    x /= this.obj.walking_frame_rate;
                    y /= this.obj.walking_frame_rate;
                    y = Math.round(y);

                    return new Framework.Point3D(x, y, 0);
                    break;
                default:
                    return this.currentFrame.offset;
            }
        }

        /**
         * Is move key pressed
         * @returns {boolean}
         * @private
         */
        _isArrowKeyOnly() {
            return (
                    this._curFuncKey & (
                        KeyboardConfig.KEY_MAP.UP | KeyboardConfig.KEY_MAP.DOWN |
                        KeyboardConfig.KEY_MAP.LEFT | KeyboardConfig.KEY_MAP.RIGHT
                    )
                ) !== 0;
        }

        /**
         *
         * @param {Number} key KeyboardConfig.KEY_MAP
         * @returns {boolean}
         * @private
         */
        _containsKey(key) {
            return (this._curFuncKey & key) === key;
        }

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

        update() {
            super.update();
            if (this.isFuncKeyChanged) {
                console.log(this.charId, this._curFuncKey, this._currentFrameIndex);

                this._lastFuncKey = this._curFuncKey;
                this._frameForceChange = true;
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

                if ((keywoFront & KeyboardConfig.KEY_MAP.LEFT) != 0) {
                    this._direction = DIRECTION.LEFT;
                } else if ((keywoFront & KeyboardConfig.KEY_MAP.RIGHT) != 0) {
                    this._direction = DIRECTION.RIGHT;
                }
            }

        }

        /**
         * Set func key
         * @param {Number} key
         */
        setFuncKey(key) {
            this._curFuncKey = key;
        }
    };


    return lf2;
})(lf2 || {});