/**
 * StateStore Tests
 * Tests for Redux-like state management
 */

import StateStore from '../StateStore';

describe('StateStore', () => {
  let store;
  let initialState;
  let reducer;

  beforeEach(() => {
    initialState = {
      count: 0,
      user: { name: '' },
      items: []
    };

    reducer = (state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return { ...state, count: state.count + 1 };
        case 'DECREMENT':
          return { ...state, count: state.count - 1 };
        case 'SET_USER':
          return { ...state, user: action.payload };
        case 'ADD_ITEM':
          return { ...state, items: [...state.items, action.payload] };
        case 'RESET':
          return initialState;
        default:
          return state;
      }
    };

    store = new StateStore(initialState, reducer);
  });

  afterEach(() => {
    store = null;
  });

  describe('initialization', () => {
    test('should initialize with initial state', () => {
      expect(store.getState()).toEqual(initialState);
    });

    test('should have empty history initially', () => {
      expect(store.history).toHaveLength(1);
      expect(store.historyIndex).toBe(0);
    });

    test('should accept middleware', () => {
      const middleware = jest.fn(() => next => action => next(action));
      const storeWithMiddleware = new StateStore(initialState, reducer, [middleware]);
      expect(storeWithMiddleware.middleware).toHaveLength(1);
    });
  });

  describe('dispatch', () => {
    test('should dispatch actions and update state', () => {
      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState().count).toBe(1);
    });

    test('should handle multiple dispatches', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      expect(store.getState().count).toBe(1);
    });

    test('should pass payload to reducer', () => {
      store.dispatch({ type: 'SET_USER', payload: { name: 'John' } });
      expect(store.getState().user.name).toBe('John');
    });

    test('should handle array updates', () => {
      store.dispatch({ type: 'ADD_ITEM', payload: 'item1' });
      store.dispatch({ type: 'ADD_ITEM', payload: 'item2' });
      expect(store.getState().items).toEqual(['item1', 'item2']);
    });
  });

  describe('subscribe', () => {
    test('should notify subscribers on state change', () => {
      const subscriber = jest.fn();
      store.subscribe(subscriber);

      store.dispatch({ type: 'INCREMENT' });

      expect(subscriber).toHaveBeenCalledWith(store.getState());
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    test('should support multiple subscribers', () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      store.subscribe(subscriber1);
      store.subscribe(subscriber2);

      store.dispatch({ type: 'INCREMENT' });

      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);
    });

    test('should return unsubscribe function', () => {
      const subscriber = jest.fn();
      const unsubscribe = store.subscribe(subscriber);

      store.dispatch({ type: 'INCREMENT' });
      expect(subscriber).toHaveBeenCalledTimes(1);

      unsubscribe();

      store.dispatch({ type: 'INCREMENT' });
      expect(subscriber).toHaveBeenCalledTimes(1); // Still 1, not called again
    });
  });

  describe('middleware', () => {
    test('should apply middleware', () => {
      const middleware = jest.fn(() => next => action => {
        return next(action);
      });

      const storeWithMiddleware = new StateStore(initialState, reducer, [middleware]);
      storeWithMiddleware.dispatch({ type: 'INCREMENT' });

      expect(middleware).toHaveBeenCalled();
    });

    test('should apply multiple middleware in order', () => {
      const calls = [];

      const middleware1 = () => next => action => {
        calls.push('middleware1');
        return next(action);
      };

      const middleware2 = () => next => action => {
        calls.push('middleware2');
        return next(action);
      };

      const storeWithMiddleware = new StateStore(initialState, reducer, [
        middleware1,
        middleware2
      ]);

      storeWithMiddleware.dispatch({ type: 'INCREMENT' });

      expect(calls).toEqual(['middleware1', 'middleware2']);
    });

    test('middleware can access getState', () => {
      let capturedState;

      const middleware = store => next => action => {
        capturedState = store.getState();
        return next(action);
      };

      const storeWithMiddleware = new StateStore(initialState, reducer, [middleware]);
      storeWithMiddleware.dispatch({ type: 'INCREMENT' });

      expect(capturedState).toEqual(initialState);
    });
  });

  describe('time travel', () => {
    test('should maintain history', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(store.history).toHaveLength(4); // initial + 3 dispatches
    });

    test('should undo to previous state', () => {
      store.dispatch({ type: 'INCREMENT' }); // count = 1
      store.dispatch({ type: 'INCREMENT' }); // count = 2
      store.dispatch({ type: 'INCREMENT' }); // count = 3

      store.undo(); // count = 2
      expect(store.getState().count).toBe(2);

      store.undo(); // count = 1
      expect(store.getState().count).toBe(1);
    });

    test('should redo to next state', () => {
      store.dispatch({ type: 'INCREMENT' }); // count = 1
      store.dispatch({ type: 'INCREMENT' }); // count = 2

      store.undo(); // count = 1
      store.redo(); // count = 2

      expect(store.getState().count).toBe(2);
    });

    test('should not undo beyond initial state', () => {
      store.undo();
      expect(store.getState()).toEqual(initialState);
      expect(store.historyIndex).toBe(0);
    });

    test('should not redo beyond current state', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.redo();
      expect(store.getState().count).toBe(1);
    });

    test('should clear future history on new dispatch after undo', () => {
      store.dispatch({ type: 'INCREMENT' }); // count = 1
      store.dispatch({ type: 'INCREMENT' }); // count = 2
      store.dispatch({ type: 'INCREMENT' }); // count = 3

      store.undo(); // count = 2
      store.undo(); // count = 1

      store.dispatch({ type: 'INCREMENT' }); // count = 2, but clears future

      store.redo(); // Should not go to old count = 2
      expect(store.getState().count).toBe(2);
      expect(store.history).toHaveLength(3); // initial, 1, 2
    });

    test('should limit history size', () => {
      // Dispatch more than maxHistory actions
      for (let i = 0; i < 55; i++) {
        store.dispatch({ type: 'INCREMENT' });
      }

      expect(store.history.length).toBeLessThanOrEqual(50);
    });
  });

  describe('error handling', () => {
    test('should handle reducer errors', () => {
      const errorReducer = () => {
        throw new Error('Reducer error');
      };

      const errorStore = new StateStore(initialState, errorReducer);

      expect(() => {
        errorStore.dispatch({ type: 'TEST' });
      }).toThrow('Reducer error');
    });

    test('should handle middleware errors', () => {
      const errorMiddleware = () => () => () => {
        throw new Error('Middleware error');
      };

      const storeWithError = new StateStore(initialState, reducer, [errorMiddleware]);

      expect(() => {
        storeWithError.dispatch({ type: 'TEST' });
      }).toThrow('Middleware error');
    });
  });

  describe('immutability', () => {
    test('should not mutate original state', () => {
      const originalState = store.getState();
      store.dispatch({ type: 'INCREMENT' });

      expect(originalState.count).toBe(0); // Original unchanged
      expect(store.getState().count).toBe(1); // New state changed
    });

    test('should create new state object on each dispatch', () => {
      const state1 = store.getState();
      store.dispatch({ type: 'INCREMENT' });
      const state2 = store.getState();

      expect(state1).not.toBe(state2); // Different objects
    });
  });

  describe('getState', () => {
    test('should return current state', () => {
      expect(store.getState()).toEqual(initialState);
    });

    test('should return updated state after dispatch', () => {
      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState().count).toBe(1);
    });
  });
});
