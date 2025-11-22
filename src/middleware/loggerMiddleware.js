/**
 * Logger Middleware
 *
 * Logs all state changes to console (development only)
 * Useful for debugging state flow
 */

const loggerMiddleware = (store) => (next) => (action) => {
  // Only log in development
  if (process.env.NODE_ENV === 'production') {
    return next(action);
  }

  console.group(`%c Action: ${action.type}`, 'color: #03A9F4; font-weight: bold');

  console.log('%c Previous State:', 'color: #9E9E9E', store.getState());
  console.log('%c Action:', 'color: #00BCD4', action);

  const result = next(action);

  console.log('%c Next State:', 'color: #4CAF50', store.getState());
  console.groupEnd();

  return result;
};

export default loggerMiddleware;
