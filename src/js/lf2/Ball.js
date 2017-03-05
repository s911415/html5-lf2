"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    /**
     * Ball
     *
     * @type {Ball}
     * @class lf2.Ball
     * @extends lf2.GameObject
     */
    lf2.Ball = class extends GameObject{

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