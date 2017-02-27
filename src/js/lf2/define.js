'use strict';
(function (window) {
    const BASE_PATH = "./";

    window.define = {
        BASE_PATH: BASE_PATH,
        DATA_PATH:BASE_PATH + "data/",
        IMG_PATH:BASE_PATH + "image/",
        MUSIC_PATH:BASE_PATH + "music/",

        PLAYER_COUNT: 2,
        KEYBOARD_CONFIG_KEY: "keyConfig",

    };

    Object.freeze(window.define);
})(window);