"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    /**
     * Character
     *
     * @type {Character}
     * @class lf2.Character
     * @extends lf2.GameItem
     * @implements Framework.AttachableInterface
     */
    lf2.Character = class extends GameItem {
        /**
         *
         * @param charId ID of character
         */
        constructor(charId) {
            super(charId);
        }
    };


    return lf2;
})(lf2 || {});