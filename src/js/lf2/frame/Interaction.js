"use strict";
var lf2 = (function (lf2) {
    const Point = Framework.Point;
    const Utils = lf2.Utils;
    const Rectangle = lf2.Rectangle;
    /**
     * Interaction
     * 提供Frame攻擊範圍及資訊儲存功能
     * ◎itr解說◎
         itr: =身體攻擊動作開始

         kind:
         0=特殊特技
         1=捉住暈眩(state:16)的人
         2=撿武器
         3=強迫抓人
         6=敵人靠近按A時是重擊
         7=撿武器不影響動作
         8=injury數值變成治療多少hp，動作跳至dvx:?
         9=打中敵人自己hp歸0(如John的防護罩)
         10=henry魔王之樂章效果
         11=henry魔王之樂章效果
         14=阻擋
         15=飛起
         16=結冰
         10??=被你打到會跳到第???個frame(如人質的kind)

         x: 40 ,w: 35=攻擊前~後的距離   y: 5 ,h: 45 攻擊上~下的距離

         dvx:3   =打中會往後彈後多遠
         dvy:-10 =打中會彈多高(負值是向天空，正值是向地面)

         fall: 70 =倒下的機會
         fall: 0 是敵人只動一下
         fall: 30 是打兩下敵人就暈
         fall: 40 是打一下往後退打第二下就倒地
         fall: 60 是打一下暈眩打第二下就倒地
         fall: 70 是必定倒地

         vrest:15 =同一個frame打到人的中間間隔時間(vrest越小，同一個frame就會打
         到越多下)。如Davis的昇龍霸，原本vrest只有10，若改的更低，則
         會造成如強化網頁的地獄真升龍的連擊效果。
         ※注意：vrest值最低只能是4，更低的話打到人會卡住。
         (強化網頁的地獄吸星萬印

         arest: (vrest無效)一攻擊到一個人，多久後才能再打一個人


         bdefend: 60 =破擋的機會(即打破敵人防禦的機會)
         bdefend: 60打一次就破擋；同fall，如值是16則16+16+16+16大於60所以值是16
         時打敵人4下就破擋。
         bdefend: 100則完全擋不住，就算按擋也會讓你直接被打到，連破擋的動作都跳
         過。且有防禦效果的人物(如Julian.Knight.Louis)也防不住；道具也
         會直接被毀掉(不論道具的HP有多少)。

         injury: 40 =殺傷力(即損害敵人hp多少；玩家的hp是預設值的500)

         在injury後面加上以下effect會有特效(僅限於kind:0時有作用)
         effect: 0 拳擊
         effect: 1 利器攻擊
         effect: 2 著火
         effect: 3 結冰
         effect: 4 穿過敵人(僅能打中type:1.2.3.4.5.6的物件)
         effect: 5 (或以上)沒效果，也打不中任何東西
         effect: 20 定身火
         effect: 21 定身火
         effect: 22 定身火
         effect: 30 定身冰

         effect可以加上負號(有效果但無聲音)。
         若要加大攻擊的z軸範圍,只要在effect或injury的後面加上zwidth: ??即可
         (沒有effect就是加在injury的後面,若有effect則加在effect的後面)

         itr_end: =身體攻擊動作結束


         <特別說明>大範圍攻擊→
         itr:
         kind: 0 x: -x y: -x w: x h: x dvx: ? dvy: ? fall: ? vrest: ?
         bdefend: ? injury: ? zwidth: x effect: ?
         itr_end:

         x數值越高則範圍越大，?數值是看自己高興填寫的。
     *
     * @class lf2.Interaction
     */
    lf2.Interaction = class Interaction {
        /**
         *
         * @param {String} content
         */
        constructor(content) {
            this.info = Utils.parseDataLine(content.replace(/\r?\n/g, ""));
            this.kind = intval(this.info.get('kind') || 0);
            this.rect = new Rectangle(
                intval(this.info.get('w')), intval(this.info.get('h')),
                intval(this.info.get('x')), intval(this.info.get('y'))
            );

            this.zwidth = intval(this.info.get('zwidth') || 12);

            this.dv = new Point(
                intval(this.info.get('dvx') || 0),
                intval(this.info.get('dvy') || 0)
            );

            this.fall = intval(this.info.get('fall') || 20);

            this.vrest = intval(this.info.get('vrest') || 0);
            this.arest = intval(this.info.get('arest') || 7);

            this.hasArest = this.info.get('arest') !== undefined;
            this.hasVrest = this.info.get('vrest') !== undefined;

            this.injury = intval(this.info.get('injury') || 0);
            this.bdefend = intval(this.info.get('bdefend') || 0);

            this.effect = intval(this.info.get('effect') || 0);

            this._filterFall();
        }

        /**
         * Filter fall.
         *
         * @return  {Number} fall filtered
         */
        _filterFall() {
            switch (this.fall) {
                case 70:
                    this.fall = 100;
                    break;
                case 60:
                    this.fall = 70;
                    break;
                case 40:
                    this.fall = 50;
                    break;
                case 30:
                    this.fall = 30;
                    break;
            }
        }
    };


    return lf2;
})(lf2 || {});