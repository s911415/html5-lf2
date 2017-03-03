"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const Level = Framework.Level;

    /**
     * Loading Level
     *
     * @type {LoadingLevel}
     * @class lf2.LoadingLevel
     */
    lf2.LoadingLevel = class extends Framework.Level {
        constructor() {
            super();
        }

        load() {
            this.allDone = false;
            this.promiseList = [];
            this.objInfo = [];
            this.bgInfo = [];
            this.promiseList.push(
                ResourceManager.loadResource(define.DATA_PATH + "data_list.json")
                    .then((data) => {
                        return data.json();
                    }).then((data) => {
                    const objs = data.object, bgs = data.background;

                    objs.forEach((o) => {
                        this.promiseList.push(
                            ResourceManager.loadResource(define.DATA_PATH + o.file).then((data) => {
                                return data.text();
                            }).then((datText) => {
                                this.objInfo.push(this.parseObj(datText));
                            })
                        );
                    });
                })
            );


            Promise.all(this.promiseList).then((a, b)=>{
                console.log("all down");
            });
        }

        update() {
            if(this.allDone){
                Game.goToLevel('menu');
            }
        }

        draw(ctx) {
            super.draw(ctx);

        }

        /**
         * Parse LF@ Object
         * @param {String} content
         * @returns {*}
         */
        parseObj(content) {
            return content;
        }
    };

    return lf2;
})(lf2 || {});