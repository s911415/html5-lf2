'use strict';
var Framework = (function (Framework) {

    Framework.triangleComponent = function (sprite, bodyType, box2D) {
        var physicScale = 30;
        this.sprite = sprite;
        this.body = box2D.createSquareBody(1, 1, bodyType);
        this.mBox2D = box2D;
        this.mPosition;
        this.mScale;
        this.mRotation;
        this.bodyType = bodyType;

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
                return this.mPosition;
            },

            set: function (newValue) {
                this.mPosition = newValue;
                this.body.SetPosition(new this.mBox2D.b2Vec2(newValue.x / physicScale, newValue.y / physicScale));
                this.sprite.position = {x: newValue.x, y: newValue.y};
            },
        });

        Object.defineProperty(this, 'scale', {
            get: function () {
                return this.mScale;
            },

            set: function (newValue) {
                this.mScale = newValue;
                this.body.GetFixtureList().GetShape().SetAsBox(this.sprite.width / physicScale / 2, this.sprite.height / physicScale / 2);
                this.sprite.scale = this.mScale;
            },
        });

        Object.defineProperty(this, 'rotation', {
            get: function () {
                return this.mRotation;
            },

            set: function (newValue) {
                this.mRotation = newValue;
                this.body.SetAngle(newValue * Math.PI / 180);
                this.sprite.rotation = newValue;
            },
        });

        this.update = function () {
            if (!this.bodyCreated && this.secondUpdate) {
                this.bodyCreated = true;
                this.body.GetFixtureList().GetShape().SetAsBox(this.sprite.width / physicScale / 2, this.sprite.height / physicScale / 2);
            }
            this.secondUpdate = true;
            this.sprite.position = {
                x: this.body.GetPosition().x * physicScale,
                y: this.body.GetPosition().y * physicScale
            };
            this.sprite.rotation = this.body.GetAngle() / Math.PI * 180;
            this.body.GetFixtureList().GetShape().SetAsArray([
                new this.mBox2D.b2Vec2(-2 * this.mScale, 1 * this.mScale),
                new this.mBox2D.b2Vec2(0, -2 * this.mScale),
                new this.mBox2D.b2Vec2(2 * this.mScale, 1 * this.mScale),
            ], 3);
        }
    };

    return Framework;
})(Framework || {});