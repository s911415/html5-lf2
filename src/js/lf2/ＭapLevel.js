"use strict";
var MapLevel = (function (MapLevel) {
    const Game = Framework.Game;
    const Sprite = Framework.Sprite;
    const Point = Framework.Point;
    /**
     * MapLevel
     *
     * @type {MapLevel}
     * @class lf2.MapLevel
     * @implements Framework.AttachableInterface
     */
    lf2.MapLevel = class extends Framework.Level {
        constructor() {
            super();
        }

        load(){
            /**
             *
             *
             */
            var characterPosition,cameraPosition;
            this.width=3200;
            var minX=0,MaxX=this.width;
            this.backgroundmap = new Sprite(define.IMG_PATH + 'backgroundmap.dat');
            characterPosition = {
                x:this.position.x,
                y:this.position.y
            }
            cameraPosition={
                x:Math.max(minX+this.width/2,Math.min(characterPosition.x,maxX-this.width/2)),
                y:this.height/2
            }


        }

        update(){


        }

        draw(ctx){
            super.draw(ctx);

        }

        keydown(e, list, oriE) {
            super.keydown(e);

            if(e.key === 'right'){
                this.position.x+=10;
            }

            if(e.key === 'left'){
                this.position.x-=10;
            }

            if(e.key === 'up'){
                this.position.y+=10;
            }

            if(e.key === 'down'){
                this.position.y-=10;
            }
        }

    };

    return Sample;
})(Sample || {});