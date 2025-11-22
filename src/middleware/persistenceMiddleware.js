/**
 * Persistence Middleware
 *
 * Auto-saves user progress and preferences to localStorage
 * Loads on application start
 */

const STORAGE_KEY = 'kannada_games_state';

// Actions that trigger persistence
const PERSIST_ACTIONS = [
  'USER_SET_PROFILE',
  'USER_UPDATE_PROFILE',
  'USER_SET_PREFERENCES',
  'USER_ADD_ACHIEVEMENT',
  'USER_UPDATE_PROGRESS',
  'GAME_COMPLETE'
];

// Parts of state to persist
const PERSIST_KEYS = ['user'];

/**
 * Load state from localStorage
 * @returns {object|null} Persisted state or null
 */
export function loadPersistedState() {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);

    if (serializedState === null) {
      return null;
    }

    const state = JSON.parse(serializedState);
    console.log('Loaded persisted state:', state);

    return state;
  } catch (error) {
    console.error('Error loading persisted state:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 * @param {object} state - State to persist
 */
function saveState(state) {
  try {
    // Only persist specified keys
    const stateToPersist = {};

    PERSIST_KEYS.forEach(key => {
      if (state[key]) {
        stateToPersist[key] = state[key];
      }
    });

    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem(STORAGE_KEY, serializedState);

    console.log('State persisted to localStorage');
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
}

/**
 * Clear persisted state
 */
export function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Persisted state cleared');
  } catch (error) {
    console.error('Error clearing persisted state:', error);
  }
}

/**
 * Persistence middleware
 */
const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Save state after specific actions
  if (PERSIST_ACTIONS.includes(action.type)) {
    // Debounce save to avoid excessive writes
    clearTimeout(persistenceMiddleware.saveTimeout);

    persistenceMiddleware.saveTimeout = setTimeout(() => {
      saveState(store.getState());
    }, 500); // Save 500ms after last action
  }

  return result;
};

// Debounce timeout reference
persistenceMiddleware.saveTimeout = null;

export default persistenceMiddleware;
