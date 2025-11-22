/**
 * Analytics Middleware
 *
 * Tracks learning progress and patterns
 * Collects data for adaptive difficulty and insights
 */

// Actions to track
const TRACKED_ACTIONS = {
  GAME_START: 'game_start',
  GAME_END: 'game_end',
  GAME_COMPLETE: 'game_complete',
  GAME_PAUSE: 'game_pause',
  GAME_RESUME: 'game_resume',
  GAME_SET_SCORE: 'score_change',
  USER_ADD_ACHIEVEMENT: 'achievement_earned'
};

// Analytics storage key
const ANALYTICS_KEY = 'kannada_games_analytics';

/**
 * Get analytics data from localStorage
 * @returns {object} Analytics data
 */
function getAnalytics() {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : createEmptyAnalytics();
  } catch (error) {
    console.error('Error loading analytics:', error);
    return createEmptyAnalytics();
  }
}

/**
 * Save analytics data to localStorage
 * @param {object} analytics - Analytics data
 */
function saveAnalytics(analytics) {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
}

/**
 * Create empty analytics structure
 * @returns {object}
 */
function createEmptyAnalytics() {
  return {
    sessions: [],
    currentSession: null,
    games: {},
    totalPlayTime: 0,
    lastUpdated: Date.now()
  };
}

/**
 * Track game start
 * @param {object} action - Action object
 * @param {object} analytics - Analytics data
 */
function trackGameStart(action, analytics) {
  const { gameId } = action.payload;
  const now = Date.now();

  // Create game entry if doesn't exist
  if (!analytics.games[gameId]) {
    analytics.games[gameId] = {
      playCount: 0,
      completions: 0,
      totalTime: 0,
      highScore: 0,
      averageScore: 0,
      scores: [],
      startTimes: [],
      lastPlayed: null
    };
  }

  const gameData = analytics.games[gameId];
  gameData.playCount++;
  gameData.startTimes.push(now);
  gameData.lastPlayed = now;

  // Track session
  if (!analytics.currentSession) {
    analytics.currentSession = {
      startTime: now,
      games: []
    };
  }

  analytics.currentSession.games.push({
    gameId,
    startTime: now,
    endTime: null,
    completed: false,
    score: 0
  });
}

/**
 * Track game end
 * @param {object} action - Action object
 * @param {object} state - Current state
 * @param {object} analytics - Analytics data
 */
function trackGameEnd(action, state, analytics) {
  const now = Date.now();
  const gameId = state.game.currentGame;

  if (!gameId || !analytics.currentSession) {
    return;
  }

  const currentGame = analytics.currentSession.games[analytics.currentSession.games.length - 1];

  if (currentGame && currentGame.gameId === gameId) {
    currentGame.endTime = now;
    currentGame.score = state.game.score;

    // Update game stats
    const gameData = analytics.games[gameId];
    const playTime = now - currentGame.startTime;
    gameData.totalTime += playTime;
    gameData.scores.push(state.game.score);

    // Update average score
    gameData.averageScore = gameData.scores.reduce((a, b) => a + b, 0) / gameData.scores.length;

    // Update high score
    if (state.game.score > gameData.highScore) {
      gameData.highScore = state.game.score;
    }
  }
}

/**
 * Track game completion
 * @param {object} action - Action object
 * @param {object} analytics - Analytics data
 */
function trackGameCompletion(action, analytics) {
  const { gameId, stars } = action.payload;

  if (!analytics.games[gameId]) {
    return;
  }

  const gameData = analytics.games[gameId];
  gameData.completions++;

  if (analytics.currentSession) {
    const currentGame = analytics.currentSession.games[analytics.currentSession.games.length - 1];

    if (currentGame && currentGame.gameId === gameId) {
      currentGame.completed = true;
      currentGame.stars = stars;
    }
  }
}

/**
 * End current session
 * @param {object} analytics - Analytics data
 */
function endSession(analytics) {
  if (analytics.currentSession) {
    const now = Date.now();
    analytics.currentSession.endTime = now;

    const sessionDuration = now - analytics.currentSession.startTime;
    analytics.totalPlayTime += sessionDuration;

    // Add to sessions history (keep last 100 sessions)
    analytics.sessions.push(analytics.currentSession);

    if (analytics.sessions.length > 100) {
      analytics.sessions.shift();
    }

    analytics.currentSession = null;
  }
}

/**
 * Get learning insights from analytics
 * @param {object} analytics - Analytics data
 * @returns {object} Insights
 */
export function getInsights(analytics = getAnalytics()) {
  const insights = {
    totalGames: Object.keys(analytics.games).length,
    totalPlayTime: analytics.totalPlayTime,
    totalSessions: analytics.sessions.length,
    averageSessionLength: 0,
    mostPlayedGames: [],
    bestPerformingGames: [],
    needsPractice: []
  };

  // Calculate average session length
  if (analytics.sessions.length > 0) {
    const totalSessionTime = analytics.sessions.reduce((sum, session) => {
      return sum + (session.endTime - session.startTime);
    }, 0);

    insights.averageSessionLength = totalSessionTime / analytics.sessions.length;
  }

  // Find most played games
  insights.mostPlayedGames = Object.entries(analytics.games)
    .sort((a, b) => b[1].playCount - a[1].playCount)
    .slice(0, 5)
    .map(([gameId, data]) => ({
      gameId,
      playCount: data.playCount,
      averageScore: data.averageScore
    }));

  // Find best performing games (high completion rate + high average score)
  insights.bestPerformingGames = Object.entries(analytics.games)
    .filter(([_, data]) => data.playCount > 0)
    .map(([gameId, data]) => ({
      gameId,
      completionRate: data.completions / data.playCount,
      averageScore: data.averageScore
    }))
    .sort((a, b) => (b.completionRate + b.averageScore) - (a.completionRate + a.averageScore))
    .slice(0, 5);

  // Find games that need practice (low completion rate or low average score)
  insights.needsPractice = Object.entries(analytics.games)
    .filter(([_, data]) => data.playCount > 2) // At least 3 attempts
    .map(([gameId, data]) => ({
      gameId,
      completionRate: data.completions / data.playCount,
      averageScore: data.averageScore
    }))
    .filter(game => game.completionRate < 0.5 || game.averageScore < 50)
    .sort((a, b) => a.completionRate - b.completionRate)
    .slice(0, 5);

  return insights;
}

/**
 * Clear analytics data
 */
export function clearAnalytics() {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
    console.log('Analytics data cleared');
  } catch (error) {
    console.error('Error clearing analytics:', error);
  }
}

/**
 * Analytics middleware
 */
const analyticsMiddleware = (store) => (next) => (action) => {
  const analytics = getAnalytics();
  const previousState = store.getState();

  // Execute action
  const result = next(action);

  const newState = store.getState();

  // Track specific actions
  switch (action.type) {
    case 'GAME_START':
      trackGameStart(action, analytics);
      break;

    case 'GAME_END':
      trackGameEnd(action, previousState, analytics);
      break;

    case 'GAME_COMPLETE':
      trackGameCompletion(action, analytics);
      break;

    case 'APP_DESTROY':
      endSession(analytics);
      break;
  }

  // Update timestamp
  analytics.lastUpdated = Date.now();

  // Save analytics
  saveAnalytics(analytics);

  return result;
};

export default analyticsMiddleware;
