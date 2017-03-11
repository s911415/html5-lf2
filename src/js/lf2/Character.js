"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardConfig = Framework.KeyboardConfig;
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
            this.head = new Image();
            this.small = new Image();
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

        get isFuncKeyChanged() {
            return this._curFuncKey !== this._lastFuncKey;
        }

        update() {
            super.update();
            if(this.isFuncKeyChanged){
                console.log(this.charId, this._curFuncKey);
            }

        }

        /**
         * Set func key
         * @param {Number} key
         */
        setFuncKey(key) {
            this._lastFuncKey = this._curFuncKey;
            this._curFuncKey = key;
        }
    };


    return lf2;
})(lf2 || {});