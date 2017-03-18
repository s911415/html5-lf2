"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
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

            "_hitSoundUrl _dropSoundUrl _brokenSoundUrl".split(' ').forEach((k)=>{
                this.addPreloadResource(define.MUSIC_PATH + this[k]);
            });

            this._audio = new Framework.Audio({
                hit: {
                    ogg: define.MUSIC_PATH + this._hitSoundUrl,
                },
                drop: {
                    ogg: define.MUSIC_PATH + this._dropSoundUrl,
                },
                broken: {
                    ogg: define.MUSIC_PATH + this._brokenSoundUrl,
                },
            });
        }

        /**
         * Play hit sound
         */
        playHitSound() {
            this._hitSoundUrl && this._audio.play({name: 'hit'});
        }

        /**
         * Play drop sound
         */
        playDropSound() {
            this._dropSoundUrl && this._audio.play({name: 'drop'});
        }

        /**
         * Play borken sound
         */
        playBrokenSound() {
            this._brokenSoundUrl && this._audio.play({name: 'broken'});
        }
    }


    ;


    return lf2;
})(lf2 || {});