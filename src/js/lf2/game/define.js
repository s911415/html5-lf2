'use strict';
(function (window) {
    const BASE_PATH = "./";

    window.define = {
        DEBUG: false,
        SHOW_PLAYER_COUNT: 8,

        BASE_PATH: BASE_PATH,
        DATA_PATH: BASE_PATH + "data/",
        IMG_PATH: BASE_PATH + "image/",
        MUSIC_PATH: BASE_PATH + "music/",
        BGM_PATH: BASE_PATH + "music/bgm/",
        ZIP_PATH: BASE_PATH + "zip/",

        PLAYER_COUNT: 4,
        KEYBOARD_CONFIG_KEY: "keyConfig",
        TEAM_COUNT: 4,

        BGM_VOLUME: .3,

        LOADING_MIN_TIME: 0 * 1000,

        INF_MP: false, //Infinity MP

        MAP_SMOOTHLY: false,

    };

    // Object.freeze(window.define);
})(window);