// By Raccoon
// include namespace
'use strict';
var Framework = (function (Framework) {
    Framework.FpsAnalysis = function () {
        //在strict mode底下, 不能使用caller, callee, arguments;
        //FpsAnalysis, user不會用到, 形成沒有意義的防呆
        //if (!(this instanceof arguments.callee))
        //	return new arguments.callee();
        var timeData = new Array(60);
        var fpsData = new Array(60);
        for (var i = 0; i < fpsData.length; i++) {
            timeData[i] = 0;
            fpsData[i] = 0;
        }
        var currentPoint = 1;
        var fps = 0;
        timeData[0] = (new Date()).getTime();
        return {
            update: function () {
                timeData[currentPoint] = (new Date()).getTime();
                fps -= fpsData[currentPoint];
                fpsData[currentPoint] = timeData[currentPoint] - (currentPoint === 0 ? timeData[timeData.length - 1] : timeData[currentPoint - 1]);
                fps += fpsData[currentPoint];
                currentPoint = (++currentPoint) % fpsData.length;
            },
            getUpdateFPS: function () {
                return Math.floor((1000 / (fps / fpsData.length)) * 10) / 10;
            },
            toString: function () {
                return "[FpsAnalysis Object]";
            }
        };
    };
    return Framework;
})(Framework || {});
