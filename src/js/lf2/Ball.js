"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const ResourceManager = Framework.ResourceManager;
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
         */
        constructor(ballId) {
            super(ballId);

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
    };


    return lf2;
})(lf2 || {});