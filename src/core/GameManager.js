/**
 * GameManager - Application Coordinator (Singleton)
 *
 * Features:
 * - Service registration via ServiceRegistry
 * - Global event handling
 * - State management via StateStore
 * - Error handling
 * - Application lifecycle (init, pause, resume, destroy)
 */

import BaseService from './BaseService.js';

class GameManager extends BaseService {
  constructor() {
    super('GameManager');

    if (GameManager.instance) {
      return GameManager.instance;
    }

    this.store = null;
    this.registry = null;
    this.paused = false;
    this.errorHandler = null;

    GameManager.instance = this;
  }

  /**
   * Get singleton instance
   * @returns {GameManager}
   */
  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  /**
   * Set state store
   * @param {StateStore} store - State store instance
   */
  setStateStore(store) {
    if (!store || typeof store.getState !== 'function') {
      throw new Error('Invalid StateStore provided');
    }

    this.store = store;
    return this;
  }

  /**
   * Set service registry
   * @param {ServiceRegistry} registry - Service registry instance
   */
  setServiceRegistry(registry) {
    if (!registry || typeof registry.get !== 'function') {
      throw new Error('Invalid ServiceRegistry provided');
    }

    this.registry = registry;
    return this;
  }

  /**
   * Register a service
   * Convenience method for registry.register()
   * @param {string} name - Service name
   * @param {object} service - Service instance
   */
  registerService(name, service) {
    if (!this.registry) {
      throw new Error('ServiceRegistry not set. Call setServiceRegistry() first.');
    }

    this.registry.register(name, service);
    return this;
  }

  /**
   * Get a service
   * Convenience method for registry.get()
   * @param {string} name - Service name
   * @returns {object} Service instance
   */
  getService(name) {
    if (!this.registry) {
      throw new Error('ServiceRegistry not set. Call setServiceRegistry() first.');
    }

    return this.registry.get(name);
  }

  /**
   * Initialize the application
   */
  async initialize() {
    if (this.initialized) {
      console.warn('GameManager already initialized');
      return;
    }

    console.log('Initializing GameManager...');

    try {
      // Ensure dependencies are set
      if (!this.store) {
        throw new Error('StateStore not set. Call setStateStore() first.');
      }

      if (!this.registry) {
        throw new Error('ServiceRegistry not set. Call setServiceRegistry() first.');
      }

      // Initialize all services
      await this.registry.initializeAll();

      // Dispatch initialization action
      this.store.dispatch({ type: 'APP_INITIALIZE' });

      this.initialized = true;
      this.emit('initialized');

      console.log('GameManager initialized successfully');
    } catch (error) {
      this.handleError(error, 'initialization');
      throw error;
    }
  }

  /**
   * Pause the application
   */
  pause() {
    if (this.paused) {
      return;
    }

    console.log('Pausing application...');

    this.paused = true;

    // Dispatch pause action if game is active
    const state = this.store.getState();
    if (state.game.currentGame) {
      this.store.dispatch({ type: 'GAME_PAUSE' });
    }

    this.emit('paused');
  }

  /**
   * Resume the application
   */
  resume() {
    if (!this.paused) {
      return;
    }

    console.log('Resuming application...');

    this.paused = false;

    // Dispatch resume action if game was paused
    const state = this.store.getState();
    if (state.game.isPaused) {
      this.store.dispatch({ type: 'GAME_RESUME' });
    }

    this.emit('resumed');
  }

  /**
   * Check if application is paused
   * @returns {boolean}
   */
  isPaused() {
    return this.paused;
  }

  /**
   * Destroy the application
   */
  async destroy() {
    if (this.destroyed) {
      console.warn('GameManager already destroyed');
      return;
    }

    console.log('Destroying GameManager...');

    try {
      // Destroy all services
      if (this.registry) {
        await this.registry.destroyAll();
      }

      // Clear store
      this.store = null;
      this.registry = null;

      await super.destroy();

      this.emit('destroyed');

      console.log('GameManager destroyed successfully');
    } catch (error) {
      this.handleError(error, 'destruction');
      throw error;
    }
  }

  /**
   * Get current application state
   * @returns {object} Current state
   */
  getState() {
    if (!this.store) {
      throw new Error('StateStore not set');
    }

    return this.store.getState();
  }

  /**
   * Dispatch an action
   * @param {object} action - Action object
   */
  dispatch(action) {
    if (!this.store) {
      throw new Error('StateStore not set');
    }

    return this.store.dispatch(action);
  }

  /**
   * Subscribe to state changes
   * @param {function} listener - State change listener
   * @returns {function} Unsubscribe function
   */
  subscribe(listener) {
    if (!this.store) {
      throw new Error('StateStore not set');
    }

    return this.store.subscribe(listener);
  }

  /**
   * Set global error handler
   * @param {function} handler - Error handler function
   */
  setErrorHandler(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Error handler must be a function');
    }

    this.errorHandler = handler;
  }

  /**
   * Handle error
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  handleError(error, context = '') {
    console.error(`GameManager Error (${context}):`, error);

    // Call custom error handler if set
    if (this.errorHandler) {
      try {
        this.errorHandler(error, context);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }

    // Dispatch error to state
    if (this.store) {
      this.store.dispatch({
        type: 'APP_SET_ERROR',
        payload: {
          message: error.message,
          context,
          timestamp: Date.now()
        }
      });
    }

    // Emit error event
    this.emit('error', error, context);
  }

  /**
   * Clear error state
   */
  clearError() {
    if (this.store) {
      this.store.dispatch({
        type: 'APP_SET_ERROR',
        payload: null
      });
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
      paused: this.paused,
      hasStore: !!this.store,
      hasRegistry: !!this.registry,
      serviceCount: this.registry ? this.registry.getServiceCount() : 0,
      services: this.registry ? this.registry.getServiceNames() : [],
      state: this.store ? this.store.getState() : null
    };
  }

  /**
   * Reset GameManager singleton (mainly for testing)
   */
  static reset() {
    if (GameManager.instance) {
      GameManager.instance.destroy().catch(console.error);
      GameManager.instance = null;
    }
  }
}

// Static instance
GameManager.instance = null;

export default GameManager;
