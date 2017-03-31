"use strict";
var lf2 = (function (lf2) {
    const ResourceManager = Framework.ResourceManager;
    const Point = Framework.Point;

    /**
     * GameMapLayer
     *
     * @class lf2.GameMapLayer
     * @implements Framework.AttachableInterface
     */
    lf2.GameMapLayer = class GameMapLayer {
        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(context){
            this.sourceCode = context;

            this.imgUrl = context.trim().lines()[0].trim();
            this.img = new Image();
            this._imgLoader =ResourceManager.loadImage({
                url:    define.IMG_PATH + this.imgUrl
            }).then((img)=>{
                this.img = img;

                return img;
            });

            let info = lf2.Utils.parseDataLine(context);
            this.transparency = info.get("transparency") != '0';
            this.width = intval(info.get('width'));
            this.position = new Point(
                intval(info.get('x') || 0),
                intval(info.get('y') || 0)
            );

            this.loop = intval(info.get('loop'));
            this.cc = intval(info.get('cc') || 0);
            this.c1 = intval(info.get('c1') || 0);
            this.c2 = intval(info.get('c2') || 0);
            this.rect = info.get('rect') || 0;
        }

        /**
         * done()
         *
         * Dones this object.
         *
         * @return  .
         */
        done(){
            return this._imgLoader;
        }

        /**
         * initialize()
         *
         * Initializes this object.
         *
         * @return  .
         */
        initialize(){

        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load(){

        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update(){

        }

        /**
         * draw(ctx)
         *
         * Draws the given context.
         *
         * @param   ctx The context.
         *
         * @return  .
         */
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