'use strict';
(function () {
    const GAME_COMPONENT=[
        'define.js',
        'LaunchMenu.js',
        'MySettingLevel.js',

        'MainGame.js',
    ];

    LoadScriptInSequence.call(document.currentScript, GAME_COMPONENT);
})();
