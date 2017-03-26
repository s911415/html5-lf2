"use strict";
var lf2 = (function (lf2) {
    const ResourceManager = Framework.ResourceManager;
    const Game = Framework.Game;
    const _MENU_CONTAINER_ID = "__main_menu";

    /**
     * @class lf2.LaunchMenu
     * @namespace lf2
     * @extends {Framework.GameMainMenu}
     * @implements {Framework.KeyboardEventInterface}
     * @type {{}}
     */
    lf2.LaunchMenu = class extends Framework.GameMainMenu {
        //初始化loadingProgress需要用到的圖片

        //在initialize時會觸發的事件
        loadingProgress(ctx, requestInfo) {
            super.loadingProgress(ctx, requestInfo);
        }

        load() {
            super.load();

            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            this.audio = new Framework.Audio({
                ok: {
                    ogg: define.MUSIC_PATH + 'm_ok.ogg',
                },
                cancel: {
                    ogg: define.MUSIC_PATH + 'm_cancel.ogg',
                },
                bgm: {
                    ogg: define.BGM_PATH + 'main.ogg',
                },
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

        initialize() {
            this.audio.play({
                name: 'bgm',
                loop: true,
                volume: .3,
            });
        }

        update() {
            super.update();
        }

        draw(parentCtx) {
            super.draw(parentCtx);

            if (!this._menuAttached) {

            }
        }

        click(e, list, orgE) {
        }

        showLaunchMenu() {
            if (!this.isCurrentLevel) return;

            if (this.html !== "" && !this._menuAttached) {
                $("#" + _MENU_CONTAINER_ID).remove();

                this._menuContainer = $(this.html);
                this._menuContainer.attr("id", _MENU_CONTAINER_ID);
                this._menuContainer.find("#start_game_btn").click((e) => {
                    this.audio.play({name: 'ok'});
                    Game.goToLevel('loading');
                });
                this._menuContainer.find("#control_set_btn").click((e) => {
                    this.audio.play({name: 'ok'});
                    Game.goToLevel('control');
                });

                $("body").append(this._menuContainer);
                this._menuAttached = true;
                Game.resizeEvent();
            }
        }


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
