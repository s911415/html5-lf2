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

    let SOUND = {};
    SOUND[Effect.NORMAL] = ['001.m4a', '006.m4a']; //006
    SOUND[Effect.BLADE] = ['032.m4a', '033.m4a'];
    SOUND[Effect.FIRE] = ['070.m4a', '071.m4a'];
    SOUND[Effect.ICE] = ['065.m4a', '066.m4a'];
    SOUND[Effect.FIXED_FIRE_0] = SOUND[Effect.FIRE];
    SOUND[Effect.FIXED_FIRE_1] = SOUND[Effect.FIRE];
    SOUND[Effect.FIXED_FIRE_2] = SOUND[Effect.FIRE];
    // SOUND[Effect.FIXED_FIRE_3] = SOUND[Effect.FIRE];
    SOUND[Effect.FIXED_ICE] = ['065.m4a'];

    let allSound = new Set();
    for (let k in SOUND) {
        if (!(SOUND[k] instanceof Array)) continue;

        SOUND[k].forEach(k => {
            allSound.add(define.MUSIC_PATH + k);
        });
    }

    lf2.Effect.sound = SOUND;
    Object.freeze(allSound);
    lf2.Effect.allSound = allSound;

    /**
     * Get Sound Path by effect code
     * @param {Number} effectCode effect code
     * @param {Number} [fall] fall
     * @returns {String|undefined} return path if effect found
     */
    lf2.Effect.sound.getSoundPath = (effectCode, fall) => {
        const ARR = SOUND[effectCode];

        if (ARR) {
            const index = fall && ARR.length > 1 ? 1 : 0;
            return (define.MUSIC_PATH + ARR[index]);
        }

        return undefined;
    };

    // Object.freeze(SOUND);
    Object.freeze(lf2.Effect);

    return lf2;
})(lf2 || {});