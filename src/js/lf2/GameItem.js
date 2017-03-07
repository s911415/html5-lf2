"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const DESTROY_ID = 1000;

    const DIRECTION = {
        RIGHT: true,
        LEFT: false,
    };
    Object.freeze(DIRECTION);

    /**
     * GameItem
     *
     * @type {GameItem}
     * @class lf2.GameItem
     * @extends {Framework.GameObject}
     * @implements Framework.AttachableInterface
     */
    lf2.GameItem = class GameItem extends Framework.GameObject {
        /**
         *
         * @param charId ID of character
         */
        constructor(charId) {
            super();
            this.obj = GameObjectPool.get(charId);

            /**
             * 物件的中下座標
             */
            this.position = new Point3D(0, 0, 0);
            this.absolutePosition = new Point3D(0, 0, 0);
            this.relativePosition = new Point3D(0, 0, 0);

            this._currentFrameIndex = 0;
            this._lastFrameSetTime = -1;
            this._config = Framework.Config;
            this._frameInterval = (1e3 / Framework.Config.fps);
            this._direction = DIRECTION.RIGHT;
            this._lastFrameId = -1;
            this.isDrawBoundry = define.DEBUG;

            this.pushSelfToLevel();
        }

        /**
         * Get current frame
         * @returns {lf2.Frame}
         */
        get currentFrame() {
            return this.obj.frames[this._currentFrameIndex];
        }

        /**
         * Load
         *
         * @override
         */
        load() {
            //TODO: DO NOTHING
        }

        /**
         * Initial this object
         *
         * @override
         */
        initialize() {
            //TODO: OD NOTHING
        }

        /**
         * Update object
         *
         * @override
         */
        update() {
            const now = Date.now();
            if ((now - this._lastFrameSetTime) < this.currentFrame.wait * this._frameInterval) return;

            let offset = this.currentFrame.offset;
            //Start move object
            this.position.z += offset.z;
            this.position.y += offset.y;
            if (this._direction == DIRECTION.RIGHT) {
                this.position.x += offset.x;
            } else {
                this.position.x -= offset.x;
            }
            //End of move object

            this.setFrameById(this._getNextFrameId());


            if (this.position.z < 0) this.position.z = 0;
        }

        /**
         *
         * @param {Number} frameId
         */
        setFrameById(frameId) {
            if (!this.frameExist(frameId)) throw new RangeError(`Object (${this.obj.id}) Frame (${frameId}) not found`);
            //console.log("Set Frame ", frameId);
            if (frameId == DESTROY_ID) {
                if(this.spriteParent) {
                    this.spriteParent.detach(this);
                }
                
                return;
            }
            this._currentFrameIndex = frameId;
            this._lastFrameSetTime = Date.now();
        }

        /**
         *
         * @param {String} frameName
         */
        getFrameIdByName(frameName) {
            let frame = this.obj.frames.filter(o => o.name == frameName)[0];
            if (!frame) throw new RangeError(`Object (${this.obj.id}) Frame (${frameName}) not found`);

            return frame.id;
        }

        /**
         * Frame Exist
         * @param frameId
         * @returns {boolean}
         */
        frameExist(frameId) {
            if (frameId == DESTROY_ID) return true;

            return !!this.obj.frames[frameId];
        }

        /**
         *
         * @param {String} frameName
         */
        setFrameByName(frameName) {
            this.setFrameById(this.getFrameIdByName(frameName));
        }

        /**
         * Draw object
         *
         * @param {CanvasRenderingContext2D} ctx
         *
         * @override
         */
        draw(ctx) {
            const imgInfo = this.ImgInfo;
            let leftTopPoint = new Point(
                this.position.x - imgInfo.rect.width / 2,
                this.position.y - imgInfo.rect.height
            );
            leftTopPoint.y -= this.position.z;


            /*
            console.log([
                this._currentFrameIndex,
                imgInfo.img.src,
                imgInfo.rect,
                leftTopPoint]);
            */

            ctx.drawImage(
                imgInfo.img,
                imgInfo.rect.position.x, imgInfo.rect.position.y,
                imgInfo.rect.width, imgInfo.rect.height,
                leftTopPoint.x, leftTopPoint.y,
                imgInfo.rect.width, imgInfo.rect.height
            );

            if (this.isDrawBoundry) {
                ctx.strokeStyle = "#FF00FF";
                ctx.strokeRect(
                    leftTopPoint.x, leftTopPoint.y,
                    imgInfo.rect.width, imgInfo.rect.height
                );
            }
        }


        get ImgInfo() {
            const imgArray = this._direction ? this.obj.bmpInfo.imageNormal : this.obj.bmpInfo.imageMirror;
            const curFrame = this.currentFrame;
            return imgArray[curFrame.pictureIndex];
        }

        _getNextFrameId() {
            let next = this.currentFrame.nextFrameId;
            if (next == 0) return this.currentFrame.id;
            if (next == 999) return 0;

            return next;
        }

        /**
         *
         * @returns {boolean}
         */
        get isFrameChanged() {
            if (this._currentFrameIndex != this._lastFrameId) {
                this._lastFrameId = this._currentFrameIndex;
                return true;
            }
            return false;
        }

        get isObjectChanged() {
            //TODO: need implement
            return super.isObjectChanged ||
                this.isFrameChanged;
        }

        get width() {
            if (this._maxWidth === undefined) {
                this._maxWidth = Math.max.apply(this, this.obj.bmpInfo.imageNormal.map(i => i.rect.width));
            }

            return this._maxWidth;
        }

        get height() {
            if (this._maxHeight === undefined) {
                this._maxHeight = Math.max.apply(this, this.obj.bmpInfo.imageNormal.map(i => i.rect.height));
            }

            return this._maxHeight;
        }

    };

    lf2.GameItem.prototype.DIRECTION = lf2.GameItem.DIRECTION = DIRECTION;

    return lf2;
})(lf2 || {});