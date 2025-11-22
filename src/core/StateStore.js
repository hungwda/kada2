/**
 * StateStore - Redux-like state management with middleware support
 *
 * Features:
 * - Single source of truth
 * - Immutable state updates via reducers
 * - Middleware support (logging, persistence, analytics)
 * - Time-travel debugging (undo/redo)
 * - State history tracking
 * - Subscribe to state changes
 */

class StateStore {
  constructor(initialState, reducer, middleware = []) {
    this.state = initialState;
    this.reducer = reducer;
    this.listeners = [];
    this.middleware = middleware;

    // Time-travel debugging
    this.history = [initialState];
    this.historyIndex = 0;
    this.maxHistorySize = 50; // Limit history to prevent memory issues
  }

  /**
   * Get current state (read-only)
   */
  getState() {
    // Return a frozen copy to prevent direct mutations
    return Object.freeze(JSON.parse(JSON.stringify(this.state)));
  }

  /**
   * Dispatch an action to update state
   */
  dispatch(action) {
    if (!action || typeof action !== 'object' || !action.type) {
      throw new Error('Actions must be objects with a type property');
    }

    // Apply middleware chain
    const middlewareAPI = {
      getState: () => this.getState(),
      dispatch: (a) => this.dispatch(a)
    };

    let chain = this.middleware.map(middleware => middleware(middlewareAPI));
    let finalDispatch = this._dispatchCore.bind(this);

    // Compose middleware
    chain.reverse().forEach(middlewareFn => {
      const next = finalDispatch;
      finalDispatch = (a) => middlewareFn(next)(a);
    });

    return finalDispatch(action);
  }

  /**
   * Core dispatch logic (after middleware)
   */
  _dispatchCore(action) {
    // Calculate new state using reducer
    const newState = this.reducer(this.state, action);

    // Only update if state actually changed
    if (newState !== this.state) {
      this.state = newState;

      // Add to history for time-travel
      this._addToHistory(newState);

      // Notify all listeners
      this._notifyListeners();
    }

    return action;
  }

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  _notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Add state to history for time-travel debugging
   */
  _addToHistory(state) {
    // If we're not at the end of history, truncate future states
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    // Add new state
    this.history.push(JSON.parse(JSON.stringify(state)));

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  /**
   * Undo last action (time-travel)
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this._notifyListeners();
      return true;
    }
    return false;
  }

  /**
   * Redo last undone action (time-travel)
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this._notifyListeners();
      return true;
    }
    return false;
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.historyIndex > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  /**
   * Clear history (useful for performance)
   */
  clearHistory() {
    this.history = [JSON.parse(JSON.stringify(this.state))];
    this.historyIndex = 0;
  }

  /**
   * Get history size (for debugging)
   */
  getHistorySize() {
    return this.history.length;
  }
}

/**
 * Create initial state
 */
export function createInitialState() {
  return {
    app: {
      initialized: false,
      loading: false,
      error: null,
      viewport: {
        width: 0,
        height: 0,
        breakpoint: 'mobile',
        orientation: 'portrait',
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        scaleFactor: 1,
        gameDimensions: { width: 800, height: 600 }
      }
    },

    user: {
      profile: {
        name: '',
        age: null,
        avatarId: 1
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
        learningAnalytics: {
          timeSpent: {},
          accuracy: {},
          strengths: [],
          weaknesses: []
        }
      }
    },

    game: {
      currentGame: null,
      currentScene: null,
      isPaused: false,
      score: 0,
      lives: 3,
      level: 1,
      timeRemaining: 60,
      gameHistory: []
    },

    ui: {
      modal: {
        isOpen: false,
        type: null,
        data: null
      },
      notification: {
        isVisible: false,
        message: '',
        type: 'info'
      },
      loading: {
        isVisible: false,
        progress: 0,
        message: ''
      }
    }
  };
}

/**
 * Root reducer - combines all reducers
 */
export function rootReducer(state, action) {
  switch (action.type) {
    // App actions
    case 'APP_INITIALIZE':
      return {
        ...state,
        app: { ...state.app, initialized: true, loading: false }
      };

    case 'APP_SET_LOADING':
      return {
        ...state,
        app: { ...state.app, loading: action.payload }
      };

    case 'APP_SET_ERROR':
      return {
        ...state,
        app: { ...state.app, error: action.payload }
      };

    case 'APP_SET_VIEWPORT':
      return {
        ...state,
        app: { ...state.app, viewport: { ...state.app.viewport, ...action.payload } }
      };

    // User actions
    case 'USER_SET_PROFILE':
      return {
        ...state,
        user: { ...state.user, profile: { ...state.user.profile, ...action.payload } }
      };

    case 'USER_UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, profile: { ...state.user.profile, ...action.payload } }
      };

    case 'USER_SET_PREFERENCES':
      return {
        ...state,
        user: { ...state.user, preferences: { ...state.user.preferences, ...action.payload } }
      };

    case 'USER_ADD_ACHIEVEMENT':
      return {
        ...state,
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            achievements: [...state.user.progress.achievements, action.payload]
          }
        }
      };

    case 'USER_UPDATE_PROGRESS':
      return {
        ...state,
        user: {
          ...state.user,
          progress: { ...state.user.progress, ...action.payload }
        }
      };

    // Game actions
    case 'GAME_START':
      return {
        ...state,
        game: {
          ...state.game,
          currentGame: action.payload.gameId,
          score: 0,
          lives: action.payload.lives || 3,
          level: action.payload.level || 1,
          isPaused: false
        }
      };

    case 'GAME_SET_SCORE':
      return {
        ...state,
        game: { ...state.game, score: action.payload.score }
      };

    case 'GAME_SET_LIVES':
      return {
        ...state,
        game: { ...state.game, lives: action.payload.lives }
      };

    case 'GAME_SET_LEVEL':
      return {
        ...state,
        game: { ...state.game, level: action.payload.level }
      };

    case 'GAME_PAUSE':
      return {
        ...state,
        game: { ...state.game, isPaused: true }
      };

    case 'GAME_RESUME':
      return {
        ...state,
        game: { ...state.game, isPaused: false }
      };

    case 'GAME_END':
      return {
        ...state,
        game: {
          ...state.game,
          currentGame: null,
          currentScene: null,
          isPaused: false
        }
      };

    case 'GAME_COMPLETE':
      return {
        ...state,
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            gamesCompleted: [...state.user.progress.gamesCompleted, action.payload.gameId],
            totalStars: state.user.progress.totalStars + (action.payload.stars || 0)
          }
        },
        game: {
          ...state.game,
          currentGame: null
        }
      };

    // UI actions
    case 'UI_SHOW_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modal: {
            isOpen: true,
            type: action.payload.type,
            data: action.payload.data
          }
        }
      };

    case 'UI_HIDE_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modal: { isOpen: false, type: null, data: null }
        }
      };

    case 'UI_SHOW_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: {
            isVisible: true,
            message: action.payload.message,
            type: action.payload.type || 'info'
          }
        }
      };

    case 'UI_HIDE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notification: { isVisible: false, message: '', type: 'info' }
        }
      };

    case 'UI_SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: {
            isVisible: action.payload.isVisible,
            progress: action.payload.progress || 0,
            message: action.payload.message || ''
          }
        }
      };

    default:
      return state;
  }
}

export default StateStore;
