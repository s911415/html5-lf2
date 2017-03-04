"use strict";
var lf2 = (function (lf2) {

    /**
     * @type {BmpInfo}
     */
    const BmpInfo = lf2.BmpInfo;

    /**
     * @type {Frame}
     */
    const Frame = lf2.Frame;

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
        constructor(fileInfo, context) {
            this.fileInfo = fileInfo;
            this.sourceCode = context;

            this.bmpInfo = new BmpInfo(context);
            this.frames = lf2.GameObject._parseBmpInfo(context);
        }

        /**
         *
         * @returns {Promise.<*>}
         */
        done() {
            let arr = [].concat(this.bmpInfo._bmpLoad);
            return Promise.all(arr);
        }

        static _parseFrames(context) {

        }

        static _parseBmpInfo(context) {
            const FRAME_START_TAG = '<frame>';
            const FRAME_END_TAG = '<frame_end>';
            let framesIndex = [], frameContent = [];
            debugger;

            for (
                let index = context.indexOf(FRAME_START_TAG);
                index !== -1;
                index = context.indexOf(FRAME_START_TAG, index+1)
            ) {
                framesIndex.push(index);
                console.log(index);
            }
            framesIndex.forEach((i)=>{
                let str = context.getStringBetween(FRAME_START_TAG, FRAME_END_TAG, i).trim();
                let frame =new Frame(str);

                frameContent[frame.id] = frame;
            });

            return frameContent;
        }
    };


    return lf2;
})(lf2 || {});