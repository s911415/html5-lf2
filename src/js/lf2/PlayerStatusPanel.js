"use strict";
var lf2 = (function (lf2) {
    const Sprite = Framework.Sprite;
    const Point = Framework.Point;
    const PANEL_SIZE = new Point(198, 53);
    const PANEL_PER_ROW_COUNT = Math.floor(Framework.Config.canvasWidth / PANEL_SIZE.x);
    const PANEL_COL_COUNT = 2;
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
                _COL * PANEL_SIZE.x + PANEL_SIZE.x / 2,
                _ROW * PANEL_SIZE.y + PANEL_SIZE.y / 2
            );

        }

        load() {
        }


        update() {
            //DO NOTHING
        }

        /**
         *
         * @param {CanvasRenderingContext2D} ctx
         */
        draw(ctx) {

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