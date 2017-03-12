"use strict";
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

/**
 * Load Script In Sequence
 *
 * @param {Array} scriptArray
 * @param {Function|null} [callback]
 * @method LoadScriptInSequence
 */
function LoadScriptInSequence(scriptArray, callback) {
    const loadScriptDOM = function (index) {
        if (index >= scriptArray.length) return callback ? callback() : null;
        let script = document.createElement("script");
        script.src = scriptArray[index];
        script.addEventListener('load', () => {
            loadScript(index + 1);
        });
        document.head.appendChild(script);
    };

    const loadScriptFetch = function (index) {
        if (index >= scriptArray.length) return callback ? callback() : null;
        return fetch(scriptArray[index], {
            method: "GET",
            redirect: 'follow',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'text/javascript'
            },
        })
            .then(res => res.blob())
            .then((blob) => {
                let script = document.createElement("script");
                script.src = URL.createObjectURL(blob);
                document.head.appendChild(script);

                return loadScript(index + 1);
            });
    };
    const loadScript = loadScriptDOM;

    let basePath = '';
    if (this instanceof HTMLScriptElement) {
        basePath = this.src.slice(0, this.src.lastIndexOf('/') + 1);

        scriptArray = scriptArray.map((src) => {
            if (src.startsWith('/')) return src;
            return basePath + src;
        });
    }
    return loadScript(0);
}

/**
 * Try convert an object to array
 * @param obj
 * @returns {*}
 */
Array.prototype.toArray = (obj) => {
    return Array.prototype.slice.call(obj);
};

/**
 * Get context between a string
 * @param {String} startString
 * @param {String} endString
 * @param {Number} [fromIndex] default = 0
 *
 * @returns {String} context
 */
String.prototype.getStringBetween = function (startString, endString, fromIndex) {
    if (fromIndex === undefined) fromIndex = 0;

    let startIndex = this.indexOf(startString, fromIndex);
    let endIndex = this.indexOf(endString, startIndex);

    if (startIndex === -1) return "";

    if (endIndex === -1) return this.substr(startIndex);

    //Remove Starting String
    startIndex += startString.length;

    return this.substring(startIndex, endIndex);
};

/**
 * Check whatever number in range
 *
 * @param {Number} minValue
 * @param {Number} maxValue
 * @returns {boolean}
 */
Number.prototype.inRange = function(minValue, maxValue){
    return this>=minValue && this<=maxValue;
};

/**
 * Split string into lines
 * @returns {String[]} lines
 */
String.prototype.lines = function () {
    return this.split(/\r?\n/);
};

/**
 * Convert Object to number
 * @param obj
 * @returns {Number}
 */
function intval(obj){
    return parseInt(obj, 10);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function (e) {
            reject(e);
        };
        img.src = src;
    });
}