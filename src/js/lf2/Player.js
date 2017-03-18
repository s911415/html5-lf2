"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    const PlayerStatusPanel = lf2.PlayerStatusPanel;
    const KeyboardConfig = lf2.KeyboardConfig;
    const Bound = lf2.Bound;
    const KeyBoardManager = Framework.KeyBoardManager;
    const Character = lf2.Character;
    const Ball = lf2.Ball;
    const DIRECTION = lf2.GameItem.DIRECTION;
    const DEFAULT_HP = 500;
    const DEFAULT_MP = 500;

    const BALL_OFFSET_Z = 0;

    /**
     * Player
     *
     * @class lf2.Player
     * @implements Framework.AttachableInterface
     */
    lf2.Player = class Player {
        /**
         *
         * @param {Number} playerId
         * @param {Number} charId
         */
        constructor(playerId, charId) {
            console.log('Create player', playerId, charId);

            this.playerId = playerId;
            this.charId = charId;
            this.status = new PlayerStatusPanel(this);

            this.keyboardConfig = new KeyboardConfig(playerId);
            this.name = this.keyboardConfig.NAME;

            /**
             *
             * @type {lf2.Character}
             */
            this.character = new Character(charId, this);

            /**
             *
             * @type {lf2.Ball[]}
             */
            this.balls = [];

            this.hp = DEFAULT_HP;
            this.mp = DEFAULT_MP;

            this._godMode = false;

            this._currentDownFunctionKey = 0;

            /**
             * @type {Framework.Scene}
             */
            this.spriteParent = null;
        }

        /**
         *
         * @param e
         * @param list
         * @param {KeyboardEvent} oriE
         */
        keydown(e, list, oriE) {
            this.character.setFuncKey(this._parseKeyDownCode(oriE));
        }

        /**
         *
         * @param e
         * @param list
         * @param {KeyboardEvent} oriE
         */
        keyup(e, list, oriE) {
            this.character.setFuncKey(this._parseKeyDownCode(oriE));
        }

        /**
         * Parse key down code, {"ja", "Fj", "Fa", "Dj", "Da", "Uj", "Ua",
         *                      "j", "d", "a",
         *                      "_up", "_down", "_left", "_right"}
         *
         * @param {KeyboardEvent} e
         * @returns {Number} return hit key code
         * @private
         */
        _parseKeyDownCode(e) {
            const KEY_CONFIG = this.keyboardConfig.config;
            let currentKey = 0;

            KeyboardConfig.KEY_MAP.KEY_LIST.forEach((k) => {
                if (KeyBoardManager.isKeyDown(KEY_CONFIG[k])) currentKey |= KeyboardConfig.KEY_MAP[k];
            });

            let hitFuncCode = 0;
            for (
                let o = KeyboardConfig.HIT_KEY.HIT_LIST, i = 0, j = o.length;
                i < j && hitFuncCode === 0;
                i++
            ) {
                let hit = o[i];
                if ((currentKey & KeyboardConfig.HIT_KEY[hit]) === KeyboardConfig.HIT_KEY[hit]) {
                    hitFuncCode = KeyboardConfig.HIT_KEY[hit];
                    break;
                }
            }

            //keep arrow key
            hitFuncCode |= currentKey & (KeyboardConfig.KEY_MAP.LEFT | KeyboardConfig.KEY_MAP.RIGHT);

            return hitFuncCode;
        }

        load() {

        }

        /**
         * Update
         *
         * @override
         */
        update() {
            const MAP = this.spriteParent.map;
            this.character.update();
            this.balls.forEach(ball => ball.update());

            let bound = MAP.getBound(this.character.position);
            if (bound !== Bound.NONE) {
                this.character.onOutOfBound(bound, MAP);
            }
        }

        /**
         * Draw player with camera offset
         *
         * @param {CanvasRenderingContext2D} ctx
         * @override
         */
        draw(ctx) {
        }

        /**
         * Add hp
         * @param num
         */
        addHp(num) {
            let newHP = Utils.returnInRangeValue(this.hp + num, 0, DEFAULT_HP);
            this.hp = newHP;
        }


        /**
         * Add mp
         * @param num
         */
        addMp(num) {
            let newMP = Utils.returnInRangeValue(this.mp + num, 0, DEFAULT_MP);
            this.mp = newMP;
        }

        /**
         * Cost mp
         *
         * @param num
         * @returns {boolean}
         */
        requestMp(num) {
            if (define.INF_MP || num == 0) return true;

            num = Math.abs(num);
            if (this.mp >= num) {
                this.addMp(-num);
                return true;
            }

            return false;
        }

        hurtPlayer(num) {
            if (this._godMode || num == 0) return true;

            num = intval(num);
            this.addHp(-num);

            return true;
        }

        /**
         *
         * @param {lf2.ObjectPoint} opoint
         * @param {lf2.GameItem} caller who added the ball
         */
        addBall(opoint, caller) {
            if (!(caller instanceof lf2.GameItem)) throw TypeError('caller is not an instance of lf2.GameItem');
            /**
             *
             * @type {lf2.Ball[]}
             */
            let ballArr = [];
            for (let i = 0; i < opoint.count; i++) {
                ballArr.push(new Ball(opoint.objectId, this));
            }

            ballArr.forEach(ball => {
                //Set frame id
                ball.setFrameById(opoint.action);

                //Set direction
                if (opoint.dir != DIRECTION.RIGHT) {
                    ball._direction = !caller._direction;
                } else {
                    ball._direction = caller._direction;
                }

                const DIR_WEIGHT = caller._direction == DIRECTION.RIGHT ? 1 : -1;
                let xOffset = -DIR_WEIGHT * caller.width / 2;
                xOffset += DIR_WEIGHT * opoint.appearPoint.x;
                ball.position = new Framework.Point3D(
                    caller.position.x + xOffset, // 前後
                    caller.position.y,  //Y 不變
                    opoint.appearPoint.y
                );

                this.balls.push(ball);
                this.spriteParent.attach(ball);
            });


        }

        /**
         *
         * @returns {boolean}
         */
        get isObjectChanged() {
            return true;
        }

    };

    lf2.Player.prototype.DEFAULT_HP = DEFAULT_HP;
    lf2.Player.prototype.DEFAULT_MP = DEFAULT_MP;


    return lf2;
})(lf2 || {});