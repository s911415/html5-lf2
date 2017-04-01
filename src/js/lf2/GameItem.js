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
    const STOP_ALL_MOVE_DV = 550;

    const FRICTION = 0.10;
    const MIN_SPEED = 1;

    let dvxArray = [0];
    const getDvxPerWait = function (i) {
        return i;
        // if (i < 0) return -getDvxPerWait(-i);
        //
        // if (dvxArray[i] !== undefined) return dvxArray[i];
        // dvxArray[i] = (i + 1) + getDvxPerWait(i - 1);
        // return dvxArray[i];
    };

    const DIRECTION = {
        RIGHT: true,
        LEFT: false,
    };
    Object.freeze(DIRECTION);

    /**
     *
     * @param {Number} x
     */
    const applyFriction = (x) => {
        if (x === 0) return 0;
        const y = x * FRICTION;
        if (x > 0) {
            return y;
        } else {
            return y;
        }
    };

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

            this._velocity = new Point3D(0, 0, 0);

            this._currentFrameIndex = 0;
            this._lastFrameSetTime = Date.now();
            this._config = Framework.Config;
            this._frameInterval = (1e3 / Framework.Config.fps) | 0;
            this._direction = DIRECTION.RIGHT;
            this._lastFrameId = NONE;
            this._isDrawBoundry = define.DEBUG;
            this._isShowInfo = define.DEBUG;
            this.belongTo = player;
            this._frameForceChange = false;
            this._createTime = Date.now();
            this._allowDraw = true;

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
            this.position.z += offset.y;
            this.position.y += offset.z;
            if (this._direction === DIRECTION.RIGHT) {
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

                const getVelocityVal = (cur, next) => {
                    let s1 = Math.sign(cur), s2 = Math.sign(next);
                    let ret;

                    if (s1 === s2 || s2 === 0) {
                        if (s1 > 0) ret=Math.max(cur, next);
                        else if (s1 < 0) ret = Math.min(cur, next);
                        else ret = 0;
                    } else {
                        ret = next;
                    }

                    if(Math.abs(ret)<MIN_SPEED){
                        return 0;
                    }else{
                        return ret;
                    }
                };

                const v = this._getVelocity();

                this._velocity.x = getVelocityVal(this._velocity.x, v.x);
                this._velocity.y = getVelocityVal(this._velocity.y, v.y);
                this._velocity.z = getVelocityVal(this._velocity.z, v.z);
            }
        }

        /**
         *
         * @returns {Framework.Point3D}
         * @protected
         */
        _getFrameOffset() {
            //const currentFrame = this.currentFrame;
            const wait = this.currentFrame.wait;
            //const totalMove = this._getVelocity();
            //let x = totalMove.x / wait,
            //    y = totalMove.y / wait,
            //    z = totalMove.z / wait;
            let ret = new Point3D(
                this._velocity.x / wait,
                this._velocity.y / wait,
                this._velocity.z / wait
            );

            // Only apply on ground
            if (this.position.z === 0) {
                this._velocity.x -= applyFriction(this._velocity.x);
                this._velocity.z -= applyFriction(this._velocity.z);
            }

            //if(this._velocity.x!==0) debugger;
            //console.log(this, this._velocity);
            return ret;
        }

        /**
         *
         * @returns {Framework.Point3D}
         * @protected
         */
        _getVelocity() {
            let v =  this.currentFrame.velocity.clone();
            v.x = getDvxPerWait(v.x);
            return v;
        }

        /**
         *
         * @param {Number} frameId
         */
        setFrameById(frameId) {
            if (!this.frameExist(frameId)) throw new RangeError(`Object (${this.obj.id}) Frame (${frameId}) not found`);
            //console.log("Set Frame ", frameId);
            if (frameId === DESTROY_ID) {
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
            const curFrame = this.currentFrame;


            /*
             console.log([
             this._currentFrameIndex,
             imgInfo.img.src,
             imgInfo.rect,
             leftTopPoint]);
             */

            const REAL_DRAW_POS = new Point(
                leftTopPoint.x | 0,
                (leftTopPoint.y - leftTopPoint.z) | 0
            );

            //if (leftTopPoint.z != 0) debugger;
            if (this._allowDraw) {
                ctx.drawImage(
                    imgInfo.img,
                    imgInfo.rect.position.x | 0, imgInfo.rect.position.y | 0,
                    imgInfo.rect.width, imgInfo.rect.height,
                    REAL_DRAW_POS.x, REAL_DRAW_POS.y,
                    imgInfo.rect.width, imgInfo.rect.height
                );
            }

            if (this.isFrameChanged) {
                //Play sound
                if (curFrame.soundPath) {
                    this.obj._audio.play({
                        name: curFrame.soundPath,
                    });
                }

                if (curFrame.opoint) {
                    let opoint = curFrame.opoint;

                    switch (opoint.kind) {
                        case 4100:  //Magic number
                            break;
                        case 1:
                        default:
                            //console.log('add ball', curFrame.id);
                            this.belongTo.addBall(opoint, this);
                            break;
                    }

                }
            }
            this._lastFrameId = this._currentFrameIndex;


            if (this._isShowInfo) {
                let msg = [];
                msg.push(`ID: ${this.obj.id}`);
                msg.push(`CurrentFrameId: ${this._currentFrameIndex}`);
                msg.push(`position: (${this.position.x | 0}, ${this.position.y | 0}, ${this.position.z | 0})`);
                ctx.font = "200 12px Arial";
                ctx.textAlign = "start";
                ctx.textBaseline = "top";
                ctx.fillStyle = "#FFF";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                for (let i = 0; i < msg.length; i++) {
                    const _y = REAL_DRAW_POS.y + 12 * i;
                    ctx.strokeText(msg[i], REAL_DRAW_POS.x, _y);
                    ctx.fillText(msg[i], REAL_DRAW_POS.x, _y);
                }

            }
            if (this._isDrawBoundry) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#FF00FF";
                //Draw image rect
                ctx.strokeRect(
                    REAL_DRAW_POS.x, REAL_DRAW_POS.y,
                    imgInfo.rect.width, imgInfo.rect.height
                );

                //Draw bdy rect
                if (curFrame.bdy) {
                    const rect = curFrame.bdy.rect;
                    ctx.strokeStyle = "#FF0000";
                    ctx.strokeRect(
                        REAL_DRAW_POS.x + rect.position.x, REAL_DRAW_POS.y + rect.position.y,
                        rect.width, rect.height
                    );
                }

                //Draw itr rect
                if (curFrame.itr) {
                    const rect = curFrame.itr.rect;
                    ctx.strokeStyle = "#0000FF";
                    ctx.strokeRect(
                        REAL_DRAW_POS.x + rect.position.x, REAL_DRAW_POS.y + rect.position.y,
                        rect.width, rect.height
                    );
                }
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

        /**
         * get ImgInfo()
         *
         * Image information.
         *
         * @return  {get}   A get.
         */
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

        /**
         * get leftTopPoint()
         *
         * Left top point.
         *
         * @return  {get}   A get.
         */
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

        /**
         * _getNextFrameId()
         *
         * Gets the next frame identifier.
         *
         * @return  The next frame identifier.
         */
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

        /**
         * get isObjectChanged()
         *
         * Is object changed.
         *
         * @return  {get}   A get.
         */
        get isObjectChanged() {
            //TODO: need implement
            return super.isObjectChanged ||
                this.isFrameChanged;
        }

        /**
         * get width()
         *
         * Gets the width.
         *
         * @return  {get}   A get.
         */
        get width() {
            return this.ImgInfo.rect.width;
        }

        /**
         * get height()
         *
         * Gets the height.
         *
         * @return  {get}   A get.
         */
        get height() {
            return this.ImgInfo.rect.height;
        }

    };

    lf2.GameItem.prototype.DIRECTION = lf2.GameItem.DIRECTION = DIRECTION;
    lf2.GameItem.prototype.DESTROY_ID = lf2.GameItem.DESTROY_ID = DESTROY_ID;

    return lf2;
})(lf2 || {});