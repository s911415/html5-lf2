"use strict";
var lf2 = (function (lf2) {
    /**
     * Itr Effect
     *
     * @class lf2.Effect
     */
    let Effect;
    lf2.Effect = Effect = {
        NORMAL: 0,
        BLADE: 1,
        FIRE: 2,
        ICE: 3,
        PASS_E: 4,
        NONE: 5,
        FIXED_FIRE_0: 20,
        FIXED_FIRE_1: 21,
        FIXED_FIRE_2: 22,
        FIXED_FIRE_3: 23,
        FIXED_ICE: 30,
    };

    let SOUND = {}, soundList = {};
    SOUND[Effect.NORMAL] = ['001.ogg', '006.ogg']; //006
    SOUND[Effect.BLADE] = ['032.ogg', '033.ogg'];
    SOUND[Effect.FIRE] = ['070.ogg', '071.ogg'];
    SOUND[Effect.ICE] = ['065.ogg', '066.ogg'];
    SOUND[Effect.FIXED_FIRE_0] = SOUND[Effect.FIRE];
    SOUND[Effect.FIXED_FIRE_1] = SOUND[Effect.FIRE];
    SOUND[Effect.FIXED_FIRE_2] = SOUND[Effect.FIRE];
    // SOUND[Effect.FIXED_FIRE_3] = SOUND[Effect.FIRE];
    SOUND[Effect.FIXED_ICE] = ['065.ogg'];

    for (let k in SOUND) {
        SOUND[k].forEach(s => {
            const soundPath = define.MUSIC_PATH + s;

            soundList[soundPath] = {ogg: soundPath};
        });
    }

    SOUND.createAudio = () => {
        SOUND.audioInstance = new Framework.Audio(soundList);
    };

    lf2.Effect.sound = SOUND;

    lf2.Effect.sound.play = (effectCode) => {
        const ARR = SOUND[effectCode];
        
        if (ARR) {
            const index = (Math.random() * ARR.length) | 0;
            SOUND.audioInstance.play({
                name: define.MUSIC_PATH + ARR[index]
            });
        }
    };

    // Object.freeze(SOUND);
    Object.freeze(lf2.Effect);

    return lf2;
})(lf2 || {});