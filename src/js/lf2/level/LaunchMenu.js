"use strict";
var lf2 = (function (lf2) {
    const ResourceManager = Framework.ResourceManager;
    const Game = Framework.Game;
    const _MENU_CONTAINER_ID = "__main_menu";
    const Prefetch = lf2.Prefetch;

    /**
     * @class lf2.LaunchMenu
     * @namespace lf2
     * @extends {Framework.Level}
     * @implements {Framework.KeyboardEventInterface}
     * @type {{}}
     */
    lf2.LaunchMenu = class extends Framework.Level {

        /** Default constructor. */
        constructor() {
            super();

            this.loadResLoadStart = false;
        }


        //初始化loadingProgress需要用到的圖片

        //在initialize時會觸發的事件
        loadingProgress(ctx, requestInfo) {
            super.loadingProgress(ctx, requestInfo);
        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load() {
            super.load();

            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            this.audio = new Framework.Audio({
                ok: define.MUSIC_PATH + 'm_ok.m4a',
                join: define.MUSIC_PATH + 'm_join.m4a',
                cancel: define.MUSIC_PATH + 'm_cancel.m4a',
                pass: define.MUSIC_PATH + 'm_pass.m4a',
                end: define.MUSIC_PATH + 'm_end.m4a',
            });

            this.html = '';
            this._menuAttached = false;
            this._menuContainer = undefined;
            //Load Menu view
            ResourceManager.loadResource(define.DATA_PATH + 'LaunchScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
                this.showLaunchMenu();
            });
        }

        /**
         * initialize()
         *
         * Initializes this object.
         *
         * @return  .
         */
        initialize() {
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            super.update();

            if (this._menuAttached && !this.loadResLoadStart) {
                //Play bgm
                lf2['!MainGame'].playBgm();

                this.loadResLoadStart = true;
                this.preload();
            }
        }

        /**
         * Preloads this object.
         *
         * @return  .
         */
        preload() {
            Prefetch.start();
            //Start preload loading video
            lf2.LoadingLevel.PreloadLoadingVideo();

        }

        /**
         * draw(parentCtx)
         *
         * Draws the given parent context.
         *
         * @param   parentCtx   Context for the parent.
         *
         * @return  .
         */
        draw(parentCtx) {
            super.draw(parentCtx);

            if (!this._menuAttached) {
            }
        }

        /**
         * click(e, list, orgE)
         *
         * Clicks.
         *
         * @param   e       The unknown to process.
         * @param   list    The list.
         * @param   orgE    The organisation e.
         *
         * @return  .
         */
        click(e, list, orgE) {
            this._fullScreenGame();
        }

        /**
         * Full screen game.
         *
         * @return  .
         */
        _fullScreenGame() {
            if (define.DEBUG) return;

            if (
                false
            // document.fullscreenElement ||
            // document.webkitFullscreenElement ||
            // document.mozFullScreenElement ||
            // document.msFullscreenElement
            ) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                const element = document.documentElement;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
        }

        /**
         * showLaunchMenu()
         *
         * Shows the launch menu.
         *
         * @return  .
         */
        showLaunchMenu() {
            if (!this.isCurrentLevel) return;

            if (this.html !== "" && !this._menuAttached) {
                $("#" + _MENU_CONTAINER_ID).remove();

                this._menuContainer = $(this.html);
                this._menuContainer.attr("id", _MENU_CONTAINER_ID);
                this._menuContainer.find("#start_game_btn").click((e) => {
                    this._fullScreenGame();
                    this.audio.play('ok');
                    Game.goToLevel('loading');
                });
                this._menuContainer.find("#control_set_btn").click((e) => {
                    this.audio.play('ok');
                    Game.goToLevel('control');
                });
                this._menuContainer.find("#help_btn").click(e=>{
                    this.audio.play('ok');
                    Game.goToLevel('help');
                });

                $("body").append(this._menuContainer);
                this._menuAttached = true;
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
            if (this._menuContainer) {
                this._menuContainer.remove();
                this._menuContainer = undefined;
            }

            //reverse autodelete called to remove menu container first
            super.autodelete();
        }
    };

    return lf2;
})(lf2 || {});
