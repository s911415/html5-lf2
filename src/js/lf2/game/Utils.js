"use strict";
var lf2 = (function (lf2) {
    let Utils;
    /**
     * @class lf2.Utils
     */
    lf2.Utils = Utils = {
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
            let pairs = str.match(/(([^ ]+)(\s+)?:(\s+)?[^ ]+)/g);

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
            if (dx >= 0 && dy > 0) {
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
            else if (dx < 0 && dy <= 0) {
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
        GetPointPFromLineAB: function (a, b, r) {
            const Point3D = Framework.Point3D;
            const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y), dz = Math.abs(a.z - b.z);
            const lengthab = Math.sqrt(dx * dx + dy * dy + dz * dz);
            var scale = (lengthab - r) / r;
            let p = new Point3D(
                (a.x * scale + b.x) / (scale + 1),
                (a.y * scale + b.y) / (scale + 1),
                (a.z * scale + b.z) / (scale + 1)
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
        },

        _CubicBezierDiff: 1e3,
        _CubicBezierCache: new Map(),
        _MakeCubicBezierCache: function (x1, y1, x2, y2) {
            const _DIFF = Utils._CubicBezierDiff;
            const pow = Math.pow;
            const key = `${x1},${y1},${x2},${y2}`;
            const CurObj = Utils._CubicBezierCache.get(key);
            if (CurObj !== undefined) {
                return CurObj;
            }

            let arr = new Array(_DIFF + 1);
            const STEP = 1 / _DIFF;
            const x0 = 0, y0 = 0;
            const x3 = 1, y3 = 1;
            /**
             * @returns {number}
             * @constructor
             */
            const B = (t, p0, p1, p2, p3) => {
                const tb = 1 - t;
                return p0 * pow(tb, 3) + 3 * p1 * t * pow(tb, 2) + 3 * p2 * pow(t, 2) * tb + p3 * pow(t, 3);
            };

            for (let i = 0; i <= _DIFF; i++) {
                let p = i * STEP;
                arr[i] = new Framework.Point(
                    ((B(p, x0, x1, x2, x3) * _DIFF) | 0),
                    B(p, y0, y1, y2, y3),
                );
            }
            Utils._CubicBezierCache.set(key, arr);

            return arr;
        },

        CubicBezier: function (t, x1, y1, x2, y2) {
            const _DIFF = Utils._CubicBezierDiff;
            let cacheObj = Utils._MakeCubicBezierCache(x1, y1, x2, y2);

            t = Math.floor(t * _DIFF);

            let i = cacheObj.binarySearch(t, function (element, target) {
                if (element.x === target) return 0;
                return element.x - target;
            });

            if (i < 0 || i > 1e4) {
                debugger;
            }

            return cacheObj[i].y;
        },
    };

    
    lf2.__defineGetter__('CurrentLevel', () => Framework.Game._currentLevel);


    return lf2;
})(lf2 || {});
