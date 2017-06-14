"use strict";
var lf2 = (function (lf2) {
    const HALF_SCREEN_WIDTH = Framework.Config.canvasWidth >> 1;
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const Audio = Framework.Audio;
    const Bezier = lf2.Bezier;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const FrameStage = lf2.FrameStage;
    const GameObject = lf2.GameObject;
    const GameObjectPool = lf2.GameObjectPool;
    const Bound = lf2.Bound;
    const ItrKind = lf2.ItrKind;
    const Rectangle = lf2.Rectangle;
    const Cube = lf2.Cube;
    const DESTROY_ID = 1000;
    const NONE = -1;
    const STOP_ALL_MOVE_DV = 550;

    const FRICTION = 0.25;
    const MIN_SPEED = 1;
    const MIN_V = 1;
    const GRAVITY = 1.7; // 1.7

    const SOUND_BEZIER = [0.895, 0.03, 0.685, 0.22];
    const KEEP_SOUND_DISTANCE = 100;

    let dvxArray = [0];
    const getDvxPerWait = function (i) {
        return i;
        // if (i < 0) return -getDvxPerWait(-i);
        //
        // if (dvxArray[i] !== undefined) return dvxArray[i];
        // dvxArray[i] = (i + 1) + getDvxPerWait(i - 1);
        // return dvxArray[i];
    };

    const getMinX = (gameItem, rect) => {
        const W = (gameItem.currentFrame.center.x);
        return (gameItem.position.x | 0) + (
                gameItem._direction === DIRECTION.RIGHT ?
                    (-W + rect.position.x) :
                    (W - rect.position.x - rect.width)
            );
    };

    const getMinZ = (gameItem, rect) => {
        return gameItem.position.z - gameItem.currentFrame.center.y + rect.position.y;
    };

    const DIRECTION = {
        RIGHT: true,
        LEFT: false,
    };
    Object.freeze(DIRECTION);

    /**
     * GameItem
     *
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

            this._previousFrameIndex = 0;
            this._currentFrameIndex = 0;
            this._lastFrameSetTime = Date.now();
            this._config = Framework.Config;
            this._direction = DIRECTION.RIGHT;
            this._lastFrameId = NONE;
            this.belongTo = player;
            this._frameForceChange = false;
            this._frameForceChangeId = NONE;
            this._createTime = Date.now();
            this._allowDraw = true;
            this._updateCounter = 0;
            this._affectByFriction = true;
            this._bdyItems = [];
            this._itrItem = null;
            this._itrItr = null;
            this._itrItemFrame = null;
            this._arestCounter = 0;
            this._vrestCounter = 0;
            this._flashing = false;
            this._flashCounter = false;
            this._isNew = true;
            this.alive = true;
            /**
             *
             * @type {lf2.WorldScene|null}
             * @private
             */
            this._world = null;

            /**
             * @type {Framework.Audio}
             */
            this._audio = new Framework.Audio(this.obj.getPlayList());

            this._nextDirection = null;

            /**
             *
             * @type {Framework.Point3D}
             */
            this._prevVelocity = this._velocity.clone();

            this.pushSelfToLevel();
        }

        /**
         *
         * @param {lf2.WorldScene} v
         */
        set world(v) {
            this._world = v;
        }

        /**
         *
         * @returns {lf2.WorldScene}
         */
        get world() {
            return this._world;
        }

        /**
         * Get current frame
         * @returns {lf2.Frame}
         */
        get currentFrame() {
            return this.obj.frames[this._currentFrameIndex];
        }

        /**
         * Get current frame
         * @returns {lf2.Frame}
         */
        get previousFrame() {
            return this.obj.frames[this._previousFrameIndex];
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
            if (this._isNew) {
                this._isNew = false;
                return;
            }
            const curFrame = this.currentFrame;
            this._updateCounter++;
            this.applyFriction();

            let offset = this._getFrameOffset();
            //Start move object
            this.position.z += offset.y;
            this.position.y += offset.z;
            if (this._direction === DIRECTION.RIGHT) {
                this.position.x += offset.x;
            } else {
                this.position.x -= offset.x;
            }
            if (this.position.z > 0) {
                this.position.z = 0;
                this._velocity.y = 0;
            }
            //End of move object


            switch (curFrame.state) {
                case FrameStage.CLOSED_BAD_GUY: {
                    if (this.world) {
                        let item = this.world.getEnemy(this.belongTo);

                        if (item) {
                            this.setPosition(item.position);
                        }
                    }
                }
                    break;
                case FrameStage.CLOSED_TEAMMATE: {
                    if (this.world) {
                        let item = this.world.getFriend(this.belongTo);

                        if (item) {
                            this.setPosition(item.position);
                        }
                    }
                }
                    break;
            }

            let bound = 0;
            if (this._frameForceChange || this._updateCounter >= this.currentFrame.wait) {
                this.setFrameById(this._getNextFrameId());
                this._frameForceChange = false;
                this._frameForceChangeId = NONE;
                if (this._nextDirection !== null) {
                    this._direction = this._nextDirection;
                }
                this._nextDirection = null;

                this.updateVelocity();
            }

            if (this._arestCounter > 0) {
                this._arestCounter--;
            } else {
                this._arestCounter = 0;
            }

            if (this._vrestCounter > 0) {
                this._vrestCounter--;
            } else {
                this._vrestCounter = 0;
            }

            if (this._flashing) {
                this._flashCounter = !this._flashCounter;
            }
        }

        /**
         *
         * @param {lf2.GameItem[]} items
         */
        setBdyItems(items) {
            this._bdyItems = items;
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
            this._frameOffset = this._frameOffset || new Point3D(0, 0, 0);
            let ret = this._frameOffset;
            this._frameOffset.x = this._velocity.x;
            this._frameOffset.y = this._velocity.y;
            this._frameOffset.z = this._velocity.z;


            if (ret.x === STOP_ALL_MOVE_DV) ret.x = 0;
            if (ret.y === STOP_ALL_MOVE_DV) ret.y = 0;
            if (ret.z === STOP_ALL_MOVE_DV) ret.z = 0;

            this._frameOffset = ret;

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
            // v.x = getDvxPerWait(v.x);
            return this.currentFrame.velocity;
        }

        /**
         * Updates the velocity.
         *
         * @return  .
         */
        updateVelocity() {
            const getVelocityVal = (cur, next) => {
                if (next === 0) return cur;
                return next;
            };

            this._velocity.writeTo(this._prevVelocity);
            // this._prevVelocity = this._velocity.clone();
            const v = this._getVelocity();

            this._velocity.x = getVelocityVal(this._velocity.x, v.x);
            this._velocity.y = getVelocityVal(this._velocity.y, v.y);
            this._velocity.z = getVelocityVal(this._velocity.z, v.z);
        }

        /**
         * Applies the friction.
         *
         * @return  .
         */
        applyFriction() {
            if (this._affectByFriction) {
                const FX = GameItem.ApplyFriction(this._velocity.x);
                const FZ = GameItem.ApplyFriction(this._velocity.z);

                // Only apply friction on ground
                if (this.position.z === 0) {
                    if (FX && this._velocity.x) {
                        this._velocity.x += this._velocity.x > 0 ? -FX : FX;
                    }
                    if (FZ && this._velocity.z) {
                        this._velocity.z += this._velocity.z > 0 ? -FZ : FZ;
                    }
                }

                if (this.position.z < 0) {
                    this._velocity.y += GRAVITY;
                }

                if (this.position.z > 0) {
                    this.position.z = 0;
                    this._velocity.y = 0;
                }

                // Avoid too small velocity
                if (Math.abs(this._velocity.x) < MIN_V) this._velocity.x = 0;
                if (Math.abs(this._velocity.y) < MIN_V) this._velocity.y = 0;
                if (Math.abs(this._velocity.z) < MIN_V) this._velocity.z = 0;
                // End of friction
            }
        }


        /**
         *
         * @param {Number} frameId
         */
        setFrameById(frameId) {
            if (frameId < 0 && this.frameExist(-frameId)) {
                this._direction = !this._direction;
                return this.setFrameById(-frameId);
            }
            if (!this.frameExist(frameId)) throw new RangeError(`Object (${this.obj.id}) Frame (${frameId}) not found`);
            //console.log("Set Frame ", frameId);
            if (frameId === DESTROY_ID) {
                this.onDestroy();
                return;
            }
            this._previousFrameIndex = this._currentFrameIndex;
            this._currentFrameIndex = frameId;
            this._lastFrameSetTime = Date.now();
            this._updateCounter = 0;
        }

        /**
         *
         * @param {String} frameName
         */
        getFrameIdByName(frameName) {
            let frame = this.obj.frames.filter(o => o.name === frameName)[0];
            if (!frame) throw new RangeError(`Object (${this.obj.id}) Frame (${frameName}) not found`);

            return frame.id;
        }

        /**
         * Can damage by.
         *
         * @param   item    The item.
         * @param   ITR     The itr.
         *
         * @return  .
         */
        canDamageBy(item, ITR) {
            const itemState = item.currentFrame.state;
            if (itemState === FrameStage.FIRE && item.obj.id !== 211) return true;
            if (ITR.kind === ItrKind.THREE_D_OBJECTS) return true;

            switch (ITR.kind) {
                case ItrKind.CATCH:
                case ItrKind.PICK_WEAPON:
                case ItrKind.CATCH_BDY:
                case ItrKind.FALLING:
                case ItrKind.WEAPON_STRENGTH:
                case ItrKind.SUPER_PUNCH:
                case ItrKind.PICK_WEAPON_2:
                    return false;
            }

            return !this.isSameTeam(this, item);
        }

        /**
         * Frame Exist
         * @param frameId
         * @returns {boolean}
         */
        frameExist(frameId) {
            if (frameId === DESTROY_ID) return true;

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
            const curFrame = this.obj.frames[this._currentFrameIndex];

            /*
             console.log([
             this._currentFrameIndex,
             imgInfo.img.src,
             imgInfo.rect,
             leftTopPoint]);
             */

            // const REAL_DRAW_POS = new Point(
            //     leftTopPoint._x | 0,
            //     (leftTopPoint._y + leftTopPoint._z) | 0
            // );
            const REAL_DRAW_POS_X = leftTopPoint._x | 0;
            const REAL_DRAW_POS_Y = (leftTopPoint._y + leftTopPoint._z) | 0;

            //if (leftTopPoint.z != 0) debugger;
            if (this._allowDraw) {
                if (!this._flashing || (this._flashing && this._flashCounter)) {
                    const infoRect = imgInfo._rect;
                    ctx.drawImage(
                        imgInfo._img,
                        infoRect.position._x | 0,
                        infoRect.position._y | 0,
                        infoRect.width,
                        infoRect.height,
                        REAL_DRAW_POS_X,
                        REAL_DRAW_POS_Y,
                        infoRect.width,
                        infoRect.height
                    );
                }
            }

            if (this.isFrameChanged) {
                //Play sound
                if (curFrame.soundPath) {
                    if (this.world instanceof lf2.WorldScene) {
                        const DistanceFrom = this.world.getDistanceBetweenCameraAndItem(this);
                        let balance = DistanceFrom / HALF_SCREEN_WIDTH;

                        if (balance > 1) balance = 1;
                        if (balance < -1) balance = -1;

                        this._audio.balance = balance;

                        if (DistanceFrom > HALF_SCREEN_WIDTH) {
                            let vol = (DistanceFrom - HALF_SCREEN_WIDTH) / KEEP_SOUND_DISTANCE;
                            if (vol > 1) vol = 1;
                            vol = 1 - Bezier(SOUND_BEZIER, vol);
                            if (vol < 0) vol = 0;
                            this._audio.rightVolume = vol;
                        }

                        if (DistanceFrom < -HALF_SCREEN_WIDTH) {
                            let vol = (-DistanceFrom - HALF_SCREEN_WIDTH) / KEEP_SOUND_DISTANCE;
                            if (vol > 1) vol = 1;
                            vol = 1 - Bezier(SOUND_BEZIER, vol);
                            if (vol < 0) vol = 0;
                            this._audio.leftVolume = vol;
                        }
                        //
                        // const diffSign = Math.sign(DisDiff);
                        // let vol = diffSign * DisDiff / HALF_SCREEN_WIDTH;
                        // if (vol > 1) {
                        //     vol = 1;
                        // } else if (vol < 0) {
                        //     vol = 0;
                        // }
                        // vol = Bezier(SOUND_BEZIER, 1 - vol);
                        // if (vol <= 0) vol = 0;


                        // vol = Math.round(vol* 100) / 100;
                        // this._audio.volume = vol;

                    }
                    this._audio.play(curFrame.soundPath);
                }

                //add ball
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

            if (define.DEBUG) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#FF00FF";
                //Draw image rect
                ctx.strokeRect(
                    REAL_DRAW_POS_X, REAL_DRAW_POS_Y,
                    imgInfo.rect.width, imgInfo.rect.height
                );

                //Draw bdy rect
                const bdy = this.getBdyRect();
                if (bdy) {
                    ctx.strokeStyle = "#FF0000";
                    bdy.draw(ctx, leftTopPoint.z);
                }

                //Draw itr rect
                const itr = this.getItrBox();
                if (itr) {
                    ctx.strokeStyle = "#0000FF";
                    itr.forEach(i => i.draw(ctx, leftTopPoint.z));
                }

                let msg = [];
                msg.push(`ID: ${this.obj.id}`);
                msg.push(`CurrentFrameId: ${this._currentFrameIndex} / wait: ${this.currentFrame.wait}`);
                msg.push(`position: (${this.position.x | 0}, ${this.position.y | 0}, ${this.position.z | 0}) / ${this._direction ? 'RIGHT' : 'LEFT'}`);
                msg.push(`velocity: (${this._velocity.x | 0}, ${this._velocity.y | 0}, ${this._velocity.z | 0})`);

                msg.push(`VrestCounter: ${this._vrestCounter}`);

                if (this instanceof lf2.Character) {
                    msg.push(`Fall: ${this._fall | 0}`);
                }

                if (this instanceof lf2.Ball) {
                    if (this._behavior) {
                        msg.push(`Behavior: ${this._behavior.toString()}`);
                    }
                }

                ctx.font = "200 12px Arial";
                ctx.textAlign = "start";
                ctx.textBaseline = "top";
                ctx.fillStyle = "#FFF";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                for (let i = 0; i < msg.length; i++) {
                    const _y = REAL_DRAW_POS_Y + 12 * i;
                    ctx.strokeText(msg[i], REAL_DRAW_POS_X, _y);
                    ctx.fillText(msg[i], REAL_DRAW_POS_X, _y);
                }
            }
        }

        /**
         *
         * @returns {lf2.Cube[]}
         */
        getItrBox() {
            const _itr = this.currentFrame.itr;
            if (!_itr) return null;
            return _itr.map(itr => {
                let rect = this._transferRect(itr.rect);
                return new Cube(
                    rect.width, rect.height, _itr.zwidth,
                    rect.position.x, rect.position.y
                );
            });
        }


        /**
         *
         * @returns {lf2.Rectangle}
         */
        getBdyRect() {
            if (!this.currentFrame.bdy || !this._allowDraw) return null;
            return this._transferRect(this.currentFrame.bdy.rect);
        }

        /**
         *
         * @param {lf2.Rectangle} rect
         * @returns {lf2.Rectangle}
         * @private
         */
        _transferRect(rect) {
            if (!rect) return null;

            const leftTopPoint = this.leftTopPoint;

            if (this._direction === DIRECTION.RIGHT) {
                return new Rectangle(
                    rect.width, rect.height,

                    leftTopPoint.x + rect.position.x,
                    leftTopPoint.y + rect.position.y
                );
            } else if (this._direction === DIRECTION.LEFT) {
                return new Rectangle(
                    rect.width, rect.height,

                    leftTopPoint.x + this.width - rect.position.x - rect.width,
                    leftTopPoint.y + rect.position.y
                );
            }
        }

        /**
         *
         * @param {Framework.Point} p
         * @returns {Framework.Point}
         */
        transferPoint(p) {
            if (!p) return null;

            const leftTopPoint = this.leftTopPoint;

            if (this._direction === DIRECTION.RIGHT) {
                return new Point(
                    leftTopPoint.x + p.x,
                    leftTopPoint.y + p.y
                );
            } else if (this._direction === DIRECTION.LEFT) {
                return new Point(
                    leftTopPoint.x + this.width - p.x,
                    leftTopPoint.y + p.y
                );
            }
        }

        /**
         * Gets attack items.
         *
         * @return {lf2.GameItem[]} The attack items.
         */
        getAttackItems() {
            const ITRs = this.currentFrame.itr;
            if (!ITRs) return [];

            let res = [];
            ITRs.forEach(ITR => {
                if (ITR.kind === 4) return [];
                if (ITR.kind === 6) return [];

                const
                    a_minX = getMinX(this, ITR.rect),
                    a_maxX = a_minX + ITR.rect.width,
                    a_minY = this.position.y - (ITR.zwidth >> 1), a_maxY = a_minY + ITR.zwidth,
                    a_minZ = getMinZ(this, ITR.rect),
                    a_maxZ = a_minZ + ITR.rect.height;

                const checkCollision = (bdyItem) => {
                    const bdy = bdyItem.currentFrame.bdy;
                    if (!bdy || bdyItem._flashing) return false;

                    const
                        b_minX = getMinX(bdyItem, bdy.rect),
                        b_maxX = b_minX + bdy.rect.width,

                        b_minY = bdyItem.position.y - 6, b_maxY = b_minY + 12,

                        b_minZ = getMinZ(bdyItem, bdy.rect),
                        b_maxZ = b_minZ + bdy.rect.height;

                    return (a_minX <= b_maxX && a_maxX >= b_minX) &&
                        (a_minY <= b_maxY && a_maxY >= b_minY) &&
                        (a_minZ <= b_maxZ && a_maxZ >= b_minZ);
                };

                for (let i = 0; i < this._bdyItems.length && this._vrestCounter === 0; i++) {
                    const item = this._bdyItems[i];

                    if (this._arestCounter > 0) break;

                    if (this === item) continue; //cannot attack itself.

                    if (checkCollision(item) && item._itrItem === null) {
                        if (
                            // (ITR.kind === FrameStage.FIRE || this.belongTo !== item.belongTo)
                        item !== this
                        ) { //kind 18 allow attack itself.
                            res.push({
                                item: item,
                                itr: ITR
                            });

                            if (
                                (ITR.hasArest || !ITR.hasVrest) &&
                                item instanceof lf2.Character &&
                                ItrKind.ITR_ALLOW_FALL.binarySearch(ITR.kind) !== -1
                            ) {
                                this._arestCounter = ITR.arest;
                            }
                        }
                    }
                }
            });

            return res;
        }

        /**
         * Clean up itr.
         *
         * @return  .
         */
        cleanUpItr() {
            this._itrItem = null;
            this._itrItr = null;
            this._itrItemFrame = null;
        }

        /**
         *
         * @param {lf2.GameItem} item
         * @param {lf2.Interaction} itr
         * @returns {boolean} return true if accept, otherwise false
         */
        notifyDamageBy(item, itr) {
            this._itrItem = item;
            this._itrItr = itr;
            this._itrItemFrame = item.currentFrame;
            // console.log(item, 'attack', this);

            return true;
        }

        /**
         *
         * @param {lf2.GameItem[]} gotDamageItems
         */
        postDamageItems(gotDamageItems) {
            this.currentFrame.itr.forEach(ITR => {
                if (ITR && !ITR.hasArest && ITR.hasVrest && gotDamageItems.length > 0) {
                    if (gotDamageItems.some(x => x instanceof lf2.Character)) {
                        this._vrestCounter = ITR.vrest;
                    }
                }
            });
        }

        /**
         * Force set next frame id
         *
         * @param {Number} id
         */
        setNextFrame(id) {
            this._frameForceChangeId = id;
            this._frameForceChange = true;
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
         * @return  {lf2.ImageInformation}   A get.
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
         * @return  {Framework.Point}   A get.
         */
        get leftTopPoint() {
            const center = this.currentFrame.center;
            let leftTopPoint = this._leftTopPointRef || new Point3D(0, 0, 0);
            leftTopPoint.x = this.position.x - center.x;
            leftTopPoint.y = this.position.y - center.y;
            leftTopPoint.z = this.position.z;

            if (this._direction === DIRECTION.LEFT) {
                leftTopPoint.x = this.position.x - (this.width - center.x);
            }

            this._leftTopPointRef = leftTopPoint;

            return leftTopPoint;
        }

        /**
         * _getNextFrameId()
         *
         * Gets the next frame identifier.
         *
         * @return {Number} The next frame identifier.
         */
        _getNextFrameId() {
            if (this._frameForceChangeId !== NONE) return this._frameForceChangeId;
            let next = this.currentFrame.nextFrameId;
            if (next === 0) return this.currentFrame.id;
            if (next === 999) return 0;

            return next;
        }

        /**
         * Freezes this object.
         *
         * @return  .
         */
        freeze() {
            this._velocity.x
                = this._velocity.y
                = this._velocity.z
                = 0;
        }

        isSameTeam(item1, item2) {
            return item1.belongTo.team.equalsTo(item2.belongTo.team);
        }

        /**
         * Is frame changed.
         *
         * @return  {boolean}   bool.
         */
        get isFrameChanged() {
            if (this._currentFrameIndex !== this._lastFrameId) {
                return true;
            }
            return false;
        }

        /**
         * get isObjectChanged()
         *
         * Is object changed.
         *
         * @return  {boolean}   A get.
         */
        get isObjectChanged() {
            return true;
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
         * @return  {Number}   A get.
         */
        get height() {
            return this.ImgInfo.rect.height;
        }

        /**
         * Is stopping.
         *
         * @return  {boolean}   A get.
         */
        get isStopping() {
            return this._velocity.x === this._velocity.y && this._velocity.y === this._velocity.z
                && this._velocity.x === 0;
        }

        /**
         *
         * @returns {Point3D}
         */
        get velocity() {
            return this._velocity.clone();
        }

        /**
         *
         * @param {Framework.Point3D} p
         */
        set velocity(p) {
            this._velocity.x = p.x;
            this._velocity.y = p.y;
            this._velocity.z = p.z;
        }

        /**
         *
         * @param {lf2.GameItem} item
         */
        isFront(item) {
            let ret = true;
            if (this._direction === DIRECTION.RIGHT) {
                ret = this.position.x < item.position.x;
            } else {
                ret = this.position.x > item.position.x;
            }

            // if (this._velocity.x < 0) ret = !ret;

            return ret;
        }

        /**
         *
         * @param {Framework.Point3D} p
         */
        setPosition(p) {
            this.position.x = p.x;
            this.position.y = p.y;
            if (p.z !== undefined) {
                this.position.z = p.z;
            }
        }

        /**
         * Sets next direction.
         *
         * @param   v   The unknown to process.
         *
         * @return  .
         */
        setNextDirection(v) {
            this._nextDirection = v;
        }

        /**
         *
         * @param {Number} speed
         */
        static GetFriction(speed) {
            //a lookup table
            const TABLE = {
                //speed: friction
                3: 1,
                5: 2,
                6: 4, //smaller or equal to 6, value is 4
                9: 5,
                13: 7,
                25: 9 //guess entry
            };

            if (speed < 0) speed = -speed;

            let targetSpeed;
            for (targetSpeed in TABLE) {
                if (speed <= targetSpeed) {
                    return TABLE[targetSpeed];
                }
            }

            return TABLE[targetSpeed];
        }

        /**
         *
         * @param {Number} val
         * @param {Number} [f] friction
         * @return {Number}
         */
        static ApplyFriction(val, f) {
            if (f === undefined) {
                f = GameItem.GetFriction(val);
            }
            if (val === 0) return 0;
            if (val === STOP_ALL_MOVE_DV) return 0;

            return FRICTION * f;
        };

    };

    lf2.GameItem.prototype.DIRECTION = lf2.GameItem.DIRECTION = DIRECTION;
    lf2.GameItem.prototype.DESTROY_ID = lf2.GameItem.DESTROY_ID = DESTROY_ID;
    lf2.GameItem.prototype.NONE = lf2.GameItem.NONE = NONE;
    lf2.GameItem.prototype.MIN_V = lf2.GameItem.MIN_V = MIN_V;
    lf2.GameItem.prototype.FRICTION = lf2.GameItem.FRICTION = FRICTION;
    lf2.GameItem.prototype.GRAVITY = lf2.GameItem.GRAVITY = GRAVITY;
    lf2.GameItem.prototype.STOP_ALL_MOVE_DV = lf2.GameItem.STOP_ALL_MOVE_DV = STOP_ALL_MOVE_DV;

    return lf2;
})(lf2 || {});