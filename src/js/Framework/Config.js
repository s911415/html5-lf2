// By Raccoon
// include namespace

'use strict';
var Framework = (function (Framework) {

    /**
     *
     * @constructor
     */
    Framework.Config = function () {
        this.fps = 60;
        this.canvasWidth = 794;
        this.canvasHeight = 500;
//		this.canvasWidth =  640;
//		this.canvasHeight = 480;
        this.isBackwardCompatiable = false;
        this.isOptimize = false;  // 2017.02.20, from V3.1.1
        this.isMouseMoveRecorded = false;
    };
    return Framework;
})(Framework || {});
