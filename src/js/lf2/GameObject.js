"use strict";
var lf2 = (function (lf2) {

    /**
     * @type {BmpInfo}
     */
    const BmpInfo = lf2.BmpInfo;

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

            this.bmpInfo = new BmpInfo(context);
            this.frames=[];
        }

        /**
         *
         * @returns {Promise.<*>}
         */
        done(){
            let arr = [].concat(this.bmpInfo._bmpLoad);
            return Promise.all(arr);
        }

        static _parseFrames(context){

        }

        static _parseBmpInfo(context){

        }
    };



    return lf2;
})(lf2 || {});