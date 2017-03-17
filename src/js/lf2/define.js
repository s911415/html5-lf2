'use strict';
(function (window) {
    const BASE_PATH = "./";

    window.define = {
        DEBUG: true,

        BASE_PATH: BASE_PATH,
        DATA_PATH:BASE_PATH + "data/",
        IMG_PATH:BASE_PATH + "image/",
        MUSIC_PATH:BASE_PATH + "music/",

        PLAYER_COUNT: 2,
        KEYBOARD_CONFIG_KEY: "keyConfig",

        LOADING_MIN_TIME: 0 * 1000,

        INF_MP: true, //Infinity MP

    };

    Object.freeze(window.define);
})(window);