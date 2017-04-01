// By Raccoon
'use strict';

var Framework = (function (Framework) {
    const Point3D = Framework.Point3D;
    /**
     * 所有Sprite和Scene的Base Class,
     * 一般而言, 應該不會直接new它, 而是new其他的concrete class
     *
     * @implements Framework.AttachableInterface
     * @abstract
     */
    Framework.GameObject = class GameObject{

        /** Default constructor. */
        constructor() {
            this.relativePosition = new Point3D(0, 0, 0);
            this.relativeRotation = 0;
            this.relativeScale = 1;

            this.absolutePosition = new Point3D(0, 0, 0);
            this.absoluteRotation = 0;
            this.absoluteScale = 1;
            this.systemLayer = 1;
            //this.spriteParent = {};

            this.previousAbsolutePosition = new Point3D(0, 0, 0);
            this.previousWidth = 0;
            this.previousHeight = 0;

            this.rotation = 0;
            this.scale = 1;
            this.position = new Point3D(0, 0, 0);

            this._isRotate = true;
            this._isScale = true;
            this._isMove = true;
            this._changeFrame = true;
            this._isCountAbsolute = false;

            /**
             * @type {Framework.Scene}
             */
            this.spriteParent = undefined;
        }

        /**
         * Clears the dirty flag.
         *
         * @return  .
         */
        clearDirtyFlag() {
            this._isRotate = false;
            this._isScale = false;
            this._isMove = false;
            this._changeFrame = false;
        }

        /**
         * Pushes the self to level.
         *
         * @return  .
         */
        pushSelfToLevel() {
            Framework.Game._pushGameObj(this);
        }

        /**
         * Count absolute property.
         *
         * @return  The total number of absolute property.
         */
        countAbsoluteProperty() {
            var rad, parentRotation = 0, parentScale = 1, parentPositionX = 0, parentPositionY = 0;

            this.previousAbsolutePosition.x = this.absolutePosition.x;
            this.previousAbsolutePosition.y = this.absolutePosition.y;
            this.previousWidth = this.width;
            this.previousHeight = this.height;

            if (!Framework.Util.isUndefined(this.spriteParent)) {
                parentRotation = this.spriteParent.absoluteRotation;
                parentScale = this.spriteParent.absoluteScale;
                parentPositionX = this.spriteParent.absolutePosition.x;
                parentPositionY = this.spriteParent.absolutePosition.y;
            }

            rad = (parentRotation / 180) * Math.PI;
            var changedRotate = this.rotation + parentRotation,
                changedScale = this.scale * parentScale,
                changedPositionX = Math.floor((this.relativePosition.x * Math.cos(rad) - this.relativePosition.y * Math.sin(rad))) * parentScale + parentPositionX,
                changedPositionY = Math.floor((this.relativePosition.x * Math.sin(rad) + this.relativePosition.y * Math.cos(rad))) * parentScale + parentPositionY;
            //changedPositionX = this.relativePosition.x + parentPositionX,
            //changedPositionY = this.relativePosition.y + parentPositionY;

            if (this.absoluteRotation !== changedRotate) {
                this._isRotate = true;
            }

            if (this.absoluteScale !== changedScale) {
                this._isScale = true;
            }

            if (this.absolutePosition.x !== changedPositionX || this.absolutePosition.y !== changedPositionY) {
                this._isMove = true;
            }

            this.absoluteRotation = changedRotate;
            this.absoluteScale = changedScale;

            this.absolutePosition.x = changedPositionX;
            this.absolutePosition.y = changedPositionY;

            if (Array.isArray(this.attachArray)) {
                this.attachArray.forEach(function (ele) {
                    if (!Framework.Util.isUndefined(ele.countAbsoluteProperty)) {
                        ele.countAbsoluteProperty();
                    }

                });
            }
        }

        /**
         * @abstract
         */
        load() {
        }

        /**
         * @abstract
         */
        initialize() {
        }

        /**
         * @abstract
         */
        update() {
        }

        /**
         * @abstract
         */
        draw(ctx) {
        }

        /**
         * @abstract
         */
        teardown() {
        }

        /**
         *
         * @returns {string}
         */
        toString() {
            return '[GameObject Object]'
        }

        /**
         * Is object changed.
         * @readonly
         * @return  {boolean}   A get.
         */
        get isObjectChanged() {
            var isParentChanged = false;

            if (!Framework.Util.isUndefined(this.attachArray)) {
                this.attachArray.forEach(function (ele) {
                    if (ele.isObjectChanged) {
                        isParentChanged = true;
                    }
                });
            }

            return this._isRotate || this._isScale || this._isMove || this._changeFrame || isParentChanged;
        };

        /**
         * Is on changed rectangle.
         *
         * @readonly
         * @return  {boolean}   A get.
         */
        get isOnChangedRect() {
            var halfDiagonal = this.diagonal / 2,
                thisRect = {
                    x: this.absolutePosition.x - halfDiagonal,
                    y: this.absolutePosition.y - halfDiagonal,
                    x2: this.absolutePosition.x + halfDiagonal,
                    y2: this.absolutePosition.y + halfDiagonal,
                },
                changedRect = Framework.Game._currentLevel._getChangedRect(1600, 900);

            if ((thisRect.x < changedRect.x2 && thisRect.y < changedRect.y2) ||
                (thisRect.x2 > changedRect.x && thisRect.y2 > changedRect.y) ||
                (thisRect.x2 > changedRect.x && thisRect.y2 < changedRect.y) ||
                (thisRect.x2 < changedRect.x && thisRect.y2 > changedRect.y)) {
                return true;
            }

            return false;
        }

        /**
         * 相對位置的getter
         *
         * @return  {Point}   A get.
         */
        get position() {
            return this.relativePosition;
        }

        /**
         *相對位置的setter
         *
         * @param {Point}  value   The value.
         *
         * @return  {void}   A set.
         */
        set position(value) {
            this.relativePosition = new Point3D(
                value.x,value.y,value.z
            );
        }

        /**
         * 相對旋轉角度的getter
         *
         * @return  {Number}   A get.
         */
        get rotation() {
            return this.relativeRotation;
        }

        /**
         * 相對旋轉角度的setter
         *
         * @param  {Number}  newValue    The new value.
         *
         * @return  {void}
         */
        set rotation(newValue) {
            this.relativeRotation = newValue;
        }

        /**
         * 相對放大縮小的getter
         *
         * @return  {Number}   A get.
         */
        get scale() {
            return this.relativeScale;
        }

        /**
         * 相對放大縮小的setter
         *
         * @param {Number} newValue
         * @return  {void}
         */
        set scale(newValue) {
            this.relativeScale = newValue;
        }

        /**
         * 絕對寬度的getter
         *
         * @readonly
         * @return  {Number}   A get.
         */
        get width() {
            var width = 0;
            if (this.texture) {
                width = this.texture.width;
            }
            return Math.floor(width * this.absoluteScale);
        }

        /**
         * 絕對高度的getter
         *
         * @return  {Number}   A get.
         */
        get height() {
            var height = 0;//this.texture.height;
            if (this.texture) {
                height = this.texture.height;
            }
            return Math.floor(height * this.absoluteScale);
        }

        /**
         * Gets the diagonal.
         *
         * @return  {Number}   A get.
         */
        get diagonal() {
            return Math.sqrt(this.width * this.width + this.height * this.height);
        }

        /**
         * 絕對位置左上角的getter
         * @property upperLeft
         * @type {Point}
         * @default 0
         * @readOnly
         */
        get upperLeft() {
            var oriX = -this.width / 2,
                oriY = -this.height / 2,
                positionDif = countRotatePoint({x: oriX, y: oriY}, this.absoluteRotation);

            return new Point(
                Math.floor(this.absolutePosition.x + positionDif.x),
                Math.floor(this.absolutePosition.y + positionDif.y)
            );
        }

        /**
         * 絕對位置右上角的getter
         * @property upperRight
         * @type {Point}
         * @default 0
         * @readOnly
         */
        get upperRight() {
            var oriX = this.width / 2,
                oriY = -this.height / 2,
                positionDif = countRotatePoint({x: oriX, y: oriY}, this.absoluteRotation);

            return new Point(
                Math.floor(this.absolutePosition.x + positionDif.x),
                Math.floor(this.absolutePosition.y + positionDif.y)
            );
        }

        /**
         * 絕對位置左下角的getter
         * @property lowerLeft
         * @type {Point}
         * @default 0
         * @readOnly
         */
        get lowerLeft() {
            var oriX = -this.width / 2,
                oriY = this.height / 2,
                positionDif = countRotatePoint(new Point(oriX, oriY), this.absoluteRotation);

            return new Point(
                Math.floor(this.absolutePosition.x + positionDif.x),

                Math.floor(this.absolutePosition.y + positionDif.y)
            )
        }

        /**
         * 絕對位置右下角的getter
         * @property lowerRight
         * @type {Point}
         * @default 0
         * @readOnly
         */
        get lowerRight() {
            var oriX = this.width / 2,
                oriY = this.height / 2,
                positionDif = countRotatePoint(new Point(oriX, oriY), this.absoluteRotation);

            return new Point(
                Math.floor(this.absolutePosition.x + positionDif.x),
                Math.floor(this.absolutePosition.y + positionDif.y)
            );
        }
    };

    /**
     * Count rotate point.
     *
     * @param  {Point}  point   The point.
     * @param  {Number} angle   The angle.
     *
     * @return {Point} The rotated point.
     */
    const countRotatePoint = function (point, angle) {
        var currentRotate = (angle / 180) * Math.PI,
            cosRatio = Math.cos(currentRotate),
            sinRatio = Math.sin(currentRotate),
            pointX = point.x * cosRatio - point.y * sinRatio,
            pointY = point.x * sinRatio + point.y * cosRatio;
        return new Framework.Point(pointX, pointY);
    };


    Object.defineProperty(Framework.GameObject.prototype, 'layer', {
        set: function (newValue) {
            this.systemLayer = newValue;
            if (!Framework.Util.isUndefined(this.attachArray)) {
                this.attachArray.forEach(function (o) {
                    o.layer = newValue + 1;
                });
            }
        },
        get: function () {
            return this.systemLayer;
        }
    });
    return Framework;
})
(Framework || {});