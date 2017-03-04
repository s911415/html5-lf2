"use strict";
var lf2 = (function (lf2) {
    const TAG_START = "<bmp_begin>";
    const TAG_END = "<bmp_end>";
    const BMP_START_TAG = 'file(';
    const BMP_END_TAG = ')';

    const ResourceManager = Framework.ResourceManager;
    const Utils = lf2.Utils;

    /**
     * BmpInfo
     *
     * @type {BmpInfo}
     * @class lf2.BmpInfo
     * @implements Framework.AttachableInterface
     */
    lf2.BmpInfo = class {
        /**
         *
         * @param {String} context
         */
        constructor(context) {
            this.source = context.getStringBetween(TAG_START, TAG_END);
            this.imageNormal = [];
            this.imageMirror = [];
            this._data = new Map();
            this._bmpLoad = [];

            context.lines().forEach((str) => {
                //圖片資訊
                if (str.startsWith('file(')) {
                    this._bmpLoad.push(this._processImage(str));
                } else if(str.indexOf(':')!==-1) {
                    let d=Utils.parseDataLine(str);
                    d.forEach((value, key, map)=>{
                        this._data.set(key, value);
                    });
                }else{
                    let d = str.split(/\s+/);
                    this._data.set(d[0].trim(), parseFloat(d[1]));
                }
            });
        }


        static _parseFrames(context) {

        }

        static _parseBmpInfo(context) {

        }

        _processImage(str) {
            let indexInfo = str.getStringBetween(BMP_START_TAG, BMP_END_TAG);
            let pairContent = Utils.parseDataLine(str);
            let key = str.split(':')[0];
            const
                index = key.match(/(\d+)/g),
                startIndex = parseInt(index[0], 10),
                endIndex = parseInt(index[1], 10);

            return ResourceManager.loadImage({
                url: define.IMG_PATH + pairContent.get(key)
            }).then((img) => {
                let c = document.createElement('canvas');
                c.width = img.width * 2;
                c.height = img.height;
                let g = c.getContext('2d');

                g.drawImage(img, 0, 0);

                //Mirror image
                g.translate(img.width, c.height / 2);
                g.scale(-1, 1);

                g.drawImage(img, 0, 0);

                debugger;


            });
        }
    };


    return lf2;
})(lf2 || {});