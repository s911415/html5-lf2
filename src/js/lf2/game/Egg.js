"use strict";
var lf2 = (function (lf2) {
    const PLAYER = new window.Audio();
    const EGG_PATH = define.MUSIC_PATH + 'egg/';

    let Egg;
    let _axysCount = 0;
    let _axysTimer = -1;
    let playQueue = [];
    let isFirstAxysEgg = true;


    PLAYER.addEventListener('ended', function () {
        if (playQueue.length) Egg._play();
    });

    /**
     * Egg
     *
     * @class lf2.Egg
     */
    lf2.Egg = Egg = {
        EGG_KEYWORD: [
            {key: 'eris', sound: 'ERIS_CHEST_PADDED'},
            {
                key: 'friends',
                sound: () => {
                    if ((lf2.CurrentLevel instanceof lf2.FightLevel)) {
                        const Players = lf2.CurrentLevel.world.config.players;

                        Players.forEach(p => {
                            p.team = 5;
                        });
                    }

                    return Egg['FRIENDS'];
                }
            },
            {
                key: 'axys',
                sound: () => {
                    if (Egg.AXYS_EGG.length === 0) return Egg.ERIS_CHEST_PADDED;
                    clearTimeout(_axysTimer);

                    if ((lf2.CurrentLevel instanceof lf2.FightLevel)) {
                        const Players = lf2.CurrentLevel.world.config.players;

                        let sp = $("#statusPanels");
                        sp.addClass('axys');
                        Players.forEach(player => {
                            player.setGodMode(true);
                        });

                        _axysTimer = setTimeout(() => {
                            sp.removeClass('axys');

                            Players.forEach(player => {
                                player.setGodMode(false);
                            });
                        }, Egg.AXYS_EGG_TIME[_axysCount]);
                    }

                    if (!isFirstAxysEgg && _axysCount === 0) {
                        window.open(atob(Egg._EGG_CONTENT._JOIN_APPLICATION_FORM_URL));
                    }

                    let src = Egg.AXYS_EGG[_axysCount];

                    _axysCount = (_axysCount + 1) % Egg.AXYS_EGG.length;

                    isFirstAxysEgg = false;
                    return src;
                }
            }
        ],
        ERIS_CHEST_PADDED: '',
        FRIENDS: '',

        AXYS_EGG: [],
        AXYS_EGG_TIME: [6463, 2180, 6130, 8470, 8150, 3164],

        AddPlayQueue: (sound) => {
            if (!sound) return;

            playQueue.push(sound);

            Egg._play();
        },

        _play: () => {
            if (!PLAYER.paused && PLAYER.duration) return;
            if (playQueue.length < 1) return;

            let sound = playQueue.shift();
            let s = typeof sound === 'function' ? sound() : Egg[sound];

            if (!s) return;

            PLAYER.pause();
            PLAYER.src = s;
            PLAYER.currentTime = 0;
            PLAYER.play();
        },

        stop: () => {
            PLAYER.pause();
            PLAYER.currentTime = 0;
        },

        ////////////////////////////////////////////////////////////////////////////////////
        _EGG_CONTENT: {
            _JOIN_APPLICATION_FORM_URL: 'aHR0cHM6Ly93ZWItcHJvZ3JhbW1pbmctczE3dS5zOTExNDE1LnRrLyNzaWduLWJvYXJk',
            _ZIP: define.ZIP_PATH + 'egg.zip',
        },
        ////////////////////////////////////////////////////////////////////////////////////
    };

    const ReadZipFromBlob = (blob) => {
        JSZip.loadAsync(blob)
            .then(zip => zip.files)
            .then(fs => {
                //Add to ERIS CHEST PADDED
                {
                    fs['エリスの胸はパッド入り.m4a'].async('blob').then(b => {
                        Egg.ERIS_CHEST_PADDED = URL.createObjectURL(b);
                    });
                }
                //Add to FRIENDS
                {
                    fs['ようこそジャパリパークへ.m4a'].async('blob').then(b => {
                        Egg.FRIENDS = URL.createObjectURL(b);
                    });
                }

                //Add to AXYS_EGG
                {
                    let arr = [];
                    for (let f in fs) {
                        if (fs.hasOwnProperty(f) && f.toString().match(/axys_(.*?)\.m4a/g)) {
                            arr.push(fs[f]);
                        }
                    }

                    arr.sort(String.localeCompare);

                    arr.forEach((file, i) => {
                        file.async('blob').then(b => {
                            Egg.AXYS_EGG[i] = URL.createObjectURL(b);
                        });
                    });
                }

            })
            .catch(err => {
                console.error(err);
                Egg.ERIS_CHEST_PADDED = EGG_PATH + 'エリスの胸はパッド入り.m4a';
                Egg.FRIENDS = EGG_PATH + 'ようこそジャパリパークへ.m4a';

                for (let i = 1; i <= 6; i++) {
                    const name = EGG_PATH + `axys_${i.toString().padStart(2, '0')}.m4a`;
                    Egg.AXYS_EGG.push(name);
                }
            });
    };

    window.addEventListener('load', () => {
        fetch(Egg._EGG_CONTENT._ZIP, {method: 'GET'})
            .then(d => d.blob()).then(ReadZipFromBlob);
    });


    Egg.EGG_KEYWORD.forEach(v => {
        v.key = v.key.toUpperCase().split('').reverse();

        Object.freeze(v);
    });
    Object.freeze(Egg.EGG_KEYWORD);

    return lf2;
})(lf2 || {});