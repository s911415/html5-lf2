"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const BDY_START_TAG = 'bdy:';
    const BDY_END_TAG = 'bdy_end:';
    const ITR_START_TAG = 'itr:';
    const ITR_END_TAG = 'itr_end:';
    const SOUND_TAG = 'sound:';
    const OPOINT_START_TAG = 'opoint:';
    const OPOINT_END_TAG = 'opoint_end:';
    const BPOINT_START_TAG = 'bpoint:';
    const BPOINT_END_TAG = 'bpoint_end:';

    const Body = lf2.Body;
    const ObjectPoint = lf2.ObjectPoint;
    const BloodPoint = lf2.BloodPoint;
    const Interaction = lf2.Interaction;
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const KeyboardConfig = lf2.KeyboardConfig;

    /**
     * Frame
     * 提供人物、氣功波各種畫格資訊儲存功能
     * <frame>=動作開始
         72 super_punch=號碼和名

         pic: 8 =圖檔位置(從0開始算)

         <特別說明>18的攻擊會傷及我方。


         wait: 2 =停頓時間

         next: 73 =下一個動作是

         dvx: =向前後行多少
         dvy: =向天,地行多少
         dvz: =向上下行多少

         centerx: 是以哪一點作為人物的中央
         centery: 是以哪一點作為人物的底部(腳的位置)

         hit_a: 按攻擊時,跳到哪一個frame?
         hit_d: 按防衛時,跳到哪一個frame?
         hit_j: 按跳時,跳到哪一個frame?
         hit_Ua: 按"防上攻"時,跳到哪一個frame?
         hit_Uj: 按"防上跳"時,跳到哪一個frame?
         hit_Da: 按"防下攻"時,跳到哪一個frame?
         hit_Dj: 按"防下跳"時,跳到哪一個frame?
         hit_Fa: 按"防前攻"時,跳到哪一個frame?
         hit_Fj: 按"防前跳"時,跳到哪一個frame?
         hit_ja: 按"防跳攻"時,跳到哪一個frame?

         <特別說明>
         1.next:0是不斷重複此動作，hit_???:的0是指沒有設定。
         2.next、hit_? :999是指回到隨機動作
         3.next、hit_? :1000是消失
         4.next: -??? 會反向進行第???個frame
         5.next:1200~1299是隱形
     *
     * @type {Frame}
     * @class lf2.Frame
     */
    lf2.Frame = class Frame {
        /**
         *
         * @param {String} context
         * @param {lf2.GameObject} gameObj Game Object
         */
        constructor(context, gameObj) {
            this.sourceCode = context;
            let lines = context.lines();
            let infoArr = lines[0].split(/\s+/);

            this._gameObj = gameObj;

            this.id = intval(infoArr[0]);
            this.name = infoArr[1];

            let picIndex = 1;
            while (picIndex < lines.length && lines[picIndex].indexOf('pic') === -1) picIndex++;

            this.data = Utils.parseDataLine(lines[picIndex]);

            let opoint = context.getStringBetween(OPOINT_START_TAG, OPOINT_END_TAG);
            let bpoint = context.getStringBetween(BPOINT_START_TAG, BPOINT_END_TAG);

            this.opoint = opoint ? new ObjectPoint(opoint) : undefined;
            this.bpoint = bpoint ? new BloodPoint(bpoint) : undefined;

            this.mp = intval(this.data.get('mp') || 0);


            let itr = context.getStringBetweenMulti(ITR_START_TAG, ITR_END_TAG);
            if (itr.length > 0) {
                /**
                 *
                 * @type {lf2.Interaction[]}
                 */
                this.itr = [];
                itr.forEach(
                    itrString => {
                        let iStr = itrString.trim();
                        if (iStr) {
                            this.itr.push(new Interaction(iStr));
                        }
                    }
                )
            } else {
                this.itr = undefined;
            }

            // let bdy = context.getStringBetweenMulti(BDY_START_TAG, BDY_END_TAG);
            // if (bdy.length > 0) {
            //     this.bdy = bdy.map(
            //         bdyString =>
            //             new Body(bdyString.trim())
            //     );
            // } else {
            //     this.bdy = undefined;
            // }
            let bdy = context.getStringBetween(BDY_START_TAG, BDY_END_TAG);
            bdy = bdy ? bdy.trim() : bdy;
            this.bdy = bdy ? new Body(bdy) : undefined;


            this.soundPath = (function () {
                let soundStr = undefined;
                for (let i = 0; i < lines.length; i++) {
                    const lineStr = lines[i].trim();
                    if (lineStr.startsWith(SOUND_TAG)) {
                        soundStr = Utils.parseDataLine(lineStr).get('sound');
                        break;
                    }
                }

                if (soundStr !== undefined) {
                    soundStr = define.MUSIC_PATH + soundStr;

                    return soundStr;
                }

                return undefined;
            })();

            this.hit = (() => {
                let ret = {};
                KeyboardConfig.HIT_KEY.HIT_LIST.forEach((k) => {
                    const val = intval(this.data.get('hit_' + k) || 0);
                    ret[KeyboardConfig.HIT_KEY[k]] = ret[k] = val;
                });

                return ret;
            })();

            this._velocity = new Point3D(
                intval(this.data.get('dvx') || 0),
                intval(this.data.get('dvy') || 0),
                intval(this.data.get('dvz') || 0)
            );

            this._center = new Point(
                intval(this.data.get('centerx')),
                intval(this.data.get('centery'))
            );
        }

        /**
         * Get picture index
         * @property pictureIndex
         * @returns {Number}
         */
        get pictureIndex() {
            return intval(this.data.get('pic') || 0);
        }

        /**
         * Get current state
         *
         * 0=站立(stand)
         * 1=行走(walk)
         * 2=跑步(run)
         * 3=普通拳腳攻擊(punch)
         * 4=跳(jump)
         * 5=突進(dash，即跑+跳)
         * 7=擋(defend)
         * 8=破擋(broken defend)
         * 9=捉人(catching)
         * 10=被捉(picked caught)
         * 11=被攻擊(injured)
         * 12=fall大於60才會被打到
         * 13=有冰碎效果
         * 14=倒在地上(lying，可使com不會追你)
         * 15=被冰封(ice，可被同盟攻擊)
         * 16=暈眩(tired)可被敵人捉住
         * 17=喝(weapon drink)可以喝的物件被消耗
         * 18=燃燒(fire，可攻擊我方同盟)
         * 19=firen的烈火焚身(burn run)
         * 301=deep的鬼哭斬(dash sword，此state具有人物上下移動的功能)
         * 400=woody瞬間轉移(teleport，移往最近的敵人)
         * 401=woody瞬間轉移(teleport，移往最近的隊友)
         * 500=rudolf轉換成其他角色(transform)
         * 501=rudolf轉換回來(transform_b)
         * 1700=治療自己
         * 9995=變身成LouisEX(transform，任何人都可以)
         * 9996=爆出盔甲(transform，任何人都可以)
         * 9997=訊息(come,move之類，能在任何地方看見)
         * 9998=訊息刪除
         * 9999=毀壞的武器(broken weapon)
         *
         * @returns {Number}
         */
        get state() {
            return intval(this.data.get('state') || 0);
        }

        /**
         * get wait()
         *
         * Gets the wait.
         *
         * @return  {Number}   A get.
         */
        get wait() {
            return intval(this.data.get('wait') || 0) + 1;
        }

        /**
         * Get Next frame id
         * @returns {Number}
         */
        get nextFrameId() {
            return intval(this.data.get('next') || 0);
        }

        /**
         * Get offset of item
         * @returns {Framework.Point3D}
         */
        get velocity() {
            return this._velocity;
        }

        /**
         *
         * @returns {Framework.Point}
         */
        get center() {
            return this._center;
        }

        get size() {
            if (this._sizeCache === undefined) {
                /**
                 * @type {lf2.ImageInformation}
                 */
                const img = this._gameObj.bmpInfo.imageNormal[this.pic];


                this._sizeCache = new Point(
                    img.rect.width, img.rect.height
                );
            }

            return this._sizeCache;
        }
    };


    return lf2;
})(lf2 || {});