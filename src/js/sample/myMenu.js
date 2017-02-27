"use strict";
var Sample = (function(Sample){
    Sample.MyMenu = class extends Framework.GameMainMenu {
        //初始化loadingProgress需要用到的圖片
        initializeProgressResource() {
            this.loading = new Framework.Sprite(define.imagePath + 'loading.webp');
            this.loading.position = {x: Framework.Game.getCanvasWidth() / 2, y: Framework.Game.getCanvasHeight() / 2};

            //為了或得到this.loading這個Sprite的絕對位置, 故需要先計算一次(在Game Loop執行時, 則會自動計算, 但因為loadingProgress只支援draw故需要自行計算)
        }

        function () {
            this.loading = new Framework.Sprite(define.imagePath + 'loading.webp');
            this.loading.position = {x: Framework.Game.getCanvasWidth() / 2, y: Framework.Game.getCanvasHeight() / 2};

            //為了或得到this.loading這個Sprite的絕對位置, 故需要先計算一次(在Game Loop執行時, 則會自動計算, 但因為loadingProgress只支援draw故需要自行計算)
        }

        //在initialize時會觸發的事件
        loadingProgress(ctx, requestInfo) {
            //console.log(Framework.ResourceManager.getFinishedRequestPercent())
            this.loading.draw(ctx);
            ctx.font = '90px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText(Math.round(requestInfo.percent) + '%', ctx.canvas.width / 2, ctx.canvas.height / 2 + 300);
        }

        load() {
            //Animation Sprite會用到的圖片資源
            var photoLink =
                [
                    define.imagePath + 'image1.webp',
                    define.imagePath + 'image2.webp',
                    define.imagePath + 'image3.webp',
                    define.imagePath + 'image4.webp',
                    define.imagePath + 'image5.webp'
                ];

            this.scrollBar = new Framework.Sprite(define.imagePath + 'scrollBar.webp');
            this.rightArrow = new Framework.Sprite(define.imagePath + 'rightArrow.webp');
            this.photo = new Framework.AnimationSprite({url: photoLink, loop: true, speed: 0.05});

            this.isTouchArrow = false;
            this.previousTouch = {x: 0, y: 0};
            this.currentTouch = {x: 0, y: 0};

            //為了讓之後的位置較好操控, new出一個位於中心點且可以黏貼任何東西的容器
            //注意, Position都是用中心點
            this.center = new Framework.Scene();
            this.center.position = {
                x: Framework.Game.getCanvasWidth() / 2,
                y: Framework.Game.getCanvasHeight() / 2
            };

            //由於scrollBar將會被attach到this.center上
            //故x設為0, 表示x也是要正中心
            this.scrollBar.position = {
                x: Framework.Game.getCanvasWidth() / 2,
                y: Framework.Game.getCanvasHeight() / 4 * 3
            };

            this.photo.position = {
                x: 0,
                y: 0
            };

            //Framework支援scale, rotation等功能
            this.rightArrow.scale = 0.35;
            this.rightArrow.position = {
                x: Framework.Game.getCanvasWidth() / 2 - 500,
                y: Framework.Game.getCanvasHeight() / 4 * 3
            };

            this.center.attach(this.photo);

            //rootScene為系統預設的容器, 由於其他東西都被attach到center上
            //將物件attach到center上, 順序是會影響繪製出來的效果的
            this.rootScene.attach(this.center);
            this.rootScene.attach(this.scrollBar);
            this.rootScene.attach(this.rightArrow);

            //讓AnimationSprite開始被播放
            this.photo.start();

        }

        initialize() {

        }

        update() {
            this.rootScene.update();
            //this.rootScene.update();

            //目前的Framework, 當任何一個GameObject不做attach時, 則必須要自行update
            // this.center.update();
            this.scrollBar.update();
        }

        draw(parentCtx) {
            //this.rootScene.draw();一定要在第一行
            this.rootScene.draw(parentCtx);

        }

        mouseup(e) {
            this.isTouchArrow = false;
        }

        mousedown(e) {
            //console.log為Browser提供的function, 可以在debugger的console內看到被印出的訊息
            if (e) {
                console.log(e.x, e.y);
            }

            this.previousTouch = {x: e.x, y: e.y};
            if (this.previousTouch.x > this.rightArrow.upperLeft.x && this.previousTouch.x < this.rightArrow.upperRight.x && this.previousTouch.y > this.rightArrow.upperLeft.y && this.previousTouch.y < this.rightArrow.lowerLeft.y) {
                this.isTouchArrow = true;
            }
        }

        mousemove(e) {
            if (this.isTouchArrow) {
                this.currentTouch = {x: e.x, y: e.y};
                if (this.currentTouch.x > this.previousTouch.x && this.currentTouch.y < this.rightArrow.lowerLeft.y && this.currentTouch.y > this.rightArrow.upperLeft.y) {
                    //當arrow被Touch到時, 會跟隨著觸控的位置移動
                    this.rightArrow.position.x = this.rightArrow.position.x + this.currentTouch.x - this.previousTouch.x;
                    if (this.currentTouch.x > Framework.Game.getCanvasWidth() - this.rightArrow.width) {
                        //當要換關時, 可以呼叫goToNextLevel, goToPreviousLevel, goToLevel(levelName)
                        Framework.Game.goToNextLevel();
                    }
                }
            }
            this.previousTouch = this.currentTouch;
        }

        mouseup(e) {
            this.isTouchArrow = false;
        }

        touchstart(e) {
            //為了要讓Mouse和Touch都有一樣的事件
            //又要減少Duplicated code, 故在Touch事件被觸發時, 去Trigger Mouse事件
            this.mousedown({x: e.touches[0].clientX, y: e.touches[0].clientY});
        }

        touchend(e) {
            this.mouseup();
        }

        touchmove(e) {
            this.mousemove({x: e.touches[0].clientX, y: e.touches[0].clientY});
        }
    };

    return Sample;
})(Sample || {});
