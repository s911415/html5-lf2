"use strict";
var lf2 = (function (lf2) {

    /**
     * @type {Framework.Game}
     */
    const Game = Framework.Game;

    const ResourceManager = Framework.ResourceManager;
    /**
     * @type {Framework.Level}
     */
    const Level = Framework.Level;

    /**
     * @type {GameObjectPool}
     */
    const GameObjectPool = lf2.GameObjectPool;

    /**
     * @type {GameObject}
     */
    const GameObject = lf2.GameObject;

    /**
     * Loading Level
     *
     * @type {LoadingLevel}
     * @class lf2.LoadingLevel
     */
    lf2.LoadingLevel = class extends Framework.Level {
        constructor() {
            super();
        }

        load() {
            this.allDone = false;
            this.promiseList = [];
            this.objInfo = [];
            this.bgInfo = [];
            new Promise((res, rej) => {
                ResourceManager.loadResource(define.DATA_PATH + "data_list.json").then((data) => {
                    return data.json();
                }).then((data) => {
                    console.log('Load data list done.');

                    const objs = data.object, bgs = data.background;

                    objs.forEach((o) => {
                        this.promiseList.push(
                            new Promise((res, rej) => {
                                ResourceManager.loadResource(define.DATA_PATH + o.file).then((data) => {
                                    return data.text();
                                }).then((datText) => {
                                    let obj = this.parseObj(o, datText);
                                    if (obj !== null) {
                                        this.objInfo.push(obj);

                                        this.promiseList.push(
                                            obj.done().then(res)
                                        );
                                    } else {
                                        res(obj);
                                    }
                                });
                            })
                        );
                    });
                    Promise.all(this.promiseList).then(res);
                });
            }).then((a, b) => {
                console.log("loading data and image done");
                console.log(GameObjectPool.get(52).bmpInfo);
                this.allDone = true;
            });
        }

        update() {
            if (this.allDone) {
                Game.goToLevel('menu');
            }
        }

        draw(ctx) {
            super.draw(ctx);

        }

        /**
         * Parse LF@ Object
         * @param {Object} info
         * @param {String} content
         * @returns {GameObject|null}
         */
        parseObj(info, content) {
            switch (info.type) {
                case 0:
                    let obj = new GameObject(info, content);
                    GameObjectPool.set(info.id, obj);

                    return obj;
                    break;
            }
            return null;
        }
    };

    return lf2;
})(lf2 || {});