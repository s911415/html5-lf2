"use strict";

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


function loadImage(src){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.onload=function(){
            resolve(img);
        };
        img.onerror=function(e){
            reject(e);
        };
        img.src=src;
    });
}