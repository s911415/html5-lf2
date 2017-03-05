"use strict";
var lf2 = (function (lf2) {
    const _CONTAINER_ID = "__loading_container";

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
     * @type {Framework.AnimationSprite}
     */
    const AnimationSprite = Framework.AnimationSprite;

    /**
     * @type {Framework.Point}
     */
    const Point = Framework.Point;

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

        initializeProgressResource() {
            super.initializeProgressResource();
            if (this.html) return;

            this.html = "";

            ResourceManager.loadResource(define.DATA_PATH + 'LoadingScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
                this.showLoadingVideo();
            });
            this.loadingImg = ResourceManager.loadResource(lf2.LoadingLevel.LOADING_RESOURCE_SRC);
        }

        loadingProgress(context, requestInfo) {
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
                console.log(GameObjectPool.get(52));
                this.allDone = true;
            });
        }

        update() {
            if (this.allDone) {
                //Game.goToLevel('menu');
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

        showLoadingVideo() {
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._loadingContainer) {
                $("#" + _CONTAINER_ID).remove();

                this._loadingContainer = $(this.html);
                this._loadingContainer.attr("id", _CONTAINER_ID);
                this._loadingContainer.find("#loadProcess").attr('src', lf2.LoadingLevel.LOADING_RESOURCE_SRC);
            }
            if (!this._attached && this._loadingContainer) {
                $("body").append(this._loadingContainer);
                this._attached = true;
            }
        }

        autodelete() {
            if (this._loadingContainer) {
                this._loadingContainer.remove();
                this._loadingContainer = undefined;
            }
        }

        /**
         *
         * @type {string}
         */
        static get LOADING_RESOURCE_SRC() {
            return define.IMG_PATH + 'loading_video.webm';
        }
    };

    return lf2;
})(lf2 || {});