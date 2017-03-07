"use strict";
var lf2 = (function (lf2) {
    const LAYER_START_TAG = 'layer:';
    const LAYER_END_TAG = 'layer_end';

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
            this.fileInfo = fileInfo;
            this.sourceCode = context;

            this.id = fileInfo.id;
            this.layers = lf2.GameMap._parseLayers(context);

            let info = lf2.Utils.parseDataLine(context.getStringBetween("", LAYER_START_TAG));
            this.name = info.get("name").replace(/_/g, ' ');
            this.width = intval(info.get("width"));
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

        }
    };

    return lf2;
})(lf2 || {});