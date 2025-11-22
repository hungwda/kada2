/**
 * PhaserBridge - Communication layer between Phaser and Preact
 *
 * Features:
 * - Manages Phaser game instance lifecycle
 * - Provides API for Preact to control games
 * - Emits events for state changes
 * - Handles DOM integration and cleanup
 * - Synchronizes game state with app state
 */

import Phaser from 'phaser';

class PhaserBridge {
  constructor(config = {}) {
    this.config = config;
    this.game = null;
    this.gameInstance = null; // BaseGame instance
    this.containerElement = null;
    this.eventListeners = new Map();

    // Services
    this.viewport = window.services.get('viewport');
    this.store = window.store;

    // State
    this.isInitialized = false;
    this.isPaused = false;
  }

  /**
   * Initialize Phaser game instance
   * @param {HTMLElement} container - DOM container element
   * @param {object} gameConfig - Phaser game configuration
   * @returns {Phaser.Game}
   */
  init(container, gameConfig) {
    if (this.isInitialized) {
      console.warn('PhaserBridge already initialized');
      return this.game;
    }

    console.log('Initializing Phaser game:', gameConfig.type);

    this.containerElement = container;

    // Get optimal game dimensions
    const dims = this.viewport.getOptimalGameDimensions();

    // Create Phaser configuration
    const phaserConfig = {
      type: Phaser.AUTO,
      width: dims.width,
      height: dims.height,
      parent: container,
      backgroundColor: gameConfig.backgroundColor || '#FFFFFF',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: dims.width,
        height: dims.height
      },
      physics: gameConfig.physics || {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: gameConfig.scenes || [],
      ...gameConfig.phaserConfig
    };

    // Create Phaser game
    this.game = new Phaser.Game(phaserConfig);

    // Set up resize handling
    this.setupResize();

    // Set up scene event listeners
    this.setupSceneEvents();

    this.isInitialized = true;

    this.emit('init', { game: this.game });

    console.log('Phaser game initialized');

    return this.game;
  }

  /**
   * Set up resize handling
   */
  setupResize() {
    this.viewport.onResize((state) => {
      if (!this.game) return;

      const dims = state.gameDimensions;

      // Update Phaser scale
      this.game.scale.resize(dims.width, dims.height);

      this.emit('resize', dims);
    });
  }

  /**
   * Set up scene event listeners
   */
  setupSceneEvents() {
    if (!this.game) return;

    // Listen to scene events
    this.game.events.on('ready', () => {
      console.log('Phaser game ready');
      this.emit('ready');
    });

    this.game.events.on('step', (time, delta) => {
      this.emit('step', { time, delta });
    });

    this.game.events.on('pause', () => {
      this.isPaused = true;
      this.emit('pause');
    });

    this.game.events.on('resume', () => {
      this.isPaused = false;
      this.emit('resume');
    });
  }

  /**
   * Start game with specific scene
   * @param {string} sceneKey - Scene key to start
   * @param {object} data - Data to pass to scene
   */
  startScene(sceneKey, data = {}) {
    if (!this.game) {
      console.error('Cannot start scene: game not initialized');
      return;
    }

    console.log(`Starting scene: ${sceneKey}`);

    // Wait for Phaser to finish registering scenes, then start
    const tryStartScene = () => {
      const scene = this.game.scene.getScene(sceneKey);

      if (scene) {
        this.game.scene.start(sceneKey, data);
        this.emit('scene-start', { sceneKey, data });
        console.log(`Scene ${sceneKey} started successfully`);
      } else {
        // Scene not ready yet, try again on next frame
        setTimeout(tryStartScene, 10);
      }
    };

    tryStartScene();
  }

  /**
   * Set BaseGame instance for this bridge
   * @param {BaseGame} instance - Game instance
   */
  setGameInstance(instance) {
    this.gameInstance = instance;

    // Set up game event forwarding
    if (instance) {
      instance.onScoreChange = (score) => {
        this.emit('score-change', { score });
      };

      instance.onLivesChange = (lives) => {
        this.emit('lives-change', { lives });
      };

      instance.onGameOver = (data) => {
        this.emit('game-over', data);
      };

      instance.onGameComplete = (data) => {
        this.emit('game-complete', data);
      };

      instance.onPause = () => {
        this.emit('game-pause');
      };

      instance.onResume = () => {
        this.emit('game-resume');
      };
    }

    console.log('Game instance set');
  }

  /**
   * Pause game
   */
  pause() {
    if (!this.game) return;

    this.game.scene.pause();

    if (this.gameInstance) {
      this.gameInstance.pause();
    }

    this.isPaused = true;
    this.emit('pause');

    console.log('Game paused');
  }

  /**
   * Resume game
   */
  resume() {
    if (!this.game) return;

    this.game.scene.resume();

    if (this.gameInstance) {
      this.gameInstance.resume();
    }

    this.isPaused = false;
    this.emit('resume');

    console.log('Game resumed');
  }

  /**
   * Get current game state
   * @returns {object}
   */
  getGameState() {
    if (!this.gameInstance) {
      return {
        score: 0,
        lives: 0,
        level: 1,
        isPlaying: false,
        isPaused: false
      };
    }

    return this.gameInstance.getState();
  }

  /**
   * Get Phaser game instance
   * @returns {Phaser.Game}
   */
  getGame() {
    return this.game;
  }

  /**
   * Get active scene
   * @returns {Phaser.Scene}
   */
  getActiveScene() {
    if (!this.game) return null;

    const scenes = this.game.scene.getScenes(true);
    return scenes.length > 0 ? scenes[0] : null;
  }

  /**
   * Destroy game instance
   */
  destroy() {
    console.log('Destroying Phaser game');

    // Destroy game instance
    if (this.gameInstance) {
      this.gameInstance.destroy();
      this.gameInstance = null;
    }

    // Destroy Phaser game
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }

    // Clear container
    if (this.containerElement) {
      this.containerElement.innerHTML = '';
      this.containerElement = null;
    }

    // Clear event listeners
    this.eventListeners.clear();

    this.isInitialized = false;
    this.isPaused = false;

    this.emit('destroy');

    console.log('Phaser game destroyed');
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }

    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   */
  off(event, callback) {
    if (!this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event);
    const index = listeners.indexOf(callback);

    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    if (!this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event);

    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    });
  }

  /**
   * Check if game is initialized
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized && this.game !== null;
  }

  /**
   * Check if game is paused
   * @returns {boolean}
   */
  isPausedState() {
    return this.isPaused;
  }

  /**
   * Take screenshot of game
   * @returns {string} - Data URL of screenshot
   */
  takeScreenshot() {
    if (!this.game) return null;

    const canvas = this.game.canvas;
    return canvas.toDataURL('image/png');
  }

  /**
   * Get game performance metrics
   * @returns {object}
   */
  getPerformance() {
    if (!this.game) return null;

    return {
      fps: this.game.loop.actualFps,
      delta: this.game.loop.delta,
      frame: this.game.loop.frame
    };
  }
}

export default PhaserBridge;
