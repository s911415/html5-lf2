"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    /**
     * Character
     *
     * @type {Character}
     * @class lf2.Character
     * @extends lf2.GameObject
     */
    lf2.Character = class extends GameObject{
        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(fileInfo, context) {
            super(fileInfo, context)
        }


    };


    return lf2;
})(lf2 || {});