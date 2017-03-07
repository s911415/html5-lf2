"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    /**
     * Ball
     *
     * @type {GameObjectBall}
     * @class lf2.GameObjectBall
     * @extends lf2.GameObject
     */
    lf2.GameObjectBall = class GameObjectBall extends GameObject {

        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(fileInfo, context) {
            super(fileInfo, context);
            const headerData = this.bmpInfo._data;

            this.hitSoundUrl = define.MUSIC_PATH + headerData.get("weapon_hit_sound");
            this.dropSoundUrl = define.MUSIC_PATH + headerData.get("weapon_drop_sound");
            this.brokenSoundUrl = define.MUSIC_PATH + headerData.get("weapon_broken_sound");

            "hitSoundUrl dropSoundUrl brokenSoundUrl".split(' ').forEach((k)=>{
                this.addPreloadResource(this[k]);
            });
        }


    };


    return lf2;
})(lf2 || {});