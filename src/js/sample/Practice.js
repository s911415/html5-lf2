"use strict";
var Sample = (function (Sample) {
    const Point = Framework.Point;
    const AnimationSprite = Framework.AnimationSprite;
    /**
     * Custom class
     *
     * @type {Practice}
     * @class Sample.Practice
     * @implements Framework.AttachableInterface
     */
    Sample.Practice = class Practice {
        constructor() {
            this.initialize();
        }

        initialize() {
            return this;
        }

        load() {
            this.pic = new AnimationSprite({url:define.imagePath + 'firen.webp', col:10 , row:7 , loop:true , speed:2});
            this.pic.position = new Point(Math.random() * 500, Math.random() * 500);
            this.pic.rotation = 0;
            this.dir = 0;

            this.pic.start({from: 20, to: 22, loop: true});
            return this;
        }

        update() {
            if (this.dir == 0) {
                this.pic.position.x++;
            } else {
                this.pic.position.x--;
            }

            if (this.pic.lowerRight.x >= Framework.Game._canvas.width) {
                this.dir = 1;
            }
            if (this.pic.lowerLeft.x <= 0) {
                this.dir = 0;
            }
            this.pic.rotation++;
            this.pic.update();

            return this;
        }

        /**
         * Draw
         *
         * @override
         * @param ctx
         */
        draw(ctx) {
            this.pic.draw(ctx);
        }
    };

    return Sample;
})(Sample || {});