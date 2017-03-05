'use strict';
(function () {
    const GAME_COMPONENT=[
        'define.js',
        'Utils.js',
        'Rectangle.js',
        'ImageInformation.js',
        'KeyboardConfig.js',

        'BmpInfo.js',
        'Interaction.js',
        'Body.js',
        'Frame.js',
        'GameObject.js',
        'GameObjectPool.js',
        'GameItem.js',
        'Character.js',
        'Ball.js',

        'LaunchMenu.js',
        'MySettingLevel.js',
        'LoadingLevel.js',

        'MainGame.js',
    ];

    LoadScriptInSequence.call(document.currentScript, GAME_COMPONENT);
})();
