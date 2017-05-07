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
        }

        /**
         * Play hit sound
         */
        playHitSound() {
            this._hitSoundUrl && this._audio.play(define.MUSIC_PATH + this._hitSoundUrl);
        }

        /**
         * Play drop sound
         */
        playDropSound() {
            this._dropSoundUrl && this._audio.play(define.MUSIC_PATH + this._dropSoundUrl);
        }

        /**
         * Play borken sound
         */
        playBrokenSound() {
            this._brokenSoundUrl && this._audio.play(define.MUSIC_PATH + this._brokenSoundUrl);
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
                if (this[k]) {
                    soundSet.add(define.MUSIC_PATH + this[k]);
                }
            });

            return soundSet;
        }
    }


    ;


    return lf2;
})(lf2 || {});