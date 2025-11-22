/**
 * ProgressManager - Save/Load Player Progress
 *
 * Features:
 * - Save/load user profile and progress
 * - Track game completions and achievements
 * - Calculate statistics
 * - Export/import progress
 * - Reset progress
 */

import BaseService from '../core/BaseService.js';

const STORAGE_KEY = 'kannada_games_progress';

class ProgressManager extends BaseService {
  constructor() {
    super('ProgressManager');

    this.progress = null;
    this.autoSaveEnabled = true;
    this.autoSaveInterval = null;
  }

  /**
   * Initialize progress manager
   */
  async initialize() {
    await super.initialize();

    // Load existing progress
    await this.load();

    // Start auto-save (every 30 seconds)
    if (this.autoSaveEnabled) {
      this.startAutoSave();
    }

    console.log('ProgressManager initialized');
  }

  /**
   * Destroy progress manager
   */
  async destroy() {
    // Stop auto-save
    this.stopAutoSave();

    // Save before destroying
    await this.save();

    await super.destroy();
  }

  /**
   * Load progress from storage
   */
  async load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);

      if (data) {
        this.progress = JSON.parse(data);
        console.log('Progress loaded:', this.progress);
        this.emit('loaded', this.progress);
      } else {
        this.progress = this.createEmptyProgress();
        console.log('No existing progress found, created new');
      }

      return this.progress;
    } catch (error) {
      this.handleError(error, 'load');
      this.progress = this.createEmptyProgress();
      return this.progress;
    }
  }

  /**
   * Save progress to storage
   */
  async save() {
    try {
      if (!this.progress) {
        console.warn('No progress to save');
        return false;
      }

      this.progress.lastSaved = Date.now();

      const data = JSON.stringify(this.progress);
      localStorage.setItem(STORAGE_KEY, data);

      console.log('Progress saved');
      this.emit('saved', this.progress);

      return true;
    } catch (error) {
      this.handleError(error, 'save');
      return false;
    }
  }

  /**
   * Create empty progress structure
   * @returns {object}
   */
  createEmptyProgress() {
    return {
      profile: {
        name: '',
        age: null,
        avatarId: 1,
        createdAt: Date.now()
      },
      preferences: {
        language: 'kn',
        soundEnabled: true,
        musicEnabled: true,
        musicVolume: 0.7,
        sfxVolume: 1.0,
        difficulty: 'auto',
        showHints: true
      },
      progress: {
        gamesCompleted: [],
        currentLevel: {},
        totalStars: 0,
        achievements: [],
        streakDays: 0,
        lastPlayedDate: null
      },
      stats: {
        totalPlayTime: 0,
        totalGamesPlayed: 0,
        totalCompletions: 0,
        averageScore: 0
      },
      lastSaved: Date.now()
    };
  }

  /**
   * Create new profile
   * @param {object} profileData - Profile data
   */
  async createProfile(profileData) {
    this.progress = this.createEmptyProgress();

    this.progress.profile = {
      ...this.progress.profile,
      ...profileData,
      createdAt: Date.now()
    };

    await this.save();
    this.emit('profile-created', this.progress.profile);

    return this.progress.profile;
  }

  /**
   * Update profile
   * @param {object} updates - Profile updates
   */
  async updateProfile(updates) {
    if (!this.progress) {
      await this.load();
    }

    this.progress.profile = {
      ...this.progress.profile,
      ...updates
    };

    await this.save();
    this.emit('profile-updated', this.progress.profile);

    return this.progress.profile;
  }

  /**
   * Update preferences
   * @param {object} updates - Preference updates
   */
  async updatePreferences(updates) {
    if (!this.progress) {
      await this.load();
    }

    this.progress.preferences = {
      ...this.progress.preferences,
      ...updates
    };

    await this.save();
    this.emit('preferences-updated', this.progress.preferences);

    return this.progress.preferences;
  }

  /**
   * Save game result
   * @param {string} gameId - Game ID
   * @param {object} result - Game result
   */
  async saveGameResult(gameId, result) {
    if (!this.progress) {
      await this.load();
    }

    const { score, stars, completed, timeSpent } = result;

    // Update game completion
    if (completed && !this.progress.progress.gamesCompleted.includes(gameId)) {
      this.progress.progress.gamesCompleted.push(gameId);
    }

    // Update total stars
    if (stars) {
      this.progress.progress.totalStars += stars;
    }

    // Update level progress
    if (!this.progress.progress.currentLevel[gameId]) {
      this.progress.progress.currentLevel[gameId] = {
        level: 1,
        highScore: score,
        bestStars: stars,
        completions: completed ? 1 : 0,
        totalAttempts: 1
      };
    } else {
      const gameLevel = this.progress.progress.currentLevel[gameId];
      gameLevel.totalAttempts++;

      if (completed) {
        gameLevel.completions++;
      }

      if (score > gameLevel.highScore) {
        gameLevel.highScore = score;
      }

      if (stars > gameLevel.bestStars) {
        gameLevel.bestStars = stars;
      }
    }

    // Update stats
    this.progress.stats.totalGamesPlayed++;

    if (completed) {
      this.progress.stats.totalCompletions++;
    }

    if (timeSpent) {
      this.progress.stats.totalPlayTime += timeSpent;
    }

    // Update streak
    this.updateStreak();

    // Update last played
    this.progress.progress.lastPlayedDate = Date.now();

    await this.save();
    this.emit('game-result-saved', { gameId, result });

    return this.progress;
  }

  /**
   * Add achievement
   * @param {object} achievement - Achievement data
   */
  async addAchievement(achievement) {
    if (!this.progress) {
      await this.load();
    }

    const { id, name, description, earnedAt = Date.now() } = achievement;

    // Check if achievement already exists
    const exists = this.progress.progress.achievements.some(a => a.id === id);

    if (!exists) {
      this.progress.progress.achievements.push({
        id,
        name,
        description,
        earnedAt
      });

      await this.save();
      this.emit('achievement-added', achievement);
    }

    return this.progress.progress.achievements;
  }

  /**
   * Update streak
   */
  updateStreak() {
    const now = Date.now();
    const lastPlayed = this.progress.progress.lastPlayedDate;

    if (!lastPlayed) {
      this.progress.progress.streakDays = 1;
      return;
    }

    const daysSinceLastPlayed = Math.floor((now - lastPlayed) / (1000 * 60 * 60 * 24));

    if (daysSinceLastPlayed === 0) {
      // Same day, streak continues
      return;
    } else if (daysSinceLastPlayed === 1) {
      // Next day, increment streak
      this.progress.progress.streakDays++;
    } else {
      // More than 1 day, reset streak
      this.progress.progress.streakDays = 1;
    }
  }

  /**
   * Get current progress
   * @returns {object}
   */
  getProgress() {
    return this.progress ? { ...this.progress } : null;
  }

  /**
   * Get profile
   * @returns {object}
   */
  getProfile() {
    return this.progress ? { ...this.progress.profile } : null;
  }

  /**
   * Get preferences
   * @returns {object}
   */
  getPreferences() {
    return this.progress ? { ...this.progress.preferences } : null;
  }

  /**
   * Get game progress
   * @param {string} gameId - Game ID
   * @returns {object}
   */
  getGameProgress(gameId) {
    if (!this.progress || !this.progress.progress.currentLevel[gameId]) {
      return null;
    }

    return { ...this.progress.progress.currentLevel[gameId] };
  }

  /**
   * Get statistics
   * @returns {object}
   */
  getStats() {
    return this.progress ? { ...this.progress.stats } : null;
  }

  /**
   * Export progress
   * @returns {string} JSON string
   */
  export() {
    if (!this.progress) {
      return null;
    }

    return JSON.stringify(this.progress, null, 2);
  }

  /**
   * Import progress
   * @param {string} data - JSON string
   */
  async import(data) {
    try {
      const imported = JSON.parse(data);

      // Validate structure
      if (!imported.profile || !imported.progress) {
        throw new Error('Invalid progress data format');
      }

      this.progress = imported;
      await this.save();

      this.emit('imported', this.progress);

      return true;
    } catch (error) {
      this.handleError(error, 'import');
      return false;
    }
  }

  /**
   * Reset progress
   */
  async reset() {
    this.progress = this.createEmptyProgress();
    await this.save();

    this.emit('reset');

    console.log('Progress reset');
  }

  /**
   * Clear all data
   */
  async clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.progress = null;

      this.emit('cleared');

      console.log('Progress cleared');
    } catch (error) {
      this.handleError(error, 'clear');
    }
  }

  /**
   * Start auto-save
   */
  startAutoSave() {
    this.stopAutoSave(); // Clear existing interval

    this.autoSaveInterval = setInterval(() => {
      if (this.progress) {
        this.save().catch(error => {
          console.error('Auto-save failed:', error);
        });
      }
    }, 30000); // Save every 30 seconds

    console.log('Auto-save started');
  }

  /**
   * Stop auto-save
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('Auto-save stopped');
    }
  }

  /**
   * Enable/disable auto-save
   * @param {boolean} enabled
   */
  setAutoSave(enabled) {
    this.autoSaveEnabled = enabled;

    if (enabled) {
      this.startAutoSave();
    } else {
      this.stopAutoSave();
    }
  }

  /**
   * Get debug information
   * @returns {object}
   */
  getDebugInfo() {
    const baseInfo = super.getDebugInfo();

    return {
      ...baseInfo,
      hasProgress: !!this.progress,
      autoSaveEnabled: this.autoSaveEnabled,
      profile: this.progress?.profile,
      stats: this.progress?.stats,
      gamesCompleted: this.progress?.progress.gamesCompleted.length || 0,
      totalStars: this.progress?.progress.totalStars || 0,
      achievements: this.progress?.progress.achievements.length || 0
    };
  }
}

export default ProgressManager;
