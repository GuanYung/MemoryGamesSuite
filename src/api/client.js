/**
 * API Client for the Memory Games Suite Global Leaderboard.
 */

const BASE_URL = 'http://localhost:8000'; // Change to production URL later

export const LeaderboardAPI = {
  /**
   * Submit a new score to the global leaderboard.
   * @param {Object} scoreData - { nickname, game_id, difficulty, score }
   */
  async submitScore(scoreData) {
    try {
      const response = await fetch(`${BASE_URL}/leaderboard/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment.');
        }
        throw new Error('Could not submit score to global leaderboard.');
      }

      return await response.json();
    } catch (error) {
      console.error('Leaderboard Submit Error:', error);
      throw error;
    }
  },

  /**
   * Fetch the top 10 scores for a specific game and difficulty.
   */
  async getTopScores(gameId, difficulty) {
    try {
      const response = await fetch(`${BASE_URL}/leaderboard/${gameId}/${difficulty}`);
      if (!response.ok) {
        throw new Error('Could not fetch leaderboard data.');
      }
      return await response.json();
    } catch (error) {
      console.error('Leaderboard Fetch Error:', error);
      return []; // Fallback to empty list
    }
  },

  /**
   * Check if backend is reachable.
   */
  async checkHealth() {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
};
