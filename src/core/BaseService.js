/**
 * BaseService - Foundation for all services
 *
 * Features:
 * - Standard initialization pattern
 * - Cleanup/destroy hooks
 * - Event emitter functionality
 * - Error handling
 * - Service state tracking
 */

class BaseService {
  constructor(name = 'BaseService') {
    this.name = name;
    this.initialized = false;
    this.destroyed = false;
    this.eventListeners = new Map();
  }

  /**
   * Initialize the service
   * Override this method in subclasses
   */
  async initialize() {
    if (this.initialized) {
      console.warn(`${this.name} is already initialized`);
      return;
    }

    if (this.destroyed) {
      throw new Error(`${this.name} has been destroyed and cannot be reinitialized`);
    }

    console.log(`Initializing ${this.name}...`);
    this.initialized = true;
  }

  /**
   * Destroy the service and clean up resources
   * Override this method in subclasses
   */
  async destroy() {
    if (this.destroyed) {
      console.warn(`${this.name} is already destroyed`);
      return;
    }

    console.log(`Destroying ${this.name}...`);

    // Remove all event listeners
    this.eventListeners.clear();

    this.destroyed = true;
    this.initialized = false;
  }

  /**
   * Check if service is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Check if service is destroyed
   */
  isDestroyed() {
    return this.destroyed;
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {function} listener - Event handler
   */
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }

    this.eventListeners.get(event).push(listener);

    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Add one-time event listener
   * @param {string} event - Event name
   * @param {function} listener - Event handler
   */
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };

    return this.on(event, onceWrapper);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} listener - Event handler
   */
  off(event, listener) {
    if (!this.eventListeners.has(event)) {
      return;
    }

    const listeners = this.eventListeners.get(event);
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    // Remove event entry if no listeners left
    if (listeners.length === 0) {
      this.eventListeners.delete(event);
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {...any} args - Event arguments
   */
  emit(event, ...args) {
    if (!this.eventListeners.has(event)) {
      return;
    }

    const listeners = this.eventListeners.get(event);

    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in ${this.name} event listener for '${event}':`, error);
      }
    });
  }

  /**
   * Remove all event listeners for an event
   * If no event specified, removes all listeners
   * @param {string} [event] - Event name
   */
  removeAllListeners(event) {
    if (event) {
      this.eventListeners.delete(event);
    } else {
      this.eventListeners.clear();
    }
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  listenerCount(event) {
    if (!this.eventListeners.has(event)) {
      return 0;
    }

    return this.eventListeners.get(event).length;
  }

  /**
   * Error handler - override to customize error handling
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  handleError(error, context = '') {
    const errorMessage = context
      ? `Error in ${this.name} (${context}): ${error.message}`
      : `Error in ${this.name}: ${error.message}`;

    console.error(errorMessage, error);

    // Emit error event
    this.emit('error', error, context);

    // Re-throw if no error listeners
    if (this.listenerCount('error') === 0) {
      throw error;
    }
  }

  /**
   * Assert service is initialized
   * Throws if not initialized
   */
  assertInitialized() {
    if (!this.initialized) {
      throw new Error(`${this.name} must be initialized before use`);
    }

    if (this.destroyed) {
      throw new Error(`${this.name} has been destroyed`);
    }
  }

  /**
   * Get service debug info
   * @returns {object}
   */
  getDebugInfo() {
    const events = {};
    this.eventListeners.forEach((listeners, event) => {
      events[event] = listeners.length;
    });

    return {
      name: this.name,
      initialized: this.initialized,
      destroyed: this.destroyed,
      eventListeners: events,
      totalListeners: Array.from(this.eventListeners.values())
        .reduce((sum, listeners) => sum + listeners.length, 0)
    };
  }
}

export default BaseService;
