'use strict';
var Framework = (function (Framework) {
    Framework.TouchManager = (function () {
        var TouchManagerClass = {},
            TouchManagerInstance = {},
            userTouchstartEvent = function () {
            },
            userTouchendEvent = function () {
            },
            userTouchcancelEvent = function () {
            },
            userTouchleaveEvent = function () {
            },
            userTouchmoveEvent = function () {
            },
            _subject;

        var setSubject = function (subject) {
            _subject = subject;
        };

        var setUserTouchstartEvent = function (userEvent) {
            userTouchstartEvent = userEvent;
        };

        var setUserTouchendEvent = function (userEvent) {
            userTouchendEvent = userEvent;
        };

        var setUserTouchcancelEvent = function (userEvent) {
            userTouchcancelEvent = userEvent;
        };

        var setUserTouchleaveEvent = function (userEvent) {
            userTouchleaveEvent = userEvent;
        };

        var setUserTouchmoveEvent = function (userEvent) {
            userTouchmoveEvent = userEvent;
        };

        var countCanvasOffset = function (e) {
            var touches = e.changedTouches, pos = {}, totalOffsetX = 0, totalOffsetY = 0, ele = Framework.Game._canvas, i = 0, newE = {};

            do {
                totalOffsetX += ele.offsetLeft;
                totalOffsetY += ele.offsetTop;
                ele = ele.offsetParent;
            } while (ele);

            for (i = 0; i < touches.length; i++) {
                newE[i] = {};
                newE[i].x = Math.floor((touches[i].pageX - totalOffsetX) / Framework.Game._widthRatio);
                newE[i].y = Math.floor((touches[i].pageY - totalOffsetY) / Framework.Game._heightRatio);
            }
            /*pos.x = Math.floor((pos.x - totalOffsetX) / Framework.Game._widthRatio);
             pos.y = Math.floor((pos.y - totalOffsetY) / Framework.Game._heightRatio);*/

            return newE;
        };

        var touchstartEvent = function (e) {
            e.preventDefault();
            var newE = countCanvasOffset(e);
            userTouchstartEvent.call(_subject, newE, e);
        };

        var touchendEvent = function (e) {
            e.preventDefault();
            var newE = countCanvasOffset(e);
            userTouchendEvent.call(_subject, newE, e);
        };

        var touchcancelEvent = function (e) {
            e.preventDefault();
            var newE = countCanvasOffset(e);
            userTouchcancelEvent.call(_subject, newE, e);
        };

        var touchleaveEvent = function (e) {
            e.preventDefault();
            var newE = countCanvasOffset(e);
            userTouchleaveEvent.call(_subject, newE, e);
        };

        var touchmoveEvent = function (e) {
            e.preventDefault();
            var newE = countCanvasOffset(e);
            userTouchmoveEvent.call(_subject, newE, e);
        };


        /**
         * 管理KeyBoard所有的事件, 一般來說, 不會在此處處理相關邏輯
         * 而會在Level進行設定, 請參照
         * {{#crossLink "Level/keydown:event"}}{{/crossLink}},
         * {{#crossLink "Level/keyup:event"}}{{/crossLink}},
         *
         * @class TouchManager
         */
        TouchManagerClass = function () {
            Framework.Game._canvas.addEventListener('touchstart', touchstartEvent, false);
            Framework.Game._canvas.addEventListener('touchend', touchendEvent, false);
            //Framework.Game._canvas.addEventListener('touchcancel', touchcancelEvent, false);
            //Framework.Game._canvas.addEventListener('touchleave', touchleaveEvent, false);
            Framework.Game._canvas.addEventListener('touchmove', touchmoveEvent, false);
        };


        TouchManagerClass.prototype = {
            setSubject: setSubject,
            setTouchstartEvent: setUserTouchstartEvent,
            setTouchendEvent: setUserTouchendEvent,
            //setTouchcancelEvent: setUserTouchcancelEvent,
            //setTouchleaveEvent: setUserTouchleaveEvent,
            setTouchmoveEvent: setUserTouchmoveEvent
        };

        TouchManagerInstance = new TouchManagerClass();
        return TouchManagerInstance;
    })();
    return Framework;
})(Framework || {});