"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardManager = Framework.KeyBoardManager;
    const _SETTING_CONTAINER_ID = "__setting_container";
    const CUR = "cur";

    const setCur = (ele) => {
        $(`.${CUR}`).removeClass(CUR);
        if (ele) {
            ele.classList.add(CUR);
        }
    };
    const DISALLOW_KEY = [
        'Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ];
    for (let i = 0; i < DISALLOW_KEY.length; i++) DISALLOW_KEY[i] = KeyBoardManager.getKeyCodeByString(DISALLOW_KEY[i]);
    DISALLOW_KEY.sort((a, b) => a - b);

    /**
     * @class lf2.MySettingLevel
     * @extends Framework.Level
     * @implements Framework.MouseEventInterface
     * @implements Framework.KeyboardEventInterface
     */
    lf2.MySettingLevel = class extends Framework.Level {
        constructor() {
            super();
        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load() {
            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            //播放時, 需要給name, 其餘參數可參考W3C
            this.audio = new Framework.Audio({
                ok: define.MUSIC_PATH + 'm_ok.m4a',
                cancel: define.MUSIC_PATH + 'm_cancel.m4a',
            });

            this.config = JSON.parse(localStorage.getItem(define.KEYBOARD_CONFIG_KEY))
                || JSON.parse(JSON.stringify(lf2.KeyboardConfig.DEFAULT_CONFIG)); //Avoid lock

            this.html = '';
            this.players = [];
            this._attached = false;
            this._settingContainer = undefined;
            //Load Setting view
            ResourceManager.loadResource(define.DATA_PATH + 'SettingScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
                this.showSettingMenu();
            });
        }

        /**
         * Gets configuration by player identifier.
         *
         * @param   playerId    Identifier for the player.
         *
         * @return  The configuration by player identifier.
         */
        getConfigByPlayerId(playerId) {
            let conf = this.config[playerId];
            if (!conf) {
                conf = this.config[playerId] = {};
            }
            return conf;
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

            const KEY_CLASS = lf2.KeyboardConfig.prototype.KEY_MAP.KEY_LIST;
            //refresh key
            for (let i = 0; i < define.PLAYER_COUNT; i++) {
                const p = this.players[i], c = this.getConfigByPlayerId(i);
                if (c === undefined) continue;

                KEY_CLASS.forEach((k) => {
                    //Convert Keycode to readable text
                    p.find(".keys." + k).text(KeyBoardManager.mappingTable()[c[k]]);
                });

                p.find('.name').val(c['NAME']);
            }
        }

        /**
         * keydown(e, list, oriE)
         *
         * Keydowns.
         *
         * @param   e       The unknown to process.
         * @param   list    The list.
         * @param   oriE    The ori e.
         *
         * @return  .
         */
        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);
            console.log(oriE.keyCode);
            let curElement = $(".cur");
            let playerId = curElement.parent().data('player');

            if (curElement.length > 0) {
                const ce = curElement[0];
                if (ce.classList.contains('keys')) {
                    let key = curElement.data('key');
                    if (DISALLOW_KEY.binarySearch(oriE.keyCode) !== -1) {
                        this.getConfigByPlayerId(playerId)[key] = undefined;
                    } else {
                        this.getConfigByPlayerId(playerId)[key] = oriE.keyCode;
                    }
                    setCur(null);
                }
            }

            this.forceDraw();

        }

        /**
         * showSettingMenu()
         *
         * Shows the setting menu.
         *
         * @return  .
         */
        showSettingMenu() {
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._settingContainer) {
                $("#" + _SETTING_CONTAINER_ID).remove();

                this._settingContainer = $(this.html);
                this._settingContainer.attr("id", _SETTING_CONTAINER_ID);

                this._settingContainer.bind('mousedown', function (e) {
                    setCur(null);
                });

                this._settingContainer.find(".btn_ok").click((e) => {
                    this.audio.play('ok');
                    this.saveConfig();
                    Game.popLevelHistory();
                    // Game.goToLevel('menu');
                });

                this._settingContainer.find(".btn_cancel").click((e) => {
                    this.audio.play('cancel');
                    Game.popLevelHistory();
                    // Game.goToLevel('menu');
                });
                this.forceDraw();

                let playerElement = this._settingContainer.find(".player:first");
                let playerContainer = this._settingContainer.find(".players");

                for (let i = 0; i < define.PLAYER_COUNT; i++) {
                    this.players[i] = playerElement.clone();
                    this.players[i].attr('data-player', i);
                    this.bindPlayerEvent(this.players[i]);
                    playerContainer.append(this.players[i]);
                }

                playerElement.remove();
                $("body").append(this._settingContainer);
                this._attached = true;
                Game.resizeEvent();
            }
        }

        /**
         * bindPlayerEvent(playerElement)
         *
         * Bind player event.
         *
         * @param   playerElement   The player element.
         *
         * @return  .
         */
        bindPlayerEvent(playerElement) {
            const _this = this;
            playerElement.find(".name").bind('keydown', function (e) {
                e.stopImmediatePropagation();
            }).bind('mousedown', function (e) {
                setCur(e.target);
                e.stopImmediatePropagation();
            }).bind('keyup', function (e) {
                let playerId = $(this.parentNode).data('player');
                _this.getConfigByPlayerId(playerId)['NAME'] = this.value;
            });

            playerElement.find(".keys").bind('mousedown', function (e) {
                setCur(e.target);
                e.stopImmediatePropagation();
            });
        }

        /**
         * click(e)
         *
         * Clicks the given e.
         *
         * @param   e   The unknown to process.
         *
         * @return  .
         */
        click(e) {

        }

        /**
         * autodelete()
         *
         * Autodeletes this object.
         *
         * @return  .
         */
        autodelete() {
            if (this._settingContainer) {
                this._settingContainer.remove();
                this._settingContainer = undefined;
            }
        }

        /**
         * Store config into local storage
         */
        saveConfig() {
            localStorage.setItem(define.KEYBOARD_CONFIG_KEY, JSON.stringify(this.config));
            lf2.KeyboardConfig.clearConfigCache();
        }
    };

    return lf2;
})(lf2 || {});
