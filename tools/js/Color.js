"use strict";
class Color {
    /**
     *
     * @param {int} r
     * @param {int} g
     * @param {int} b
     */
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }


    /**
     * Parse color
     * @param {String} hexStr
     * @returns {Color}
     */
    static parse(hexStr) {
        if (hexStr.startsWith("#")) hexStr = hexStr.substr(1);
        if (hexStr.length == 3) {
            hexStr = hexStr[0] + hexStr[0] +
                hexStr[1] + hexStr[1] +
                hexStr[2] + hexStr[2];
        }

        let r = parseInt(hexStr.substr(0, 2), 16),
            g = parseInt(hexStr.substr(2, 2), 16),
            b = parseInt(hexStr.substr(4, 2), 16);

        return new Color(r, g, b);
    }

    /**
     * Convert color to array
     * @returns {Array}
     */
    toArray() {
        return [this.r, this.g, this.b];
    }
}