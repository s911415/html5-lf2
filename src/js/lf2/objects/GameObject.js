"use strict";
var lf2 = (function (lf2) {

    /**
     * @class {lf2.BmpInfo}
     */
    const BmpInfo = lf2.BmpInfo;

    const ResourceManager = Framework.ResourceManager;

    const Effect = lf2.Effect;

    /**
     * @class {lf2.Frame}
     */
    const Frame = lf2.Frame;

    /**
     * GameObject
     *
     * @class lf2.GameObject
     */
    lf2.GameObject = class GameObject {
        /**
         *
         * @param {Object} fileInfo information of file
         * @param {String} context source code of dat fiel
         */
        constructor(fileInfo, context) {
            this.fileInfo = fileInfo;
            this.sourceCode = context;

            this.id = intval(fileInfo.id);
            this.bmpInfo = new BmpInfo(context);
            this.frames = lf2.GameObject._parseFrames(context);
            this._audio = new Framework.Audio();
        }

        /**
         * Promise when all image loaded
         *
         * @returns {Promise.<*>}
         */
        done() {
            let arr = [].concat(this.bmpInfo._bmpLoad);
            return Promise.all(arr);
        }

        /**
         * addPreloadResource(url)
         *
         * Adds a preload resource.
         *
         * @param   url URL of the document.
         *
         * @return  .
         */
        addPreloadResource(url) {
            return this.bmpInfo.addPreloadResource(url);
        }

        /**
         * Parse frame block
         *
         * @param context
         * @returns {lf2.Frame[]}
         * @private
         */
        static _parseFrames(context) {
            const FRAME_START_TAG = '<frame>';
            const FRAME_END_TAG = '<frame_end>';
            let framesIndex = [], frameContent = [];

            for (
                let index = context.indexOf(FRAME_START_TAG);
                index !== -1;
                index = context.indexOf(FRAME_START_TAG, index + 1)
            ) {
                framesIndex.push(index);
            }
            framesIndex.forEach((i) => {
                let str = context.getStringBetween(FRAME_START_TAG, FRAME_END_TAG, i).trim();
                let frame = new Frame(str, this);

                frameContent[frame.id] = frame;
            });

            return frameContent;
        }

        /**
         * getSoundList()
         *
         * Gets sound list.
         *
         * @return {Set} The sound list.
         */
        getSoundList() {
            let soundSet = new Set();

            Effect.allSound.forEach(effectSoundPath => {
                soundSet.add(effectSoundPath);
            });

            this.frames.forEach(frame => {
                if (frame.soundPath !== undefined) {
                    soundSet.add(frame.soundPath);
                }
            });


            return soundSet;
        }

        /**
         *
         * @private
         */
        _preLoadSound() {
            let soundPool = {};
            this.getSoundList().forEach(soundPath => {
                if (typeof soundPool[soundPath] === 'undefined') {
                    soundPool[soundPath] = soundPath;
                }
            });

            return this.addPreloadResource(
                this._audio.addSongs(soundPool)
            );
        }

        /**
         * Gets play list.
         *
         * @return  The play list.
         */
        getPlayList(){
            return this._audio.playlist;
        }
    };


    return lf2;
})(lf2 || {});