'use strict';
var Framework = (function (Framework) {
    (function () {
        var
            MouseManagerInstance = {},
            userClickEvent = function () {
            },
            userMousedownEvent = function () {
            },
            userMouseUpEvent = function () {
            },
            userMouseMoveEvent = function () {
            },
            userContextmenuEvent = function () {
            },
            _subject;

        var setSubject = function (subject) {
            _subject = subject;
        };

        var setUserClickEvent = function (userEvent) {
            userClickEvent = userEvent;
        };

        var setUserMousedownEvent = function (userEvent) {
            userMousedownEvent = userEvent;
        };

        var setUserMouseUpEvent = function (userEvent) {
            userMouseUpEvent = userEvent;
        };

        var setUserMouseMoveEvent = function (userEvent) {
            userMouseMoveEvent = userEvent;
        };

        var setUserContextmenuEvent = function (userEvent) {
            userContextmenuEvent = userEvent;
        };

        var countCanvasOffset = function (e) {
            var pos = {}, totalOffsetX = 0, totalOffsetY = 0, ele = Framework.Game._canvas;

            do {
                totalOffsetX += ele.offsetLeft;
                totalOffsetY += ele.offsetTop;
                ele = ele.offsetParent;
            } while (ele);

            pos.x = e.x || e.clientX;
            pos.y = e.y || e.clientY;
            pos.x = Math.floor((pos.x - totalOffsetX) / Framework.Game._widthRatio);
            pos.y = Math.floor((pos.y - totalOffsetY) / Framework.Game._heightRatio);

            return pos;
        };

        var clickEvent = function (e) {
            e.preventDefault();
            var e = countCanvasOffset(e);
            userClickEvent.call(_subject, e);
        };

        var mousedownEvent = function (e) {
            e.preventDefault();
            var e = countCanvasOffset(e);
            userMousedownEvent.call(_subject, e);
        };

        var mouseupEvent = function (e) {
            e.preventDefault();
            var e = countCanvasOffset(e);
            userMouseUpEvent.call(_subject, e);
        };

        var mousemoveEvent = function (e) {
            e.preventDefault();
            var e = countCanvasOffset(e);
            userMouseMoveEvent.call(_subject, e);

            if (Framework.Game._isRecording && Framework.Game._config.isMouseMoveRecorded) {
                Framework.Game._record.mousemove(e);
            }
        };

        var contextmenuEvent = function (e) {
            e.preventDefault();
            var e = countCanvasOffset(e);
            userContextmenuEvent.call(_subject, e);
        };


        /**
         * 管理KeyBoard所有的事件, 一般來說, 不會在此處處理相關邏輯
         * 而會在Level進行設定, 請參照
         * {{#crossLink "Level/keydown:event"}}{{/crossLink}},
         * {{#crossLink "Level/keyup:event"}}{{/crossLink}},
         *
         * @class MouseManager
         */
        class MouseManager {

            /** Default constructor. */
            constructor() {
                Framework.Game._canvas.addEventListener('click', clickEvent, false);
                Framework.Game._canvas.addEventListener('mousedown', mousedownEvent, false);
                Framework.Game._canvas.addEventListener('mouseup', mouseupEvent, false);
                Framework.Game._canvas.addEventListener('mousemove', mousemoveEvent, false);
                Framework.Game._canvas.addEventListener('contextmenu', contextmenuEvent, false);
            }

            /**
             * Sets the subject.
             *
             * @return  .
             */
            setSubject() {
                return setSubject.apply(this, arguments);
            }

            /**
             * Sets click event.
             *
             * @return  .
             */
            setClickEvent() {
                return setUserClickEvent.apply(this, arguments);
            }

            /**
             * Sets mousedown event.
             *
             * @return  .
             */
            setMousedownEvent() {
                return setUserMousedownEvent.apply(this, arguments);
            }

            /**
             * Sets mouse up event.
             *
             * @return  .
             */
            setMouseUpEvent() {
                return setUserMouseUpEvent.apply(this, arguments);
            }

            /**
             * Sets mouse move event.
             *
             * @return  .
             */
            setMouseMoveEvent() {
                return setUserMouseMoveEvent.apply(this, arguments);
            }

            /**
             * Sets contextmenu event.
             *
             * @return  .
             */
            setContextmenuEvent() {
                return setUserContextmenuEvent.apply(this, arguments);
            }

            //
            // /**
            //  * Sets the subject.
            //  *
            //  * @return  .
            //  */
            // static setSubject() {
            //     return setSubject.apply(MouseManagerInstance, arguments);
            // }
            //
            // /**
            //  * Sets click event.
            //  *
            //  * @return  .
            //  */
            // static setClickEvent() {
            //     return setUserClickEvent.apply(MouseManagerInstance, arguments);
            // }
            //
            // /**
            //  * Sets mousedown event.
            //  *
            //  * @return  .
            //  */
            // static setMousedownEvent() {
            //     return setUserMousedownEvent.apply(MouseManagerInstance, arguments);
            // }
            //
            // /**
            //  * Sets mouse up event.
            //  *
            //  * @return  .
            //  */
            // static setMouseUpEvent() {
            //     return setUserMouseUpEvent.apply(MouseManagerInstance, arguments);
            // }
            //
            // /**
            //  * Sets mouse move event.
            //  *
            //  * @return  .
            //  */
            // static setMouseMoveEvent() {
            //     return setUserMouseMoveEvent.apply(MouseManagerInstance, arguments);
            // }
            //
            // /**
            //  * Sets contextmenu event.
            //  *
            //  * @return  .
            //  */
            // static setContextmenuEvent() {
            //     return setUserContextmenuEvent.apply(MouseManagerInstance, arguments);
            // }
        };

        MouseManagerInstance = Framework.MouseManager = new MouseManager();
        return MouseManagerInstance;
    })();
    return Framework;
})(Framework || {});