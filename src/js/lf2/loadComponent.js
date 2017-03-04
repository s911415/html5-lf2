'use strict';
(function () {
    const GAME_COMPONENT=[
        'define.js',
        'Utils.js',
        'Rectangle.js',

        'BmpInfo.js',
        'Interaction.js',
        'Body.js',
        'Frame.js',
        'GameObject.js',
        'GameObjectPool.js',

        'LaunchMenu.js',
        'MySettingLevel.js',
        'LoadingLevel.js',

        'MainGame.js',
    ];

    LoadScriptInSequence.call(document.currentScript, GAME_COMPONENT);
})();
