/**
 * ServiceRegistry - Dependency Injection Container
 *
 * Features:
 * - Service registration and retrieval
 * - Lazy initialization
 * - Singleton support
 * - Circular dependency detection
 * - Easy mocking for tests
 * - Service lifecycle management
 */

class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.factories = new Map();
    this.singletons = new Map();
    this.initializing = new Set();
    this.initialized = new Set();
  }

  /**
   * Register a service instance
   * @param {string} name - Service name
   * @param {object} instance - Service instance
   */
  register(name, instance) {
    if (this.services.has(name)) {
      console.warn(`Service '${name}' is being overwritten`);
    }

    this.services.set(name, instance);
    return this;
  }

  /**
   * Register a factory function for lazy initialization
   * @param {string} name - Service name
   * @param {function} factory - Factory function that returns service instance
   */
  registerFactory(name, factory) {
    if (typeof factory !== 'function') {
      throw new Error(`Factory for '${name}' must be a function`);
    }

    this.factories.set(name, factory);
    return this;
  }

  /**
   * Register a singleton factory
   * Singleton is created once and reused for all subsequent calls
   * @param {string} name - Service name
   * @param {function} factory - Factory function
   */
  registerSingleton(name, factory) {
    if (typeof factory !== 'function') {
      throw new Error(`Singleton factory for '${name}' must be a function`);
    }

    this.singletons.set(name, factory);
    return this;
  }

  /**
   * Get a service by name
   * @param {string} name - Service name
   * @returns {object} Service instance
   */
  get(name) {
    // Check if already instantiated
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    // Check for singleton
    if (this.singletons.has(name)) {
      // Circular dependency detection
      if (this.initializing.has(name)) {
        throw new Error(
          `Circular dependency detected: Service '${name}' is already being initialized`
        );
      }

      this.initializing.add(name);

      try {
        const factory = this.singletons.get(name);
        const instance = factory(this);
        this.services.set(name, instance);
        this.singletons.delete(name); // Remove factory after creation
        this.initializing.delete(name);
        return instance;
      } catch (error) {
        this.initializing.delete(name);
        throw error;
      }
    }

    // Check for factory
    if (this.factories.has(name)) {
      // Circular dependency detection
      if (this.initializing.has(name)) {
        throw new Error(
          `Circular dependency detected: Service '${name}' is already being initialized`
        );
      }

      this.initializing.add(name);

      try {
        const factory = this.factories.get(name);
        const instance = factory(this);
        this.services.set(name, instance);
        this.factories.delete(name); // Remove factory after creation
        this.initializing.delete(name);
        return instance;
      } catch (error) {
        this.initializing.delete(name);
        throw error;
      }
    }

    throw new Error(`Service '${name}' not found in registry`);
  }

  /**
   * Check if a service exists
   * @param {string} name - Service name
   * @returns {boolean}
   */
  has(name) {
    return (
      this.services.has(name) ||
      this.factories.has(name) ||
      this.singletons.has(name)
    );
  }

  /**
   * Remove a service from registry
   * @param {string} name - Service name
   */
  remove(name) {
    this.services.delete(name);
    this.factories.delete(name);
    this.singletons.delete(name);
    this.initialized.delete(name);
    return this;
  }

  /**
   * Initialize all registered services
   * Calls initialize() method if available
   */
  async initializeAll() {
    const initPromises = [];

    // Initialize all registered services
    for (const [name, service] of this.services) {
      if (!this.initialized.has(name) && typeof service.initialize === 'function') {
        console.log(`Initializing service: ${name}`);
        initPromises.push(
          service.initialize().then(() => {
            this.initialized.add(name);
            console.log(`Service initialized: ${name}`);
          })
        );
      }
    }

    await Promise.all(initPromises);
    console.log('All services initialized');
  }

  /**
   * Destroy all services
   * Calls destroy() method if available
   */
  async destroyAll() {
    const destroyPromises = [];

    for (const [name, service] of this.services) {
      if (typeof service.destroy === 'function') {
        console.log(`Destroying service: ${name}`);
        destroyPromises.push(
          service.destroy().then(() => {
            console.log(`Service destroyed: ${name}`);
          })
        );
      }
    }

    await Promise.all(destroyPromises);

    // Clear all services
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
    this.initialized.clear();
    this.initializing.clear();

    console.log('All services destroyed');
  }

  /**
   * Get all registered service names
   * @returns {Array<string>}
   */
  getServiceNames() {
    const names = new Set();

    this.services.forEach((_, name) => names.add(name));
    this.factories.forEach((_, name) => names.add(name));
    this.singletons.forEach((_, name) => names.add(name));

    return Array.from(names);
  }

  /**
   * Get service count
   * @returns {number}
   */
  getServiceCount() {
    return this.getServiceNames().length;
  }

  /**
   * Clear all services
   */
  clear() {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
    this.initialized.clear();
    this.initializing.clear();
  }

  /**
   * Get debug information
   * @returns {object}
   */
  getDebugInfo() {
    return {
      services: Array.from(this.services.keys()),
      factories: Array.from(this.factories.keys()),
      singletons: Array.from(this.singletons.keys()),
      initialized: Array.from(this.initialized),
      initializing: Array.from(this.initializing),
      totalCount: this.getServiceCount()
    };
  }
}

export default ServiceRegistry;
