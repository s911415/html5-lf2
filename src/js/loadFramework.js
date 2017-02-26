//立即執行函式, 並封裝所有變數避免衝突
var loadFrameworkEnd;
(function () {
    //動態依序載入JS
    //ref: http://blog.darkthread.net/blogs/darkthreadtw/archive/2009/01/15/4061.aspx
    var importJS = function (jsConf, src, lookFor) {
        var headID = document.getElementsByTagName("head")[0];
        var newJs = document.createElement('script');
        newJs.type = 'text/javascript';
        newJs.src = jsConf[0].src;
        headID.appendChild(newJs);
        wait_for_script_load(jsConf, function () {
            jsConf.splice(0, 1);
            if (jsConf.length > 0) {
                importJS(jsConf, lookFor);
            } else {
                loadFrameworkEnd = true;
            }
        });
    };

    var wait_for_script_load = function (jsConf, callback) {
        var interval = setInterval(function () {
            if (typeof jsConf[0].lookFor === 'undefined') {
                jsConf[0].lookFor = '';
            }

            if (jsConf[0].lookFor === '') {
                clearInterval(interval);
                callback();
            } else if (eval("typeof " + jsConf[0].lookFor) !== 'undefined') {
                clearInterval(interval);
                callback();
            }
        }, 50);
    };

    //陣列和載入JS檔的順序相同, lookFor為在要載入的檔案中, 
    //有用到的全域變數, importJS這個function, 會在找到lookFor的變數後
    //才會繼續loading下一個檔案, 如果沒有需要lookFor, 則以空字串代表
    var frameworklistScript =
        [
            {src: '../../src/config.js'},
            {src: '../../src/Record.js'},
            {src: '../../src/Replay.js'},
            {src: '../../src/EqualCondition.js'},
            {src: '../../src/Util.js'},
            {src: '../../src/core.js'},
            {src: '../../src/DebugInfo.js'},
            {src: '../../src/FpsAnalysis.js'},
            {src: '../../src/Point.js'},
            {src: '../../src/GameObject.js'},
            {src: '../../src/Sprite.js'},
            {src: '../../src/animationSprite.js'},
            {src: '../../src/Scene.js'},
            {src: '../../src/ResourceManager.js'},
            {src: '../../src/level.js'},
            {src: '../../src/Game.js'},
            {src: '../../src/MouseManager.js'},
            {src: '../../src/KeyBoardManager.js'},
            {src: '../../src/TouchManager.js'},
            {src: '../../src/gameMainMenu.js'},
            {src: '../../src/Audio.js'},
            {src: '../../src/Box2dWeb-2.1.a.3.js'},
            {src: '../../src/Box2D.js'},
            {src: '../../src/circleComponent.js'},
            {src: '../../src/polygonComponent.js'},
            {src: '../../src/squareComponent.js'},
            {src: '../../src/triangleComponent.js'},
            //{ src: 'game_sample/js/loadGame.js'},
        ];
    importJS(frameworklistScript);

})();


    
