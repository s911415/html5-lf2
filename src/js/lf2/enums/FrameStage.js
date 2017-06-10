"use strict";
var lf2 = (function (lf2) {
    /**
     * 定義遊戲內Frame狀態的列舉型別
         0=站立(stand)
         1=行走(walk)
         2=跑步(run)
         3=普通拳腳攻擊(punch)
         4=跳(jump)
         5=突進(dash，即跑+跳)
         7=擋(defend)
         8=破擋(broken defend)
         9=捉人(catching)
         10=被捉(picked caught)
         11=被攻擊(injured)
         12=fall大於60才會被打到
         13=有冰碎效果
         14=倒在地上(lying，可使com不會追你)
         15=被冰封(ice，可被同盟攻擊)
         16=暈眩(tired)可被敵人捉住
         17=喝(weapon drink)可以喝的物件被消耗
         18=燃燒(fire，可攻擊我方同盟)
         19=firen的烈火焚身(burn run)
         301=deep的鬼哭斬(dash sword，此state具有人物上下移動的功能)
         400=woody瞬間轉移(teleport，移往最近的敵人)
         401=woody瞬間轉移(teleport，移往最近的隊友)
         500=rudolf轉換成其他角色(transform)
         501=rudolf轉換回來(transform_b)
         1700=治療自己
         9995=變身成LouisEX(transform，任何人都可以)
         9996=爆出盔甲(transform，任何人都可以)
         9997=訊息(come,move之類，能在任何地方看見)
         9998=訊息刪除
         9999=毀壞的武器(broken weapon)

     * @type {
                {
                    STAND: number,
                    WALK: number,
                    RUN: number,
                    PUNCH: number,
                    JUMP: number,
                    DASH: number,
                    DEFEND: number,
                    BROKEN_DEFEND: number,
                    CATCHING: number,
                    PICKED_CAUGHT: number,
                    INJURED: number,
                    FALL: number,
                    ICE: number,
                    LYING: number,
                    FROZEN: number,
                    TIRED: number,
                    DRINK: number,
                    FIRE: number,
                    BURN_RUN: number,
                    DASH_SWORD: number,
                    CLOSED_BAD_GUY: number,
                    CLOSED_TEAMMATE: number,
                    CURE_SELF: number,
                    DISAPPEAR_WHEN_HIT: number,
                    HIT_TEAMMATE: number,
                    BALL_FLYING: number,
                    BALL_HITTING: number,
                    BALL_CANCELED: number,
                    BALL_REBOUNDING: number,
                    BALL_DISAPPEAR: number,
                    BALL_WIND_FLYING: number,
                    BALL_HIT_HEART: number,
                    WEAPON_IN_THE_SKY: number,
                    WEAPON_ON_HAND: number,
                    WEAPON_THROWING: number,
                    WEAPON_REBOUNDING: number,
                    WEAPON_ON_GROUND: number,
                    DELETE_MESSAGE: number
                }
            }
     */
    lf2.FrameStage = {
        /**
         * Character used start
         */
        STAND: 0,
        WALK: 1,
        RUN: 2,
        PUNCH: 3,
        JUMP: 4,
        DASH: 5,
        DEFEND: 7,
        BROKEN_DEFEND: 8,
        CATCHING: 9,
        PICKED_CAUGHT: 10,
        INJURED: 11,
        FALL: 12,
        ICE: 13,
        LYING: 14,
        FROZEN: 15,
        TIRED: 16,
        DRINK: 17,
        FIRE: 18,
        BURN_RUN: 19,
        DASH_SWORD: 301,
        CLOSED_BAD_GUY: 400,
        CLOSED_TEAMMATE: 401,
        CURE_SELF: 1700,
        /**
         * Character used end
         */


        /**
         * Ball used start
         */
        DISAPPEAR_WHEN_HIT: 15,
        HIT_TEAMMATE: 18,
        BALL_FLYING: 3000,
        BALL_HITTING: 3001,
        BALL_CANCELED: 3002,
        BALL_REBOUNDING: 3003,
        BALL_DISAPPEAR: 3004,
        BALL_WIND_FLYING: 3005,
        BALL_HIT_HEART: 3006,
        /**
         * Ball used end
         */

        /**
         * Weapon used start
         */
        WEAPON_IN_THE_SKY: 1000,
        WEAPON_ON_HAND: 1001,
        WEAPON_THROWING: 1002,
        WEAPON_REBOUNDING: 1003,
        WEAPON_ON_GROUND: 1004,
        DELETE_MESSAGE: 9998,
        /**
         * Weapon used end
         */
    };

    Object.freeze(lf2.FrameStage);

    return lf2;
})(lf2 || {});