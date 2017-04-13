"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const SOUND_KEY = "_hitSoundUrl _dropSoundUrl _brokenSoundUrl".split(' ');
    /**
     * Ball
     *
     * @type {GameObjectBall}
     * @class lf2.GameObjectBall
     * @extends lf2.GameObject
     */
    lf2.GameObjectBall = class GameObjectBall extends lf2.GameObject {

        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(fileInfo, context) {
            super(fileInfo, context);
            const headerData = this.bmpInfo._data;

            this._hitSoundUrl = headerData.get("weapon_hit_sound");
            this._dropSoundUrl = headerData.get("weapon_drop_sound");
            this._brokenSoundUrl = headerData.get("weapon_broken_sound");

            this._audioArgs = {};

            SOUND_KEY.forEach((k) => {
                const URL = this[k];
                if (URL) this._audioArgs[URL] = {ogg: define.MUSIC_PATH + URL};
            });

            Object.freeze(this._audioArgs);

            this._audio = new Framework.Audio(this._audioArgs);

        }

        /**
         * Play hit sound
         */
        playHitSound() {
            this._hitSoundUrl && this._audio.play({name: this._hitSoundUrl});
        }

        /**
         * Play drop sound
         */
        playDropSound() {
            this._dropSoundUrl && this._audio.play({name: this._dropSoundUrl});
        }

        /**
         * Play borken sound
         */
        playBrokenSound() {
            this._brokenSoundUrl && this._audio.play({name: this._brokenSoundUrl});
        }

        /**
         * getSoundList()
         *
         * Gets sound list.
         *
         * @return  The sound list.
         */
        getSoundList() {
            let soundSet = super.getSoundList();
            SOUND_KEY.forEach((k) => {
                if (this[k]) soundSet.add(this._hitSoundUrl);
            });

            return soundSet;
        }
    }


    ;


    return lf2;
})(lf2 || {});