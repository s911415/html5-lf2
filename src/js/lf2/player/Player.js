"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const Team = lf2.Team;
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
    const CLEAR_KEY_TIME = 200; //Less than 200 make be make stop run direction wrong
    const NAME_OFFSET = 0;
    const NAME_CACHE_WIDTH = 200;
    const NAME_CACHE_HEIGHT = 20;

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
         * @param {Number|undefined} [teamId]
         */
        constructor(playerId, charId, teamId) {
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
                teamId = teamId || 0;
                teamId *= 1;

                /**
                 *
                 * @type {lf2.Character}
                 */
                this.character = new Character(charId, this);

                this.hp = DEFAULT_HP;
                this.mp = DEFAULT_MP;

                this._godMode = false;
                this._infMp = false;
                this._playerNameCache = undefined;

                /**
                 * @type {Framework.Scene}
                 */
                this.spriteParent = null;

                this._upKeyTimer = false;

                this.team = (teamId);
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
                if (!this.character.world._allowUpdate) return false;

                const funcKeyWoArrow = this._currentKey & ~((KeyboardConfig.KEY_MAP.LEFT | KeyboardConfig.KEY_MAP.RIGHT) & ~KeyboardConfig.KEY_MAP.FRONT);
                const hitList = this.character.currentFrame.hit;

                //Same func key twice
                let first = this.keyEventPool[0] !== undefined ? this.keyEventPool[0].lf2Key : undefined;
                let second = this.keyEventPool[1] !== undefined ? this.keyEventPool[1].lf2Key : undefined;

                if (
                    this.allowCombineKey &&
                    second !== undefined && first === second
                ) {
                    if ((first & KeyboardConfig.KEY_MAP.FRONT) === KeyboardConfig.KEY_MAP.FRONT) {
                        this.character.startRun();
                        define.DEBUG && console.log('start run');
                    }
                }

                const hitFid = hitList[funcKeyWoArrow], cFrame = this.character.obj.frames[hitFid];
                if (hitFid && cFrame && this.requestMp(cFrame.mp)) {
                    if ((this._currentKey & KeyboardConfig.KEY_MAP.LEFT) === KeyboardConfig.KEY_MAP.LEFT) {
                        this.character.setNextDirection(DIRECTION.LEFT);
                    } else if ((this._currentKey & KeyboardConfig.KEY_MAP.RIGHT) === KeyboardConfig.KEY_MAP.RIGHT) {
                        this.character.setNextDirection(DIRECTION.RIGHT);
                    }
                    this.character.setNextFrame(hitFid);
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
         *
         * @param {*} teamId
         */
        set team(teamId) {
            this._team = Team.GetTeamInstance(teamId);
            this._playerNameCache = undefined;
        }

        /**
         *
         * @returns {lf2.Team}
         */
        get team() {
            return this._team;
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

        /**
         * Loads this object.
         *
         * @return  .
         */
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
                const NameImage = this.getPlayerNameImage();
                ctx.drawImage(
                    NameImage,
                    0, 0, NAME_CACHE_WIDTH, NAME_CACHE_HEIGHT,
                    this.character.position.x - (NAME_CACHE_WIDTH >> 1),
                    this.character.position.y,
                    NAME_CACHE_WIDTH, NAME_CACHE_HEIGHT
                );
            }
        }

        getPlayerNameImage() {
            if (this._playerNameCache) return this._playerNameCache;
            this._playerNameCache = document.createElement('canvas');
            this._playerNameCache.width = NAME_CACHE_WIDTH;
            this._playerNameCache.height = NAME_CACHE_HEIGHT;
            let ctx = this._playerNameCache.getContext('2d');
            const Pos = {
                x: NAME_CACHE_WIDTH >> 1,
                y: NAME_OFFSET,
            };

            ctx.font = "12px 'Microsoft YaHei'";
            ctx.fillStyle = this.team.getColor();
            ctx.strokeStyle = this.team.getDarkColor();
            ctx.lineWidth = 2;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.strokeText(
                this.keyboardConfig.config.NAME,
                Pos.x,
                Pos.y
            );
            ctx.fillText(
                this.keyboardConfig.config.NAME,
                Pos.x,
                Pos.y
            );

            return this._playerNameCache;
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
            let sign = Math.sign(num);
            num = Math.abs(num);

            let mpCost = sign * (num % MP_COST_MAGIC_NUMBER);
            let hpCost = sign * ((num / MP_COST_MAGIC_NUMBER * 10) | 0);

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
         * @param {Boolean} val
         */
        setGodMode(val) {
            this._godMode = val;
        }

        /**
         *
         * @param {Number} amount
         */
        addAttackCount(amount) {
            this.attackSum += amount;
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
                if (!obj) {
                    console.error(`Object id :${opoint.objectId} Not found`);
                    continue;
                }

                let addBall = null;
                switch (obj.fileInfo.type) {
                    case 0:
                        addBall = new Character(opoint.objectId, this);
                        console.warn('Summon of character not implement.');
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

            const R = opoint.appearPoint.x;
            const DEG = 45;
            const RAD = Math.toRad(DEG);
            const DIFF = RAD / ballArr.length;
            const START_RAD = -(RAD / 2);
            const getOp = (i) => {
                if (ballArr.length === 1) {
                    return {x: opoint.appearPoint.x, y: caller.position.y};
                }
                const RAD = START_RAD + i * DIFF;
                return {
                    x: R * Math.cos(RAD),
                    y: R * Math.sin(RAD) + caller.position.y
                }
            };
            ballArr.forEach((ball, i) => {
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
                let op = getOp(i);
                ball.position = new Framework.Point3D(
                    caller.position.x - DIR_WEIGHT * (caller.currentFrame.center.x - op.x), // 前後
                    op.y,  //Y 不變
                    zPos
                );

                if (ball._getVelocity().isZero && !opoint.dv.isZero) {
                    ball._velocity.x = opoint.dv.x;
                    ball._velocity.y = opoint.dv.y;
                }
                this.spriteParent.addNewItem(ball);
            });

            return ballArr;
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

        /**
         * Is holding last key.
         *
         * @return  .
         */
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