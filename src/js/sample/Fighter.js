"use strict";
var Sample = (function (Sample) {
    const OFFSET_UNIT = 1;
    const Point = Framework.Point;
    const Sprite = Framework.Sprite;
    const KB = Framework.KeyBoardManager;
    /**
     * Custom class
     *
     * @type {Fighter}
     * @class Sample.Fighter
     * @implements Framework.AttachableInterface
     * @implements Framework.KeyboardEventInterface
     */
    Sample.Fighter = class Fighter {
        constructor() {
            this.initialize();
        }

        initialize() {
            return this;
        }

        load() {
            this.pic = new Sprite(define.imagePath + '169.bmp');
            this.pic.load();
            this.pic.position = new Point(Math.random() * 500, Math.random() * 500);
            this.pic.rotation = 0;
            this.dir = 0;

            return this;
        }

        update() {
            this.pic.update();

            if (KB.isKeyDown('Up')) this.pic.position.y -= OFFSET_UNIT;
            if (KB.isKeyDown('Down')) this.pic.position.y += OFFSET_UNIT;
            if (KB.isKeyDown('Left')) this.pic.position.x -= OFFSET_UNIT;
            if (KB.isKeyDown('Right')) this.pic.position.x += OFFSET_UNIT;
            //console.log("Keydownlist", KB.status.filter(x => x));
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

        /**
         *
         * @param e
         * @param list
         * @param oriE
         */
        keydown(e, list, oriE) {
            if (list['Up']) this.pic.rotation = -90;
            if (list['Down']) this.pic.rotation = 90;
            if (list['Left']) this.pic.rotation = -180;
            if (list['Right']) this.pic.rotation = 0;


            if (list['Up'] && list['Right']) this.pic.rotation = -45;
            if (list['Up'] && list['Left']) this.pic.rotation = -135;
            if (list['Down'] && list['Right']) this.pic.rotation = 45;
            if (list['Down'] && list['Left']) this.pic.rotation = 135;
        }
    };

    return Sample;
})(Sample || {});