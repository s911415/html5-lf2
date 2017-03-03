"use strict";
var lf2 = (function (lf2) {
    let ResourceManager = Framework.ResourceManager;

    /**
     * Game Resource
     *
     * @type {GameRes}
     * @class lf2.GameRes
     */
    class GameRes extends Map{
        constructor(){
            super();
        }

        loadRes(path){
            return ResourceManager.loadResource(path);
        }
    };


    lf2.GameRes = new Map();
    return lf2;
})(lf2 || {});