"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;

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
            this._frameInterval = (1e3 / 30);
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
            if ((now - this._lastFrameSetTime) >= this.currentFrame.wait * this._frameInterval) {
                this.setFrameById(this._getNextFrameId());
            }
        }

        /**
         *
         * @param {Number} frameId
         */
        setFrameById(frameId) {
            if (!this.obj.frames[frameId]) throw new RangeError(`Object (${this.obj.id}) Frame (${frameId}) not found`);
            this._lastFrameId = this._currentFrameIndex;
            this._currentFrameIndex = frameId;
            this._lastFrameSetTime = Date.now();
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

        get isObjectChanged() {
            //TODO: need implement
            return super.isObjectChanged||
                this._currentFrameIndex != this._lastFrameId;
        }

    };

    lf2.GameItem.prototype.DIRECTION = lf2.GameItem.DIRECTION = DIRECTION;

    return lf2;
})(lf2 || {});