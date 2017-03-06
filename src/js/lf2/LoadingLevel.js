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
    const Character = lf2.Character;
    const Ball = lf2.Ball;

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
            this._startLoadingTime = Date.now();
            this.promiseList = [];
            this.objInfo = [];
            this.bgInfo = [];
            new Promise((res, rej) => {
                ResourceManager.loadResource(define.DATA_PATH + "data_list.json").then((data) => {
                    return data.json();
                }).then((data) => {
                    console.log('Load data list done.');

                    const objs = data.object, bgs = data.background, $=this;
                    let loadObjectRes = function*(){
                        let i=0;
                        while(i<objs.length){
                            yield objs[i++];
                        }

                        return null;
                    };
                    let loadBackgroundRes = function*(){
                        let i=0;
                        while(i<bgs.length){
                            yield bgs[i++];
                        }

                        return null;
                    };
                    let loadObjGen = loadObjectRes();
                    let loadBgGen = loadBackgroundRes();

                    let loadObj = function(){
                        let v=loadObjGen.next();
                        const _o = v.value;
                        if(_o===null) {
                            res();
                        }else{
							console.log(`Loading "${_o.file}".`);
                            ResourceManager.loadResource(define.DATA_PATH + _o.file).then((data) => {
                                return data.text();
                            }).then((datText) => {
                                const obj = $.parseObj(_o, datText);
                                if (obj instanceof GameObject) {
                                    $.objInfo.push(obj);

                                    obj.done().then(()=>{
										console.log(`"${_o.file}" including images Loaded.`);
										loadObj();
									});
                                } else {
                                    loadObj();
                                }
                            });
                        }
                    };

                    let loadBg = function(){
                        let v=loadBgGen.next();
                        debugger;
                        const _o = v.value;
                        if(_o===null) {
                            res();
                        }else{
							console.log(`Loading "${_o.file}".`);
                            ResourceManager.loadResource(define.DATA_PATH + _o.file).then((data) => {
                                return data.text();
                            }).then((datText) => {
                                loadBg();
                                /*
                                 const obj = $.parseObj(_o, datText);
                                 if (obj instanceof GameObject) {
                                 $.objInfo.push(obj);

                                 obj.done().then(()=>{
                                 console.log(`"${_o.file}" including images Loaded.`);
                                 loadObj();
                                 });
                                 } else {
                                 loadObj();
                                 }*/
                            });
                        }
                    };

                    loadObj();
                    loadBg();
                });
            }).then((a, b) => {
                console.log("---------------------------");
                console.log("All object loaded.");
                console.log("---------------------------");
                console.log(GameObjectPool.get(52));
                this.allDone = true;
            });
        }

        update() {
            if (this.allDone && (Date.now() - this._startLoadingTime) >= define.LOADING_MIN_TIME) {
                //TODO: NEED CHANGE
                Game.goToLevel('fight', {
                    players: [
                        {charId: 2},
                        //{charId: 2},
                    ],
                    mapId: 0,

                });
            }
        }

        draw(ctx) {
            super.draw(ctx);

        }

        /**
         * Parse LF@ Object
         * @param {Object} info
         * @param {String} content
         * @returns {GameObject|undefined}
         */
        parseObj(info, content) {
            let obj = undefined;
            obj = new GameObject(info, content);
            GameObjectPool.set(info.id, obj);

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
            return obj;
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
                this._startLoadingTime = Date.now();
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