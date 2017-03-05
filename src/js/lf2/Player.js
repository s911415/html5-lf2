"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const GameObject = lf2.GameObject;
    const GameItem = lf2.GameItem;
    const GameObjectPool = lf2.GameObjectPool;
    /**
     * Player
     *
     * @class lf2.Player
     */
    lf2.Player = class extends GameItem {
        constructor(playerId) {
            this.playerId = playerId;
        }

    };


    return lf2;
})(lf2 || {});