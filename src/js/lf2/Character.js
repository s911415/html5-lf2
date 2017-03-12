"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const KeyboardConfig = lf2.KeyboardConfig;
    const FrameStage = lf2.FrameStage;


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
         */
        constructor(charId) {
            super(charId);
            this.charId = charId;
            this.head = this.obj.head;
            this.small = this.obj.small;
            this._curFuncKey = 0;
            this._lastFuncKey = 0;
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
            if (hitList[this._curFuncKey]) {
                next = hitList[this._curFuncKey];
            }

            const IS_ARR_ONLY = this._isArrowKeyOnly();

            if(this.currentFrame.state==FrameStage.STAND){
                if(
                    next.inRange(
                        STAND_FRAME_RANGE.min, STAND_FRAME_RANGE.max
                    ) && IS_ARR_ONLY
                ){
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
                            next = this.currentFrame.id + 1;
                            //Loop walk action
                            if (next > WALK_FRAME_RANGE.max) next = WALK_FRAME_RANGE.min;
                        }
                        break;
                    default:
                        next = 0;
                }
                if (next === 999) next = 0;


                if (this._containsKey(KeyboardConfig.KEY_MAP.LEFT)) {
                    this._direction = GameItem.DIRECTION.LEFT;
                } else if (this._containsKey(KeyboardConfig.KEY_MAP.RIGHT)) {
                    this._direction = GameItem.DIRECTION.RIGHT;
                }
            }

            return next;
        }

        _isArrowKeyOnly(){
            return this._curFuncKey == KeyboardConfig.KEY_MAP.UP ||
            this._curFuncKey == KeyboardConfig.KEY_MAP.DOWN ||
            this._curFuncKey == KeyboardConfig.KEY_MAP.LEFT ||
            this._curFuncKey == KeyboardConfig.KEY_MAP.RIGHT;
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

        update() {
            super.update();
            if (this.isFuncKeyChanged) {
                console.log(this.charId, this._curFuncKey);

                this._lastFuncKey = this._curFuncKey;
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