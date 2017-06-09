"use strict";
var lf2 = (function (lf2) {
    const ResourceManager = Framework.ResourceManager;
    /**
     * Prefetch
     *
     * @class Prefetch
     */
    class Prefetch {

        /** Default constructor. */
        constructor() {
            this._fetch = {};
        }

        /**
         * Starts preload resources
         *
         * @return  .
         */
        start() {
            this._fetch = {
                LOADING_VIDEO: ResourceManager.loadResourceAsBlob(lf2.LoadingLevel.LOADING_RESOURCE_SRC),

                DATA_LIST: ResourceManager.loadResource(define.DATA_PATH + "data_list.json")
                    .then(d=>d.json()),

                SKILL_LIST: ResourceManager.loadResource(define.DATA_PATH + "skill.json")
                    .then(d=>d.json()),

                DATA: ResourceManager.loadResource(define.ZIP_PATH + 'data.zip')
                    .then(r => r.blob())
                    .then(JSZip.loadAsync),

                RESOURCES: ResourceManager.loadResource(define.ZIP_PATH + 'resources.zip')
                    .then(r => r.blob())
                    .then(JSZip.loadAsync)
            };

            ResourceManager.loadZip();
        }

        /**
         * Gets an Promise using the given key.
         *
         * @param {String}  key The key to get.
         *
         * @return  {Promise}
         */
        get(key) {
            return this._fetch[key];
        }
    }
    ;

    /**
     *
     * @type {Prefetch}
     */
    lf2.Prefetch = new Prefetch();
    return lf2;
})(lf2 || {});