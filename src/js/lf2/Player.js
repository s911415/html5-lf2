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
            console.log('create player', playerId, charId);

            this.playerId = playerId;
            this.charId = charId;

            this.keyboardConfig = new KeyboardConfig(playerId);
            this.character = new Character(charId);
        }

    };


    return lf2;
})(lf2 || {});