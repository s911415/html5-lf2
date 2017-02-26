var Framework = (function (Framework) {
    'use strict';

    Framework.polygonComponent = function (sprite, bodyType, box2D, arraySize) {
        var physicScale = 30;
        this.sprite = sprite;
        this.body = box2D.createSquareBody(1, 1, bodyType);
        this.mBox2D = box2D;
        this.mPosition;
        this.mScale;
        this.mRotation;
        this.bodyType = bodyType;
        this.arraySize = arraySize;
        this.isSensor;
        this.mbodyWidth;
        this.mbodyHeight;

        Object.defineProperty(this, 'BodyType', {
            get: function () {
                return this.bodyType;
            },
            set: function (newValue) {
                this.bodyType = newValue;
                this.body.setType(newValue);
            }
        });
        Object.defineProperty(this, 'Body', {
            get: function () {
                return this.body;
            }
        });

        Object.defineProperty(this, 'fixtureDef', {
            get: function () {
                return this.body.m_fixtureList;
            }
        });

        Object.defineProperty(this, 'position', {
            get: function () {
                return this.sprite.position;
            },

            set: function (newValue) {
                this.mPosition = newValue;
                this.body.SetPosition(new this.mBox2D.b2Vec2(newValue.x / physicScale, newValue.y / physicScale));
                if (this.sprite != null) {
                    this.sprite.position = {
                        x: newValue.x,
                        y: newValue.y
                    };
                }
            },
        });

        Object.defineProperty(this, 'scale', {
            get: function () {
                return this.mScale;
            },

            set: function (newValue) {
                this.mScale = newValue;
                if (this.sprite != null) {
                    this.body.GetFixtureList().GetShape().SetAsBox(this.sprite.width / physicScale / 2, this.sprite.height / physicScale / 2);
                    this.sprite.scale = this.mScale;
                }
                else {
                    this.body.GetFixtureList().GetShape().SetAsBox(this.mbodyWidth / physicScale / 2, this.mbodyHeight / physicScale / 2);
                }
                this.arraySize.forEach(
                    function scaleArray(value) {
                        value.x = value.x * newValue;
                        value.y = value.y * newValue;
                    });
            },
        });

        Object.defineProperty(this, 'rotation', {
            get: function () {
                return this.mRotation;
            },

            set: function (newValue) {
                this.mRotation = newValue;
                this.body.SetAngle(newValue * Math.PI / 180);
                if (this.sprite != null) {
                    this.sprite.rotation = newValue;
                }
            },
        });

        Object.defineProperty(this, 'isSensor', {
            get: function () {
                return this.isSensor;
            },

            set: function (newValue) {
                this.body.m_fixtureList.SetSensor(newValue);
            },
        });

        Object.defineProperty(this, 'bodyWidth', {
            get: function () {
                return this.mbodyWidth;
            },

            set: function (newValue) {
                this.mbodyWidth = newValue;
            },
        });

        Object.defineProperty(this, 'bodyHeight', {
            get: function () {
                return this.mbodyHeight;
            },

            set: function (newValue) {
                this.mbodyHeight = newValue;
            },
        });

        this.registerContact = function (contactCallBack) {
            this.mBox2D.addDictionary(this.body, contactCallBack);
        };

        this.update = function () {
            if (!this.bodyCreated && this.secondUpdate) {
                this.bodyCreated = true;
                if (this.sprite != null) {
                    this.body.GetFixtureList().GetShape().SetAsBox(this.sprite.width / physicScale / 2, this.sprite.height / physicScale / 2);
                }
                else {
                    this.body.GetFixtureList().GetShape().SetAsBox(this.mbodyWidth / physicScale / 2, this.mbodyHeight / physicScale / 2);
                }
            }
            this.secondUpdate = true;
            if (this.sprite != null) {
                this.sprite.position = {
                    x: this.body.GetPosition().x * physicScale,
                    y: this.body.GetPosition().y * physicScale
                };
                this.sprite.rotation = this.body.GetAngle() / Math.PI * 180;
            }
            this.body.GetFixtureList().GetShape().SetAsArray(this.arraySize);
            Framework.Game.update()
        }
    };

    return Framework;
})(Framework || {});
