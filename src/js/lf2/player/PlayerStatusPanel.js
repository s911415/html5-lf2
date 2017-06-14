"use strict";
var lf2 = (function (lf2) {
    const Sprite = Framework.Sprite;
    const Point = Framework.Point;
    const PANEL_SIZE = new Point(198, 53);
    const PANEL_PER_ROW_COUNT = Math.floor(Framework.Config.canvasWidth / PANEL_SIZE.x);
    const PANEL_COL_COUNT = 2;
    const ColorBar = lf2.ColorBar;
    const Utils = lf2.Utils;

    const HP_COLOR = "#ff0000";
    const HP_DARK_COLOR = "#6f081f";

    const MP_COLOR = "#0000ff";
    const MP_DARK_COLOR = "#1f086f";

    const SMALL_POSITION = new Point(7, 4);
    const BAR_SIZE = new Point(124, 10);

    const HP_POSITION = new Point(57, 15);
    const MP_POSITION = new Point(57, 35);

    const getEleTransformX = (val) => {
        return "translateX(" + (val - 100) + "%)";
    };
    /**
     * Player HP Panel
     *
     * @type {PlayerStatusPanel}
     * @class lf2.PlayerStatusPanel
     * @implements Framework.AttachableInterface
     */
    lf2.PlayerStatusPanel = class PlayerStatusPanel {
        /**
         *
         * @param {lf2.Player} player
         */
        constructor(player) {
            this._player = player;
            const playerIndex = this._player.playerId;
            const _ROW = (playerIndex / PANEL_PER_ROW_COUNT) | 0;
            const _COL = (playerIndex % PANEL_PER_ROW_COUNT);

            this.panelPosition = new Point(
                _COL * PANEL_SIZE.x,
                _ROW * PANEL_SIZE.y
            );

            //this._realHPPosition = this.getRealPosition(HP_POSITION);
            //this._realMPPosition = this.getRealPosition(MP_POSITION);

            //this._darkHPBar = new ColorBar(HP_DARK_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            //this._darkHPBar.position = this._realHPPosition;

            //this._darkMPBar = new ColorBar(MP_DARK_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            //this._darkMPBar.position = this._realMPPosition;

            //this._hpBar = new ColorBar(HP_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            //this._hpBar.position = this._realHPPosition;
            this._hpRatio = 1;

            //this._mpBar = new ColorBar(MP_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            //this._mpBar.position = this._realMPPosition;
            this._mpRatio = 1;

            this._elem = undefined;

            this._lastTeam = undefined;
        }

        /**
         * Sets an element.
         *
         * @param   elem    The element.
         *
         * @return  .
         */
        setElem(elem) {
            if (elem && elem.hp && elem.mp && elem.small) {
                this._elem = elem;
                elem.setAttribute('attached', '1');

                this._flagIcon = elem.flag;
                this._hpValueBar = elem.hp.querySelector('.value');
                this._mpValueBar = elem.mp.querySelector('.value');

            }
        }

        /**
         * load()
         *
         * Loads this object.
         *
         * @return  .
         */
        load() {
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            this._hpRatio = this._player.hp / lf2.Player.prototype.DEFAULT_HP;
            this._mpRatio = this._player.mp / lf2.Player.prototype.DEFAULT_HP;

            this._hpRatio = (Utils.returnInRangeValue(this._hpRatio, 0, 1) * 100) | 0;
            this._mpRatio = (Utils.returnInRangeValue(this._mpRatio, 0, 1) * 100) | 0;

            //this._hpBar.width = BAR_SIZE.x * this._hpRatio;
            //this._mpBar.width = BAR_SIZE.x * this._mpRatio;
        }


        /**
         *
         * @param {CanvasRenderingContext2D} ctx
         */
        draw(ctx) {
            if (this._elem) {
                const elem = this._elem;
                if (elem.small.src !== this._player.character.small.src) {
                    elem.small.src = this._player.character.small.src;
                }

                if (this._lastTeam !== this._player.team) {
                    this._elem.setAttribute('data-team', this._player.team.id);
                    this._elem.setAttribute('data-team-str', this._player.team);

                    this._flagIcon.style.color = this._player.team.getColor();
                    this._lastTeam = this._player.team;
                }

                this._hpValueBar.style.transform = getEleTransformX(this._hpRatio);
                this._mpValueBar.style.transform = getEleTransformX(this._mpRatio);
            }
            // //Draw small people
            // ctx.drawImage(
            //     this._player.character.small,
            //     SMALL_POSITION.x + this.panelPosition.x,
            //     SMALL_POSITION.y + this.panelPosition.y
            // );
            //
            // //Draw dark hp and mp bar
            // this._darkHPBar.draw(ctx);
            // this._darkMPBar.draw(ctx);
            //
            // //Draw hp and mp bar
            // this._hpBar.draw(ctx);
            // this._mpBar.draw(ctx);
        }

        /**
         * Gets real position.
         *
         * @param  {Framework.Point} point   The point.
         *
         * @return {Framework.Point} The real position.
         */
        getRealPosition(point) {
            let x = point.x + this.panelPosition.x;
            let y = point.y + this.panelPosition.y;

            return new Point(x, y);
        }

        /**
         * Hp radio.
         *
         * @return  {Number}   A get.
         */
        get HPRadio() {
            return this._hpRatio;
        }

        /**
         * Mp radio.
         *
         * @return  {Number}   A get.
         */
        get MPRadio() {
            return this._mpRatio;
        }
    };
    lf2.PlayerStatusPanel.prototype.PANEL_SIZE
        = lf2.PlayerStatusPanel.PANEL_SIZE = PANEL_SIZE;

    lf2.PlayerStatusPanel.prototype.PANEL_PER_ROW_COUNT
        = lf2.PlayerStatusPanel.PANEL_PER_ROW_COUNT = PANEL_PER_ROW_COUNT;

    lf2.PlayerStatusPanel.prototype.PANEL_COL_COUNT
        = lf2.PlayerStatusPanel.PANEL_COL_COUNT = PANEL_COL_COUNT;

    return lf2;
})(lf2 || {});