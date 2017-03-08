"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    const KeyboardConfig = lf2.KeyboardConfig;
    const Character = lf2.Character;
    const DEFAULT_HP = 500;
    const DEFAULT_MP = 500;
    /**
     * Player
     *
     * @class lf2.Player
     */
    lf2.Player = class Player{
        /**
         *
         * @param {Number} playerId
         * @param {Number} charId
         */
        constructor(playerId, charId) {
            console.log('Create player', playerId, charId);

            this.playerId = playerId;
            this.charId = charId;

            this.keyboardConfig = new KeyboardConfig(playerId);

            /**
             *
             * @type {lf2.Character}
             */
            this.character = new Character(charId);
            this.character.belongTo = playerId;

            this.hp = DEFAULT_HP;
            this.mp = DEFAULT_MP;
        }

    };


    return lf2;
})(lf2 || {});