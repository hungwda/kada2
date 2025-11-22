/**
 * ServiceRegistry Tests
 * Tests for dependency injection container
 */

import ServiceRegistry from '../ServiceRegistry';
import BaseService from '../BaseService';

describe('ServiceRegistry', () => {
  let registry;

  beforeEach(() => {
    registry = new ServiceRegistry();
  });

  afterEach(() => {
    registry = null;
  });

  describe('register', () => {
    test('should register a service instance', () => {
      const service = { name: 'test-service' };
      registry.register('test', service);

      expect(registry.get('test')).toBe(service);
    });

    test('should throw error if service already registered', () => {
      const service = { name: 'test' };
      registry.register('test', service);

      expect(() => {
        registry.register('test', service);
      }).toThrow('Service "test" is already registered');
    });

    test('should register multiple services', () => {
      const service1 = { name: 'service1' };
      const service2 = { name: 'service2' };

      registry.register('service1', service1);
      registry.register('service2', service2);

      expect(registry.get('service1')).toBe(service1);
      expect(registry.get('service2')).toBe(service2);
    });
  });

  describe('registerFactory', () => {
    test('should register a factory function', () => {
      const factory = jest.fn(() => ({ name: 'factory-service' }));
      registry.registerFactory('test', factory);

      const service = registry.get('test');

      expect(factory).toHaveBeenCalled();
      expect(service.name).toBe('factory-service');
    });

    test('should call factory on each get', () => {
      const factory = jest.fn(() => ({ name: 'factory-service' }));
      registry.registerFactory('test', factory);

      registry.get('test');
      registry.get('test');

      expect(factory).toHaveBeenCalledTimes(2);
    });

    test('should pass registry to factory', () => {
      const factory = jest.fn((reg) => {
        expect(reg).toBe(registry);
        return { name: 'test' };
      });

      registry.registerFactory('test', factory);
      registry.get('test');

      expect(factory).toHaveBeenCalledWith(registry);
    });
  });

  describe('registerSingleton', () => {
    test('should register a singleton factory', () => {
      const factory = jest.fn(() => ({ name: 'singleton-service' }));
      registry.registerSingleton('test', factory);

      const service1 = registry.get('test');
      const service2 = registry.get('test');

      expect(factory).toHaveBeenCalledTimes(1);
      expect(service1).toBe(service2);
    });

    test('should create instance on first get', () => {
      const factory = jest.fn(() => ({ name: 'singleton' }));
      registry.registerSingleton('test', factory);

      expect(factory).not.toHaveBeenCalled();

      registry.get('test');

      expect(factory).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    test('should get registered service', () => {
      const service = { name: 'test' };
      registry.register('test', service);

      expect(registry.get('test')).toBe(service);
    });

    test('should throw error for unregistered service', () => {
      expect(() => {
        registry.get('nonexistent');
      }).toThrow('Service "nonexistent" not found');
    });

    test('should handle circular dependencies', () => {
      registry.registerSingleton('serviceA', (reg) => ({
        name: 'A',
        b: reg.get('serviceB')
      }));

      registry.registerSingleton('serviceB', (reg) => ({
        name: 'B',
        a: reg.get('serviceA')
      }));

      expect(() => {
        registry.get('serviceA');
      }).toThrow('Circular dependency detected');
    });
  });

  describe('has', () => {
    test('should return true for registered service', () => {
      registry.register('test', { name: 'test' });
      expect(registry.has('test')).toBe(true);
    });

    test('should return false for unregistered service', () => {
      expect(registry.has('nonexistent')).toBe(false);
    });
  });

  describe('unregister', () => {
    test('should unregister a service', () => {
      const service = { name: 'test' };
      registry.register('test', service);

      expect(registry.has('test')).toBe(true);

      registry.unregister('test');

      expect(registry.has('test')).toBe(false);
    });

    test('should allow re-registration after unregister', () => {
      const service1 = { name: 'test1' };
      const service2 = { name: 'test2' };

      registry.register('test', service1);
      registry.unregister('test');
      registry.register('test', service2);

      expect(registry.get('test')).toBe(service2);
    });

    test('should call destroy on BaseService instances', () => {
      class TestService extends BaseService {
        destroy = jest.fn();
      }

      const service = new TestService();
      registry.register('test', service);

      registry.unregister('test');

      expect(service.destroy).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    test('should clear all services', () => {
      registry.register('service1', { name: 'test1' });
      registry.register('service2', { name: 'test2' });

      expect(registry.has('service1')).toBe(true);
      expect(registry.has('service2')).toBe(true);

      registry.clear();

      expect(registry.has('service1')).toBe(false);
      expect(registry.has('service2')).toBe(false);
    });

    test('should call destroy on all BaseService instances', () => {
      class TestService extends BaseService {
        destroy = jest.fn();
      }

      const service1 = new TestService();
      const service2 = new TestService();

      registry.register('service1', service1);
      registry.register('service2', service2);

      registry.clear();

      expect(service1.destroy).toHaveBeenCalled();
      expect(service2.destroy).toHaveBeenCalled();
    });
  });

  describe('initializeAll', () => {
    test('should initialize all services with initialize method', async () => {
      class TestService extends BaseService {
        initialize = jest.fn().mockResolvedValue(undefined);
      }

      const service1 = new TestService();
      const service2 = new TestService();

      registry.register('service1', service1);
      registry.register('service2', service2);

      await registry.initializeAll();

      expect(service1.initialize).toHaveBeenCalled();
      expect(service2.initialize).toHaveBeenCalled();
    });

    test('should skip services without initialize method', async () => {
      const service = { name: 'test' };
      registry.register('test', service);

      await expect(registry.initializeAll()).resolves.not.toThrow();
    });

    test('should handle initialization errors', async () => {
      class TestService extends BaseService {
        async initialize() {
          throw new Error('Init error');
        }
      }

      const service = new TestService();
      registry.register('test', service);

      await expect(registry.initializeAll()).rejects.toThrow('Init error');
    });
  });

  describe('dependency injection', () => {
    test('should inject dependencies via factory', () => {
      class ServiceA {
        constructor() {
          this.name = 'A';
        }
      }

      class ServiceB {
        constructor(serviceA) {
          this.serviceA = serviceA;
          this.name = 'B';
        }
      }

      registry.registerSingleton('serviceA', () => new ServiceA());
      registry.registerSingleton('serviceB', (reg) => {
        const serviceA = reg.get('serviceA');
        return new ServiceB(serviceA);
      });

      const serviceB = registry.get('serviceB');

      expect(serviceB.serviceA.name).toBe('A');
    });

    test('should support complex dependency graphs', () => {
      registry.registerSingleton('config', () => ({ env: 'test' }));

      registry.registerSingleton('logger', (reg) => ({
        config: reg.get('config'),
        log: jest.fn()
      }));

      registry.registerSingleton('database', (reg) => ({
        config: reg.get('config'),
        logger: reg.get('logger'),
        connect: jest.fn()
      }));

      const database = registry.get('database');

      expect(database.config.env).toBe('test');
      expect(database.logger.config).toBe(database.config);
    });
  });
});
