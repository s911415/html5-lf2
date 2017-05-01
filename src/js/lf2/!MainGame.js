//當有要加關卡時, 可以使用addNewLevel
//第一個被加進來的Level就是啟動點, 所以一開始遊戲就進入MyMenu
'use strict';
"use strict";
var lf2 = (function (lf2) {
    const CHEAT_KEYWORD = "lf2.net".toUpperCase().split('').reverse();
    const FightLevel = lf2.FightLevel;

    class Game {
        constructor() {
            Framework.Game.addNewLevel({menu: new lf2.LaunchMenu()});
            Framework.Game.addNewLevel({control: new lf2.MySettingLevel()});
            Framework.Game.addNewLevel({loading: new lf2.LoadingLevel()});
            Framework.Game.addNewLevel({selection: new lf2.SelectionLevel()});
            Framework.Game.addNewLevel({fight: new FightLevel()});

            this._cheatStatus = false;
            this.bgmStatus = !define.DEBUG;
            this._keyPool = new lf2.KeyEventPool(CHEAT_KEYWORD.length);
            this.bgmParam = {
                name: 'bgm',
                loop: true,
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
                        Framework.Audio.play(this.bgmParam);
                        break;
                }
            });

            this.addCheatHandle();
            this.addEggHandle();
        }

        start() {
            Framework.Game.start();
        }

        keyInSequence(asciiArrayReversed) {
            return !asciiArrayReversed.some((e, i) => e !== this._keyPool[i]);
        }

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

        get cheat() {
            return this._cheatStatus;
        }
    }

    lf2['!MainGame'] = new Game();
    lf2['!MainGame'].start();


    return lf2;
})(lf2 || {});