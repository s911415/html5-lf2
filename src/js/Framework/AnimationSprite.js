// By Raccoon
// include namespace

'use strict';
var Framework = (function (Framework) {
    /**
     * 支援播放連續圖片的Sprite
     *
     * @param  {Object} options
     * options.url為要載入的圖片, 當url為一個Array時表示為零散的多張圖片,
     * 當為string時表示是一張大張的連續動作圖,
     * 故需要在提供大張連續圖的row和col.
     * options.speed可以設定這個Sprite播放的速度(fps),
     * options.loop 則可以設定這個Sprite是否需要不斷重複播放
     * @example
     *     new Framework.AnimationSprite({url:['image1.png', 'image2.bmp']}); //多張圖片
     *     new Framework.AnimationSprite({url:' bigImage.png', col: 10 , row: 7 , loop: true , speed: 6}); //只有一張大型的連續動作圖,speed和loop為非必要項
     *
     */
    Framework.AnimationSprite = class extends Framework.GameObject {

        /**
         * Constructor.
         *
         * @param   options Options for controlling the operation.
         */
        constructor(options) {
            super();
            // Define variable
            // private
            this._id = undefined;
            this._type = undefined;
            this._isLoadSprite = false;
            this._sprites = [];
            this._previousTime = (new Date()).getTime();
            this._start = false;
            // public
            this.col = 1;
            this.row = 1;
            this.from = 0;
            this.to = 0;
            this._index = 0;
            this.speed = 10;
            this.loop = true;
            this.maxIndex = 0;
            this.speedCounter = 0;
            this.finishPlaying = function () {
            };


            // 建構子參數判斷
            if (!Framework.Util.isUndefined(options.url)) {
                if (Framework.Util.isString(options.url)) {
                    this._id = options.url;
                    if (Framework.Util.isUndefined(options.col) || Framework.Util.isUndefined(options.row)) {
                        Framework.DebugInfo.Log.error('AnimationSprite Error : 建構子參數錯誤，需指定col、row');
                        throw new SyntaxError('AnimationSprite constructor arguments error');
                    } else {
                        this.col = options.col;
                        this.row = options.row;
                        this.maxIndex = this.col * this.row - 1;
                    }
                } else if (Array.isArray(options.url)) {
                    this.maxIndex = options.url.length - 1;
                    this.row = options.url.length;
                } else {
                    Framework.DebugInfo.Log.error('AnimationSprite Error : 建構子參數錯誤，url格式不正確');
                    throw new SyntaxError('AnimationSprite constructor arguments error');
                }
            } else {
                Framework.DebugInfo.Log.error('AnimationSprite Error : 建構子參數錯誤');
                throw new SyntaxError('AnimationSprite constructor arguments error');
            }
            this.speed = options.speed || 24;
            this.loop = (Framework.Util.isUndefined(options.loop) ? true : options.loop);


            if (Framework.Util.isString(options.url)) {
                //單張圖片切割
                Framework.ResourceManager.loadImage({id: this._id, url: this._id});
                this._type = 'one';
            } else if (Array.isArray(options.url)) {
                //一堆圖片串成動畫
                this._id = [];
                this._type = 'more';
                this._id = options.url;
                options.url.forEach(function (src) {
                    this._sprites.push(new Framework.Sprite(src));
                }, this);
                this._isLoadSprite = true;
            } else if (!Framework.Util.isUndefined(options)) {
                Framework.DebugInfo.Log.error('AnimationSprite 不支援的參數 ' + options);
            }

            this.pushSelfToLevel();
        }

        /**
         * Next frame.
         *
         * @private
         * @return  .
         */
        _nextFrame() {
            if (this._start) {
                this.index++;
                this._changeFrame = true;
                if (this.index > this.to) {
                    if (this.loop) {
                        this.index = this.from;
                    } else {
                        this.index = this.to;
                        this._start = false;
                        this.finishPlaying.call(this);
                    }
                }
                /*if(this.to === -1){
                 if(this.index >= this.maxIndex){
                 this._start = this.loop;
                 if(this._start){
                 this.index = this.from;
                 }else{
                 this.index = this.maxIndex-1;
                 }
                 }
                 }else{
                 if(this.index > this.to){
                 this._start = this.loop;
                 this.index = this.from;
                 }
                 }*/
            }
        }

        /**
         * Init texture.
         *
         * @return  .
         */
        initTexture() {
        }

        /**
         *
         * 開始播放設定好的AnimationSprite
         * @param {Object} options options.from和options.to表示要從第幾張播放到第幾張,
         * 若to < from表示要倒著播放, 可以在此設定要被播放的速度和是否重複播放,
         * finishPlaying可以設定播放完畢後是否要有callback
         * (loop: true時, 此callback永遠不會被執行)
         * @example
         *     start({from:3, to: 5}); //從第三張圖片播放到第五張
         *     start({from:6, to: 1}); //倒著從第六張圖片播放到第一張
         *     start({from:6, to: 1, loop: false, speed: 1, finishPlaying: function(){
        *         console.log('finish');
        *     }});
         */
        start(option) {
            var option = option || {};
            this.from = (Framework.Util.isUndefined(option.from) ? 0 : option.from);
            this.to = (Framework.Util.isUndefined(option.to) ? this.maxIndex : option.to);
            this.speed = (Framework.Util.isUndefined(option.speed) ? this.speed : option.speed);
            this.loop = (Framework.Util.isUndefined(option.loop) ? this.loop : option.loop);

            this._start = true;
            this._previousTime = (new Date()).getTime();
            this.finishPlaying = option.finishPlaying || function () {
                };
            this.userInputFrom = this.from;
            this.userInputTo = this.to;
            if (this.userInputFrom > this.userInputTo) {
                this.from = this.maxIndex - this.from;
                this.to = this.maxIndex - this.to;
                if (this._type === 'more') {
                    this._sprites.reverse();
                }
            }
            this.index = this.from;
        }

        /**
         * 停止播放AnimationSprite, 若已經停止, 則不會發生任何事情
         */
        stop() {
            this._start = false;
        }

        /**
         * 繼續播放AnimationSprite, 若未曾停止, 則不會發生任何事情
         */
        resume() {
            if (!this._start) {
                this._previousTime = (new Date()).getTime();
                this._start = true;
            }
        }

        /**
         * Loads this object.
         *
         * @return  .
         */
        load() {
            if (this._type === 'one') {
                Framework.ResourceManager.loadImage({id: this._id, url: this._id});
            } else {
                this._id.forEach(function (src) {
                    Framework.ResourceManager.loadImage({id: src, url: src});
                }, this);
            }
        }

        /**
         * Initializes this object.
         *
         * @return  .
         */
        initialize() {
            //if(this._type === 'one') {              
            // 故意用 closures 隔離變數的scope
            //(function() {
            var i = 0, tmpImg, tmpCanvas, tmpContext, sprite, realWidth, realHeight;
            if (this._type === 'one') {
                this.texture = Framework.ResourceManager.getResource(this._id);
                for (i = 0; i < this.col * this.row; i++) {
                    tmpCanvas = document.createElement('canvas');
                    realWidth = this.texture.width * this.scale;
                    realHeight = this.texture.height * this.scale;
                    tmpCanvas.width = (this.texture.width ) / this.col;
                    tmpCanvas.height = (this.texture.height ) / this.row;
                    tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.drawImage(this.texture, -(this.texture.width / this.col) * (i % this.col), -(this.texture.height / this.row) * (Math.floor(i / this.col)));
                    this._sprites.push(new Framework.Sprite(tmpCanvas));
                }
                if (this.userInputFrom > this.userInputTo) {
                    this._sprites.reverse();
                }
            } else {
                this._id.forEach(function (imgId) {
                    tmpCanvas = document.createElement('canvas');
                    tmpImg = Framework.ResourceManager.getResource(imgId);
                    realWidth = tmpImg.width * this.scale;
                    realHeight = tmpImg.height * this.scale;
                    tmpCanvas.width = realWidth;
                    tmpCanvas.height = realHeight;
                    tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.drawImage(tmpImg, 0, 0);
                    this._sprites.push(new Framework.Sprite(tmpCanvas));
                }, this);
                this.texture = this._sprites[this.index];

            }

            //}).call(this);
            this._isLoadSprite = true;

            // }

        }

        /**
         * Updates this object.
         *
         * @return  .
         */
        update() {
            if (this._start) {
                var addFrame = this.speed / 30;
                this.speedCounter += addFrame;
                while (this.speedCounter > 1) {
                    this._nextFrame();
                    this.speedCounter -= 1;
                }
            }

        }

        /**
         * Draws the given painter.
         *
         * @param   painter The painter.
         *
         * @return  .
         */
        draw(painter) {
            var painter = painter || Framework.Game._context;
            if (Framework.Util.isUndefined(this._sprites) || this._sprites.length == 0) {
                this.initialize();
            }
            //if(this.isObjectChanged) {
            this.texture = this._sprites[this.index];

            //if(this._isMove) {
            this.texture.position = this.position;
            this.texture.absolutePosition = this.absolutePosition;
            //}

            //if(this._isRotate) {
            this.texture.rotation = this.rotation;
            this.texture.absoluteRotation = this.absoluteRotation;
            //}

            //if(this._isScale) {
            this.texture.scale = this.scale;
            this.texture.absoluteScale = this.absoluteScale;
            //}

            this.texture.spriteParent = this.spriteParent;
            this.texture.layer = this.layer;
            this.texture.isDrawBoundry = this.isDrawBoundry;
            this.texture.isDrawPace = this.isDrawPace;
            this.texture._changeFrame = this._changeFrame;

            this.texture.draw(painter);
            //} 


        }

        /**
         * Convert this object into a string representation.
         *
         * @return  An unknown that represents this object.
         */
        toString() {
            return '[AnimationSprite Object]';
        }

        /**
         * Teardowns this object.
         *
         * @return  .
         */
        teardown() {
            if (this.type === 'one') {
                Framework.ResourceManager.destroyResource(this.id);
            } else if (this.type === 'more') {
                this._sprites.forEach(function (s) {
                    s.teardown();
                }, this)
            }
        }

        /**
         * Gets the index.
         *
         * @return  {Number}   .
         */
        get index() {
            return this._index;
        }

        /**
         * Indexes the given new value.
         *
         * @param {Number}  newValue    The new value.
         *
         * @return  {void}.
         */
        set index(newValue) {
            this._index = newValue;
            this._changeFrame = true;
        }
    };

    return Framework;
})(Framework || {});
