"use strict";
var lf2 = (function (lf2) {
    const ResourceManager = Framework.ResourceManager;
    /**
     * Prefetch
     *
     * @class Prefetch
     */
    class Prefetch {
        constructor() {
            this._fetch = {};
        }

        start() {
            this._fetch = {
                LOADING_VIDEO:
                    ResourceManager.loadResourceAsBlob(lf2.LoadingLevel.LOADING_RESOURCE_SRC),

                DATA: ResourceManager.loadResource(define.ZIP_PATH + 'data.zip')
                    .then(r => r.blob())
                    .then(JSZip.loadAsync),

                RESOURCES: ResourceManager.loadResource(define.ZIP_PATH + 'resources.zip')
                    .then(r => r.blob())
                    .then(JSZip.loadAsync)
            };

            ResourceManager.loadZip();
        }

        get(key) {
            return this._fetch[key];
        }
    };

    /**
     *
     * @type {Prefetch}
     */
    lf2.Prefetch = new Prefetch();
    return lf2;
})(lf2 || {});