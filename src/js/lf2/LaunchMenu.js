"use strict";
var lf2 = (function (lf2) {
    const ResourceManager = Framework.ResourceManager;
    const _MENU_CONTAINER_ID = "__main_menu";

    /**
     * @class MyMenu
     * @namespace lf2
     * @extends {Framework.GameMainMenu}
     * @type {{}}
     */
    lf2.MyMenu = class extends Framework.GameMainMenu {
        //初始化loadingProgress需要用到的圖片

        //在initialize時會觸發的事件
        loadingProgress(ctx, requestInfo) {
            super.loadingProgress(ctx, requestInfo);

            ctx.font = '90px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText(Math.round(requestInfo.percent) + '%', ctx.canvas.width / 2, ctx.canvas.height / 2 + 300);
        }

        load() {
            super.load();

            this.html = '';
            this._menuAttached = false;
            this._menuContainer = undefined;
            //Load Menu view
            ResourceManager.loadResource(define.DATA_PATH + 'LaunchScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
            });
        }

        initialize() {
            $("#" + _MENU_CONTAINER_ID).remove();
        }

        update() {
            super.update();

            if (this.html !== "" && !this._menuAttached) {
                this._menuContainer = $(this.html);
                this._menuContainer.attr("id", _MENU_CONTAINER_ID);
                this.forceDraw();
            }
        }

        draw(parentCtx) {
            super.draw(parentCtx);

            if(!this._menuAttached){
                $("body").append(this._menuContainer);
                this._menuAttached = true;
            }
        }

        click(e, list, orgE){
            debugger;
        }


        autodelete(){
            if(this._menuContainer){
                this._menuContainer.parentNode.removeChild(this._menuContainer);
            }

            //reverse autodelete called to remove menu container first
            super.autodelete();
        }
    };

    return lf2;
})(lf2 || {});
