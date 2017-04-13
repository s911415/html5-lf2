"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const NONE = lf2.GameItem.NONE;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
    const FrameStage = lf2.FrameStage;
    const KeyboardConfig = lf2.KeyboardConfig;
    const Bound = lf2.Bound;

    const ON_GROUND_ID = 70;
    /**
     * Weapon
     *
     * @class lf2.Weapon
     * @extends lf2.Ball
     * @implements Framework.AttachableInterface
     */
    lf2.Weapon = class Weapon extends lf2.Ball {
        /**
         *
         * @param weaponId ID of character
         * @param {lf2.Player} player of this ball belong to
         */
        constructor(weaponId, player) {
            super(weaponId, player);
            this._affectByFriction = true;
        }


        /**
         *
         * @returns {Number}
         * @private
         * @override
         */
        _getNextFrameId() {
            if (this._isOut) return lf2.GameItem.DESTROY_ID;
            if(this._frameForceChangeId!==NONE) return this._frameForceChangeId;

            const curF = this.currentFrame;
            let next = curF.nextFrameId;
            switch (curF.state) {
                case FrameStage.WEAPON_IN_THE_SKY:
                case FrameStage.WEAPON_THROWING:
                    if (this.position.z === 0) {
                        next = ON_GROUND_ID; //just on ground
                    }
                    break;
            }

            if (next === 0) {
                switch (curF.state) {
                    case FrameStage.WEAPON_THROWING:
                        if(this.position.z===0){
                            next = ON_GROUND_ID; //just on ground
                        }
                        break;
                    case FrameStage.DELETE_MESSAGE:
                        next = lf2.GameItem.DESTROY_ID;
                        break;
                    default:
                        next = 0;
                }
            }
            if (next === 999) return 0;



            return next;
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
            const curF = this.currentFrame;
            if(curF.state === FrameStage.DELETE_MESSAGE){
                this._allowDraw = false;
            }
        }

    };


    return lf2;
})(lf2 || {});