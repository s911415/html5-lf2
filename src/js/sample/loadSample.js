'use strict';
//立即執行函式, 並封裝所有變數避免衝突
(function () {
    const GAME_COMPONENT=[
        "define.js",
        "myMenu.js",
        "character.js",
        "Practice.js",
        "Fighter.js",
        "GameMap.js",
        "myGameLevel1.js",
        "mainGame.js",
    ];

    LoadScriptInSequence.call(document.currentScript, GAME_COMPONENT);
})();
