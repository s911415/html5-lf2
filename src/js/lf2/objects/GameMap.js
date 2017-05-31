"use strict";
var lf2 = (function (lf2) {
    const LAYER_START_TAG = 'layer:';
    const LAYER_END_TAG = 'layer_end';
    const Point = Framework.Point;
    const ResourceManager = Framework.ResourceManager;
    const GameMapLayer = lf2.GameMapLayer;
    const Bound = lf2.Bound;

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
        constructor(fileInfo, context) {
            this._promiseList = [];
            this.fileInfo = fileInfo;
            this.sourceCode = context;

            this.id = intval(fileInfo.id);

            const infoText = context.getStringBetween("", LAYER_START_TAG);
            let info = lf2.Utils.parseDataLine(infoText);
            this.name = info.get("name").replace(/_/g, ' ');
            this.width = intval(info.get("width"));
            this.zBoundary = lf2.GameMap._parseSizeByKey('zboundary', infoText);
            this.shadowSize = lf2.GameMap._parseSizeByKey('shadowsize', infoText);
            this.shadowUrl = info.get("shadow");
            this.shadow;

            this._promiseList.push(
                ResourceManager.loadImage({
                    url: define.IMG_PATH + this.shadowUrl
                }).then(r => {
                    this.shadow = r.response;
                })
            );

            this.haveCC = false;
            this.layers = this._parseLayers(context);

            this.layers.forEach((layer) => {
                this._promiseList.push(layer.done());
            });

            this.canvas = document.createElement('canvas');
            this.canvas.width = Framework.Config.canvasWidth;
            this.canvas.height = Framework.Config.canvasHeight;
            this.mapCtx = this.canvas.getContext('2d');
            this.widthShow = this.canvas.width;

            this.lastCameraX = -1;
            this.cameraX = 0;
        }

        /**
         * done()
         *
         * Dones this object.
         *
         * @return  .
         */
        done() {
            return Promise.all(this._promiseList);
        }

        /**
         * initialize
         *
         * Initializes this object.
         *
         * @param world
         */
        initialize(world) {
            if (!world instanceof lf2.WorldScene) return;
            this._world = world;

            this.layers.forEach(l => l.initialize());
        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load() {

        }

        get isCameraChanged() {
            return this.haveCC || this.cameraX !== this.lastCameraX;
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            this.cameraX = this._world._getCameraPositionAsPoint().x;
            this.layers.forEach(l => l.update());
        }

        /**
         * draw(ctx)
         *
         * Draws the given context.
         *
         *
         * @param {CanvasRenderingContext2D} ctx The context.
         *
         * @return  .
         */
        draw(ctx) {
            //Align to bottom
            /*const Y = Framework.Config.canvasHeight - this.simpleMap.height;
             ctx.drawImage(this.simpleMap, 0, Y);
             */
            if (this.isCameraChanged) {
                this.mapCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.layers.forEach(l => l.draw(this.mapCtx));
                this.lastCameraX = this.cameraX;
            }

            ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
        }

        /**
         *
         * @param {Framework.Point} p
         * @returns {number}
         */
        getBound(p) {
            let bound = Bound.NONE;
            if (p.x < 0) bound |= Bound.LEFT;
            if (p.x > this.width) bound |= Bound.RIGHT;
            if (p.y < this.zBoundary.first) bound |= Bound.TOP;
            if (p.y > this.zBoundary.second) bound |= Bound.BOTTOM;

            return bound;
        }

        /**
         *
         * @param {String} context
         * @private
         */
        _parseLayers(context) {
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
                let layer = new GameMapLayer(str, this);

                layerContent.push(layer);

                if (layer.cc) {
                    this.haveCC = true;
                }
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
        static _parseSizeByKey(key, str) {
            let i = str.indexOf(key);
            if (i === -1) return null;
            str = str.substr(i + key.length);
            let m = str.match(/:\s+?(\d+)\s+(\d+)/);
            let x = intval(m[1]);
            let y = intval(m[2]);

            return new Point(x, y);
        }
    };

    return lf2;
})(lf2 || {});