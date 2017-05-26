'use strict';
//立即執行函式, 並封裝所有變數避免衝突
(function () {
    const jsArray = [
        //Load jszip
        "jszip.min.js",
        
        //Load framework
        "Framework/AttachableInterface.js",
        "Framework/KeyboardEventInterface.js",
        "Framework/MouseEventInterface.js",

        "Framework/Config.js",
        "Framework/Record.js",
        "Framework/Replay.js",
        // "Framework/EqualCondition.js",
        "Framework/Util.js",
        // "Framework/core.js",
        "Framework/DebugInfo.js",
        // "Framework/FpsAnalysis.js",
        "Framework/Point.js",
        "Framework/Point3D.js",
        "Framework/GameObject.js",
        "Framework/Sprite.js",
        "Framework/AnimationSprite.js",
        "Framework/Scene.js",
        "Framework/ResourceManager.js",
        "Framework/Level.js",
        "Framework/Game.js",
        "Framework/MouseManager.js",
        "Framework/KeyBoardManager.js",
        // "Framework/TouchManager.js",
        // "Framework/GameMainMenu.js",
        "Framework/Audio.js",
        //"Framework/Box2dWeb-2.1.a.3.js",
        //"Framework/Box2D.js",
        //"Framework/circleComponent.js",
        //"Framework/polygonComponent.js",
        //"Framework/squareComponent.js",
        //"Framework/triangleComponent.js",

        //Game Component
        "lf2/!loadComponent.js",
    ];

    LoadScriptInSequence.call(document.currentScript, jsArray);
})();

