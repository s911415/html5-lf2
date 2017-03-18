"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const Bound = lf2.Bound;
    const DESTROY_ID = 1000;
    const NONE = -1;

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
         * @param gameObjId ID of character
         * @param {lf2.Player} player this object belong to which player
         */
        constructor(gameObjId, player) {
            super();

            if (!(player instanceof lf2.Player)) throw TypeError('player argument must be a instance of lf2.Player');

            this.obj = GameObjectPool.get(gameObjId);

            /**
             * 物件的中下座標
             */
            this.position = new Point3D(0, 0, 0);
            this.absolutePosition = new Point3D(0, 0, 0);
            this.relativePosition = new Point3D(0, 0, 0);

            this._currentFrameIndex = 0;
            this._lastFrameSetTime = Date.now();
            this._config = Framework.Config;
            this._frameInterval = (1e3 / Framework.Config.fps);
            this._direction = DIRECTION.RIGHT;
            this._lastFrameId = NONE;
            this.isDrawBoundry = define.DEBUG;
            this.belongTo = player;
            this._frameForceChange = false;
            this._createTime = Date.now();

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
            const lastFrameSetDiff = now - this._lastFrameSetTime;
            if ((lastFrameSetDiff ) < this._frameInterval) return;

            let offset = this._getFrameOffset();
            //Start move object
            this.position.z += offset.z;
            this.position.y += offset.y;
            if (this._direction == DIRECTION.RIGHT) {
                this.position.x += offset.x;
            } else {
                this.position.x -= offset.x;
            }
            //End of move object


            if (this.position.z < 0) this.position.z = 0;

            let bound = 0;

            if (this._frameForceChange || lastFrameSetDiff >= this.currentFrame.wait * this._frameInterval) {
                this.setFrameById(this._getNextFrameId());
                this._frameForceChange = false;
            }
        }

        /**
         *
         * @returns {Framework.Point3D}
         * @private
         */
        _getFrameOffset() {
            switch (this.currentFrame.state) {

                default:
                    return this.currentFrame.offset;
            }
        }

        /**
         *
         * @param {Number} frameId
         */
        setFrameById(frameId) {
            if (!this.frameExist(frameId)) throw new RangeError(`Object (${this.obj.id}) Frame (${frameId}) not found`);
            //console.log("Set Frame ", frameId);
            if (frameId == DESTROY_ID) {
                this.onDestroy();
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
            const leftTopPoint = this.leftTopPoint;


            /*
             console.log([
             this._currentFrameIndex,
             imgInfo.img.src,
             imgInfo.rect,
             leftTopPoint]);
             */

            const REAL_DRAW_POS = new Point(
                leftTopPoint.x,
                leftTopPoint.y - leftTopPoint.z
            );

            if (leftTopPoint.z != 0) debugger;
            ctx.drawImage(
                imgInfo.img,
                imgInfo.rect.position.x, imgInfo.rect.position.y,
                imgInfo.rect.width, imgInfo.rect.height,
                REAL_DRAW_POS.x, REAL_DRAW_POS.y,
                imgInfo.rect.width, imgInfo.rect.height
            );

            if (this.isFrameChanged) {
                //Play sound
                if (this.currentFrame.soundPath) {
                    this.obj._audio.play({
                        name: this.currentFrame.soundPath
                    });
                }

                if (this.currentFrame.opoint) {
                    let opoint = this.currentFrame.opoint;
                    console.log('add ball', this.currentFrame.id);
                    this.belongTo.addBall(opoint, this);
                }
            }
            this._lastFrameId = this._currentFrameIndex;


            if (this.isDrawBoundry) {
                ctx.strokeStyle = "#FF00FF";
                ctx.strokeRect(
                    leftTopPoint.x, leftTopPoint.y,
                    imgInfo.rect.width, imgInfo.rect.height
                );
            }
        }

        /**
         *
         * @param {Number} bound
         * @param {lf2.GameMap} map
         */
        onOutOfBound(bound, map) {
            //TODO: Implement when arrive bound
        }

        /**
         * destroy this item
         *
         * @abstract
         */
        onDestroy() {
            throw 'METHOD NOT IMPLEMENT';
        }


        get ImgInfo() {
            const imgArray = this._direction ? this.obj.bmpInfo.imageNormal : this.obj.bmpInfo.imageMirror;
            const curFrame = this.currentFrame;
            let imgInfo = imgArray[curFrame.pictureIndex];
            if (imgInfo instanceof lf2.ImageInformation) {
                return imgInfo;
            } else {
                return imgArray[-1];
            }
        }

        get leftTopPoint() {
            const center = this.currentFrame.center;
            let leftTopPoint = new Point3D(
                this.position.x - center.x,
                this.position.y - center.y,
                this.position.z
            );

            if (this._direction == DIRECTION.LEFT) {
                leftTopPoint.x = this.position.x - (this.width - center.x);
            }

            return leftTopPoint;
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
            return this.ImgInfo.rect.width;
        }

        get height() {
            return this.ImgInfo.rect.height;
        }

    };

    lf2.GameItem.prototype.DIRECTION = lf2.GameItem.DIRECTION = DIRECTION;
    lf2.GameItem.prototype.DESTROY_ID = lf2.GameItem.DESTROY_ID = DESTROY_ID;

    return lf2;
})(lf2 || {});