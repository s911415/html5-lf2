"use strict";
var lf2 = (function (lf2) {
    const _FIGHT_CONTAINER_ID = "__fight_container";
    const PLAYER_TAG = 'data-player';
    const Point = Framework.Point;
    const Game = Framework.Game;
    const Sprite = Framework.Sprite;
    const Character = lf2.Character;
    const Practice = lf2.Practice;
    const GameMap = lf2.GameMap;
    const Fighter = lf2.Fighter;
    const KeyboardConfig = lf2.KeyboardConfig;
    const Player = lf2.Player;
    const WorldScene = lf2.WorldScene;
    const ResourceManager = Framework.ResourceManager;
    const PlayerStatusPanel = lf2.PlayerStatusPanel;
    /**
     * @class lf2.FightLevel
     * @extends {Framework.Level}
     * @implements Framework.MouseEventInterface
     * @implements Framework.KeyboardEventInterface
     */
    lf2.FightLevel = class FightLevel extends Framework.Level {
        constructor() {
            super();

            this.html = '';
            //Load Setting view
            this._htmlLoader = ResourceManager.loadResource(define.DATA_PATH + 'FightScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
            });
        }

        /**
         * 接收傳遞的資料
         *
         * @override
         * @param extraData
         */
        receiveExtraDataWhenLevelStart(extraData) {
            this.config = {
                players: [],
                mapId: extraData.mapId,
            };

            for (let playerId in extraData.players) {
                playerId = intval(playerId);
                if (isNaN(playerId)) continue;

                this.config.players[playerId] = new Player(playerId, extraData.players[playerId].charId);
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
            this.world = new WorldScene(this.config);
            this.rootScene.attach(this.world);

            this._statusPanels = new Array(define.SHOW_PLAYER_COUNT);

            //attach player's character
            this.config.players.forEach((player, i) => {
                //TODO: debug use
                player.character.position = new Framework.Point3D(Framework.Config.canvasWidth / 2, Framework.Config.canvasHeight / 2, 0);
                player.status.setElem(this._statusPanels[i]);
                //Framework.Game._currentLevel.config.players[0].character.setFrameById(210);
            });

            this._funcStatus = {
                'F6': 0,
                'F7': 0,
            };

            this._anyFuncPressed = false;

            this._container = undefined;
            this._htmlLoader.then(()=>{
                this.showPanel();
            });

            //TODO: debug use
            this.config.players[0].character.position = new Point(100, 360);
            //this.config.players[1].character.position = new Point(800, 300);
        }

        /**
         * initialize()
         *
         * Initializes this object.
         *
         * @return  .
         */
        initialize() {
        }

        /**
         * update()
         *
         * Updates this object.
         *
         * @return  .
         */
        update() {
            super.update();

            //update each player status
            this.config.players.forEach((player) => {
                player.update();
                player.status.update();
            });
        }

        /**
         * draw(ctx)
         *
         * Draws the given context.
         *
         * @param   ctx The context.
         *
         * @return  .
         */
        draw(ctx) {
            super.draw(ctx);


            //Draw each player status
            this.config.players.forEach((player) => {
                player.status.draw(ctx);
            });

            if (this._anyFuncPressed) {
                let funcStr = 'Function Keys Used: ';
                for (let k in this._funcStatus) {
                    funcStr += `　${k}: ${this._funcStatus[k]} time(s)`;
                }

                this._funcBar.textContent = funcStr;

                // ctx.textAlign = "start";
                // ctx.font = "12px Arial";
                // ctx.textBaseline = "middle";
                // ctx.fillStyle = "#FFF";
                // ctx.fillText(funcStr, 3, 120);
            }
        }

        /**
         * keydown(e, list, oriE)
         *
         * Keydowns.
         *
         * @param   e       The unknown to process.
         * @param   list    The list.
         * @param   oriE    The ori e.
         *
         * @return  .
         */
        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);
            this.config.players.forEach((player) => {
                player.keydown(oriE);
            });

            let curCount = (this._funcStatus[e.key] !== undefined) ? ++this._funcStatus[e.key] : 0;
            //Handle func key
            switch (e.key) {
                case 'F4'://Restart Game
                    Framework.Game.goToLevel('selection');
                    break;
                case 'F6'://INF MP
                    let infMpStatus = curCount % 2 === 1;
                    this.config.players.forEach((player) => {
                        player.setInfMp(infMpStatus);
                    });
                    break;
                case 'F7'://Recover players
                    this.config.players.forEach((player) => {
                        player.addHp(500);
                        player.addMp(500);
                    });
                    break;
                default:
            }

            if (curCount !== 0) this._anyFuncPressed = true;
        }

        /**
         * keyup(e, list, oriE)
         *
         * Keyups.
         *
         * @param   e       The unknown to process.
         * @param   list    The list.
         * @param   oriE    The ori e.
         *
         * @return  .
         */
        keyup(e, list, oriE) {
            super.keyup(e, list, oriE);
        }

        keypress(e, list, oriE){
        }

        /**
         * click(e)
         *
         * Clicks the given e.
         *
         * @param   e   The unknown to process.
         *
         * @return  .
         */
        click(e) {

        }

        autodelete(){
            super.autodelete();

            if (this._container) {
                this._container.remove();
                this._container = undefined;
            }
        }

        showPanel(){
            if (!this.isCurrentLevel) return;
            if (this.html !== "" && !this._container) {
                $("#" + _FIGHT_CONTAINER_ID).remove();

                this._container = $(this.html);
                this._container.attr("id", _FIGHT_CONTAINER_ID);
                this._funcBar = this._container.find("#funcKeyStatus")[0];


                const _statusPanelsTarget = this._container.find("#statusPanels");

                let statusPanelTemplate = _statusPanelsTarget.find(".status");
                for (let i = 0; i < define.SHOW_PLAYER_COUNT; i++) {
                    this._statusPanels[i] = statusPanelTemplate.clone()[0];
                    this._statusPanels[i].setAttribute(PLAYER_TAG, i.toString());
                    this._statusPanels[i].hp = this._statusPanels[i].querySelector('.hp');
                    this._statusPanels[i].mp = this._statusPanels[i].querySelector('.mp');
                    this._statusPanels[i].small = this._statusPanels[i].querySelector('.small');

                    _statusPanelsTarget.append(this._statusPanels[i]);
                    if(this.config.players[i]){
                        this.config.players[i].status.setElem(this._statusPanels[i]);
                    }
                }
                statusPanelTemplate.remove();


                $("body").append(this._container);
                Game.resizeEvent();
            }
        }
    };

    return lf2;
})(lf2 || {});
