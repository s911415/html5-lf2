"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const Body = lf2.Body;
    const Interaction = lf2.Interaction;
    const ResourceManager = Framework.ResourceManager;
    /**
     * Ball
     *
     * @type {GameObjectCharacter}
     * @class lf2.GameObjectCharacter
     * @extends {lf2.GameObject}
     */
    lf2.GameObjectCharacter = class GameObjectCharacter extends lf2.GameObject {

        /**
         *
         * @param {Object} fileInfo
         * @param {String} context
         */
        constructor(fileInfo, context) {
            super(fileInfo, context);
            const headerData = this.bmpInfo._data;

            this.head;
            this.small;

            this.addPreloadResource(
                ResourceManager.loadResource(define.IMG_PATH + headerData.get('head'), {
                    method: 'GET'
                })
                    .then(r => r.blob())
                    .then((img) => {
                        this.head = new Image();
                        this.head.src = URL.createObjectURL(img);
                    })
            );

            this.addPreloadResource(
                ResourceManager.loadResource(define.IMG_PATH + headerData.get('small'), {
                    method: 'GET'
                })
                    .then(r => r.blob())
                    .then((img) => {
                        this.small = new Image();
                        this.small.src = URL.createObjectURL(img);
                    })
            );

            this.name = headerData.get("name") || 0;
            this.walking_frame_rate = headerData.get("walking_frame_rate") || 0;
            this.walking_speed = headerData.get("walking_speed") || 0;
            this.walking_speedz = headerData.get("walking_speedz") || 0;
            this.running_frame_rate = headerData.get("running_frame_rate") || 0;
            this.running_speed = headerData.get("running_speed") || 0;
            this.running_speedz = headerData.get("running_speedz") || 0;
            this.heavy_walking_speed = headerData.get("heavy_walking_speed") || 0;
            this.heavy_walking_speedz = headerData.get("heavy_walking_speedz") || 0;
            this.heavy_running_speed = headerData.get("heavy_running_speed") || 0;
            this.heavy_running_speedz = headerData.get("heavy_running_speedz") || 0;
            this.jump_height = headerData.get("jump_height") || 0;
            this.jump_distance = headerData.get("jump_distance") || 0;
            this.jump_distancez = headerData.get("jump_distancez") || 0;
            this.dash_height = headerData.get("dash_height") || 0;
            this.dash_distance = headerData.get("dash_distance") || 0;
            this.dash_distancez = headerData.get("dash_distancez") || 0;
            this.rowing_height = headerData.get("rowing_height") || 0;
            this.rowing_distance = headerData.get("rowing_distance") || 0;
        }


    };


    return lf2;
})(lf2 || {});