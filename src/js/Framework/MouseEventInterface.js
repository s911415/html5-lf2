'use strict';
var Framework = (function (Framework) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    /**
     * Mouse Event Interface
     * 提供滑鼠事件的介面
     *
     * @interface Framework.MouseEventInterface
     * @type {MouseEventInterface}
     */
    Framework.MouseEventInterface = class MouseEventInterface {

        /**
         * 處理點擊的事件, 當mousedown + mouseup 都成立時才會被觸發
         *
         * @abstract
         * @event click
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前點擊的絕對位置
         */
        click(e) {
        }

        /**
         * 處理滑鼠點下的事件
         *
         * @abstract
         * @event mousedown
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前點擊的絕對位置
         */
        mousedown(e) {
        }

        /**
         * 處理滑鼠放開的事件
         *
         * @abstract
         * @event mouseup
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前放開的絕對位置
         */
        mouseup(e) {
        }

        /**
         * 處理滑鼠移動的事件(不論是否有點下, 都會觸發該事件)
         *
         * @abstract
         * @event mousemove
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前滑鼠的絕對位置
         */
        mousemove(e) {
        }

    };

    return Framework;
})(Framework || {});
