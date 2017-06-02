'use strict';
(function () {
    const GAME_COMPONENT=[
        'game/define.js',

        'enums/Bound.js',
        'enums/Effect.js',
        'enums/FrameStage.js',
        'enums/ItrKind.js',

        'game/Prefetch.js',
        'game/Bezier.js',
        'game/Utils.js',
        'game/KeyboardConfig.js',
        'game/KeyEventPool.js',
        'game/Rectangle.js',
        'game/Cube.js',
        'game/Egg.js',

        'frame/ImageInformation.js',
        'frame/BmpInfo.js',
        'frame/Interaction.js',
        'frame/ObjectPoint.js',
        'frame/Body.js',
        'frame/BloodPoint.js',

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

        'items/behavior/AbstractBehavior.js',
        'items/behavior/CenterTrackerBehavior.js',
        'items/behavior/FasterTrackerBehavior.js',
        'items/behavior/HorizontalTrackerBehavior.js',
        'items/behavior/SpeedUpTrackerBehavior.js',
        'items/behavior/JulianBallBeginBehavior.js',
        'items/behavior/JulianBallTrackerBehavior.js',
        'items/behavior/FirzenDisasterFallDownBeginBehavior.js',
        'items/behavior/FirzenDisasterFallDownBehavior.js',

        'player/Team.js',
        'player/PlayerStatusPanel.js',
        'player/Player.js',

        'game/scenes/WorldScene.js',

        'level/LaunchMenu.js',
        'level/MySettingLevel.js',
        'level/LoadingLevel.js',
        'level/HelpLevel.js',
        'level/SelectionLevel.js',
        'level/FightLevel.js',

        '!MainGame.js',
    ];

    LoadScriptInSequence.call(document.currentScript, GAME_COMPONENT);
})();
