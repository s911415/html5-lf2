//立即執行函式, 並封裝所有變數避免衝突
var _isTestMode = false;
var _isRecordMode = true;
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
            }
            else if (eval("typeof " + jsConf[0].lookFor) !== 'undefined') {
                if (jsConf[0].lookFor === 'loadFrameworkEnd') {
                    Framework.Game._isRecordMode = true;
                    Framework.Game._isTestMode = false;
                }
                clearInterval(interval);
                callback();
            }
        }, 50);
    };

    importJS(listScript);

})();


    
