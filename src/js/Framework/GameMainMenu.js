/**
 * Created by Raccoon on 2014/1/24.
 */

'use strict';
var Framework = (function (Framework) {
    Framework.GameMainMenu = class extends Framework.Level {
        constructor() {
            super();
            this.autoDelete = false;
        }
    };

    return Framework;
})(Framework || {});
