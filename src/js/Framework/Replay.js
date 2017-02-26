// By Raccoon
// include namespace
'use strict';
var Framework = (function (Framework) {

    Framework.Replay = (function () {
        /**
         * 自動測試重播系統
         *
         * @class Replay
         * @constructor
         */

        var _cycleCount = 0,
            _replayList = [],
            ReplayClass = {},
            ReplayInstance = {},
            _start = false,
            _isWaiting = false,
            _pollingFunction,
            _waitingCounter = 0,
            _waitingCondition,
            _isReady = false,
            _isTestEnd = false,
            _isContinue = false,
            _waitForTimeoutSecond = 30,
            _waitForTimeout = 600;
        var GREEN_LOG = "color: #6cbd45";
        var _qUnitStarting = true;

        var replayItem = function () {
            this.replayFunction;
            this.infoString;
            this.failString;
            this.x;
            this.y;
            this.isDone = false;
            this.execute = function () {
                try {
                    // console.log(this.infoString);
                    this.replayFunction();
                } catch (err) {
                    // console.error('Action Fail:' + this.infoString + "\n" + err);
                    // Framework.Game.pause();
                }
                this.isDone = true;
            }

        };
        var setGameReady = function () {
            if (useGoToLevel) {
                useGoToLevel = false;
                ready();
            } else {
                startQunit();
                ready();
            }
        };

        var ready = function (scriptInfo) {
            console.log('%c ----------------------------', GREEN_LOG);
            //console.log('%c Run Test:' + scriptInfo.name,GREEN_LOG);
            _isReady = true;
            _isTestEnd = false;
            Framework.Game.resume();
        };

        var assertionItem = function () {
            this.targetValue;
            this.assertValue;
            this.infoString;
            this.failString;
            this.delta;

            this.execute = function () {
                var isEqual;
                if (Framework.Util.isUndefined(this.delta)) {
                    this.delta = 0;
                }
                if (Framework.Util.isNumber(this.assertValue)) {
                    isEqual = this.assertValue - this.delta <= evaluate(this.targetValue) && evaluate(this.targetValue) <= this.assertValue + this.delta;
                } else {
                    isEqual = this.assertValue === evaluate(this.targetValue)
                }
                var assertMessage;
                if (isEqual) {
                    assertMessage = "Passed!";
                    QUnit.assert.ok(isEqual, assertMessage);
                } else {
                    assertMessage = 'Assert Fail! targetValue: ' + evaluate(this.targetValue) + ', assertValue: ' + this.assertValue;
                    assertMessage += '\nFail at ' + this.infoString;
                    QUnit.assert.ok(isEqual, assertMessage);
                    //Framework.Game.pause();
                }
            }
        };

        var stopReplay = function () {
            _cycleCount = 0;
            _replayList = [];
            _isReady = false;
            _isTestEnd = true;
            Framework.Game.pause();
            console.error('Test Stop');
            console.log('%c ----------------------------', GREEN_LOG);
        };
        var hasExecuteCommand = false;
        var update = function () {
            if (_isReady) {
                _cycleCount++;
                //console.log("Cycle count = " + _cycleCount);
                if (_isWaiting == false) {
                    if (_replayList.length > 0) {
                        hasExecuteCommand = true;
                        executeCommend();
                    }
                    else {
                        if (!_isTestEnd) {
                            if (hasExecuteCommand) {
                                console.log('%c Test Case Success', GREEN_LOG);
                                console.log('%c ----------------------------', GREEN_LOG);
                                //Framework.Game.pause();
                                _isTestEnd = true;
                                hasExecuteCommand = false;
                                QUnit.start();
                            }

                        }
                    }
                }
                else {
                    waitLoop();
                }

                // if (_replayList.length > 0) {
                // 	if (_isWaiting == false) {
                // 		_replayList[0].execute();
                // 		_replayList.shift();
                // 	} else {
                // 		waitLoop();
                // 	}
                // }else
                // {
                // 	if(!_isTestEnd){
                // 		console.log('%c Test Case Success',GREEN_LOG);
                // 		console.log('%c ----------------------------',GREEN_LOG);
                // 		Framework.Game.pause();
                // 		_isTestEnd = true;
                // 	}
                // }
            }
        };

        var resetCycleCount = function () {
            _cycleCount = 0;
        };

        var getCycleCount = function () {
            return _cycleCount;
        };

        var pause = function () {
            var item = new replayItem();
            item.replayFunction = function () {
                Framework.Game.pause();
                //console.log("Replay pause at " + _cycleCount + "th cycle");
            };
            _replayList.push(item);
        };

        var resume = function () {
            var item = new replayItem();
            item.replayFunction = function () {
                Framework.Game.resume();
            };
            _replayList.push(item);
        };

        var assertEqual = function (targetValue, assertValue, delta) {
            var item = new assertionItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.targetValue = targetValue;
            item.assertValue = assertValue;
            item.delta = delta;
            _replayList.push(item);
        };

        var evaluate = function (objectString) {
            return eval('Framework.Game._currentLevel.' + objectString);
        };

        var executeCommend = function () {
            while (_replayList.length > 0 && _isWaiting == false && _isReady == true && Framework.Game.isContinue == false) {
                _replayList[0].execute();
                _replayList.shift();
            }
        };

        var waitFor = function (condition) {

            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                if (Framework.Util.isNumber(condition) === false) {
                    //console.log("wait start");
                    condition.setInfoString(splliString);
                }
                _waitForTimeout = _waitForTimeoutSecond * Framework.Game.getUpdateFPS();
                _waitingCounter = 1;
                _isWaiting = true;
                _waitingCondition = condition;
            };
            _replayList.push(item);
        };

        var waitLoop = function () {
            _waitingCounter++;
            if (Framework.Util.isNumber(_waitingCondition)) {
                if (_waitingCounter >= _waitingCondition) {
                    _isWaiting = false;
                    executeCommend();
                }
            } else {
                if (_waitingCondition.isFitCondition()) {
                    _isWaiting = false;
                    executeCommend();
                }
            }

            if (_waitingCounter > _waitForTimeout) {
                var timeoutMessage = 'Wait For Timeout' + _waitingCondition;
                if (Framework.Util.isNumber(_waitingCondition) === false) {
                    timeoutMessage += '\nFail at ' + _waitingCondition.getInfoString();
                }
                QUnit.assert.ok(false, timeoutMessage);
                Framework.Game.pause();

            }
        };

        var mouseClick = function (x, y) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    x: 0,
                    y: 0
                };
                e.x = x;
                e.y = y;
                Framework.Game.click(e);
            };
            _replayList.push(item);
        };
        var mouseDown = function (x, y) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    x: 0,
                    y: 0
                };
                e.x = x;
                e.y = y;
                Framework.Game.mousedown(e);
            };
            _replayList.push(item);
        };

        var mouseClickProperty = function (positionString) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    x: 0,
                    y: 0
                };
                e.x = evaluate(positionString).x;
                e.y = evaluate(positionString).y;
                //console.log("Click " + e.x + " " + e.y);
                Framework.Game.click(e);
            };
            _replayList.push(item);
        };

        var mouseClickObject = function (objectString) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    x: 0,
                    y: 0
                };
                e.x = evaluate(objectString).position.x;
                e.y = evaluate(objectString).position.y;
                Framework.Game.click(e);
            };
            _replayList.push(item);
        };

        var mouseMove = function (x, y) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    x: 0,
                    y: 0
                };
                e.x = x;
                e.y = y;
                Framework.Game.mousemove(e);
            };
            _replayList.push(item);
        };

        var keyDown = function (key) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    key: key
                };
                Framework.Game.keydown(e);
            };
            _replayList.push(item);
        };

        var keyUp = function (key) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    key: key
                };
                Framework.Game.keyup(e);
            };
            _replayList.push(item);
        };

        var keyPress = function (key) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    key: key
                };
                Framework.Game.keypress(e);
            };
            _replayList.push(item);
        };

        var keyPressAndWait = function (key, cycle) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                var e = {
                    key: key
                };
                keyDown(e);
                waitFor(cycle);
                keyUp(e);
            };
            _replayList.push(item);
        };

        var startQunit = function () {
            if (!_qUnitStarting) {
                _qUnitStarting = true;
                QUnit.start();
            }
        };
        var stopQunit = function () {
            if (_qUnitStarting) {
                _qUnitStarting = false;
                QUnit.stop();
            }
        };

        var start = function () {
            stopQunit();
            Framework.Game._isTestReady = true;
            Framework.Game._currentLevel = null;
            Framework.Game.start();
            console.log('set up test');
        };
        var stop = function () {
            Framework.Game.stop();
            console.log('tear down test');
        };
        var useGoToLevel = false;
        var goToLevel = function (levelName) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                _isReady = false;
                useGoToLevel = true;
                Framework.Game.goToLevel(levelName);
            };
            _replayList.push(item);
        };

        var executeFunction = function (functionName) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                evaluate(functionName);
            };
            _replayList.push(item);
        };

        var setFPS = function (fps) {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                Framework.Game.setUpdateFPS(fps);
                Framework.Game.setDrawFPS(fps);
            };
            _replayList.push(item);
        };

        var resetFPS = function () {
            var item = new replayItem();

            var callStack = new Error().stack;
            var splliString = callStack.split("    at ")[2].split("(")[1].replace(")", "");
            item.infoString = splliString;

            item.replayFunction = function () {
                Framework.Game.setUpdateFPS(Framework.Game._config.fps);
                Framework.Game.setDrawFPS(Framework.Game._config.fps);
            };
            _replayList.push(item);
        };

        ReplayClass = function () {
        };

        ReplayClass.prototype = {
            update: update,
            resetCycleCount: resetCycleCount,
            getCycleCount: getCycleCount,
            pause: pause,
            waitFor: waitFor,
            assertEqual: assertEqual,
            evaluate: evaluate,
            mouseClick: mouseClick,
            mouseDown: mouseDown,
            mouseClickObject: mouseClickObject,
            mouseClickProperty: mouseClickProperty,
            mouseMove: mouseMove,
            keyDown: keyDown,
            keyUp: keyUp,
            keyPress: keyPress,
            keyPressAndWait: keyPressAndWait,
            ready: ready,
            setGameReady: setGameReady,
            start: start,
            stop: stop,
            goToLevel: goToLevel,
            executeFunction: executeFunction,
            setFPS: setFPS,
            resetFPS: resetFPS,
            replayList: _replayList,
        };

        ReplayInstance = new ReplayClass();
        return ReplayInstance;

    })();
    return Framework;
})(Framework || {});
