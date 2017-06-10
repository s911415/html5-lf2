'use strict';
var Framework = (function (Framework) {
    const METHOD_NOT_IMPLEMENT = "Method Not Implemented";
    /**
     * Keyboard Event Interface
     * 提供鍵盤事件的介面
     *
     * @interface Framework.KeyboardEventInterface
     * @type {KeyboardEventInterface}
     */
    Framework.KeyboardEventInterface = class KeyboardEventInterface {

        /**
         *
         * 處理鍵盤被壓下按鈕的事件
         *
         * @abstract
         * @event keydown
         * @param {Object} e 改寫過後的事件的參數表示按下去的最後一個鍵, 其包含有
         * altKey, ctrlKey, shiftKey表示是否按下的狀態,
         * firstTimeStamp 表示剛按下去這個按鈕的時間,
         * key 存的是按下去的鍵的string,
         * lastTimeDiff 則為剛按下這個鍵到目前有多久了
         *  @param {Object} list 目前按下去所有可以被偵測到的鍵
         *  @param {KeyboardEvent} oriE W3C定義的事件的e
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
        keydown(e, list, oriE) {

        }


        /**
         * 處理鍵盤被壓下按鈕的事件, 除了W3C定義的參數外,
         * Framework尚支援進階的功能history
         *
         * @abstract
         * @event keyup
         *  @param {Object} e 原生的事件參數
         *  @param {Object} history 儲存最近幾秒內keyup的按鍵
         * (可以用來處理類似小朋友齊打交, 發動攻擊技能的Scenario)
         * history可以設定多久清除一次, 請參考
         * {{#crossLink "KeyBoardManager/setClearHistoryTime:method"}}{{/crossLink}}
         *  @param {KeyboardEvent} oriE W3C定義的事件的e
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
        keyup(e, history, oriE) {
        }
    };

    return Framework;
})(Framework || {});
