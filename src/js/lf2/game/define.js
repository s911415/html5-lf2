'use strict';
(function (window) {
    const BASE_PATH = "./";
    /**
     * 定義遊戲內部用到的常數即設定，例如是否為DEBUG模式、或是預設的血量等
     * @type {
            {
                DEBUG: boolean,
                SHOW_PLAYER_COUNT: number,
                BASE_PATH: string,
                DATA_PATH: string,
                IMG_PATH: string,
                MUSIC_PATH: string,
                BGM_PATH: string,
                ZIP_PATH: string,
                PLAYER_COUNT: number,
                KEYBOARD_CONFIG_KEY: string,
                TEAM_COUNT: number,
                BGM_VOLUME: number,
                LOADING_MIN_TIME: number,
                MAX_ITEM_COUNT: number,
                INF_MP: boolean,
                MAP_SMOOTHLY: boolean
            }
        }
     */
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

        MAX_ITEM_COUNT: 200,

        INF_MP: false, //Infinity MP

        MAP_SMOOTHLY: false,

    };

    // Object.freeze(window.define);
})(window);