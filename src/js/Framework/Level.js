// By Raccoon
// include namespace
'use strict';

var Framework = (function (Framework) {
    /**
     * 遊戲關卡的Class, 一個Game中可能有無數個Level
     * (當然Game的開始和結束頁面也可以是一個Level)
     * 每個Level都會有
     * {{#crossLink "Level/initializeProgressResource:method"}}{{/crossLink}},
     * {{#crossLink "Level/loadingProgress:method"}}{{/crossLink}},
     * {{#crossLink "Level/initialize:method"}}{{/crossLink}},
     * {{#crossLink "Level/update:method"}}{{/crossLink}},
     * {{#crossLink "Level/draw:method"}}{{/crossLink}},
     * 五個基本的生命週期
     *
     * @implements Framework.KeyboardEventInterface
     * @example
     *     new Framework.Level();
     *
     */
    Framework.Level = class {
        constructor() {
            /**
             * 每個Level一定會有一個rootScene,
             * 建議所有的GameObject都應該要attach到rootScene上
             * @property rootScene
             * @type {Framework.Scene}
             */
            this.rootScene = new Framework.Scene();
            this.autoDelete = true;
            this._firstDraw = true;
            this._allGameElement = [];
            this.timelist = [];
            this.updatetimelist = [];
            this.cycleCount = 0;
            this._forceDraw = false;

            this.config = Framework.Config;  // 2017.02.20, from V3.1.1

        }

        /**
         * Traversal all element.
         *
         * @param   func    The function.
         *
         * @private
         * @return  .
         */
        _traversalAllElement(func) {
            this._allGameElement.forEach(func);
        }

        /**
         * Initializes the initialize progress resource.
         *
         * @private
         * @return  .
         */
        _initializeProgressResource() {
            this.initializeProgressResource();
        }

        /**
         * Loads this object.
         *
         * @private
         * @return  .
         */
        _load() {
            this.load();
            this._traversalAllElement(function (ele) {
                ele.load();
            });
        }

        /**
         * Loading progress.
         *
         * @param   ctx         The context.
         * @param   requestInfo Information describing the request.
         *
         * @private
         * @return  .
         */
        _loadingProgress(ctx, requestInfo) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.loadingProgress(ctx, requestInfo);
        }

        /**
         * Initializes this object.
         *
         * @private
         * @return  .
         */
        _initialize() {
            this.cycleCount = 0;
            this.initialize();
            this._traversalAllElement(function (ele) {
                ele.initialize();
            });
            //this.rootScene.initTexture();
        }

        /**
         * Updates this object.
         *
         * @private
         * @return  .
         */
        _update() {
            this.rootScene.clearDirtyFlag();
            this._traversalAllElement(function (ele) {
                ele.clearDirtyFlag();
            });

            // var preDraw = Date.now();
            //
            // this.rootScene.update();
            // this.cycleCount++;
            this.update();

            // var drawTime = Date.now() - preDraw;
            // this.updatetimelist.push(drawTime);
            // if (this.updatetimelist.length >= 30) {
            //     var average = this.countAverage(this.updatetimelist);
            //     this.updatetimelist = [];
            //     //console.log("update time average " + average);
            // }


        }

        /**
         * 接收傳遞的資料
         *
         * @abstract
         * @param extraData
         */
        receiveExtraDataWhenLevelStart(extraData){

        }

         /**
          * Count average.
          *
          * @param  list    The list.
          *
          * @return The total number of average.
          */
         countAverage(list) {
            var sum = 0;
            for (var i = 0; i < list.length; i++) {
                sum += list[i];
            }
            return sum / list.length;
        }

        /**
         * Teardowns this object.
         *
         * @private
         * @return  .
         */
        _teardown() {
            for (var i in this._allGameElement) {
                var deleteObj = this._allGameElement[i];
                if (Framework.Util.isFunction(deleteObj.teardown)) {
                    deleteObj.teardown();
                }
                this._allGameElement[i] = null;
                delete this._allGameElement[i];
            }
            this._allGameElement.length = 0;
            this.teardown();
        }

        /**
         * Gets changed rectangle.
         *
         * @param   maxWidth    The maximum width.
         * @param   maxHeight   The maximum height.
         *
         * @private
         * @return  The changed rectangle.
         */
        _getChangedRect(maxWidth, maxHeight) {
            var rect = {x: maxWidth, y: maxHeight, x2: 0, y2: 0};

            this._traversalAllElement(function (ele) {
                if (ele.isObjectChanged) {
                    var nowDiagonal = Math.ceil(Math.sqrt(ele.width * ele.width + ele.height * ele.height)),
                        nowX = Math.ceil(ele.absolutePosition.x - nowDiagonal / 2),
                        nowY = Math.ceil(ele.absolutePosition.y - nowDiagonal / 2),
                        nowX2 = nowDiagonal + nowX,
                        nowY2 = nowDiagonal + nowY,
                        preDiagonal = Math.ceil(Math.sqrt(ele.previousWidth * ele.previousWidth + ele.previousHeight * ele.previousHeight)),
                        preX = Math.ceil(ele.previousAbsolutePosition.x - preDiagonal / 2),
                        preY = Math.ceil(ele.previousAbsolutePosition.y - preDiagonal / 2),
                        preX2 = preDiagonal + preX,
                        preY2 = preDiagonal + preY,
                        x = (nowX < preX) ? nowX : preX,
                        y = (nowY < preY) ? nowY : preY,
                        x2 = (nowX2 > preX2) ? nowX2 : preX2,
                        y2 = (nowY2 > preY2) ? nowY2 : preY2;

                    if (x < rect.x) {
                        rect.x = x;
                    }

                    if (y < rect.y) {
                        rect.y = y;
                    }

                    if (x2 > rect.x2) {
                        rect.x2 = x2;
                    }

                    if (y2 > rect.y2) {
                        rect.y2 = y2;
                    }
                }
            });

            rect.width = rect.x2 - rect.x;
            rect.height = rect.y2 - rect.y;

            return rect;
        }

        /**
         *
         * @returns {Level}
         */
        forceDraw(){
            this._forceDraw = true;
            return this;
        }

        /**
         * Shows all element.
         *
         * @private
         * @return  .
         */
        _showAllElement() {
            this._traversalAllElement(function (ele) {
                console.log(ele, "ele.isMove", ele._isMove, "ele.isRotate", ele._isRotate, "ele.isScale", ele._isScale, "ele.changeFrame", ele._changeFrame, "ele.isObjectChanged", ele.isObjectChanged);
            });
        }
        
        /**
         * Draws the given context.
         *
         * @private
         * @param   ctx The context.
         *
         * @return  .
         */
        _draw(ctx) {
            this.rootScene.countAbsoluteProperty();
            if (this.canvasChanged) {
                //var rect = this._getChangedRect(ctx.canvas.width, ctx.canvas.height);
                //ctx.save();
                //ctx.beginPath();
                
                //ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
                //ctx.clip();

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // var preDraw = Date.now();

                // this.rootScene.draw(ctx);
                this.draw(ctx);
                //
                // var drawTime = Date.now() - preDraw;
                // this.timelist.push(drawTime);
                // if (this.timelist.length >= 30) {
                //     var average = this.countAverage(this.timelist);
                //     this.timelist = [];
                //     //console.log("draw time average " + average);
                // }

                //ctx.restore();
            }
        }

        /**
         * 初始化loadingProgress事件中會用到的圖片素材,
         * 建議降低此處要載入的圖片數量, 主要Game要用的圖片可以等到initialize再載入
         * @abstract
         */
        initializeProgressResource() {
        }

        /**
         * Loads this object.
         *
         * @abstract
         * @return  .
         */
        load() {
        }

        /**
         * 在載入圖片資源時, 要被繪製的畫面, 當不設定時, 會有預設的顯示畫面
         * 若不想要有該畫面, 可以override一個空的function
         * @param {Object} context 用來繪製的工具
         * @param {Object} requestInfo requestInfo.requset為發送request的數量,
         * requestInfo.response為已經有response的數量
         * requestInfo.percent為已完成的百分比
         */
        loadingProgress(context, requestInfo) {
            //context.font = '90px Arial';
            //context.fillText(Math.floor(Framework.ResourceManager.getFinishedRequestPercent()) + '%', context.canvas.width / 2 - 50, context.canvas.height / 2);
        }

        /**
         * 初始化整個Level, 並載入所有圖片資源
         * @abstract
         */
        initialize() {
        }

        /**
         * 用來撰寫遊戲邏輯, 不會去處理繪製的工作
         * 第一行必須撰寫 this.rootScene.update();
         */
        update() {
            this.rootScene.update();
        }

        /**
         * 用來繪製需要被繪製的GameObject
         * 第一行必須撰寫 this.rootScene.draw(context);
         * @param {Object} context 用來繪製的工具
         * @abstract
         */
        draw(context) {
            this.rootScene.draw(context);
        }

        /**
         * 處理點擊的事件, 當mousedown + mouseup 都成立時才會被觸發
         * @event click
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前點擊的絕對位置
         */
        click(e) {
        }

        /**
         * 處理滑鼠點下的事件
         * @event mousedown
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前點擊的絕對位置
         */
        mousedown(e) {
        }

        /**
         * 處理滑鼠放開的事件
         * @event mouseup
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前放開的絕對位置
         */
        mouseup(e) {
        }

        /**
         * 處理滑鼠移動的事件(不論是否有點下, 都會觸發該事件)
         * @event mousemove
         * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
         * 表示的是目前滑鼠的絕對位置
         */
        mousemove(e) {
        }

        /**
         * 處理觸控到螢幕時的事件, 若是在一般電腦上跑, 是不會觸發此事件的
         * (除非使用debugger模擬, https://developers.google.com/chrome-developer-tools/docs/mobile-emulation?hl=zh-TW)
         * @event touchstart
         * @param {Object} e 事件的參數,
         * 會用到的應該是e.touches[0].clientX和e.touches[0].clientY兩個參數,
         * 表示的是目前觸控到的位置
         */
        touchstart(e) {
        }

        touchend(e) {
        }

        /**
         * 處理觸控到螢幕並移動時的事件, 若是在一般電腦上跑, 是不會觸發此事件的
         * (除非使用debugger模擬, https://developers.google.com/chrome-developer-tools/docs/mobile-emulation?hl=zh-TW)
         * @event touchmove
         * @param {Object} e 事件的參數,
         * 會用到的應該是e.touches[0].clientX和e.touches[0].clientY兩個參數,
         * 表示的是目前最新觸控到的位置
         */
        touchmove(e) {
        }

        /**
         *
         * 處理鍵盤被壓下按鈕的事件
         * @event keydown
         * @param {Object} e 改寫過後的事件的參數表示按下去的最後一個鍵, 其包含有
         * altKey, ctrlKey, shiftKey表示是否按下的狀態,
         * firstTimeStamp 表示剛按下去這個按鈕的時間,
         * key 存的是按下去的鍵的string,
         * lastTimeDiff 則為剛按下這個鍵到目前有多久了
         * @param {Object} list 目前按下去所有可以被偵測到的鍵
         * @param {Object} oriE W3C定義的事件的e
         * 表示的是目前最新觸控到的位置
         * @example
         *
         * keydown (e, list) {
         *     if(e.key === 'A' && e.key.lastTimeDiff > 3000) {
         *         console.log('A');     //當A按下超過3秒, 才會印出A
         *     }
         *     if(list.A && list.B) {
         *         console.log('A+B');   //當A和B都被按下時, 才會印出A+B
         *     }
         * }
         * //FYI: 每個真正的keyCode與相對應的string
         * _keyCodeToChar = {
         *     8:'Backspace',9:'Tab',13:'Enter',
         *     16:'shiftKey',17:'ctrlKey',18:'altKey',19:'Pause/Break',
         *     20:'Caps Lock',27:'Esc',32:'Space',33:'Page Up',34:'Page Down',
         *     35:'End',36:'Home',37:'Left',38:'Up',39:'Right',40:'Down',
         *     45:'Insert',46:'Delete',48:'0',49:'1',50:'2',51:'3',52:'4',
         *     53:'5',54:'6',55:'7',56:'8',57:'9',65:'A',66:'B',67:'C',
         *     68:'D',69:'E',70:'F',71:'G',72:'H',73:'I',74:'J',75:'K',
         *     76:'L',77:'M',78:'N',79:'O',80:'P',81:'Q',82:'R',83:'S',
         *     84:'T',85:'U',86:'V',87:'W',88:'X',89:'Y',90:'Z',91:'Windows',
         *     93:'Right Click',96:'Numpad 0',97:'Numpad 1',98:'Numpad 2',
         *     99:'Numpad 3',100:'Numpad 4',101:'Numpad 5',102:'Numpad 6',
         *     103:'Numpad 7',104:'Numpad 8',105:'Numpad 9',106:'Numpad *',
         *     107:'Numpad +',109:'Numpad -',110:'Numpad .',111:'Numpad /',
         *     112:'F1',113:'F2',114:'F3',115:'F4',116:'F5',117:'F6',118:'F7',
         *     119:'F8',120:'F9',121:'F10',122:'F11',123:'F12',144:'Num Lock',
         *     145:'Scroll Lock',182:'My Computer',
         *     183:'My Calculator',186:';',187:'=',188:',',189:'-',
         *     190:'.',191:'/',192:'`',219:'[',220:'\\',221:']',222:'\''
         * };
         *
         */
        keydown(e) {
        }

        /**
         * 處理鍵盤被壓下按鈕的事件, 除了W3C定義的參數外,
         * Framework尚支援進階的功能history
         * @event keyup
         *  @param {Object} e 原生的事件參數
         *  @param {Object} history 儲存最近幾秒內keyup的按鍵
         * (可以用來處理類似小朋友齊打交, 發動攻擊技能的Scenario)
         * history可以設定多久清除一次, 請參考
         * {{#crossLink "KeyBoardManager/setClearHistoryTime:method"}}{{/crossLink}}
         * @example
         * keyup (e, history) {
         *     var right = history.length >= 3, i;
         *     if (history.length > 2) {
         *         for (i = 3; i > 0; i--) {
         *             right = right && (history[history.length - i].key === 'Right');
         *         }
         *     }
         *     if (right) {
         *         console.log(right);   //當一秒內按了右鍵超過3次, 才會印出true
         *     }
         * },
         */
        keyup(e, list, orgI) {
        }

        keypress(e) {
        }

        teardown() {
        }

        autodelete() {
            for (var i in this.rootScene.attachArray) {
                if (Framework.Util.isFunction(this.rootScene.attachArray[i].teardown)) {
                    this.rootScene.attachArray[i].teardown();
                }
                this.rootScene.attachArray[i] = null;
                delete this.rootScene.attachArray[i];
            }
            this.rootScene.attachArray.length = 0;
            this._teardown();
        }

        get isCurrentLevel(){
            return Framework.Game._currentLevel==this;
        }
    };

    Object.defineProperty(Framework.Level.prototype, 'canvasChanged', {
        get: function () {
            if(this._forceDraw) {
                this._forceDraw=false;
                return true;
            }

            return this._allGameElement.some(e=>e.isObjectChanged);
        }

    });

    return Framework;
})(Framework || {});