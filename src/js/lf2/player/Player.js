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
    const KeyEventPool = lf2.KeyEventPool;
    const KeyBoardManager = Framework.KeyBoardManager;
    const Character = lf2.Character;
    const Ball = lf2.Ball;
    const Weapon = lf2.Weapon;
    const DIRECTION = lf2.GameItem.DIRECTION;
    const DEFAULT_HP = 500;
    const DEFAULT_MP = 500;
    const CLEAR_KEY_TIME = 200;
    const NAME_OFFSET = 0;

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
         * @param {Number|undefined} [charId]
         */
        constructor(playerId, charId) {
            console.log('Create player', playerId, charId);

            this.playerId = playerId;
            this.charId = charId;
            this.status = new PlayerStatusPanel(this);

            this.keyboardConfig = new KeyboardConfig(playerId);
            this.keyEventPool = new KeyEventPool();
            this.name = this.keyboardConfig.NAME;
            this._currentKey = 0;

            this.mpCost = 0;
            this.hpLost = 0;
            this.attackSum = 0;

            if (this.charId !== undefined) {
                /**
                 *
                 * @type {lf2.Character}
                 */
                this.character = new Character(charId, this);

                this.hp = DEFAULT_HP;
                this.mp = DEFAULT_MP;

                this._godMode = false;
                this._infMp = false;

                /**
                 * @type {Framework.Scene}
                 */
                this.spriteParent = null;

                this._upKeyTimer = false;
            }
        }

        /**
         *
         * @param {KeyboardEvent} oriE
         * @returns {boolean} return true if key fired
         */
        keydown(oriE) {
            const funcCode = this._parseKeyDownCode(oriE);
            const NOW = Date.now();
            if (funcCode !== 0) {
                let addObj = {
                    lf2Key: funcCode,
                    event: oriE,
                    time: NOW,
                };

                if (this.allowCombineKey) {
                    this.keyEventPool.push(addObj);
                } else {
                    this.keyEventPool[0] = addObj;
                }

            } else {
                return false;
            }

            this._updateCurrentKey(NOW);

            if (this.character) {
                //Same func key twice
                let first = this.keyEventPool[0] !== undefined ? this.keyEventPool[0].lf2Key : undefined;
                let second = this.keyEventPool[1] !== undefined ? this.keyEventPool[1].lf2Key : undefined;

                if (
                    this.allowCombineKey &&
                    second !== undefined && first === second
                ) {
                    if ((first & KeyboardConfig.KEY_MAP.FRONT) === KeyboardConfig.KEY_MAP.FRONT) {
                        this.character.startRun();
                        console.log('start run');
                    }
                }
            }

            return true;
        }

        /**
         *
         * @param e
         * @param list
         * @param {KeyboardEvent} oriE
         */
        keyup(e, list, oriE) {
            //console.log(list);
            return;
            const funcCode = this._parseKeyDownCode(oriE);
            const upKey = this._getFuncKeyCodeByEvent(oriE);

            this._currentKey = funcCode;

            if (this.character) {
                this.character.setUpKey(upKey);
                this.character.setFuncKey(funcCode);

                if (this._upKeyTimer) {
                    clearTimeout(this._upKeyTimer);
                }
                this._upKeyTimer = setTimeout(() => {
                    this.character._upKey = -1;
                }, CLEAR_KEY_TIME);
            }
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
            return this.keyboardConfig.keyMap.get(e.keyCode) || 0;

            /*for (let i = 0, j = KeyboardConfig.KEY_MAP.KEY_LIST.length; i < j /!*&& currentKey=== 0*!/; i++) {
             const k = KeyboardConfig.KEY_MAP.KEY_LIST[i];
             if (e.keyCode === KEY_CONFIG[k]) currentKey |= KeyboardConfig.KEY_MAP[k];

             }

             let hitFuncCode = this._parseHitKey(currentKey);

             return hitFuncCode;*/
        }

        /**
         *
         * @param {Number} currentKey
         * @returns {number}
         * @private
         */
        _parseHitKey(currentKey) {
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

        /**
         *
         *
         * @param {KeyboardEvent} e
         * @private
         */
        _getFuncKeyCodeByEvent(e) {
            const KEY_CONFIG = this.keyboardConfig.config;
            let currentKey = 0;
            KeyboardConfig.KEY_MAP.KEY_LIST.forEach((k) => {
                if (e.keyCode === KEY_CONFIG[k]) currentKey |= KeyboardConfig.KEY_MAP[k];
            });

            return this._parseHitKey(currentKey);

        }

        /**
         *
         * @param {Number} NOW current time
         * @returns {number}
         * @private
         */
        _updateCurrentKey(NOW) {
            let cmd = 0;

            for (let i = KeyEventPool.KEY_KEEP_COUNT; i >= 1 && cmd === 0; i--) {
                let num = 0;
                for (let j = 0; j < i; j++) {
                    if (this.keyEventPool[j] === undefined) break;

                    //Clean up key list
                    if (NOW - this.keyEventPool[j].time > CLEAR_KEY_TIME) {
                        //keep last key
                        if (j !== 0) this.keyEventPool[j] = undefined;

                        continue;
                    }

                    num |= this.keyEventPool[j].lf2Key;
                }

                cmd = this._parseHitKey(num);
            }

            this._currentKey = cmd;

            return cmd;
        }


        load() {

        }

        /**
         * Update
         *
         * @override
         */
        update() {
            const NOW = Date.now();

            this._updateCurrentKey(NOW);

            //this.character.update();
        }

        /**
         * Draw player with camera offset
         *
         * @param {CanvasRenderingContext2D} ctx
         * @override
         */
        draw(ctx) {
            if (!this.character) return;

            if (this.character._allowDraw) {
                //Backup shadow variables
                const oldShadowBlur = ctx.shadowBlur, oldShadowColor = ctx.shadowColor;

                ctx.shadowBlur = 10;
                ctx.shadowColor = "#000";
                ctx.font = "8px Arial";
                ctx.fillStyle = "#FFF";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(
                    this.keyboardConfig.config.NAME,
                    this.character.position.x,
                    this.character.position.y + NAME_OFFSET
                );

                //Restore shadow variable
                ctx.shadowBlur = oldShadowBlur;
                ctx.shadowColor = oldShadowColor;
            }
        }

        /**
         * Add hp
         * @param num
         */
        addHp(num) {
            const newHP = Utils.returnInRangeValue(this.hp + num, 0, DEFAULT_HP);

            if (num < 0) {
                this.hpLost += -num;
            }

            this.hp = newHP;
        }


        /**
         * Add mp
         * @param num
         */
        addMp(num) {
            const newMP = Utils.returnInRangeValue(this.mp + num, 0, DEFAULT_MP);

            if (num < 0) {
                this.mpCost += -num;
            }

            this.mp = newMP;
        }

        /**
         * Cost mp if possible, if impossible return false
         *
         * @param {Number} num
         * @returns {boolean} return true if mp is enough
         */
        requestMp(num) {
            const MP_COST_MAGIC_NUMBER = 1000;
            if (define.INF_MP || this._infMp || num === 0) return true;

            //let sign = Math.sign(num);
            num = Math.abs(num);

            let mpCost = (num % MP_COST_MAGIC_NUMBER);
            let hpCost = ((num / MP_COST_MAGIC_NUMBER * 10) | 0);

            if (this.mp >= mpCost && this.hp >= hpCost) {
                this.addMp(-mpCost);
                this.addHp(-hpCost);
                return true;
            }

            return false;
        }

        /**
         * check is key pressed
         *
         * @param {Number} keyCode
         * @returns {boolean}
         */
        isKeyPressed(keyCode) {
            return (this._currentKey & keyCode) === keyCode;
        }

        /**
         * Hurt player and decrease hp
         *
         * @param {Number} num
         * @returns {boolean}
         */
        hurtPlayer(num) {
            if (this._godMode || num === 0) return true;

            num = intval(num);
            this.addHp(-num);

            return true;
        }

        /**
         *
         * @param {boolean} flag
         */
        setInfMp(flag) {
            this._infMp = flag;
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
                const obj = GameObjectPool.get(opoint.objectId);
                let addBall = null;
                switch (obj.fileInfo.type) {
                    case 0:
                        addBall = new Ball(opoint.objectId, this);
                        break;
                    case 1:
                        addBall = new Weapon(opoint.objectId, this);
                        break;
                    default:
                        addBall = new Ball(opoint.objectId, this);
                }

                if (addBall !== null) {
                    ballArr.push(addBall);
                }
            }

            ballArr.forEach(ball => {
                //Set frame id
                ball.setFrameById(opoint.action);

                //Set direction
                if (opoint.dir !== DIRECTION.RIGHT) {
                    ball._direction = !caller._direction;
                } else {
                    ball._direction = caller._direction;
                }

                const DIR_WEIGHT = caller._direction === DIRECTION.RIGHT ? 1 : -1;

                let zPos = caller.position.z - caller.currentFrame.center.y + opoint.appearPoint.y;

                ball.position = new Framework.Point3D(
                    caller.position.x - DIR_WEIGHT * (caller.currentFrame.center.x - opoint.appearPoint.x), // 前後
                    caller.position.y,  //Y 不變
                    zPos
                );


                if (ball._getVelocity().isZero && !opoint.dv.isZero) {
                    ball._velocity.x = opoint.dv.x;
                    ball._velocity.y = opoint.dv.y;
                }
                this.spriteParent.attach(ball);
            });


        }

        /**
         *
         * @param {Number} key lf2 key code
         * @returns {boolean}
         */
        containsKey(key) {
            const keyName = this.keyboardConfig.KEY_MAP.REVERT_MAP[key];
            const keyCode = this.keyboardConfig.config[keyName];

            return KeyBoardManager.isKeyDown(keyCode);
        }

        _isHoldingLastKey() {
            if (this.keyEventPool[0] === undefined) return false;
            return KeyBoardManager.isKeyDown(this.keyEventPool[0].event.keyCode);
        }

        /**
         *
         * @returns {boolean}
         */
        get isObjectChanged() {
            return true;
        }

        get allowCombineKey() {
            return !!this.character;
        }

        /**
         *
         * @returns {boolean}
         */
        get isAlive() {
            return this.hp > 0;
        }

    };

    lf2.Player.prototype.DEFAULT_HP = DEFAULT_HP;
    lf2.Player.prototype.DEFAULT_MP = DEFAULT_MP;


    return lf2;
})(lf2 || {});