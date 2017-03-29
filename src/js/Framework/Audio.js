'use strict';
var Framework = (function (Framework) {
    (function () {
        var $ = Framework,
            _audioClass = {},
            _audioInstanceObj = {},
            _mainPlaylist = new Map(),
            _errorEvent = function () {
            };

        let audioCtx = new window.AudioContext();


        var setPlaylist = function (playlist) {
            addSongs(playlist);
        };

        /**
         * 設定當音樂無法播放時, 要執行的callback
         * @param {function} errorEvent 音樂無法播放時, 要執行的callback
         * @example
         *        setErrorEvent(function() {
		 * 			console.log('error');
		 * 		});
         */
        var setErrorEvent = function (eventFunction) {
            _errorEvent = eventFunction;
        };

        var addSongs = function (playlist) {
            for(let k in playlist){
                _mainPlaylist.set(k, playlist[k]);
                getAudioInstance(k, playlist[k]);
            }
        };

        var removeSong = function (song) {
            _mainPlaylist.delete(song);
        };

        //只接受String或Array
        var removeSongs = function (songs) {
            var i = 0, len = 0;
            if ($.Util.isString(songs)) {
                removeSong(songs);
            } else {
                for (i = 0, len = songs.length; i < len; i++) {
                    removeSong(songs[i]);
                }
            }
        };

        var getAudioInstance = function (songName, song, newInstance) {
            newInstance = newInstance === undefined ? (false) : !!newInstance;
            var audioInstance;
            if(song instanceof ArrayBuffer){
                audioInstance = audioCtx.createBufferSource();
            }else{
                if (!newInstance && !$.Util.isUndefined(_audioInstanceObj[songName])) {
                    return _audioInstanceObj[songName];
                }

                audioInstance = new Audio();
                //document.body.appendChild(audioInstance);
                //audioInstance.controls='controls';
                audioInstance.preload = 'auto';
                audioInstance.autoplay = false;

                const sourceTagStr = 'source',
                    audioSourceType = {
                        mp3: 'audio/mpeg',
                        ogg: 'audio/ogg',
                        wav: 'audio/wav'
                    };
                for (let tempName in song) {
                    let tempSource = document.createElement(sourceTagStr);
                    tempSource.type = audioSourceType[tempName];
                    tempSource.src = song[tempName];
                    audioInstance.appendChild(tempSource);
                }
            }
            if (!newInstance) {
                _audioInstanceObj[songName] = audioInstance;
            }

            return audioInstance;
        };

        var playMusic = function () {
            this.play();
            this.removeEventListener('canplaythrough', playMusic, false);
        };

        /**
         *
         * 播放音樂
         * @param {Object} audioArgs audioArgs.name為必要項,
         * 並且需要可以從Constuctor提供的清單上找到, 否則會throw exception
         * audioArgs可以加入任何一個W3C定義的option參數, 詳細請參考W3C網站
         * http://www.w3schools.com/tags/tag_audio.asp
         * @example
         *     play({name: 'horse'});
         *     play({name: 'horse', loop: true});
         */
        var play = function (audioArgs) {
            var
                tempName,
                songName = audioArgs['name'],
                song = _mainPlaylist.get(songName),
                audio = {};

            if (Framework.Util.isUndefined(song)) {
                throw ('the playlist is not set or do not contain the song: ' + songName);
            }

            audio = getAudioInstance(songName, song, !!audioArgs['newInstance']);
            if(audio instanceof AudioBufferSourceNode){
                audioCtx.decodeAudioData(song).then((decodedData)=>{
                    audio.buffer = decodedData;
                    audio.connect(audioCtx.destination);
                    audio.start(0);
                });
            }else if(audio instanceof Audio){
                audio.addEventListener('error', _errorEvent, false);
                for (tempName in audioArgs) {
                    if (audioArgs.hasOwnProperty(tempName)) {
                        audio[tempName] = audioArgs[tempName];
                    }
                }

                audio.currentTime = 0;
                //audio.addEventListener('canplaythrough', this.playMusic, true);
                //audio.load();
                audio.play();
            }
        };

        /**
         * 暫停被播放音樂
         * @param {string} audioName 歌曲的name
         * @example
         *     pause('horse');
         */
        var pause = function (audioName) {
            var audio = _audioInstanceObj[audioName];
            audio.pause();
        };

        /**
         * 暫停全部被播放音樂
         * @example
         *     pauseAll();
         */
        var pauseAll = function () {
            for (var tempName in _audioInstanceObj) {
                pause(tempName);
            }
        };

        /**
         * 恢復播放被暫停的音樂, 若沒有被暫停, 則不會發生任何事情
         * @param {string} audioName 歌曲的name
         *     resume('horse');
         */
        var resume = function (audioName) {
            var audio = _audioInstanceObj[audioName];
            if (audio.paused) {
                audio.play();
            }
        };

        /**
         * 恢復播放被暫停的所有音樂
         * @example
         *     resumeAll();
         */
        var resumeAll = function () {
            for (var tempName in _audioInstanceObj) {
                resume(tempName);
            }
        };

        /**
         * 停止被播放音樂
         * @param {string} audioName 歌曲的name
         * @example
         *     stop('horse');
         */
            //因為stop為native code, 故private命名部分改用stopMusic
        var stopMusic = function (audioName) {
                var audio = _audioInstanceObj[audioName];
                audio.pause();
                audio.currentTime = 0;
            };

        /**
         * 停止所有被播放音樂
         * @example
         *     stopAll();
         */
        var stopAll = function () {
            for (var tempName in _audioInstanceObj) {
                stopMusic(tempName);
            }
        };

        /**
         * 設定音樂的音量
         * @param {string} audioName 歌曲的name
         * @param {number} volumeValue 要設定的音量大小 0-1之間
         * @example
         *    setVolume('horse', 0);    //沒聲音
         *    setVolume('horse', 0.5);
         *    setVolume('horse', 1);    //最大聲
         */
        var setVolume = function (name, volumeValue) {
            var audio = _audioInstanceObj[name];
            audio.volume = volumeValue;
        };


        var manageMute = function (name, muted) {
            var audio = _audioInstanceObj[name];
            audio.muted = muted;
        };

        /**
         * 開起音樂的音效
         * @param {string} audioName 歌曲的name
         * @example
         *     openVolume('horse');
         */
        var openVolume = function (name) {
            manageMute(name, false);
        };

        /**
         * 開起所有音樂的音效
         * @example
         *     openVolumeAll();
         */
        var openVolumeAll = function () {
            for (var tempName in _audioInstanceObj) {
                openVolume(tempName);
            }
        };

        /**
         * 關閉音樂的音效(靜音)
         * @param {string} audioName 歌曲的name
         * @example
         *     mute('horse');
         */
        var mute = function (name) {
            manageMute(name, true);
        };

        /**
         * 關閉所有音樂的音效(靜音所有歌曲)
         * @example
         *     muteAll();
         */
        var muteAll = function () {
            for (var tempName in _audioInstanceObj) {
                mute(tempName);
            }
        };

        /*var on = function(audioName, eventName, callback, useCapture) {
         var mainUseCapture = false, audio = _audioInstanceObj[audioName];

         if(!Framework.Util.isUndefined(useCapture)) {
         mainUseCapture = useCapture;
         }

         audio.addEventListener(eventName, callback, mainUseCapture);
         };

         var off = function(audioName, eventName, callback, useCapture) {
         var mainUseCapture = false, audio = _audioInstanceObj[audioName];

         if(!Framework.Util.isUndefined(useCapture)) {
         mainUseCapture = useCapture;
         }

         audio.removeEventListener(eventName, callback, mainUseCapture);
         };

         var allOn = function(eventName, callback, useCapture) {
         for(tempName in _audioInstanceObj) {
         on(tempName, eventName, callback, useCapture);
         }
         };

         var allOff = function(eventName, callback, useCapture) {
         for(tempName in _audioInstanceObj) {
         off(tempName, eventName, callback, useCapture);
         }
         };*/

        /**
         * 控管所有音樂資源的Class
         * @param {Object} playlist 全部要被播放的音樂和音效清單
         * @example
         *    new Framework.Audio({
	    *       horse: {
	    *           mp3: 'horse.mp3',
	    *           ogg: 'horse.ogg',
	    *           wav: 'horse.wav'
	    *       }, song1:{
	    *           mp3: 'song1.mp3',
	    *           ogg: 'song1.ogg',
	    *           wav: 'song1.wav'
	    *       }, song2:{
	    *           mp3: 'song2.mp3',
	    *           ogg: 'song2.ogg',
	    *           wav: 'song2.wav'
	    *       }
	    *   });
         */
        Framework.Audio = class {
            constructor(playlist) {
                if (!Framework.Util.isUndefined(playlist)) {
                    setPlaylist(playlist);
                }
            }

            addSongs(){
                return addSongs.apply(this, arguments);
            }

            /**
             *
             * 播放音樂
             * @param {Object} audioArgs audioArgs.name為必要項,
             * 並且需要可以從Constuctor提供的清單上找到, 否則會throw exception
             * audioArgs可以加入任何一個W3C定義的option參數, 詳細請參考W3C網站
             * http://www.w3schools.com/tags/tag_audio.asp
             * @example
             *     play({name: 'horse'});
             *     play({name: 'horse', loop: true});
             */
            play() {
                return play.apply(this, arguments);
            }

            /**
             * 停止被播放音樂
             * @param {string} audioName 歌曲的name
             * @example
             *     stop('horse');
             */
            stop() {
                return stopMusic.apply(this, arguments);
            }

            /**
             * 暫停被播放音樂
             * @param {string} audioName 歌曲的name
             * @example
             *     pause('horse');
             */
            pause() {
                return pause.apply(this, arguments);
            }

            /**
             * 恢復播放被暫停的音樂, 若沒有被暫停, 則不會發生任何事情
             * @param {string} audioName 歌曲的name
             *     resume('horse');
             */
            resume() {
                return resume.apply(this, arguments);
            }

            /**
             * 設定音樂的音量
             * @param {string} audioName 歌曲的name
             * @param {number} volumeValue 要設定的音量大小 0-1之間
             * @example
             *    setVolume('horse', 0);    //沒聲音
             *    setVolume('horse', 0.5);
             *    setVolume('horse', 1);    //最大聲
             */
            setVolume() {
                return setVolume.apply(this, arguments);
            }

            /**
             * 關閉音樂的音效(靜音)
             * @param {string} audioName 歌曲的name
             * @example
             *     mute('horse');
             */
            mute() {
                return mute.apply(this, arguments);
            }

            /**
             * 開起音樂的音效
             * @param {string} audioName 歌曲的name
             * @example
             *     openVolume('horse');
             */
            openVolume() {
                return openVolume.apply(this, arguments);
            }

            /**
             * 設定當音樂無法播放時, 要執行的callback
             * @param {function} errorEvent 音樂無法播放時, 要執行的callback
             * @example
             *        setErrorEvent(function() {
             * 			console.log('error');
             * 		});
             */
            setErrorEvent() {
                return setErrorEvent.apply(this, arguments);
            }

            /**
             * 停止所有被播放音樂
             * @example
             *     stopAll();
             */
            stopAll() {
                return stopAll.apply(Framework.Audio, arguments);
            }

            /**
             * 暫停全部被播放音樂
             * @example
             *     pauseAll();
             */
            pauseAll() {
                return pauseAll.apply(Framework.Audio, arguments);
            }

            /**
             * 恢復播放被暫停的所有音樂
             * @example
             *     resumeAll();
             */
            resumeAll() {
                return resumeAll.apply(Framework.Audio, arguments);
            }

            /**
             * 關閉所有音樂的音效(靜音所有歌曲)
             * @example
             *     muteAll();
             */
            muteAll() {
                return muteAll.apply(Framework.Audio, arguments);
            }

            /**
             * 開起所有音樂的音效
             * @example
             *     openVolumeAll();
             */
            openVolumeAll() {
                return openVolumeAll.apply(Framework.Audio, arguments);
            }

            /**
             *
             * 播放音樂
             * @param {Object} audioArgs audioArgs.name為必要項,
             * 並且需要可以從Constuctor提供的清單上找到, 否則會throw exception
             * audioArgs可以加入任何一個W3C定義的option參數, 詳細請參考W3C網站
             * http://www.w3schools.com/tags/tag_audio.asp
             * @example
             *     play({name: 'horse'});
             *     play({name: 'horse', loop: true});
             */
            static play() {
                return play.apply(Framework.Audio, arguments);
            }

            /**
             * 停止被播放音樂
             * @param {string} audioName 歌曲的name
             * @example
             *     stop('horse');
             */
            static stop() {
                return stopMusic.apply(Framework.Audio, arguments);
            }

            /**
             * 停止所有被播放音樂
             * @example
             *     stopAll();
             */
            static stopAll() {
                return stopAll.apply(Framework.Audio, arguments);
            }

            /**
             * 暫停被播放音樂
             * @param {string} audioName 歌曲的name
             * @example
             *     pause('horse');
             */
            static pause() {
                return pause.apply(Framework.Audio, arguments);
            }

            /**
             * 暫停全部被播放音樂
             * @example
             *     pauseAll();
             */
            static pauseAll() {
                return pauseAll.apply(Framework.Audio, arguments);
            }

            /**
             * 恢復播放被暫停的音樂, 若沒有被暫停, 則不會發生任何事情
             * @param {string} audioName 歌曲的name
             *     resume('horse');
             */
            static resume() {
                return resume.apply(Framework.Audio, arguments);
            }

            /**
             * 恢復播放被暫停的所有音樂
             * @example
             *     resumeAll();
             */
            static resumeAll() {
                return resumeAll.apply(Framework.Audio, arguments);
            }

            /**
             * 設定音樂的音量
             * @param {string} audioName 歌曲的name
             * @param {number} volumeValue 要設定的音量大小 0-1之間
             * @example
             *    setVolume('horse', 0);    //沒聲音
             *    setVolume('horse', 0.5);
             *    setVolume('horse', 1);    //最大聲
             */
            static setVolume() {
                return setVolume.apply(Framework.Audio, arguments);
            }

            /**
             * 關閉音樂的音效(靜音)
             * @param {string} audioName 歌曲的name
             * @example
             *     mute('horse');
             */
            static mute() {
                return mute.apply(Framework.Audio, arguments);
            }

            /**
             * 關閉所有音樂的音效(靜音所有歌曲)
             * @example
             *     muteAll();
             */
            static muteAll() {
                return muteAll.apply(Framework.Audio, arguments);
            }

            /**
             * 開起音樂的音效
             * @param {string} audioName 歌曲的name
             * @example
             *     openVolume('horse');
             */
            static openVolume() {
                return openVolume.apply(Framework.Audio, arguments);
            }

            /**
             * 開起所有音樂的音效
             * @example
             *     openVolumeAll();
             */
            static openVolumeAll() {
                return openVolumeAll.apply(Framework.Audio, arguments);
            }

            static setErrorEvent() {
                return setErrorEvent.apply(Framework.Audio, arguments);
            }
        };
        return Framework.Audio;
    })();
    return Framework;
})(Framework || {});