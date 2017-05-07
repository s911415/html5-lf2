'use strict';
var Framework = (function (Framework) {
    /**
     * @type {ResourceManager}
     */
    const ResourceManager = Framework.ResourceManager;

    const AudioCtx = new window.AudioContext();

    let AudioInstanceArray = [];

    let AudioDecodedBuffer = new Map();

    let Audio;
    Framework.Audio = Audio = class Audio {
        constructor(playlist) {
            this._playList = new Map();
            this.audioCtx = AudioCtx;
            this.gainNodeLeft = this.audioCtx.createGain();
            this.gainNodeRight = this.audioCtx.createGain();
            this._promisies = [];
            this._leftVolume = 1;
            this._rightVolume = 1;

            this._allDone = false;

            if (playlist) {
                this.addSongs(playlist);
            }

            AudioInstanceArray.push(this);
        }

        /**
         *
         * @param {Number} v
         */
        set volume(v) {
            this.leftVolume = this.rightVolume = v;
        }

        /**
         *
         * @returns {Number}
         */
        get leftVolume() {
            return this._leftVolume;
        }

        /**
         *
         * @returns {Number}
         */
        get rightVolume() {
            return this._rightVolume;
        }

        /**
         *
         * @param {Number} v
         */
        set leftVolume(v) {
            if (v > 1 || v < 0) throw new RangeError('Volume out of range, 0~1 expected');
            this._leftVolume = v;
            if (this.gainNodeLeft) {
                this.gainNodeLeft.gain.value = this._leftVolume;
            }
        }

        /**
         *
         * @param {Number} v
         */
        set rightVolume(v) {
            if (v > 1 || v < 0) throw new RangeError('Volume out of range, 0~1 expected');

            this._rightVolume = v;
            if (this.gainNodeRight) {
                this.gainNodeRight.gain.value = this._rightVolume;
            }
        }

        addSongs(list) {
            if (!list) return;
            for (let soundName in list) {
                if (list.hasOwnProperty(soundName)) {
                    let p = this._loadSoundAndReturnBuffer(list[soundName]);
                    this._playList.set(soundName, list[soundName]);
                    this._promisies.push(p);
                }
            }

            return this.done();
        }

        getSource() {
            //this.stop();

            this._source = this.audioCtx.createBufferSource();

            return this._source;
        }

        /**
         *
         * @param soundName
         * @param opts
         * @returns {*}
         */
        play(soundName, opts) {
            if (typeof soundName === 'object') {
                console.warn('Play Audio by object is deprecated, please set sound name');

                return this.play(soundName['name'], soundName);
            }

            opts = opts || {};
            let options = {
                loop: false,
                volume: 1,
                stopPrevious: true
            };

            //Override exist config
            for (let k in options) {
                if (opts[k] !== undefined) {
                    options[k] = opts[k];
                }
            }

            if (isFinite(options.volume)) {
                this.volume = options.volume;
            }

            if (options.stopPrevious) {
                this.stop();
            }

            const soundPath = this._playList.get(soundName);
            if (soundPath === undefined) throw Error(`Cannot found sound with name: ${soundName}`);
            this.gainNodeLeft = this.gainNodeRight = null;
            return this._loadSoundAndReturnBuffer(soundPath)
                .then(buf => {
                    const source = this.getSource();
                    const splitter = this.audioCtx.createChannelSplitter(2);
                    const merger = this.audioCtx.createChannelMerger(2);
                    const gainNodeLeft = this.audioCtx.createGain();
                    const gainNodeRight = this.audioCtx.createGain();
                    // const gainNodeLeft = this.gainNodeLeft;
                    // const gainNodeRight = this.gainNodeRight;
                    source.buffer = buf;
                    source.connect(splitter);
                    splitter.connect(gainNodeLeft, 0);
                    splitter.connect(gainNodeRight, 0);
                    gainNodeLeft.connect(merger, 0, 0);
                    gainNodeRight.connect(merger, 0, 1);

                    merger.connect(this.audioCtx.destination);

                    this.gainNodeLeft = gainNodeLeft;
                    this.gainNodeRight = gainNodeRight;
                    this.leftVolume = this.leftVolume;
                    this.rightVolume = this.rightVolume;

                    source.loop = options.loop;
                    source.start(0);
                });
        }

        stop() {
            if (this._source) {
                try {
                    this._source.stop();
                } catch (e) {
                }
                this._source = null;
            }
        }

        /**
         *
         * @param soundPath
         * @returns {Promise.<AudioBufferSourceNode>}
         * @private
         */
        _loadSoundAndReturnBuffer(soundPath) {
            let ob = AudioDecodedBuffer.get(soundPath);
            if (ob) return new Promise((a, b) => a(ob));

            return ResourceManager
                .loadResourceAsArrayBuffer(soundPath)
                .then(originalBuffer => {
                    return this.audioCtx.decodeAudioData(originalBuffer);
                })
                .then(decodedBuffer => {
                    AudioDecodedBuffer.set(soundPath, decodedBuffer);

                    return decodedBuffer;
                }).catch(err => {
                    console.error(soundPath, err);
                });
        }

        done() {
            return Promise.all(this._promisies);
        }
    };

    Audio.prototype.stopAll = function () {
        AudioInstanceArray.forEach(ai => ai.stop());
    };

    return Framework;
})(Framework || {});