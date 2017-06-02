"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardManager = Framework.KeyBoardManager;
    const Prefetch = lf2.Prefetch;
    const _HELP_CONTAINER_ID = "__help_container";
       

    class SimpleCharInfo {
        constructor(fInfo) {
            this.id = fInfo.id;
            lf2.LoadingLevel.prototype.Instance
                .loadDataResource(fInfo.file)
                .then(txt => {
                    const arr = txt.lines();
                    let finishCount = 0;
                    const MAX_J = 2;
                    for (let i = 0; i < arr.length && finishCount < MAX_J; i++) {
                        let txt = arr[i].trim();

                        if (txt.startsWith('name:')) {
                            this.name = txt.substr(5).trim();
                            finishCount++;
                        } else if (txt.startsWith('head:')) {
                            this.headPath = txt.substr(5).trim();
                            finishCount++;
                        }
                    }

                    if (finishCount < MAX_J) {
                        throw "Parser Error";
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.name = "???";
                    this.headPath = "sprite/template1/face.png";
                });
        }
    }

    /**
     * @class lf2.HelpLevel
     * @extends Framework.Level
     * @implements Framework.MouseEventInterface
     * @implements Framework.KeyboardEventInterface
     */
    lf2.HelpLevel = class extends Framework.Level {
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

            this.html = '';
            this._attached = false;
            this._helpContainer = undefined;

            //Load data list
            Promise.all([
                Prefetch.get('DATA_LIST'),
                ResourceManager.loadResource(define.DATA_PATH + 'HelpScreen.html', {method: "GET"})
                    .then(d => d.text())
            ]).then((dList) => {
                this.simInfo = dList[0].object.filter(c => c.type === 0).map(x => new SimpleCharInfo(x));

                this.html = dList[1];
                this._showHelp();
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
        }


        /**
         * _showHelp()
         *
         * Shows the setting menu.
         *
         * @return  .
         */
        _showHelp() {
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._helpContainer && this.simInfo.every(x => x.name !== undefined)) {
                $("#" + _HELP_CONTAINER_ID).remove();

                this._helpContainer = $(this.html);
                this._helpContainer.attr("id", _HELP_CONTAINER_ID);
                console.log(JSON.stringify(this.simInfo));

                $("body").append(this._helpContainer);
                this._attached = true;
                Game.resizeEvent();
            }
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
            if (this._helpContainer) {
                this._helpContainer.remove();
                this._helpContainer = undefined;
            }
        }

    };

    return lf2;
})(lf2 || {});
