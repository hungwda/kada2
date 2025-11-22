/**
 * I18nService - Internationalization Service
 *
 * Features:
 * - Multi-language support (Kannada, English)
 * - Translation key lookup
 * - Plural handling
 * - Variable interpolation
 * - Missing translation detection
 * - Language switching
 * - Fallback language support
 */

import BaseService from '../core/BaseService.js';

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'kn'];
const DEFAULT_LANGUAGE = 'en';
const FALLBACK_LANGUAGE = 'en';

class I18nService extends BaseService {
  constructor() {
    super('I18nService');

    this.currentLanguage = DEFAULT_LANGUAGE;
    this.fallbackLanguage = FALLBACK_LANGUAGE;
    this.translations = new Map();
    this.missingKeys = new Set();
  }

  /**
   * Initialize I18n service
   */
  async initialize() {
    await super.initialize();

    // Load default translations
    await this.loadLanguage(DEFAULT_LANGUAGE);

    // Load saved language preference
    const savedLang = this.getSavedLanguage();
    if (savedLang && savedLang !== DEFAULT_LANGUAGE) {
      await this.setLanguage(savedLang);
    }

    console.log('I18nService initialized with language:', this.currentLanguage);
  }

  /**
   * Load language translations
   * @param {string} lang - Language code
   * @returns {Promise<object>}
   */
  async loadLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Language not supported: ${lang}`);
      return null;
    }

    try {
      // In production, this would load from a file
      // For now, we'll use inline translations
      const translations = this.getBuiltInTranslations(lang);

      this.translations.set(lang, translations);

      this.emit('language-loaded', { lang, translations });

      return translations;
    } catch (error) {
      this.handleError(error, `load language ${lang}`);
      return null;
    }
  }

  /**
   * Get built-in translations
   * @param {string} lang - Language code
   * @returns {object}
   */
  getBuiltInTranslations(lang) {
    const translations = {
      en: {
        // App
        app: {
          name: 'Kannada Learning Games',
          tagline: 'Learn Kannada through fun games!',
          loading: 'Loading...',
          error: 'An error occurred'
        },

        // Navigation
        nav: {
          home: 'Home',
          games: 'Games',
          dashboard: 'Dashboard',
          profile: 'Profile',
          settings: 'Settings'
        },

        // Onboarding
        onboarding: {
          welcome: 'Welcome!',
          welcomeMessage: 'Let\'s start your Kannada learning journey',
          languageTitle: 'Choose your language',
          languageSubtitle: 'Select the language for the app interface',
          ageTitle: 'How old are you?',
          ageSubtitle: 'This helps us customize the experience',
          avatarTitle: 'Choose your avatar',
          avatarSubtitle: 'Pick your favorite character',
          parentalTitle: 'Parental Controls',
          parentalSubtitle: 'Set time limits and content filters',
          next: 'Next',
          back: 'Back',
          getStarted: 'Get Started',
          skip: 'Skip'
        },

        // Games
        games: {
          play: 'Play',
          replay: 'Play Again',
          pause: 'Pause',
          resume: 'Resume',
          exit: 'Exit',
          score: 'Score',
          lives: 'Lives',
          level: 'Level',
          stars: 'Stars',
          time: 'Time',
          highScore: 'High Score',
          complete: 'Complete!',
          gameOver: 'Game Over',
          tryAgain: 'Try Again',
          nextLevel: 'Next Level'
        },

        // Dashboard
        dashboard: {
          title: 'Your Progress',
          subtitle: 'Keep up the great work!',
          totalStars: 'Total Stars',
          gamesCompleted: 'Games Completed',
          playTime: 'Play Time',
          streak: 'Day Streak',
          achievements: 'Achievements',
          recentGames: 'Recent Games',
          continue: 'Continue Learning',
          viewAll: 'View All'
        },

        // Profile
        profile: {
          title: 'Profile',
          name: 'Name',
          age: 'Age',
          avatar: 'Avatar',
          edit: 'Edit Profile',
          save: 'Save',
          cancel: 'Cancel',
          signOut: 'Sign Out'
        },

        // Settings
        settings: {
          title: 'Settings',
          sound: 'Sound',
          music: 'Music',
          soundEffects: 'Sound Effects',
          volume: 'Volume',
          language: 'Language',
          difficulty: 'Difficulty',
          easy: 'Easy',
          medium: 'Medium',
          hard: 'Hard',
          auto: 'Auto',
          showHints: 'Show Hints',
          notifications: 'Notifications',
          resetProgress: 'Reset Progress',
          about: 'About'
        },

        // Common
        common: {
          yes: 'Yes',
          no: 'No',
          ok: 'OK',
          cancel: 'Cancel',
          close: 'Close',
          save: 'Save',
          delete: 'Delete',
          confirm: 'Confirm',
          back: 'Back',
          next: 'Next',
          done: 'Done',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success'
        },

        // Messages
        messages: {
          saveSuccess: 'Saved successfully',
          saveError: 'Failed to save',
          loadError: 'Failed to load',
          confirmDelete: 'Are you sure you want to delete?',
          confirmReset: 'Are you sure you want to reset all progress?',
          noInternet: 'No internet connection',
          updateAvailable: 'A new version is available',
          installPrompt: 'Install this app for a better experience'
        },

        // Learning
        learning: {
          correct: 'Correct!',
          incorrect: 'Try again',
          excellent: 'Excellent!',
          good: 'Good job!',
          keepGoing: 'Keep going!',
          almostThere: 'Almost there!',
          perfect: 'Perfect!',
          hint: 'Hint',
          showAnswer: 'Show Answer'
        }
      },

      kn: {
        // App
        app: {
          name: 'ಕನ್ನಡ ಕಲಿಕಾ ಆಟಗಳು',
          tagline: 'ಮಜಾದಾರ ಆಟಗಳ ಮೂಲಕ ಕನ್ನಡ ಕಲಿಯಿರಿ!',
          loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
          error: 'ದೋಷ ಸಂಭವಿಸಿದೆ'
        },

        // Navigation
        nav: {
          home: 'ಮುಖಪುಟ',
          games: 'ಆಟಗಳು',
          dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
          profile: 'ಪ್ರೊಫೈಲ್',
          settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'
        },

        // Onboarding
        onboarding: {
          welcome: 'ಸ್ವಾಗತ!',
          welcomeMessage: 'ನಿಮ್ಮ ಕನ್ನಡ ಕಲಿಕೆಯ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸೋಣ',
          languageTitle: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
          languageSubtitle: 'ಅಪ್ಲಿಕೇಶನ್ ಇಂಟರ್ಫೇಸ್‌ಗಾಗಿ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
          ageTitle: 'ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?',
          ageSubtitle: 'ಇದು ನಮಗೆ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಜ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ',
          avatarTitle: 'ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆರಿಸಿ',
          avatarSubtitle: 'ನಿಮ್ಮ ನೆಚ್ಚಿನ ಪಾತ್ರವನ್ನು ಆರಿಸಿ',
          parentalTitle: 'ಪೋಷಕರ ನಿಯಂತ್ರಣಗಳು',
          parentalSubtitle: 'ಸಮಯ ಮಿತಿಗಳು ಮತ್ತು ವಿಷಯ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ',
          next: 'ಮುಂದೆ',
          back: 'ಹಿಂದೆ',
          getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
          skip: 'ಬಿಟ್ಟುಬಿಡಿ'
        },

        // Games
        games: {
          play: 'ಆಡಿ',
          replay: 'ಮತ್ತೆ ಆಡಿ',
          pause: 'ವಿರಾಮ',
          resume: 'ಮುಂದುವರಿಸಿ',
          exit: 'ನಿರ್ಗಮಿಸು',
          score: 'ಅಂಕ',
          lives: 'ಜೀವಗಳು',
          level: 'ಹಂತ',
          stars: 'ನಕ್ಷತ್ರಗಳು',
          time: 'ಸಮಯ',
          highScore: 'ಹೆಚ್ಚಿನ ಅಂಕ',
          complete: 'ಪೂರ್ಣಗೊಂಡಿದೆ!',
          gameOver: 'ಆಟ ಮುಗಿದಿದೆ',
          tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
          nextLevel: 'ಮುಂದಿನ ಹಂತ'
        },

        // Dashboard
        dashboard: {
          title: 'ನಿಮ್ಮ ಪ್ರಗತಿ',
          subtitle: 'ಉತ್ತಮ ಕೆಲಸವನ್ನು ಮುಂದುವರಿಸಿ!',
          totalStars: 'ಒಟ್ಟು ನಕ್ಷತ್ರಗಳು',
          gamesCompleted: 'ಪೂರ್ಣಗೊಂಡ ಆಟಗಳು',
          playTime: 'ಆಟದ ಸಮಯ',
          streak: 'ದಿನಗಳ ಸರಣಿ',
          achievements: 'ಸಾಧನೆಗಳು',
          recentGames: 'ಇತ್ತೀಚಿನ ಆಟಗಳು',
          continue: 'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ',
          viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ'
        },

        // Profile
        profile: {
          title: 'ಪ್ರೊಫೈಲ್',
          name: 'ಹೆಸರು',
          age: 'ವಯಸ್ಸು',
          avatar: 'ಅವತಾರ',
          edit: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
          save: 'ಉಳಿಸಿ',
          cancel: 'ರದ್ದುಮಾಡಿ',
          signOut: 'ಸೈನ್ ಔಟ್'
        },

        // Settings
        settings: {
          title: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
          sound: 'ಧ್ವನಿ',
          music: 'ಸಂಗೀತ',
          soundEffects: 'ಧ್ವನಿ ಪರಿಣಾಮಗಳು',
          volume: 'ವಾಲ್ಯೂಮ್',
          language: 'ಭಾಷೆ',
          difficulty: 'ಕಷ್ಟದ ಮಟ್ಟ',
          easy: 'ಸುಲಭ',
          medium: 'ಮಧ್ಯಮ',
          hard: 'ಕಠಿಣ',
          auto: 'ಸ್ವಯಂ',
          showHints: 'ಸುಳಿವುಗಳನ್ನು ತೋರಿಸಿ',
          notifications: 'ಅಧಿಸೂಚನೆಗಳು',
          resetProgress: 'ಪ್ರಗತಿಯನ್ನು ಮರುಹೊಂದಿಸಿ',
          about: 'ಬಗ್ಗೆ'
        },

        // Common
        common: {
          yes: 'ಹೌದು',
          no: 'ಇಲ್ಲ',
          ok: 'ಸರಿ',
          cancel: 'ರದ್ದುಮಾಡಿ',
          close: 'ಮುಚ್ಚಿ',
          save: 'ಉಳಿಸಿ',
          delete: 'ಅಳಿಸಿ',
          confirm: 'ದೃಢೀಕರಿಸಿ',
          back: 'ಹಿಂದೆ',
          next: 'ಮುಂದೆ',
          done: 'ಮುಗಿದಿದೆ',
          loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
          error: 'ದೋಷ',
          success: 'ಯಶಸ್ವಿ'
        },

        // Messages
        messages: {
          saveSuccess: 'ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ',
          saveError: 'ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ',
          loadError: 'ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ',
          confirmDelete: 'ನೀವು ಅಳಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?',
          confirmReset: 'ನೀವು ಎಲ್ಲಾ ಪ್ರಗತಿಯನ್ನು ಮರುಹೊಂದಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?',
          noInternet: 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ',
          updateAvailable: 'ಹೊಸ ಆವೃತ್ತಿ ಲಭ್ಯವಿದೆ',
          installPrompt: 'ಉತ್ತಮ ಅನುಭವಕ್ಕಾಗಿ ಈ ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ಸ್ಥಾಪಿಸಿ'
        },

        // Learning
        learning: {
          correct: 'ಸರಿ!',
          incorrect: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
          excellent: 'ಅತ್ಯುತ್ತಮ!',
          good: 'ಚೆನ್ನಾಗಿದೆ!',
          keepGoing: 'ಮುಂದುವರಿಸಿ!',
          almostThere: 'ಬಹುತೇಕ ಬಂದಿದೆ!',
          perfect: 'ಪರಿಪೂರ್ಣ!',
          hint: 'ಸುಳಿವು',
          showAnswer: 'ಉತ್ತರ ತೋರಿಸಿ'
        }
      }
    };

    return translations[lang] || translations[DEFAULT_LANGUAGE];
  }

  /**
   * Set current language
   * @param {string} lang - Language code
   */
  async setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Language not supported: ${lang}`);
      return false;
    }

    // Load language if not already loaded
    if (!this.translations.has(lang)) {
      await this.loadLanguage(lang);
    }

    this.currentLanguage = lang;

    // Save preference
    this.saveLanguage(lang);

    this.emit('language-changed', lang);

    console.log(`Language changed to: ${lang}`);

    return true;
  }

  /**
   * Get translation for key
   * @param {string} key - Translation key (dot notation: 'nav.home')
   * @param {object} vars - Variables for interpolation
   * @returns {string}
   */
  t(key, vars = {}) {
    const translation = this.getNestedValue(
      this.translations.get(this.currentLanguage),
      key
    );

    if (translation === undefined) {
      // Try fallback language
      const fallback = this.getNestedValue(
        this.translations.get(this.fallbackLanguage),
        key
      );

      if (fallback === undefined) {
        // Track missing key
        this.missingKeys.add(key);
        console.warn(`Missing translation: ${key}`);
        return key;
      }

      return this.interpolate(fallback, vars);
    }

    return this.interpolate(translation, vars);
  }

  /**
   * Get nested value from object using dot notation
   * @param {object} obj - Object
   * @param {string} path - Dot notation path
   * @returns {any}
   */
  getNestedValue(obj, path) {
    if (!obj) {
      return undefined;
    }

    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Interpolate variables in translation string
   * @param {string} str - Translation string
   * @param {object} vars - Variables
   * @returns {string}
   */
  interpolate(str, vars) {
    if (typeof str !== 'string') {
      return str;
    }

    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return vars[key] !== undefined ? vars[key] : match;
    });
  }

  /**
   * Get current language
   * @returns {string}
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get supported languages
   * @returns {Array<string>}
   */
  getSupportedLanguages() {
    return [...SUPPORTED_LANGUAGES];
  }

  /**
   * Save language preference
   * @param {string} lang - Language code
   */
  saveLanguage(lang) {
    try {
      localStorage.setItem('preferred_language', lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }

  /**
   * Get saved language preference
   * @returns {string|null}
   */
  getSavedLanguage() {
    try {
      return localStorage.getItem('preferred_language');
    } catch (error) {
      return null;
    }
  }

  /**
   * Get missing translation keys
   * @returns {Array<string>}
   */
  getMissingKeys() {
    return Array.from(this.missingKeys);
  }

  /**
   * Clear missing keys tracker
   */
  clearMissingKeys() {
    this.missingKeys.clear();
  }

  /**
   * Get debug information
   * @returns {object}
   */
  getDebugInfo() {
    const baseInfo = super.getDebugInfo();

    return {
      ...baseInfo,
      currentLanguage: this.currentLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      loadedLanguages: Array.from(this.translations.keys()),
      missingKeysCount: this.missingKeys.size,
      missingKeys: this.getMissingKeys().slice(0, 10) // First 10
    };
  }
}

export default I18nService;
