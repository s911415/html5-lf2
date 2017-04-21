"use strict";
var lf2 = (function (lf2) {
    const GameMapPool = lf2.GameMapPool;
    const GameItem = lf2.GameItem;
    const Point = Framework.Point;
    const ResourceManager = Framework.ResourceManager;
    const Bound = lf2.Bound;

    /**
     * Check if object is sortable
     * @param x
     * @returns {boolean}
     */
    const isAttachableSortObj = (x) => {
        if (
            x instanceof lf2.Character ||
            x instanceof lf2.Ball ||
            false
        ) return true;

        return false;
    };
    /**
     * World Scene
     *
     * @class {lf2.WorldScene}
     * @extends {Framework.Scene}
     * @implements {Framework.AttachableInterface}
     */
    lf2.WorldScene = class WorldScene extends Framework.Scene {
        constructor(config) {
            super();
            this.config = config;

            /**
             * position of camera, from 0 to 1
             * @type {Number}
             */
            this.cameraPosition = 0;
            this.map = GameMapPool.get(this.config.mapId);
            this.players = this.config.players;

            this.attach(this.map);
            this.addPlayers(this.players);

            this._lastCameraX = -1;

        }


        /**
         *
         * @param {lf2.Player[]} playerArray
         */
        addPlayers(playerArray) {
            playerArray.forEach((player) => {
                this.attach(player);
                this.attach(player.character);
            });
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            let sumPlayerX = 0;
            this.config.players.forEach((p) => {
                sumPlayerX += p.character.position.x;
            });
            this._setCameraPositionByX(sumPlayerX / this.config.players.length);

            let bdyItems = this._getAllBdyItem();

            this.attachArray.forEach((item) => {
                if (item instanceof lf2.GameItem) {
                    item.setBdyItems(bdyItems);
                }
            });

            this.attachArray.forEach((item) => {
                if (item instanceof lf2.GameItem) {
                    let attackedItems = item.getAttackItems();
                    /**
                     * @type {lf2.GameItem[]}
                     */
                    let actualAttackedItems = [];
                    attackedItems.forEach(bdyItem => {
                        const r = bdyItem.notifyDamageBy(item);
                        if (r) {
                            actualAttackedItems.push(bdyItem);
                        }
                    });


                    item.postDamageItems(actualAttackedItems);

                    let bound = this.map.getBound(item.position);
                    if (bound !== Bound.NONE) {
                        item.onOutOfBound(bound, this.map);
                    }
                }
            });

            this.attachArray.forEach((ele) => {
                ele.update();
            });

            this.attachArray.forEach((ele) => {
                if (ele instanceof lf2.GameItem) {
                    ele.cleanUpItr();
                }
            });
        }

        /**
         *
         * @returns {lf2.GameItem[]}
         * @private
         */
        _getAllBdyItem() {
            let bdyItems = [];
            this.attachArray.forEach((item) => {
                if (item instanceof lf2.GameItem) {
                    if (item.currentFrame.bdy && item._allowDraw) {
                        bdyItems.push(item);
                    }
                }
            });

            // bdyItems.sort((x, y) => x.position.x - y.position.x);

            return bdyItems;
        }

        /**
         * _setCameraPositionByX(x)
         *
         * Sets camera position by x coordinate.
         *
         * @param   x   The unknown to process.
         *
         * @return  .
         */
        _setCameraPositionByX(x) {
            const WIDTH = this.map.width - Framework.Config.canvasWidth;
            const HW = Framework.Config.canvasWidth / 2;
            let pos = 0;
            if (x <= HW) {
                pos = 0;
            } else if (x >= this.map.width - HW) {
                pos = 1;
            } else {
                pos = (x - HW) / WIDTH;
            }

            this.cameraPosition = pos;

        }

        /**
         * _getCameraPositionAsPoint()
         *
         * Gets camera position as point.
         *
         * @return  The camera position as point.
         */
        _getCameraPositionAsPoint() {
            let x = this.map.width - Framework.Config.canvasWidth;
            x *= this.cameraPosition;

            return new Point(x | 0, 0);
        }

        /**
         *
         * @param {CanvasRenderingContext2D} ctx The painter.
         * @override
         */
        draw(ctx) {
            //Reset translate
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            //TODO: just for demo

            ctx.save();
            let canvasTranslate = this._getCameraPositionAsPoint();
            ctx.translate(-canvasTranslate.x, -canvasTranslate.y);


            this.attachArray.sort((e1, e2) => {
                if (!isAttachableSortObj(e1)) return -1;
                if (!isAttachableSortObj(e2)) return 1;
                const p1 = (e1.position);
                const p2 = (e2.position);
                const yd = p1.y - p2.y;
                if (yd === 0) {
                    return e1._createTime - e2._createTime;
                } else {
                    return yd;
                }
            });

            this.attachArray.forEach(function (ele) {
                ele.draw(ctx);
            }, this);

            ctx.restore();
        }

        /**
         *
         * @param {lf2.Player} player
         */
        getEnemy(player) {
            for (let i = 0, j = this.players.length; i < j; i++) {
                if (player !== this.players[i]) return this.players[i];
            }

            return null;
        }

        /**
         *
         * @param {lf2.Player} player
         */
        getFriend(player) {
            return player;
        }


        /**
         *
         * @param {lf2.GameItem} gameItem
         */
        detach(gameItem) {
            super.detach(gameItem);
            gameItem.alive = false;
        }
    };

    return lf2;
})(lf2 || {});