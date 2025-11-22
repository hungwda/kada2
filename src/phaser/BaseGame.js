/**
 * BaseGame - Foundation for all Phaser games
 *
 * Features:
 * - Lifecycle management (init, start, pause, resume, end)
 * - Score tracking
 * - Lives system
 * - Timer functionality
 * - Audio integration
 * - Progress saving
 * - Responsive layout handling
 * - Event system for UI updates
 */

import Phaser from 'phaser';

class BaseGame {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.config = config;

    // Game state
    this.isInitialized = false;
    this.isPlaying = false;
    this.isPaused = false;
    this.isComplete = false;

    // Game data
    this.score = 0;
    this.lives = config.lives || 3;
    this.level = config.level || 1;
    this.stars = 0;
    this.startTime = 0;
    this.playTime = 0;
    this.timer = null;

    // Services
    this.viewport = window.services.get('viewport');
    this.audio = window.services.get('audio');
    this.progress = window.services.get('progress');
    this.i18n = window.services.get('i18n');
    this.store = window.store;

    // Event callbacks
    this.onScoreChange = null;
    this.onLivesChange = null;
    this.onGameOver = null;
    this.onGameComplete = null;
    this.onPause = null;
    this.onResume = null;
  }

  /**
   * Initialize game
   * Called once when game is created
   */
  init() {
    if (this.isInitialized) {
      return;
    }

    console.log(`Initializing game: ${this.config.id}`);

    // Dispatch game start to state
    this.store.dispatch({
      type: 'GAME_START',
      payload: {
        gameId: this.config.id,
        lives: this.lives,
        level: this.level
      }
    });

    this.isInitialized = true;
  }

  /**
   * Start game
   * Called when gameplay begins
   */
  start() {
    if (this.isPlaying) {
      return;
    }

    console.log('Starting game');

    this.isPlaying = true;
    this.startTime = Date.now();

    // Start timer if configured
    if (this.config.timeLimit) {
      this.startTimer(this.config.timeLimit);
    }

    // Play background music if configured
    if (this.config.music) {
      this.audio.playMusic(this.config.music, {
        loop: true,
        fadeIn: 1
      });
    }
  }

  /**
   * Pause game
   */
  pause() {
    if (!this.isPlaying || this.isPaused) {
      return;
    }

    this.isPaused = true;
    this.scene.scene.pause();

    // Pause audio
    this.audio.pauseMusic();

    // Pause timer
    if (this.timer) {
      this.timer.paused = true;
    }

    // Dispatch to state
    this.store.dispatch({ type: 'GAME_PAUSE' });

    // Callback
    if (this.onPause) {
      this.onPause();
    }

    console.log('Game paused');
  }

  /**
   * Resume game
   */
  resume() {
    if (!this.isPlaying || !this.isPaused) {
      return;
    }

    this.isPaused = false;
    this.scene.scene.resume();

    // Resume audio
    this.audio.resumeMusic();

    // Resume timer
    if (this.timer) {
      this.timer.paused = false;
    }

    // Dispatch to state
    this.store.dispatch({ type: 'GAME_RESUME' });

    // Callback
    if (this.onResume) {
      this.onResume();
    }

    console.log('Game resumed');
  }

  /**
   * End game
   * @param {boolean} completed - Whether game was completed successfully
   */
  end(completed = false) {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;
    this.isComplete = completed;

    // Calculate play time
    this.playTime = Date.now() - this.startTime;

    // Stop timer
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }

    // Stop music
    this.audio.stopMusic(1);

    // Calculate stars (1-3 based on performance)
    this.stars = this.calculateStars();

    // Save progress
    this.saveProgress();

    // Dispatch to state
    if (completed) {
      this.store.dispatch({
        type: 'GAME_COMPLETE',
        payload: {
          gameId: this.config.id,
          stars: this.stars
        }
      });
    } else {
      this.store.dispatch({ type: 'GAME_END' });
    }

    // Callbacks
    if (completed && this.onGameComplete) {
      this.onGameComplete({
        score: this.score,
        stars: this.stars,
        playTime: this.playTime
      });
    } else if (!completed && this.onGameOver) {
      this.onGameOver({
        score: this.score,
        playTime: this.playTime
      });
    }

    console.log(`Game ended: ${completed ? 'completed' : 'game over'}`);
  }

  /**
   * Add score
   * @param {number} points - Points to add
   */
  addScore(points) {
    this.score += points;

    // Dispatch to state
    this.store.dispatch({
      type: 'GAME_SET_SCORE',
      payload: { score: this.score }
    });

    // Callback
    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }

    // Play sound effect
    this.audio.playSfx('score', { volume: 0.5 });
  }

  /**
   * Set score
   * @param {number} score - New score
   */
  setScore(score) {
    this.score = score;

    this.store.dispatch({
      type: 'GAME_SET_SCORE',
      payload: { score: this.score }
    });

    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }
  }

  /**
   * Lose a life
   * @returns {boolean} - True if game over
   */
  loseLife() {
    this.lives--;

    // Dispatch to state
    this.store.dispatch({
      type: 'GAME_SET_LIVES',
      payload: { lives: this.lives }
    });

    // Callback
    if (this.onLivesChange) {
      this.onLivesChange(this.lives);
    }

    // Play sound effect
    this.audio.playSfx('lose-life', { volume: 0.7 });

    // Check game over
    if (this.lives <= 0) {
      this.end(false);
      return true;
    }

    return false;
  }

  /**
   * Gain a life
   */
  gainLife() {
    this.lives++;

    this.store.dispatch({
      type: 'GAME_SET_LIVES',
      payload: { lives: this.lives }
    });

    if (this.onLivesChange) {
      this.onLivesChange(this.lives);
    }

    this.audio.playSfx('gain-life', { volume: 0.7 });
  }

  /**
   * Start countdown timer
   * @param {number} seconds - Timer duration in seconds
   */
  startTimer(seconds) {
    const scene = this.scene;

    this.timer = scene.time.addEvent({
      delay: 1000,
      callback: () => {
        seconds--;

        if (seconds <= 0) {
          this.end(false);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  /**
   * Calculate stars based on performance
   * @returns {number} - Stars earned (1-3)
   */
  calculateStars() {
    const targetScore = this.config.targetScore || 100;
    const percentage = (this.score / targetScore) * 100;

    if (percentage >= 100) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 40) return 1;
    return 0;
  }

  /**
   * Save progress to ProgressManager
   */
  async saveProgress() {
    try {
      await this.progress.saveGameResult(this.config.id, {
        score: this.score,
        stars: this.stars,
        completed: this.isComplete,
        timeSpent: this.playTime
      });

      console.log('Progress saved');
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  /**
   * Get current game state
   * @returns {object}
   */
  getState() {
    return {
      score: this.score,
      lives: this.lives,
      level: this.level,
      stars: this.stars,
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      isComplete: this.isComplete,
      playTime: this.isPlaying ? Date.now() - this.startTime : this.playTime
    };
  }

  /**
   * Get responsive value
   * @param {object} config - Breakpoint values
   * @returns {any}
   */
  getResponsiveValue(config) {
    return this.viewport.getResponsiveValue(config);
  }

  /**
   * Check if mobile device
   * @returns {boolean}
   */
  isMobile() {
    return this.viewport.isMobileDevice();
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.timer) {
      this.timer.destroy();
    }

    this.audio.stopMusic();
    console.log('Game destroyed');
  }
}

export default BaseGame;
