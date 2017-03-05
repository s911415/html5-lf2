"use strict";
var lf2 = (function (lf2) {
    const TAG_START = "<bmp_begin>";
    const TAG_END = "<bmp_end>";
    const BMP_START_TAG = 'file(';
    const BMP_END_TAG = ')';

    const ResourceManager = Framework.ResourceManager;
    const Utils = lf2.Utils;
    const Rectangle = lf2.Rectangle;
    const ImageInformation = lf2.ImageInformation;


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

            this.source.lines().forEach((str) => {
                str = str.trim();
                if (str.length == 0) return;

                //圖片資訊
                if (str.startsWith('file(')) {
                    this._bmpLoad.push(this._processImage(str));
                } else if (str.indexOf(':') !== -1) {
                    let d = Utils.parseDataLine(str);
                    d.forEach((value, key, map) => {
                        this._data.set(key, value);
                    });
                } else {
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
            const pairContent = Utils.parseDataLine(str);
            const key = str.split(':')[0];
            const
                index = key.match(/(\d+)/g),
                startIndex = parseInt(index[0], 10),
                endIndex = parseInt(index[1], 10),
                width = parseInt(pairContent.get('w'), 10),
                height = parseInt(pairContent.get('h'), 10),
                width2 = width * 2,
                row = parseInt(pairContent.get('row'), 10),
                col = parseInt(pairContent.get('col'), 10);

            return new Promise((s, e) => {
                ResourceManager.loadImage({
                    url: define.IMG_PATH + pairContent.get(key)
                }).then((resp) => {
                    const img = resp.response;
                    let c = document.createElement('canvas');
                    c.width = img.width * 2;
                    c.height = img.height;
                    let g = c.getContext('2d');

                    g.save();
                    g.drawImage(img, 0, 0);

                    //Mirror image
                    g.translate(c.width, 0);
                    g.scale(-1, 1);
                    g.drawImage(img, 0, 0);

                    g.restore();

                    let i = startIndex;
                    let j = startIndex;
                    let imgObj = new Image();

                    for (let r = 0; r < row; r++) {
                        const _y = r * height;
                        //Save Normal image
                        for (let c = 0; c < col; c++) {
                            const _x = c * width;
                            //this.imageNormal[i] = g.getImageData(_x, _y, width, height);
                            this.imageNormal[i] = new ImageInformation(
                                new Rectangle(width, height, _x, _y),
                                imgObj
                            );

                            i++;
                        }

                        //Save Mirror image
                        for (let c = 0; c < col; c++) {
                            const _x = width2 - c * width - width;
                            //this.imageMirror[j] = g.getImageData(_x, _y, width, height);
                            this.imageMirror[i] = new ImageInformation(
                                new Rectangle(width, height, _x, _y),
                                imgObj
                            );

                            j++;
                        }
                    }

                    c.toBlob(function (b) {
                        imgObj.src = URL.createObjectURL(b);
                        s();
                    }, 'image/webp', 1);
                });
            });
        }
    };


    return lf2;
})(lf2 || {});