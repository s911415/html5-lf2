// By Raccoon
// include namespace

var Framework = (function (Framework) {
    'use strict';


    Framework.EqualCondition = function (targetProperty, targetValue, delta) {


        var EqualConditionClass = {},
            EqualConditionInstance,
            _infoString;

        var isFitCondition = function () {
            var objectValue = Framework.Replay.evaluate(targetProperty);
            if (Framework.Util.isNumber(targetValue)) {
                if (objectValue >= targetValue - delta && objectValue <= targetValue + delta) {
                    return true;
                }
            }
            else if (Framework.Util.isBoolean(targetValue)) {
                if (objectValue === targetValue) {
                    return true;
                }
            }
        };

        var setInfoString = function (info) {
            _infoString = info;
        };
        var getInfoString = function () {
            return _infoString;
        };

        EqualConditionClass = function () {
        };
        EqualConditionClass.prototype = {
            isFitCondition: isFitCondition,
            setInfoString: setInfoString,
            getInfoString: getInfoString
        };

        EqualConditionInstance = new EqualConditionClass();
        return EqualConditionInstance;

    };
    return Framework;
})(Framework || {});