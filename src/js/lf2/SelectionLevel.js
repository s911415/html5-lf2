"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardManager = Framework.KeyBoardManager;
    const KeyboardConfig = lf2.KeyboardConfig;
    const GameObjectPool = lf2.GameObjectPool;
    const _SELECTION_CONTAINER_ID = "__selection_container";
    const Player = lf2.Player;
    const SELECTION_STAGE = {
        WAIT_JOIN: 0,
        SELECT_CHARACTER: 1,
    };

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
            this.playersEle = [];

            for(let playerId = 0; playerId<define.PLAYER_COUNT;playerId++) {
                this.players[playerId] = new Player(playerId);
                this.players[playerId]._selectStage = SELECTION_STAGE.WAIT_JOIN;
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
            console.log('selection draw');

        }

        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);

            this.players.forEach((player) => {
                player.keydown(e, list, oriE);

                if(player.isKeyPressed(KeyboardConfig.KEY_MAP.ATTACK)){
                    console.log(`Player: ${player.playerId}, Attack pressed`);
                }
            });

            this.forceDraw();
        }

        keyup(e, list, oriE) {
            super.keyup(e, list, oriE);

            this.players.forEach((player) => {
                player.keyup(e, list, oriE);
            });

            //this.forceDraw();
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
                    this.playersEle[i] = playerElement.clone();
                    this.playersEle[i].attr('data-player', i);
                    playerContainer.append(this.playersEle[i]);
                }

                let coverStyle = "";
                GameObjectPool.forEach(obj => {
                    if (obj instanceof lf2.GameObjectCharacter) {
                        coverStyle += `.player[data-char="${obj.id}"] .player-cover{background-image: url(${obj.head.src});}\n`;
                        coverStyle += `.player[data-char="${obj.id}"] .fighter-name:before{content: "${obj.name}";}\n`;
                    }
                });

                coverStyle = '<style type="text/css">' + coverStyle + '</style>';
                this._selectionContainer.append(coverStyle);

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
