"use strict";
var Sample = (function (Sample) {
    const Point = Framework.Point;
    const Sprite = Framework.Sprite;
    /**
     * Custom Map
     *
     * @type {GameMap}
     * @class Sample.GameMap
     * @implements Framework.AttachableInterface
     */
    Sample.GameMap = class {
        constructor() {
            this.MW = 70;
            this.MH = 40;

            this.position = new Point(200, 500);

            this.map = [
                [1, 2, 1, 2],
                [2, 1, 2, 1],
                [0, 1, 0, 1],
                [2, 0, 2, 0],
                [1, 2, 1, 2],
            ];
        }

        load() {
            this.greenPic = new Sprite(define.imagePath + 'green.png');
            this.bluePic = new Sprite(define.imagePath + 'blue.png');
        }

        initialize() {

        }

        update() {

        }

        /**
         *
         * @param {CanvasRenderingContext2D} ctx
         */
        draw(ctx) {
            for (let i = 0; i < this.map.length; i++) {
                for (let j = 0; j < this.map[0].length; j++) {
                    let picPos = this.position.clone().offset(
                        (this.MW * j) + this.MW / 2,
                        (this.MH * i) + this.MH / 2
                    );

                    switch (this.map[i][j]) {
                        case 0:
                            break;
                        case 1:
                            this.greenPic.position = picPos;
                            this.greenPic.draw(ctx);
                            break;
                        case 2:
                            this.bluePic.position = picPos;
                            this.bluePic.draw(ctx);
                            break;
                    }
                }
            }
        }
    };

    return Sample;
})(Sample || {});