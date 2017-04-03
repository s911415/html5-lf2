"use strict";
var lf2 = (function (lf2) {

    /**
     * @class lf2.Utils
     */
    lf2.Utils = {
        /**
         * Parse LF2 data
         * @param str
         * @returns {Map}
         */
        parseDataLine: function (str) {
            const splitKeyValue = (s) => {
                let pos = s.indexOf(':');
                let key = s.substring(0, pos);
                let value = s.substr(pos + 1).trim();

                return {
                    'key': key,
                    'value': value,
                };
            };
            str = str.replace(/\r?\n/g, ' ');
            let data = new Map();
            let pairs = str.match(/([^ ]+):\s+?[^ ]+/g);
            if (!pairs) {
                throw new TypeError('Cannot parse line: ' + str);
            }
            for (let i = 0, j = pairs.length; i < j; i++) {
                let keyValue = splitKeyValue(pairs[i]);

                data.set(keyValue.key, keyValue.value);
            }

            return data;
        },

        /**
         * Return value in range, if value is less than minValue, minValue returned,
         * if value is greater than maxValue return maxValue, otherwise input value returned.
         *
         * @param {Number} value
         * @param {Number} minValue
         * @param {Number} maxValue
         * @returns {Number}
         */
        returnInRangeValue: function(value, minValue, maxValue){
            if(value>maxValue){
                return maxValue;
            }else if(value<minValue){
                return minValue;
            }

            return value;
        },

        tryConvertType: function (obj) {

        },
    };

    return lf2;
})(lf2 || {});
