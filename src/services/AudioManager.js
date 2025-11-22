/**
 * AudioManager - Sound and Music Management
 *
 * Features:
 * - Background music control
 * - Sound effects playback
 * - Volume control (global, music, sfx)
 * - Audio sprite support
 * - Fade in/out
 * - Multiple audio formats (Web Audio API)
 * - Audio pooling for performance
 */

import BaseService from '../core/BaseService.js';

class AudioManager extends BaseService {
  constructor() {
    super('AudioManager');

    this.audioContext = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    // Audio storage
    this.sounds = new Map();        // All loaded sounds
    this.music = new Map();          // Background music
    this.currentMusic = null;        // Currently playing music

    // Volume settings (0.0 - 1.0)
    this.volumes = {
      master: 1.0,
      music: 0.7,
      sfx: 1.0
    };

    // State
    this.enabled = true;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.muted = false;

    // Audio pools for frequently played sounds
    this.pools = new Map();
  }

  /**
   * Initialize audio manager
   */
  async initialize() {
    await super.initialize();

    // Create Web Audio API context
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create gain nodes
      this.masterGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();

      // Connect gain nodes
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      // Set initial volumes
      this.masterGain.gain.value = this.volumes.master;
      this.musicGain.gain.value = this.volumes.music;
      this.sfxGain.gain.value = this.volumes.sfx;

      // Resume context on user interaction (required by browsers)
      this.setupUserInteraction();

      console.log('AudioManager initialized');
    } catch (error) {
      this.handleError(error, 'initialization');
      console.warn('Web Audio API not available, audio will be disabled');
      this.enabled = false;
    }
  }

  /**
   * Destroy audio manager
   */
  async destroy() {
    // Stop all sounds
    this.stopAll();

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
    }

    // Clear all audio
    this.sounds.clear();
    this.music.clear();
    this.pools.clear();

    await super.destroy();
  }

  /**
   * Setup user interaction to resume audio context
   * Required by modern browsers for autoplay policy
   */
  setupUserInteraction() {
    const resume = () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          console.log('AudioContext resumed');
          this.emit('context-resumed');
        });
      }

      // Remove listeners after first interaction
      document.removeEventListener('touchstart', resume);
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
    };

    document.addEventListener('touchstart', resume);
    document.addEventListener('click', resume);
    document.addEventListener('keydown', resume);
  }

  /**
   * Load audio file
   * @param {string} key - Audio key
   * @param {string} url - Audio file URL
   * @param {string} type - 'music' or 'sfx'
   * @returns {Promise<void>}
   */
  async load(key, url, type = 'sfx') {
    if (!this.enabled) {
      return;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      const audio = {
        buffer: audioBuffer,
        type,
        url,
        playing: []
      };

      this.sounds.set(key, audio);

      if (type === 'music') {
        this.music.set(key, audio);
      }

      console.log(`Audio loaded: ${key} (${type})`);
      this.emit('loaded', { key, type });

      return audioBuffer;
    } catch (error) {
      this.handleError(error, `load ${key}`);
      return null;
    }
  }

  /**
   * Load multiple audio files
   * @param {Array} audioList - Array of {key, url, type}
   * @returns {Promise<void>}
   */
  async loadMultiple(audioList) {
    const promises = audioList.map(({ key, url, type }) =>
      this.load(key, url, type)
    );

    await Promise.all(promises);
  }

  /**
   * Play sound effect
   * @param {string} key - Sound key
   * @param {object} options - Playback options
   * @returns {AudioBufferSourceNode|null}
   */
  playSfx(key, options = {}) {
    if (!this.enabled || !this.sfxEnabled || this.muted) {
      return null;
    }

    const audio = this.sounds.get(key);

    if (!audio) {
      console.warn(`Sound not found: ${key}`);
      return null;
    }

    try {
      const {
        volume = 1.0,
        loop = false,
        rate = 1.0,
        detune = 0
      } = options;

      // Create source
      const source = this.audioContext.createBufferSource();
      source.buffer = audio.buffer;
      source.loop = loop;
      source.playbackRate.value = rate;
      source.detune.value = detune;

      // Create gain for this sound
      const gain = this.audioContext.createGain();
      gain.gain.value = volume;

      // Connect: source -> gain -> sfxGain -> masterGain -> destination
      source.connect(gain);
      gain.connect(this.sfxGain);

      // Track playing sounds
      audio.playing.push({ source, gain });

      // Remove from playing list when done
      source.onended = () => {
        const index = audio.playing.findIndex(p => p.source === source);
        if (index !== -1) {
          audio.playing.splice(index, 1);
        }
      };

      // Start playback
      source.start(0);

      this.emit('sfx-played', { key, options });

      return source;
    } catch (error) {
      this.handleError(error, `play sfx ${key}`);
      return null;
    }
  }

  /**
   * Play background music
   * @param {string} key - Music key
   * @param {object} options - Playback options
   */
  playMusic(key, options = {}) {
    if (!this.enabled || !this.musicEnabled || this.muted) {
      return;
    }

    // Stop current music
    if (this.currentMusic && this.currentMusic !== key) {
      this.stopMusic();
    }

    const audio = this.music.get(key);

    if (!audio) {
      console.warn(`Music not found: ${key}`);
      return;
    }

    // Don't restart if already playing
    if (this.currentMusic === key && audio.playing.length > 0) {
      return;
    }

    try {
      const {
        volume = 1.0,
        fadeIn = 0,
        loop = true
      } = options;

      // Create source
      const source = this.audioContext.createBufferSource();
      source.buffer = audio.buffer;
      source.loop = loop;

      // Create gain
      const gain = this.audioContext.createGain();
      gain.gain.value = fadeIn > 0 ? 0 : volume;

      // Connect
      source.connect(gain);
      gain.connect(this.musicGain);

      // Track
      audio.playing = [{ source, gain, targetVolume: volume }];
      this.currentMusic = key;

      // Fade in if requested
      if (fadeIn > 0) {
        gain.gain.linearRampToValueAtTime(
          volume,
          this.audioContext.currentTime + fadeIn
        );
      }

      // Start
      source.start(0);

      this.emit('music-started', { key, options });

      console.log(`Playing music: ${key}`);
    } catch (error) {
      this.handleError(error, `play music ${key}`);
    }
  }

  /**
   * Stop background music
   * @param {number} fadeOut - Fade out duration in seconds
   */
  stopMusic(fadeOut = 0) {
    if (!this.currentMusic) {
      return;
    }

    const audio = this.music.get(this.currentMusic);

    if (!audio || audio.playing.length === 0) {
      this.currentMusic = null;
      return;
    }

    const { source, gain } = audio.playing[0];

    if (fadeOut > 0) {
      // Fade out
      gain.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + fadeOut
      );

      // Stop after fade
      setTimeout(() => {
        source.stop();
        audio.playing = [];
        this.currentMusic = null;
      }, fadeOut * 1000);
    } else {
      // Stop immediately
      source.stop();
      audio.playing = [];
      this.currentMusic = null;
    }

    this.emit('music-stopped');
  }

  /**
   * Pause background music
   */
  pauseMusic() {
    if (this.audioContext) {
      this.audioContext.suspend();
      this.emit('music-paused');
    }
  }

  /**
   * Resume background music
   */
  resumeMusic() {
    if (this.audioContext) {
      this.audioContext.resume();
      this.emit('music-resumed');
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    // Stop all sounds
    this.sounds.forEach(audio => {
      audio.playing.forEach(({ source }) => {
        try {
          source.stop();
        } catch (e) {
          // Already stopped
        }
      });
      audio.playing = [];
    });

    this.currentMusic = null;
    this.emit('all-stopped');
  }

  /**
   * Set master volume
   * @param {number} volume - Volume (0.0 - 1.0)
   */
  setMasterVolume(volume) {
    this.volumes.master = Math.max(0, Math.min(1, volume));

    if (this.masterGain) {
      this.masterGain.gain.value = this.volumes.master;
    }

    this.emit('volume-changed', { type: 'master', volume: this.volumes.master });
  }

  /**
   * Set music volume
   * @param {number} volume - Volume (0.0 - 1.0)
   */
  setMusicVolume(volume) {
    this.volumes.music = Math.max(0, Math.min(1, volume));

    if (this.musicGain) {
      this.musicGain.gain.value = this.volumes.music;
    }

    this.emit('volume-changed', { type: 'music', volume: this.volumes.music });
  }

  /**
   * Set SFX volume
   * @param {number} volume - Volume (0.0 - 1.0)
   */
  setSfxVolume(volume) {
    this.volumes.sfx = Math.max(0, Math.min(1, volume));

    if (this.sfxGain) {
      this.sfxGain.gain.value = this.volumes.sfx;
    }

    this.emit('volume-changed', { type: 'sfx', volume: this.volumes.sfx });
  }

  /**
   * Get current volumes
   * @returns {object}
   */
  getVolumes() {
    return { ...this.volumes };
  }

  /**
   * Mute all audio
   */
  mute() {
    this.muted = true;

    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }

    this.emit('muted');
  }

  /**
   * Unmute all audio
   */
  unmute() {
    this.muted = false;

    if (this.masterGain) {
      this.masterGain.gain.value = this.volumes.master;
    }

    this.emit('unmuted');
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }

    return this.muted;
  }

  /**
   * Enable/disable music
   * @param {boolean} enabled
   */
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;

    if (!enabled && this.currentMusic) {
      this.stopMusic();
    }

    this.emit('music-enabled-changed', enabled);
  }

  /**
   * Enable/disable sound effects
   * @param {boolean} enabled
   */
  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    this.emit('sfx-enabled-changed', enabled);
  }

  /**
   * Check if audio is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Check if muted
   * @returns {boolean}
   */
  isMuted() {
    return this.muted;
  }

  /**
   * Get loaded sounds count
   * @returns {number}
   */
  getSoundCount() {
    return this.sounds.size;
  }

  /**
   * Get debug information
   * @returns {object}
   */
  getDebugInfo() {
    const baseInfo = super.getDebugInfo();

    return {
      ...baseInfo,
      enabled: this.enabled,
      muted: this.muted,
      musicEnabled: this.musicEnabled,
      sfxEnabled: this.sfxEnabled,
      volumes: this.volumes,
      soundsLoaded: this.sounds.size,
      musicLoaded: this.music.size,
      currentMusic: this.currentMusic,
      audioContextState: this.audioContext?.state || 'unavailable'
    };
  }
}

export default AudioManager;
