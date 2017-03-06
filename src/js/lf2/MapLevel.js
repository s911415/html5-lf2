"use strict";
var lf2 = (function (lf2) {
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
             *make camera follow character moving
             */
            var cameraPosition;
            var position;
            this.width=3200;
            var minX=0,maxX=this.width;
            this.backgroundmap = new Sprite(define.IMG_PATH+'test.webp');
            this.position = new Point(0,0);

            this.Point = new Point(this.position.x, this.position.y);
            cameraPosition={
                x:Math.max(minX+this.width/2,Math.min(this.Point.x,maxX-this.width/2)),
                y:this.height/2
            }

            this.backgroundMap = new XXX();
            this.backgroundMap.load();
            this.rootScene.attach(this.backgroundMap);


        }

        update(){
            /**
             * update the new coordinate
             */
            super.update();



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

    return lf2;
})(lf2 || {});