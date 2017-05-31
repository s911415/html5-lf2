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
         * @param {String} context
         * @param {lf2.GameMap} bg
         */
        constructor(context, bg) {
            this.sourceCode = context;

            this.imgUrl = context.trim().lines()[0].trim();
            this.img = null;
            this._imgLoader = ResourceManager.loadImage({
                url: define.IMG_PATH + this.imgUrl
            }).then((img) => {
                this.img = img.response;

                return img;
            });

            let info = lf2.Utils.parseDataLine(context);
            this.transparency = info.get("transparency") != '0';
            this.width = intval(info.get('width'));
            this.height = intval(info.get('height'));
            this.position = new Point(
                intval(info.get('x') || 0),
                intval(info.get('y') || 0)
            );

            this.loop = intval(info.get('loop') || 0);
            this.cc = intval(info.get('cc') || 0);
            this.c1 = intval(info.get('c1') || 0);
            this.c2 = intval(info.get('c2') || 0);
            this.rect = intval(info.get('rect') || -1);
            if (this.rect === -1) {
                this.rect = undefined;
            } else {
                this.rect = GameMapLayer.GetColorFromRect(this.rect);
            }

            this._map = bg;

            this.radio = -1;
            this.counter = 0;

            this.startX = 0;
        }

        /**
         * done()
         *
         * Dones this object.
         *
         * @return  .
         */
        done() {
            return this._imgLoader;
        }

        /**
         * initialize()
         *
         * Initializes this object.
         *
         * @return  .
         */
        initialize() {
            this.radio = -1;
            this.counter = 0;
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

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            if (!isFinite(this.radio) || this.radio < 0) {
                this.radio = (this.width - this._map.widthShow) / (this._map.width - this._map.widthShow);
            }

            if (this.cc) {
                this.counter++;
                if (this.counter >= this.cc) this.counter = 0;
            }

            const X = this._map.cameraX;
            if (!this.rect) {
                this.startX = ((-X * this.radio) | 0) + this.position.x;
            }
        }

        /**
         * draw(ctx)
         *
         * Draws the given context.
         *
         * @param {CanvasRenderingContext2D} ctx The context.
         *
         */
        draw(ctx) {
            if (!this.img) {
                console.warn('Image not loaded');
                return;
            }

            let canDraw = true;


            if (this.cc) {
                if (this.counter > this.c2 || this.counter < this.c1) {
                    canDraw = false;
                }
            }

            if (canDraw) {
                if (this.rect) {
                    ctx.fillStyle = this.rect;
                    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
                } else {
                    let drawX = this.startX;
                    const _w = this.img.width, _h = this.img.height;

                    do {
                        ctx.drawImage(
                            this.img, 0, 0, _w, _h,
                            drawX, this.position.y, _w, _h
                        );
                        drawX += this.loop;
                    } while (this.loop && drawX < this._map.widthShow);
                }
            }
        }

        /**
         *
         * @param {String} context
         * @private
         */
        static _parseLayers(context) {

        }

        /**
         * @param {Number} num
         * @see http://gjp4860sev.myweb.hinet.net/lf2/page16.htm
         */
        static GetColorFromRect(num) {
            /**
             *
             * @param {Number} n
             */
            const ConvertToByte = (n) => n.toString(16).padStart(2, '0');
            num %= 65536;
            if (num < 0) num += 65536;
            let r, g, b;
            b = ( num % 32 + 1 ) * 8 - 1;
            g = ( Math.floor(num / 32) * 4 + 7 ) % 256;
            r = ( ( Math.floor(num / 2048) + 1 ) * 7 + Math.floor(( num + 32 ) / 2048) ) % 256;

            return '#' + ConvertToByte(r) + ConvertToByte(g) + ConvertToByte(b);

        }
    };

    return lf2;
})(lf2 || {});