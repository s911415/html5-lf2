"use strict";
var lf2 = (function (lf2) {
    let ItrKind;
    /**
     * Itr Kind
     * 定義遊戲內攻擊型態的列舉型別，詳情請參閱原始碼
     *
     * @class lf2.ItrKind
     * @type {{NORMAL_HIT: number, CATCH: number, PICK_WEAPON: number, CATCH_BDY: number, FALLING: number, WEAPON_STRENGTH: number, SUPER_PUNCH: number, PICK_WEAPON_2: number, HEAL_BALL: number, REFLECTIVE_SHIELD: number, SONATA_OF_DEATH_1: number, SONATA_OF_DEATH_2: number, THREE_D_OBJECTS: number, WHIRLWIND_WIND: number, WHIRLWIND_ICE: number}}
     */
    lf2.ItrKind = ItrKind = {
        NORMAL_HIT: 0,
        CATCH: 1,
        PICK_WEAPON: 2,
        CATCH_BDY: 3,
        FALLING: 4,
        WEAPON_STRENGTH: 5,
        SUPER_PUNCH: 6,
        PICK_WEAPON_2: 7,
        HEAL_BALL: 8,
        REFLECTIVE_SHIELD: 9,
        SONATA_OF_DEATH_1: 10,
        SONATA_OF_DEATH_2: 11,
        THREE_D_OBJECTS: 14,
        WHIRLWIND_WIND: 15,
        WHIRLWIND_ICE: 16,
    };
    ItrKind.ITR_ALLOW_FALL = [
        ItrKind.NORMAL_HIT, ItrKind.HEAL_BALL, ItrKind.REFLECTIVE_SHIELD, ItrKind.SONATA_OF_DEATH_1,
        ItrKind.SONATA_OF_DEATH_2,
    ];
    ItrKind.ITR_ALLOW_FALL.sort((a, b) => a - b);

    Object.freeze(ItrKind.ITR_ALLOW_FALL);
    Object.freeze(lf2.ItrKind);

    return lf2;
})(lf2 || {});