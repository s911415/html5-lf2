"use strict";
var lf2 = (function (lf2) {
    const _CONTAINER_ID = "__loading_container";

    /**
     * @type {Framework.Game}
     */
    const Game = Framework.Game;
    const Effect = lf2.Effect;

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
     * @type {GameMapPool}
     */
    const GameMapPool = lf2.GameMapPool;

    /**
     * @type {GameObject}
     */
    const GameObject = lf2.GameObject;
    const GameObjectCharacter = lf2.GameObjectCharacter;
    const GameObjectBall = lf2.GameObjectBall;
    const GameObjectWeapon = lf2.GameObjectWeapon;

    const GameMap = lf2.GameMap;
    const Prefetch = lf2.Prefetch;

    let LoadingVideoSrc = define.IMG_PATH + 'loading_video.mp4';
    let LoadingVideoLoadState = 0;

    /**
     * Loading Level
     *
     * @type {LoadingLevel}
     * @class lf2.LoadingLevel
     */
    lf2.LoadingLevel = class LoadingLevel extends Framework.Level {
        constructor() {
            super();

            if (LoadingLevel.prototype.Instance === undefined) {
                LoadingLevel.prototype.Instance = this;
            } else {
                throw 'Only One instance of Loading Level allowed';
            }

            this.html = "";
            this._htmlLoader = ResourceManager.loadResource(define.DATA_PATH + 'LoadingScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
            });

            this.zip = {};
        }

        /**
         * initializeProgressResource()
         *
         * Initializes the progress resource.
         *
         * @return  .
         */
        initializeProgressResource() {
            super.initializeProgressResource();

            this._htmlLoader.then(() => {
                this.showLoadingVideo();
            });

            lf2.LoadingLevel.PreloadLoadingVideo();
        }

        /**
         * loadingProgress(context, requestInfo)
         *
         * Loading progress.
         *
         * @param   context     The context.
         * @param   requestInfo Information describing the request.
         *
         * @return  .
         */
        loadingProgress(context, requestInfo) {
        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load() {
            this.allDone = false;
            this._startLoadingTime = Date.now();
            this.promiseList = [];
            this.objInfo = [];
            this.bgInfo = [];
            new Promise((_resolve, _reject) => {
                return Promise.all([
                    Prefetch.get('DATA_LIST'),
                    Prefetch.get('DATA')
                        .then(zip => this.zip = zip)
                        .catch((e) => {
                            console.error("Fail to load zip file", "fallback to txt file", e);
                        })
                    ,
                ]).then(r => {
                    return r[0];
                }).then((data) => {
                    const objs = data.object, $ = this;
                    console.log('Loading GameObject');

                    return new Promise((res, rej) => {
                        let loadObjectRes = function*() {
                            let i = 0;
                            while (i < objs.length) {
                                yield objs[i++];
                            }

                            return null;
                        };
                        let loadObjGen = loadObjectRes();

                        let loadObj = function () {
                            let v = loadObjGen.next();
                            const _o = v.value;
                            if (_o === null) {
                                res(data);
                            } else {
                                $._showLoadFile(_o.file);

                                $.loadDataResource(_o.file).then((datText) => {
                                    const obj = $.parseObj(_o, datText);
                                    if (obj instanceof GameObject) {
                                        $.objInfo.push(obj);

                                        obj.done().then(() => {
                                            console.log(`"${_o.file}" including images Loaded.`);
                                            loadObj();
                                        });
                                    } else {
                                        loadObj();
                                    }
                                });
                            }
                        };

                        loadObj();
                    });
                }).then((data) => {
                    console.log("GameObject all loaded");

                    return data;
                }).then((data) => {
                    const bgs = data.background, $ = this;
                    console.log('Loading GameMap');
                    return new Promise((res, rej) => {
                        let loadMapRes = function*() {
                            let i = 0;
                            while (i < bgs.length) {
                                yield bgs[i++];
                            }

                            return null;
                        };
                        let loadMapGen = loadMapRes();

                        let loadMap = function () {
                            let v = loadMapGen.next();
                            const _o = v.value;
                            if (_o === null) {
                                res(data);
                            } else {
                                $._showLoadFile(_o.file);

                                $.loadDataResource(_o.file).then((datText) => {
                                    const map = $.parseMap(_o, datText);
                                    if (map instanceof GameMap) {
                                        $.bgInfo.push(map);

                                        map.done().then(() => {
                                            console.log(`"${_o.file}" including images Loaded.`);
                                            loadMap();
                                        });
                                    } else {
                                        loadMap();
                                    }
                                });
                            }
                        };

                        loadMap();
                    });
                }).then(_resolve);
            }).then((data) => {
                console.log("GameMap all loaded");

                return data;
            }).then((a, b) => {
                console.log("Preloading extra image resources");
                let arrUrl = [
                    define.IMG_PATH + "player_status_panel.png",
                    define.IMG_PATH + "countdown_1.png",
                    define.IMG_PATH + "countdown_2.png",
                    define.IMG_PATH + "countdown_3.png",
                    define.IMG_PATH + "countdown_4.png",
                    define.IMG_PATH + "countdown_5.png",
                    define.IMG_PATH + "join_char_1.png",
                    define.IMG_PATH + "join_char_2.png",
                    define.IMG_PATH + "selection_panel.png",
                    define.IMG_PATH + "random_char.png",
                ];
                let arr = [];

                arrUrl.forEach(u => {
                    console.log("Loading " + u);
                    arr.push(
                        ResourceManager.loadImage({
                            url: u
                        })
                    );
                });

                return Promise.all(arr);
            }).then((a, b) => {
                console.log("Extra image resources all loaded");

                return a;
            }).then((a, b) => {
                console.log("Preloading extra resources");
                let arrUrl = [
                    define.DATA_PATH + 'SelectionScreen.html',
                    define.DATA_PATH + 'FightScreen.html',
                ];
                let arr = [];

                arrUrl.forEach(u => {
                    console.log("Loading " + u);
                    arr.push(ResourceManager.loadResource(u));
                });

                return Promise.all(arr);
            }).then((a, b) => {
                console.log("Extra resources all loaded");

                return a;
            }).then((a, b) => {
                console.log("---------------------------");
                console.log("All object loaded.");
                console.log("---------------------------");
                this.allDone = true;
            });
        }

        /**
         * Loads data resource.
         *
         * @param   path    Full pathname of the file.
         *
         * @return  The data resource.
         */
        loadDataResource(path) {
            path = path.replace(/\\/g, '/').replace(/\/\//, '/');

            const ZipFileEntry = this.zip.files ? this.zip.files[path] : undefined;
            if (!define.DEBUG && ZipFileEntry) {
                return ZipFileEntry.async('text');
            } else {
                return ResourceManager.loadResource(define.DATA_PATH + path).then(r => r.text());
            }
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            if (this.allDone && (Date.now() - this._startLoadingTime) >= define.LOADING_MIN_TIME) {
                //TODO: NEED CHANGE
                Game.goToLevel('selection');

                /*Game.goToLevel('fight', {
                 players: [
                 {charId: intval(prompt("腳色1 ID:", "51") || 51)},
                 {charId: intval(prompt("腳色2 ID:", "7") || 7)},
                 ],
                 mapId: intval(prompt("地圖 ID:", "3") || 3),

                 });*/
            }
        }


        draw(ctx) {
            super.draw(ctx);

        }

        /**
         * Parse LF2 Object
         * @param {Object} info
         * @param {String} content
         * @returns {GameObject|undefined}
         */
        parseObj(info, content) {
            let obj = undefined;


            switch (info.type) {
                case 0:
                    obj = new GameObjectCharacter(info, content);
                    break;
                case 1:
                    obj = new GameObjectWeapon(info, content);
                    break;
                case 3:
                    obj = new GameObjectBall(info, content);
                    break;
                default:
                    obj = new GameObject(info, content);
            }

            GameObjectPool.set(info.id, obj);
            obj._preLoadSound();

            return obj;
        }

        /**
         * Parse LF2 Object
         * @param {Object} info
         * @param {String} content
         * @returns {GameMap|undefined}
         */
        parseMap(info, content) {
            let map = undefined;
            map = new GameMap(info, content);
            GameMapPool.set(info.id, map);

            /*
             switch (info.type) {
             case 0:
             obj = new Character(info, content);
             GameObjectPool.set(info.id, obj);
             break;
             case 3:
             obj = new Ball(info, content);
             GameObjectPool.set(info.id, obj);
             break;

             }
             */
            return map;
        }

        /**
         * showLoadingVideo()
         *
         * Shows the loading video.
         *
         * @return  .
         */
        showLoadingVideo() {
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._loadingContainer) {
                $("#" + _CONTAINER_ID).remove();

                this._loadingContainer = $(this.html);
                this._loadingContainer.attr("id", _CONTAINER_ID);
                this._loadingContainer.find("#loadProcess").attr('src', lf2.LoadingLevel.LOADING_RESOURCE_SRC);
                this._loadPath = this._loadingContainer.find("#loadDatPath");
            }
            if (!this._attached && this._loadingContainer) {
                $("body").append(this._loadingContainer);
                this._attached = true;
                this._startLoadingTime = Date.now();

                Game.resizeEvent();
            }
        }

        /**
         * autodelete()
         *
         * Autodeletes this object.
         *
         * @return  .
         */
        autodelete() {
            if (this._loadingContainer) {
                this._loadingContainer.remove();
                this._loadingContainer = undefined;
            }
        }

        /**
         * _showLoadFile(url)
         *
         * Shows the load file.
         *
         * @param   url URL of the document.
         *
         * @return  .
         */
        _showLoadFile(url) {
            const showUrl = url.replace(/\\/g, '/');
            console.log(`Loading "${showUrl}".`);
            this._loadPath.text("正在讀取: " + showUrl);
        }

        /**
         *
         * @type {string}
         */
        static get LOADING_RESOURCE_SRC() {
            return LoadingVideoSrc;
        }

        static PreloadLoadingVideo() {
            if (LoadingVideoLoadState > 0) return;
            LoadingVideoLoadState = 1;
            Prefetch.get('LOADING_VIDEO')
                .then(blobUrl => {
                    LoadingVideoSrc = blobUrl;
                    LoadingVideoLoadState = 4;
                });
        }
    };

    return lf2;
})(lf2 || {});