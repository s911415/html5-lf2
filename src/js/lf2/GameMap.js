"use strict";
var lf2 = (function (lf2) {
    const LAYER_START_TAG = 'layer:';
    const LAYER_END_TAG = 'layer_end';
    const Point = Framework.Point;
    const ResourceManager = Framework.ResourceManager;
    const GameMapLayer = lf2.GameMapLayer;

    /**
     * GameMap
     *
     * @class lf2.GameMap
     * @implements Framework.AttachableInterface
     */
    lf2.GameMap = class GameMap {
        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(fileInfo, context){
            this._promiseList = [];
            this.fileInfo = fileInfo;
            this.sourceCode = context;

            this.id = fileInfo.id;

            const infoText = context.getStringBetween("", LAYER_START_TAG);
            let info = lf2.Utils.parseDataLine(infoText);
            this.name = info.get("name").replace(/_/g, ' ');
            this.width = intval(info.get("width"));
            this.zBoundary = lf2.GameMap._parseSizeByKey('zboundary', infoText);
            this.shadowSize = lf2.GameMap._parseSizeByKey('shadowsize', infoText);
            this.shadowUrl = info.get("shadow");

            this._promiseList.push(
                ResourceManager.loadImage({
                    url:    this.shadowUrl
                })
            );
            this.layers = lf2.GameMap._parseLayers(context);

            this.layers.forEach((layer) => {
                this._promiseList.push(layer.done());
            });
        }

        done(){
            return Promise.all(this._promiseList);
        }

        initialize(){

        }

        load(){

        }

        update(){

        }

        draw(ctx){

        }

        /**
         *
         * @param {String} context
         * @private
         */
        static _parseLayers(context){
            let layersIndex = [], layerContent = [];

            for (
                let index = context.indexOf(LAYER_START_TAG);
                index !== -1;
                index = context.indexOf(LAYER_START_TAG, index + 1)
            ) {
                layersIndex.push(index);
            }
            layersIndex.forEach((i) => {
                let str = context.getStringBetween(LAYER_START_TAG, LAYER_END_TAG, i).trim();
                let layer = new GameMapLayer(str);

                layerContent.push(layer);
            });

            return layerContent;
        }

        /**
         *
         * @param key
         * @param str
         * @returns {*}
         * @private
         */
        static _parseSizeByKey(key, str){
            let i = str.indexOf(key);
            if(i===-1) return null;
            str = str.substr(i + key.length);
            let m =str.match(/:\s+?(\d+)\s+(\d+)/);
            let x=intval(m[1]);
            let y=intval(m[2]);

            return new Point(x, y);
        }
    };

    return lf2;
})(lf2 || {});