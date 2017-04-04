'use strict';
(function () {
    const GAME_COMPONENT=[
        'game/define.js',
        'game/Utils.js',
        'game/KeyboardConfig.js',
        'game/KeyEventPool.js',
        'game/Rectangle.js',
        'game/Cube.js',
        'game/CollisionSearchTree.js',

        'enums/Bound.js',
        'enums/FrameStage.js',

        'frame/ImageInformation.js',
        'frame/BmpInfo.js',
        'frame/Interaction.js',
        'frame/ObjectPoint.js',
        'frame/Body.js',
        'frame/Frame.js',

        'objects/GameObject.js',
        'objects/GameObjectBall.js',
        'objects/GameObjectWeapon.js',
        'objects/GameObjectCharacter.js',
        'objects/pool/GameObjectPool.js',
        'objects/GameMapLayer.js',
        'objects/GameMap.js',
        'objects/pool/GameMapPool.js',
        'objects/ColorBar.js',

        'items/GameItem.js',
        'items/Character.js',
        'items/Ball.js',
        'items/Weapon.js',

        'player/PlayerStatusPanel.js',
        'player/Player.js',

        'game/scenes/WorldScene.js',

        'level/LaunchMenu.js',
        'level/MySettingLevel.js',
        'level/LoadingLevel.js',
        'level/SelectionLevel.js',
        'level/FightLevel.js',

        '!MainGame.js',
    ];

    LoadScriptInSequence.call(document.currentScript, GAME_COMPONENT);
})();
