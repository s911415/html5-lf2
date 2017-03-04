"use strict";
var lf2 = (function (lf2) {
    /**
     * GameObject
     *
     * @type {GameObject}
     * @class lf2.GameObject
     * @implements Framework.AttachableInterface
     */
    lf2.GameObject = class {
        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(fileInfo, context){
            this.fileInfo = fileInfo;
            this.sourceCode = context;

            this.bmpInfo;
            this.frames=[];
        }


        static _parseFrames(context){

        }

        static _parseBmpInfo(context){

        }
    };



    return lf2;
})(lf2 || {});