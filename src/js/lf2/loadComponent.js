'use strict';
(function () {
    const GAME_COMPONENT=[
        'define.js',
        'Utils.js',

        'BmpInfo.js',
        'GameObject.js',
        'GameObjectPool.js',

        'LaunchMenu.js',
        'MySettingLevel.js',
        'LoadingLevel.js',

        'MainGame.js',
    ];

    LoadScriptInSequence.call(document.currentScript, GAME_COMPONENT);
})();
