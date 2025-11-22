/**
 * PWAService - Progressive Web App Management
 *
 * Features:
 * - Install prompt handling
 * - Update detection and notification
 * - Offline detection
 * - Service worker management
 */

import BaseService from '../core/BaseService.js';

class PWAService extends BaseService {
  constructor() {
    super('PWAService');

    this.registration = null;
    this.installPrompt = null;
    this.updateAvailable = false;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
  }

  /**
   * Initialize PWA service
   */
  async initialize() {
    await super.initialize();

    // Check if already installed
    this.checkInstallation();

    // Register service worker
    if ('serviceWorker' in navigator) {
      await this.registerServiceWorker();
    }

    // Listen for install prompt
    this.setupInstallPrompt();

    // Listen for online/offline events
    this.setupOnlineDetection();

    // Listen for app installed
    this.setupAppInstalled();

    console.log('PWAService initialized');
  }

  /**
   * Destroy PWA service
   */
  async destroy() {
    // Unregister service worker if needed
    // Note: Usually you don't want to unregister SW

    await super.destroy();
  }

  /**
   * Check if app is installed
   */
  checkInstallation() {
    // Check if running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;

    this.isInstalled = isStandalone || isIOSStandalone;

    if (this.isInstalled) {
      console.log('App is installed');
      this.emit('installed');
    }
  }

  /**
   * Register service worker
   */
  async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');

      console.log('Service Worker registered:', this.registration);
      this.emit('sw-registered', this.registration);

      // Check for updates
      this.setupUpdateDetection();

      return this.registration;
    } catch (error) {
      this.handleError(error, 'service worker registration');
      return null;
    }
  }

  /**
   * Setup update detection
   */
  setupUpdateDetection() {
    if (!this.registration) {
      return;
    }

    // Listen for updates
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          this.updateAvailable = true;
          this.emit('update-available');

          console.log('App update available');
        }
      });
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      this.checkForUpdates();
    }, 60 * 60 * 1000);
  }

  /**
   * Check for updates manually
   */
  async checkForUpdates() {
    if (this.registration) {
      try {
        await this.registration.update();
        console.log('Checked for updates');
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }
  }

  /**
   * Apply update (reload page)
   */
  applyUpdate() {
    if (this.registration && this.registration.waiting) {
      // Tell service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload page when new service worker is activated
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  /**
   * Setup install prompt
   */
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent default prompt
      e.preventDefault();

      // Store prompt for later
      this.installPrompt = e;

      console.log('Install prompt available');
      this.emit('install-prompt-available');
    });
  }

  /**
   * Setup app installed listener
   */
  setupAppInstalled() {
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.installPrompt = null;

      console.log('App installed');
      this.emit('app-installed');
    });
  }

  /**
   * Setup online/offline detection
   */
  setupOnlineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online');
      console.log('App is online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline');
      console.log('App is offline');
    });
  }

  /**
   * Show install prompt
   * @returns {Promise<boolean>} True if user accepted, false otherwise
   */
  async promptInstall() {
    if (!this.installPrompt) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      // Show install prompt
      this.installPrompt.prompt();

      // Wait for user response
      const result = await this.installPrompt.userChoice;

      if (result.outcome === 'accepted') {
        console.log('User accepted install');
        this.emit('install-accepted');
        return true;
      } else {
        console.log('User dismissed install');
        this.emit('install-dismissed');
        return false;
      }
    } catch (error) {
      this.handleError(error, 'install prompt');
      return false;
    } finally {
      // Clear prompt
      this.installPrompt = null;
    }
  }

  /**
   * Check if install prompt is available
   * @returns {boolean}
   */
  canInstall() {
    return !!this.installPrompt && !this.isInstalled;
  }

  /**
   * Check if app is installed
   * @returns {boolean}
   */
  getInstallStatus() {
    return this.isInstalled;
  }

  /**
   * Check if update is available
   * @returns {boolean}
   */
  hasUpdate() {
    return this.updateAvailable;
  }

  /**
   * Check if online
   * @returns {boolean}
   */
  getOnlineStatus() {
    return this.isOnline;
  }

  /**
   * Get service worker registration
   * @returns {ServiceWorkerRegistration}
   */
  getRegistration() {
    return this.registration;
  }

  /**
   * Request notification permission
   * @returns {Promise<string>} Permission status
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted');
        this.emit('notification-permission-granted');
      }

      return permission;
    } catch (error) {
      this.handleError(error, 'notification permission');
      return 'denied';
    }
  }

  /**
   * Show notification
   * @param {string} title - Notification title
   * @param {object} options - Notification options
   */
  async showNotification(title, options = {}) {
    if (!this.registration) {
      console.warn('Service worker not registered');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      await this.registration.showNotification(title, {
        badge: '/icon-192.png',
        icon: '/icon-192.png',
        ...options
      });
    } catch (error) {
      this.handleError(error, 'show notification');
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
      isInstalled: this.isInstalled,
      canInstall: this.canInstall(),
      hasUpdate: this.updateAvailable,
      isOnline: this.isOnline,
      hasRegistration: !!this.registration,
      notificationPermission: 'Notification' in window ? Notification.permission : 'not-supported'
    };
  }
}

export default PWAService;
