"use strict";
var lf2 = (function (lf2) {
    const Point3D = Framework.Point3D;
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
        returnInRangeValue: function (value, minValue, maxValue) {
            if (value > maxValue) {
                return maxValue;
            } else if (value < minValue) {
                return minValue;
            }

            return value;
        },

        tryConvertType: function (obj) {

        },

        /**
         * Set p1 as center calculate rad based on point
         *
         * @param {Framework.Point} p1
         * @param {Framework.Point} p2
         *
         */
        GetRadBasedOnPoints: function (p1, p2) {
            let rad = 0;
            const dx = p2.x - p1.x, dy = p2.y - p1.y;
            const arctan = Math.atan(dy / dx);

            /**
             * first quadrant
             */
            if (dx > 0 && dy > 0) {
                rad = arctan;
            }
            /**
             * second quadrant
             */
            else if (dx < 0 && dy > 0) {
                rad = arctan;
                rad += Math.PI;
            }
            /**
             * Third quadrant
             */
            else if (dx < 0 && dy < 0) {
                rad = arctan;
                rad += Math.PI;
            }
            /**
             * fourth quadrant
             */
            else {
                rad = arctan;
            }
            return rad;
        },

        /**
         * calculate the pointP on lineAB which distance is r
         *
         * @param {Framework.Point3D} a
         * @param {Framework.Point3D} b
         *
         */
        GetPointPFromLineAB : function (a,b,r) {
            const dx=Math.abs(a.x-b.x), dy=Math.abs(a.y-b.y), dz=Math.abs(a.z-b.z);
            const lengthab = Math.sqrt(dx*dx + dy*dy + dz*dz);
            var scale=(lengthab-r)/r;
            let p = new Point3D(
                (a.x * scale + b.x)/(scale+1),
                (a.y * scale + b.y)/(scale+1),
                (a.z * scale + b.z)/(scale+1)
            );

            return p;
        },

        /**
         *
         * @param {Number} p probability in percentage
         * @returns {boolean}
         */
        triggerInProbability: function (p) {
            const rand = (Math.random() * 100) | 0;
            return rand < p;
        }
    };

    lf2.__defineGetter__('CurrentLevel', () => Framework.Game._currentLevel);


    return lf2;
})(lf2 || {});
