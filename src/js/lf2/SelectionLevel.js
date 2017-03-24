"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardManager = Framework.KeyBoardManager;
    const _SELECTION_CONTAINER_ID = "__selection_container";
    const Player = lf2.Player;
    /**
     * @class lf2.SelectionLevel
     * @extends Framework.Level
     * @implements Framework.KeyboardEventInterface
     */
    lf2.SelectionLevel = class extends Framework.Level {
        constructor() {
            super();
        }

        load() {
            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            //播放時, 需要給name, 其餘參數可參考W3C
            this.audio = new Framework.Audio({
                ok: {
                    ogg: define.MUSIC_PATH + 'm_ok.ogg',
                },
                cancel: {
                    ogg: define.MUSIC_PATH + 'm_cancel.ogg',
                },
            });

            this.players = [];

            for(let playerId = 0; playerId<define.PLAYER_COUNT;playerId++) {
                this.players[playerId] = new Player(playerId);
            }

            this.html = '';
            this._attached = false;
            this._selectionContainer = undefined;
            //Load Setting view
            ResourceManager.loadResource(define.DATA_PATH + 'SelectionScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
                this.showSelectionPanel();
            });

        }

        initialize() {
        }

        update() {
            super.update();
        }

        draw(parentCtx) {
            super.draw(parentCtx);

            const KEY_CLASS = lf2.KeyboardConfig.prototype.KEY_MAP.KEY_LIST;
            //refresh key
            for (let i = 0; i < define.PLAYER_COUNT; i++) {
                const p = this.players[i], c = this.config[i];
                if (c === undefined) continue;

                KEY_CLASS.forEach((k) => {
                    //Convert Keycode to readable text
                    p.find(".keys." + k).text(KeyBoardManager.mappingTable()[c[k]]);
                });

                p.find('.name').val(c['NAME']);
            }
        }

        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);
            console.log(oriE.keyCode);
            let curElement = $(".cur");
            let playerId = curElement.parent().data('player');

            if (curElement.length > 0) {
                const ce = curElement[0];
                if (ce.classList.contains('keys')) {
                    let key = curElement.data('key');
                    this.config[playerId][key] = oriE.keyCode;
                    setCur(null);
                }
            }

            this.forceDraw();

        }

        showSelectionPanel() {
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._selectionContainer) {
                $("#" + _SELECTION_CONTAINER_ID).remove();

                this._selectionContainer = $(this.html);
                this._selectionContainer.attr("id", _SELECTION_CONTAINER_ID);
                /*

                this._selectionContainer.find(".btn_ok").click((e) => {
                    this.audio.play({name: 'ok'});
                    this.saveConfig();
                    Game.goToLevel('menu');
                });

                this._selectionContainer.find(".btn_cancel").click((e) => {
                    this.audio.play({name: 'cancel'});
                    Game.goToLevel('menu');
                });
                */
                this.forceDraw();

                let playerElement = this._selectionContainer.find(".player:first");
                let playerContainer = this._selectionContainer.find(".players");

                for (let i = 0; i < define.SHOW_PLAYER_COUNT; i++) {
                    this.players[i] = playerElement.clone();
                    this.players[i].attr('data-player', i);
                    this.bindPlayerEvent(this.players[i]);
                    playerContainer.append(this.players[i]);
                }

                playerElement.remove();
                $("body").append(this._selectionContainer);
                this._attached = true;
                Game.resizeEvent();
            }
        }

        bindPlayerEvent(playerElement) {
            const _this = this;
            playerElement.find(".name").bind('keydown', function (e) {
                e.stopImmediatePropagation();
            }).bind('mousedown', function (e) {
                setCur(e.target);
                e.stopImmediatePropagation();
            }).bind('keyup', function (e) {
                let playerId = $(this.parentNode).data('player');
                _this.config[playerId]['NAME'] = this.value;
            });

            playerElement.find(".keys").bind('mousedown', function (e) {
                setCur(e.target);
                e.stopImmediatePropagation();
            });
        }

        click(e) {

        }

        autodelete() {
            if (this._selectionContainer) {
                this._selectionContainer.remove();
                this._selectionContainer = undefined;
            }
        }

        /**
         * Store config into local storage
         */
        saveConfig() {
            localStorage.setItem(define.KEYBOARD_CONFIG_KEY, JSON.stringify(this.config));
        }
    };

    return lf2;
})(lf2 || {});
