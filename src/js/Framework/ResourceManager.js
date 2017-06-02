'use strict';
var Framework = (function (Framework) {
    const DELAY_TIME = 0;

    (function () {
        var _requestCount = 0,
            _responseCount = 0,
            _timeountIDPrevious = 0,
            _timeountID = 0,
            _intervalID = 0,
            ajaxProcessing = false,
            _responsedResource = {},
            _subjectFunction = function () {
            },
            ResourceManagerInstance,
            _resourceBlobCache = new Map(),
            _resourceArrayBufferCache = new Map(),
            _zipEntry = undefined
        ;


        var getFinishedRequestPercent = function () {
            return _responseCount / _requestCount * 100;
        };

        var getRequestCount = function () {
            return _requestCount;
        };

        var getResponseCount = function () {
            return _responseCount;
        };

        var loadImage = function (requestOption) {
            if (typeof requestOption.id === "undefined") requestOption.id = requestOption.url;
            return new Promise((resolve, reject) => {
                if (_responsedResource[requestOption.id]) {
                    resolve(_responsedResource[requestOption.id]);
                }

                let imageObj = new Image();
                imageObj.src = requestOption['url'];
                _requestCount++;
                if (_intervalID === null) {
                    _intervalID = setInterval(detectAjax, DELAY_TIME);
                    finishLoading();
                }
                imageObj.onload = function () {
                    _responseCount++;
                    _responsedResource[requestOption.id] = {url: requestOption.url, response: imageObj};

                    resolve(_responsedResource[requestOption.id]);
                };
                imageObj.onerror = function (e) {
                    reject(e);
                    throw e;
                };
            });
        };

        var minAjaxJSON = function (requestOption) {
            requestOption.systemSuccess = function (responseText, textStatus, xmlHttpRequest) {
                var responseJSON = JSON.stringify(responseText);
                _responsedResource[requestOption.id] = {url: requestOption.url, response: responseJSON};
                _responseCount++;
            };

            minAjax(requestOption.type, requestOption);
        };

        var minAjax = function (type, requestOption) {
            var userSettings = userSettings || {};
            userSettings.type = type || 'POST';

            if (!Framework.Util.isUndefined(requestOption.data)) {
                userSettings['data'] = requestOption.data;
            }

            if (!Framework.Util.isUndefined(requestOption.systemSuccess)) {
                userSettings['success'] = requestOption.systemSuccess;
            }

            ajax(requestOption, userSettings);
        };

        var ajax = function (requestOption, userSettings) {
            _requestCount++;
            var defaultSettings = {
                type: 'POST',
                cache: false,
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                error: function (xmlHttpRequest, textStatus) {
                },
                //data: 'user=admin%20admin&password=12345' //需要自行encode, 且只接受string格式
                statusCode: {
                    /*404: function() {},
                     500: function() {},*/	//這部分USER可以自行設定
                },
                success: function (data, textStatus, xmlHttpRequest) {
                },
            };

            var userSettings = userSettings || defaultSettings;
            userSettings = Framework.Util.overrideProperty(defaultSettings, userSettings);


            var xhr = new XMLHttpRequest();
            xhr.onload = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        _responsedResource[requestOption.id] = {url: requestOption.url, response: xhr.responseText};
                        userSettings.success(xhr.responseText, xhr.statusText, xhr);
                    } else {
                        userSettings.error(xhr, xhr.statusText);
                    }
                }
            });

            if (!userSettings.cache && Framework.Util.isUndefined(userSettings.data) && userSettings.type === 'GET') {
                requestOption.url = requestOption.url + '?' + Math.random();
            } else if (!Framework.Util.isUndefined(userSettings.data) && userSettings.data.trim() !== '') {
                requestOption.url = requestOption.url + '?' + userSettings.data.trim();
            }

            xhr.open(userSettings.type, requestOption.url, userSettings.async);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');

            if (userSettings.type === 'GET') {
                xhr.send();
            } else {
                xhr.setRequestHeader('Content-Type', userSettings.contentType);
                xhr.send(userSettings.data);
            }
        };


        var getResource = function (id) {
            if (Framework.Util.isUndefined(_responsedResource[id])) {
                throw ('\'' + id + '\' is undefined Resource.');
            }
            return _responsedResource[id].response;
        };

        var destroyResource = function (id) {
            if (Framework.Util.isUndefined(_responsedResource[id])) {
                return;
            }
            _responsedResource[id].response = null;
            _responsedResource[id].url = null;
            _responsedResource[id] = null;
            delete _responsedResource[id];
        };

        var setSubjectFunction = function (subjectFunction) {
            _subjectFunction = subjectFunction;
        };

        var detectAjax = function () {
            //Constuctor即開始偵測
            //要有(_requestCount == 0)是為了避免一開始就去執行gameController.start
            ajaxProcessing = (_requestCount !== _responseCount) || (_requestCount === 0);
        };

        var stopDetectingAjax = function () {
            clearInterval(_intervalID);
            _intervalID = null;
        };

        var finishLoading = function () {
            //由game來控制遊戲開始的時機, 需要是在發出所有request後, 再call這個funciton
            detectAjax();
            if (!ajaxProcessing) {
                stopDetectingAjax();
                _subjectFunction();
                ajaxProcessing = false;
            } else {
                _timeountIDPrevious = _timeountID;
                _timeountID = setTimeout(function () {
                    finishLoading();
                    clearTimeout(_timeountIDPrevious);
                }, DELAY_TIME);
            }
        };


        /**
         * Resources
         *
         * @class {Framework.ResourceManager}
         * @namespace Framework
         */
        class ResourceManager {
            constructor(subjectFunction) {
                _requestCount = 0;
                _responseCount = 0;
                _responsedResource = {};

                if (!Framework.Util.isUndefined(subjectFunction)) {
                    _subjectFunction = subjectFunction;
                }

                //_intervalID = setInterval(detectAjax, 50);
                finishLoading();
            }

            /**
             * Loads the image.
             *
             * @return {Promise} The image.
             */
            loadImage() {
                return loadImage.apply(this, arguments);
            }

            /**
             * Loads the JSON.
             *
             * @return  The JSON.
             */
            loadJSON() {
                return minAjaxJSON.apply(this, arguments);
            }

            /**
             *
             * @param {String} url
             * @param option
             * @returns {Promise.<TResult>|*}
             */
            loadResource(url, option) {
                _requestCount++;
                return fetch(url, option).then((data) => {
                    finishLoading();
                    _responseCount++;

                    return data;
                });
            }

            loadResourceAsBlob(url) {
                url = url.replace(/\\/g, '/');
                url = url.replace(/\/\//g, '/');

                if (_resourceBlobCache.has(url)) {
                    return new Promise((a, b) => {
                        return a(_resourceBlobCache.get(url));
                    });
                } else if (url.startsWith('blob:')) {
                    console.warn(url);
                    return new Promise((a, b) => {
                        return a(url);
                    });
                } else {
                    _requestCount++;
                    return fetch(url, {
                        method: 'GET',
                    })
                        .then(r => r.blob())
                        .then(b => {
                            finishLoading();
                            _responseCount++;

                            _resourceBlobCache.set(url, URL.createObjectURL(b));

                            return _resourceBlobCache.get(url);
                        });
                }
            }

            loadResourceAsArrayBuffer(url) {
                if (typeof url !== 'string') {
                    throw new SyntaxError('U should pass a url to this method');
                }
                url = url.replace(/\\/g, '/');
                url = url.replace(/\/\//g, '/');

                if (_zipEntry) {
                    let path = url
                        .replace(/^\.\//ig, '')
                        .replace(/^\//ig)
                        .replace(/\\/);

                    let zipFile = _zipEntry.file(path);

                    if (zipFile) {
                        return zipFile.async("arraybuffer");
                    }
                }

                if (_resourceArrayBufferCache.has(url)) {
                    return new Promise((a, b) => {
                        const oBuf = _resourceArrayBufferCache.get(url);

                        return a(oBuf.slice(0));
                    });
                } else {
                    _requestCount++;
                    return fetch(url, {
                        method: 'GET',
                    })
                        .then(r => r.arrayBuffer())
                        .then(b => {
                            finishLoading();
                            _responseCount++;

                            _resourceArrayBufferCache.set(url, b);

                            return _resourceArrayBufferCache.get(url).slice(0);
                        });
                }
            }

            /**
             * Destroys the resource.
             *
             * @return  .
             */
            destroyResource() {
                return destroyResource.apply(this, arguments);
            }

            /**
             * Gets the resource.
             *
             * @return  The resource.
             */
            getResource() {
                return getResource.apply(this, arguments);
            }

            /**
             * Sets subject function.
             *
             * @return  .
             */
            setSubjectFunction() {
                return setSubjectFunction.apply(this, arguments);
            }

            /**
             * Gets finished request percent.
             *
             * @return  The finished request percent.
             */
            getFinishedRequestPercent() {
                return getFinishedRequestPercent.apply(this, arguments);
            }

            /**
             * Gets request count.
             *
             * @return  The request count.
             */
            getRequestCount() {
                return getRequestCount.apply(this, arguments);
            }

            /**
             * Gets response count.
             *
             * @return  The response count.
             */
            getResponseCount() {
                return getResponseCount.apply(this, arguments);
            }

            loadZip() {
                lf2.Prefetch.get('RESOURCES')
                    .then(zip => _zipEntry = zip)
                    .catch(e => {
                        console.error(e);
                    })
            }
        }
        ;

        /**
         *
         * @type {ResourceManager}
         */
        Framework.ResourceManager = ResourceManagerInstance = new ResourceManager();


        return ResourceManagerInstance;
    })();
    return Framework;
})(Framework || {});