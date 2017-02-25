let _isTestMode = false;
let _isRecordMode = false;
//立即執行函式, 並封裝所有變數避免衝突
(function () {
    const jsArray = [
        //Load framework
        "js/Framework/Config.js",
        "js/Framework/Record.js",
        "js/Framework/Replay.js",
        "js/Framework/EqualCondition.js",
        "js/Framework/Util.js",
        "js/Framework/core.js",
        "js/Framework/DebugInfo.js",
        "js/Framework/FpsAnalysis.js",
        "js/Framework/Point.js",
        "js/Framework/GameObject.js",
        "js/Framework/Sprite.js",
        "js/Framework/AnimationSprite.js",
        "js/Framework/Scene.js",
        "js/Framework/ResourceManager.js",
        "js/Framework/Level.js",
        "js/Framework/Game.js",
        "js/Framework/MouseManager.js",
        "js/Framework/KeyBoardManager.js",
        "js/Framework/TouchManager.js",
        "js/Framework/GameMainMenu.js",
        "js/Framework/Audio.js",
        "js/Framework/Box2dWeb-2.1.a.3.js",
        "js/Framework/Box2D.js",
        "js/Framework/circleComponent.js",
        "js/Framework/polygonComponent.js",
        "js/Framework/squareComponent.js",
        "js/Framework/triangleComponent.js",

        //Game Component
        "js/sample/define.js",
        "js/sample/myMenu.js",
        "js/sample/character.js",
        "js/sample/myGameLevel1.js",
        "js/sample/mainGame.js",
    ];

    LoadScriptInSequence(jsArray);
})();

