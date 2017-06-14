"use strict";
var lf2 = (function (lf2) {
    const CHEAT_KEYWORD = "lf2.net".toUpperCase().split('').reverse();
    const FightLevel = lf2.FightLevel;

    class Game {

        /** Default constructor. */
        constructor() {
            Framework.Game.addNewLevel({menu: new lf2.LaunchMenu()});
            Framework.Game.addNewLevel({control: new lf2.MySettingLevel()});
            Framework.Game.addNewLevel({loading: new lf2.LoadingLevel()});
            Framework.Game.addNewLevel({selection: new lf2.SelectionLevel()});
            Framework.Game.addNewLevel({help: new lf2.HelpLevel()});
            Framework.Game.addNewLevel({fight: new FightLevel()});

            this._cheatStatus = false;
            this.bgmStatus = !define.DEBUG;
            this._keyPool = new lf2.KeyEventPool(CHEAT_KEYWORD.length);
            this.bgmParam = {
                name: 'bgm',
                loop: true,
                stopPrevious: true
            };
            Object.defineProperty(this.bgmParam, 'volume', {
                configurable: false,
                enumerable: true,
                get: () => {
                    return this.bgmStatus ? define.BGM_VOLUME : 0
                }
            });

            window.addEventListener('keydown', (e) => {
                this._keyPool.push(e.key.toUpperCase());

                switch (e.key) {
                    case 'F10':
                        this.bgmStatus = !this.bgmStatus;
                        this.playBgm();
                        break;
                }
            });

            this.addCheatHandle();
            this.addEggHandle();
        }

        /**
         * Starts this object.
         *
         * @return  .
         */
        start() {
            Framework.Game.start();

            if (define.DEBUG) {
                document.documentElement.classList.add('mode-debug');
            } else {
                document.documentElement.classList.add('mode-product');
            }
        }

        /**
         * Key in sequence.
         *
         * @param   asciiArrayReversed  The ASCII array reversed.
         *
         * @return  .
         */
        keyInSequence(asciiArrayReversed) {
            return !asciiArrayReversed.some((e, i) => e !== this._keyPool[i]);
        }

        /**
         * Adds cheat handle.
         *
         * @return  .
         */
        addCheatHandle() {
            const keyDetection = () => {
                if (lf2.CurrentLevel instanceof FightLevel) return;
                if (this._cheatStatus) return;

                let pass = this.keyInSequence(CHEAT_KEYWORD);

                if (pass) {
                    this._cheatStatus = true;

                    if (define.DEBUG) {
                        console.log('Cheat on');
                    }
                }
            };

            window.addEventListener('keydown', keyDetection);
        }

        /**
         * Adds egg handle.
         *
         * @return  .
         */
        addEggHandle() {
            const keyDetection = () => {
                for (let i = 0, e = lf2.Egg.EGG_KEYWORD, j = e.length; i < j; i++) {
                    const V = e[i];

                    if (V.hasOwnProperty('key') && V.hasOwnProperty('sound')) {
                        if (this.keyInSequence(V.key)) {
                            lf2.Egg.AddPlayQueue(V.sound);
                            break;
                        }
                    }

                }
            };

            window.addEventListener('keydown', keyDetection);
        }

        /**
         * Play bgm.
         *
         * @return  .
         */
        playBgm() {
            this.bgmAudio = this.bgmAudio || new Framework.Audio({
                    bgm: define.BGM_PATH + 'main.m4a',
                });
            
            this.bgmAudio
                .done()
                .then(() => {
                    this.bgmAudio.play('bgm', this.bgmParam);
                });
        }

        /**
         * Gets the cheat status.
         *
         * @return  {boolean}   A get.
         */
        get cheat() {
            return this._cheatStatus;
        }
    }

    lf2['!MainGame'] = new Game();
    lf2['!MainGame'].start();


    return lf2;
})(lf2 || {});