'use strict';
var Framework = (function (Framework) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    /**
     * Attachable Interface
     * 提供可以附加到Framework.Level或是Framework.Scence的介面
     *
     * @interface Framework.AttachableInterface
     * @type {AttachableInterface}
     */
    Framework.AttachableInterface = class AttachableInterface {
        /**
         * Load
         * @abstract
         */
        load() {
            throw new METHOD_NOT_IMPLEMENT;
        }

        // /**
        //  * Initial this object
        //  * @abstract
        //  */
        // initialize(){
        //     throw new METHOD_NOT_IMPLEMENT;
        // }

        /**
         * Update object
         * @abstract
         */
        update() {
            throw new METHOD_NOT_IMPLEMENT;
        }

        /**
         * Draw object
         *
         * @param {CanvasRenderingContext2D} ctx
         * @abstract
         */
        draw(ctx) {
            throw new METHOD_NOT_IMPLEMENT;
        }
    };

    return Framework;
})(Framework || {});
