/**
 * LocalStorage utility for persisting game scores and settings.
 */

const STORAGE_KEY = 'memory_games_suite';

function getStore() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/**
 * Save a high score for a game + difficulty combination.
 * Keeps top 5 scores.
 */
export function saveScore(gameId, difficulty, score) {
  const store = getStore();
  const key = `${gameId}_${difficulty}`;

  if (!store.scores) store.scores = {};
  if (!store.scores[key]) store.scores[key] = [];

  store.scores[key].push({
    score,
    date: new Date().toISOString(),
  });

  // Keep top 5 (lower is better for time & moves)
  store.scores[key].sort((a, b) => a.score - b.score);
  store.scores[key] = store.scores[key].slice(0, 5);

  saveStore(store);
}

/**
 * Get high scores for a game + difficulty combination.
 */
export function getScores(gameId, difficulty) {
  const store = getStore();
  const key = `${gameId}_${difficulty}`;
  return store.scores?.[key] || [];
}

/**
 * Get the best score for a game + difficulty.
 */
export function getBestScore(gameId, difficulty) {
  const scores = getScores(gameId, difficulty);
  return scores.length > 0 ? scores[0] : null;
}

/**
 * Get total games played across all games.
 */
export function getTotalGamesPlayed() {
  const store = getStore();
  if (!store.scores) return 0;
  return Object.values(store.scores).reduce((sum, arr) => sum + arr.length, 0);
}
