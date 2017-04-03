"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    /**
     * Ball
     *
     * @type {GameObjectWeapon}
     * @class lf2.GameObjectWeapon
     * @extends lf2.GameObjectBall
     */
    lf2.GameObjectWeapon = class GameObjectWeapon extends lf2.GameObjectBall {

        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(fileInfo, context) {
            super(fileInfo, context);
            const headerData = this.bmpInfo._data;

            this.hp = intval(headerData.get("weapon_hp"));
            this.hurt = intval(headerData.get("weapon_hp"));
        }

    }


    ;


    return lf2;
})(lf2 || {});