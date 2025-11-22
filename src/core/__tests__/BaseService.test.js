/**
 * BaseService Tests
 * Tests for service base class
 */

import BaseService from '../BaseService';

describe('BaseService', () => {
  let service;

  beforeEach(() => {
    service = new BaseService();
  });

  afterEach(() => {
    service.destroy();
    service = null;
  });

  describe('initialization', () => {
    test('should create instance', () => {
      expect(service).toBeInstanceOf(BaseService);
    });

    test('should have empty listeners map', () => {
      expect(service.listeners).toEqual({});
    });

    test('should have isInitialized flag', () => {
      expect(service.isInitialized).toBe(false);
    });
  });

  describe('initialize', () => {
    test('should set isInitialized to true', async () => {
      await service.initialize();
      expect(service.isInitialized).toBe(true);
    });

    test('should be async', () => {
      const result = service.initialize();
      expect(result).toBeInstanceOf(Promise);
    });

    test('should allow custom initialization logic', async () => {
      class CustomService extends BaseService {
        async initialize() {
          await super.initialize();
          this.customProperty = 'initialized';
        }
      }

      const customService = new CustomService();
      await customService.initialize();

      expect(customService.customProperty).toBe('initialized');
      expect(customService.isInitialized).toBe(true);
    });
  });

  describe('event system', () => {
    describe('on', () => {
      test('should register event listener', () => {
        const listener = jest.fn();
        service.on('test-event', listener);

        expect(service.listeners['test-event']).toContain(listener);
      });

      test('should support multiple listeners for same event', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        service.on('test-event', listener1);
        service.on('test-event', listener2);

        expect(service.listeners['test-event']).toHaveLength(2);
      });

      test('should support different events', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        service.on('event1', listener1);
        service.on('event2', listener2);

        expect(service.listeners['event1']).toContain(listener1);
        expect(service.listeners['event2']).toContain(listener2);
      });
    });

    describe('emit', () => {
      test('should call registered listeners', () => {
        const listener = jest.fn();
        service.on('test-event', listener);

        service.emit('test-event');

        expect(listener).toHaveBeenCalled();
      });

      test('should pass arguments to listeners', () => {
        const listener = jest.fn();
        service.on('test-event', listener);

        service.emit('test-event', 'arg1', 'arg2', { data: 'test' });

        expect(listener).toHaveBeenCalledWith('arg1', 'arg2', { data: 'test' });
      });

      test('should call all listeners for event', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        service.on('test-event', listener1);
        service.on('test-event', listener2);

        service.emit('test-event');

        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
      });

      test('should not throw if no listeners registered', () => {
        expect(() => {
          service.emit('nonexistent-event');
        }).not.toThrow();
      });

      test('should handle listener errors gracefully', () => {
        const errorListener = jest.fn(() => {
          throw new Error('Listener error');
        });
        const normalListener = jest.fn();

        service.on('test-event', errorListener);
        service.on('test-event', normalListener);

        // Should not throw, but log error
        expect(() => {
          service.emit('test-event');
        }).not.toThrow();

        expect(errorListener).toHaveBeenCalled();
        expect(normalListener).toHaveBeenCalled();
      });
    });

    describe('off', () => {
      test('should remove event listener', () => {
        const listener = jest.fn();
        service.on('test-event', listener);

        service.off('test-event', listener);

        service.emit('test-event');
        expect(listener).not.toHaveBeenCalled();
      });

      test('should only remove specific listener', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        service.on('test-event', listener1);
        service.on('test-event', listener2);

        service.off('test-event', listener1);

        service.emit('test-event');
        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
      });

      test('should handle nonexistent event', () => {
        const listener = jest.fn();

        expect(() => {
          service.off('nonexistent-event', listener);
        }).not.toThrow();
      });

      test('should handle nonexistent listener', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        service.on('test-event', listener1);

        expect(() => {
          service.off('test-event', listener2);
        }).not.toThrow();
      });
    });
  });

  describe('destroy', () => {
    test('should clear all event listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      service.on('event1', listener1);
      service.on('event2', listener2);

      service.destroy();

      service.emit('event1');
      service.emit('event2');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    test('should set isInitialized to false', () => {
      service.isInitialized = true;
      service.destroy();

      expect(service.isInitialized).toBe(false);
    });

    test('should allow custom cleanup logic', () => {
      class CustomService extends BaseService {
        constructor() {
          super();
          this.resource = 'allocated';
        }

        destroy() {
          this.resource = null;
          super.destroy();
        }
      }

      const customService = new CustomService();
      customService.destroy();

      expect(customService.resource).toBeNull();
      expect(customService.isInitialized).toBe(false);
    });
  });

  describe('inheritance', () => {
    test('should support inheritance', () => {
      class CustomService extends BaseService {
        constructor() {
          super();
          this.name = 'custom';
        }

        customMethod() {
          return 'custom';
        }
      }

      const customService = new CustomService();

      expect(customService).toBeInstanceOf(BaseService);
      expect(customService).toBeInstanceOf(CustomService);
      expect(customService.name).toBe('custom');
      expect(customService.customMethod()).toBe('custom');
    });

    test('should inherit event system', () => {
      class CustomService extends BaseService {}

      const customService = new CustomService();
      const listener = jest.fn();

      customService.on('test', listener);
      customService.emit('test', 'data');

      expect(listener).toHaveBeenCalledWith('data');
    });
  });

  describe('error handling', () => {
    test('should handle initialization errors', async () => {
      class ErrorService extends BaseService {
        async initialize() {
          throw new Error('Init failed');
        }
      }

      const errorService = new ErrorService();

      await expect(errorService.initialize()).rejects.toThrow('Init failed');
    });

    test('should handle async event listeners', () => {
      const asyncListener = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      service.on('async-event', asyncListener);
      service.emit('async-event');

      expect(asyncListener).toHaveBeenCalled();
    });
  });
});
