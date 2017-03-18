"use strict";
var lf2 = (function (lf2) {
    /**
     * Frame Stage
     *
     * @class lf2.FrameStage
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
    };

    Object.freeze(lf2.FrameStage);

    return lf2;
})(lf2 || {});