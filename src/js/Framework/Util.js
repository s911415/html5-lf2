'use strict';
var Framework = (function (Framework) {

    var utilClass = function () {
    };

    var isAbout = function (realValue, aboutValue, delta) {
        if (realValue < aboutValue + delta && realValue > aboutValue - delta) {
            return true;
        }
        else {
            return false;
        }
    };

    var findValueByKey = function (targetList, key) {
        for (var i = 0, l = targetList.length; i < l; i++) {
            if (targetList[i].name === key) {
                return targetList[i];
            }
        }
        return null;
    };

    var isUndefined = function (obj) {
        return (typeof obj === 'undefined');
    };

    var isNull = function (obj) {
        return (obj === null);
    };

    var isFunction = function (obj) {
        return (typeof  obj === 'function');
    };

    var isNumber = function (obj) {
        return (typeof  obj === 'number');
    };

    var isObject = function (obj) {
        return (typeof  obj === 'object');
    };

    var isBoolean = function (obj) {
        return (typeof  obj === 'boolean');
    };

    var isString = function (obj) {
        return (typeof  obj === 'string');
    };

    var isCanvas = function (obj) {
        if (!isUndefined(obj.tagName)) {
            return (obj.tagName === 'CANVAS');
        }
        return false;
    };

    var namespace = function (ns_string) {
        var parts = ns_string.split('.'),
            parent = Framework,
            i;
        if (parts[0] === 'Framework') {
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length; i += 1) {
            if (isUndefined(parent[parts[i]])) {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parts;
    };

    var overrideProperty = function (defaultSettings, userSettings) {
        for (var key in defaultSettings) {
            if (isUndefined(userSettings[key])) {
                userSettings[key] = defaultSettings[key];
            }
        }
        return userSettings;
    };

    utilClass.prototype = {
        isUndefined: isUndefined,
        isNull: isNull,
        isFunction: isFunction,
        isNumber: isNumber,
        isObject: isObject,
        isBoolean: isBoolean,
        isString: isString,
        isCanvas: isCanvas,
        namespace: namespace,
        overrideProperty: overrideProperty,
        isAbout: isAbout,
        findValueByKey: findValueByKey
    };


    // 宣告 namespace
    Framework.Util = new utilClass();

    return Framework;
})(Framework || {});

if (Framework.Util.isUndefined(Date.prototype.format)) {
    // Extend Date's function , add format method
    Date.prototype.format = function (format) {
        var o = {
            'M+': this.getMonth() + 1, //month
            'd+': this.getDate(),    //day
            'h+': this.getHours(),   //hour
            'm+': this.getMinutes(), //minute
            's+': this.getSeconds(), //second
            'q+': Math.floor((this.getMonth() + 3) / 3),  //quarter
            'S': this.getMilliseconds() //millisecond
        };

        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp('(' + k + ')').test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ('00' + o[k]).substr(('' + o[k]).length));
        return format;
    };
}