// By Raccoon , undyingmoon
var Framework = (function (Framework) {
    'use strict';
    Framework.exClass = function () {
        // 如果用了new keyword 就拋例外
        if (this instanceof Framework.exClass) {
            Framework.DebugInfo.Log.error('不能再Framework.exClass之前使用new關鍵字');
            throw 'can\'t use new keyword on Framework.exClass';
        }
        // 宣告變數......
        var parent, props, childClass, i;

        // 抓取parent & child object
        if (arguments.length === 1) {
            if (Framework.Util.isObject(arguments[0])) {
                props = arguments[0];
                parent = Object;
            } else {
                Framework.DebugInfo.Log.error('Framework.exClass 參數錯誤');
                throw 'Framework.exClass\'s argument error';
            }
        } else if (arguments.length === 2) {
            parent = arguments[0];
            props = arguments[1];
        }
        // 建立 Child Class 的 Constructor 
        childClass = function () {
            if (Framework.Util.isUndefined(this)) {
                Framework.DebugInfo.Log.error('必須使用new關鍵字');
                throw 'must be use new keyword';
            }
            var that = this.prototype;

            var recursionRunConstruction = function r(a, b, arg) {
                // 不明原因無法使用isUndefined 判斷所以只好用Try了
                try {
                    if (a.hasOwnProperty("__construct")) {
                        r(a.uber, b, arg);
                        a.__construct.apply(b, arg);
                    }
                } catch (e) {
                }
            };
            // 使用遞迴的方式找出所有parent的__construct執行
            recursionRunConstruction(childClass.uber, this, arguments);
            // 
            try {
                if (childClass.prototype.hasOwnProperty("__construct")) {
                    childClass.prototype.__construct.apply(this, arguments);
                }
            } catch (e) {
            }
        };
        childClass.prototype = new parent();
        childClass.uber = parent.prototype;
        childClass.prototype.constructor = childClass;
        for (i in props) {
            if (props.hasOwnProperty(i)) {
                childClass.prototype[i] = props[i];
            }
        }
        return childClass;
    };

    Framework.Class = function () {
        if (this instanceof Framework.Class) {
            Framework.DebugInfo.Log.error('不能在Framework.Class之前使用new關鍵字');
            throw 'can\'t use new keyword on Framework.Class';
        }
        var parent, props, child, f, i;
        if (arguments.length === 1) {
            props = arguments[0];
        } else if (arguments.length === 2) {
            parent = arguments[0];
            props = arguments[1];
        }

        // 1. new constructor
        child = function () {
            if (Framework.Util.isUndefined(this)) {
                Framework.DebugInfo.Log.error('必須使用new關鍵字');
                throw 'must be use new keyword';
            }
            // 這邊應該是要執行uber的constructor，但是會因為參數的順序產生問題..
            if (child.uber && child.uber.hasOwnProperty('__construct')) {
                child.uber.__construct.apply(this, arguments);
            }
            if (child.prototype.hasOwnProperty('__construct')) {
                child.prototype.__construct.apply(this, arguments);
            }
        };

        // 2. inherit
        parent = parent || Object;
        f = function () {
        };
        f.prototype = parent.prototype;
        child.prototype = new f();
        child.uber = parent.prototype;
        child.prototype.constructor = child;

        // 3. add implementation methods
        for (i in props) {
            if (props.hasOwnProperty(i)) {
                child.prototype[i] = props[i];
            }
        }
        return child;
    };

    // Framework.class.create (simulator Inheritance class)
    Framework.inheritance = function (createObj, options) {
        var emptyObj = function () {
        };
        var newObj = new createObj();
        emptyObj.prototype = createObj.prototype;
        newObj.prototype = new emptyObj;
        newObj.uber = createObj.prototype;
        //讀出所有的屬性，如果不是內建的就加給obj
        for (var option in options) {
            if (options.hasOwnProperty(option)) {
                newObj[option] = options[option];
            }
        }
        return newObj;
    };

    return Framework;
})(Framework || {});