/**
 * Leaderboard Component — Displays global high scores and submission.
 */
import { createElement, formatTime } from '../utils/helpers.js';
import { LeaderboardAPI } from '../api/client.js';

/**
 * Creates a global leaderboard panel for a specific game.
 */
export async function createLeaderboardPanel(gameId, difficulty, currentScore) {
  const container = createElement('div', { 
    className: 'leaderboard-panel glass-panel animate-fade-in', 
    style: 'margin-top: 2rem; width: 100%; max-width: 600px; padding: 1.5rem;' 
  });

  const isReachable = await LeaderboardAPI.checkHealth();
  if (!isReachable) {
    container.innerHTML = `<div style="color: var(--color-text-muted); font-size: 0.8rem; text-align: center;">[ OFFLINE: COULD NOT CONNECT TO GLOBAL COMMAND ]</div>`;
    return container;
  }

  const scores = await LeaderboardAPI.getTopScores(gameId, difficulty);

  container.innerHTML = `
    <h3 style="font-family: var(--font-mono); letter-spacing: 2px; font-size: 0.9rem; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; color: var(--color-accent-blue);">
      GLOBAL TOP 10 [ ${difficulty.toUpperCase()} ]
    </h3>
    <div id="scores-list" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
      ${scores.length === 0 ? '<div style="color: var(--color-text-muted); font-size: 0.8rem; text-align: center; padding: 1rem;">No global records established... yet.</div>' : ''}
      ${scores.map((s, i) => `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-family: var(--font-mono);">
          <span>${i + 1}. <span style="color: var(--color-text-primary); font-weight: bold;">${s.nickname}</span></span>
          <span style="color: var(--color-accent-green);">${gameId === 'card-match' ? formatTime(s.score) : s.score}</span>
        </div>
      `).join('')}
    </div>

    <div id="submission-area" style="border-top: 1px solid var(--color-border); padding-top: 1rem;">
      <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: 1rem;">ESTABLISH YOUR GLOBAL COMMAND RECORD?</p>
      <div style="display: flex; gap: 0.5rem;">
        <input type="text" id="nickname-entry" maxlength="15" placeholder="COMMANDER NICKNAME" 
               style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--color-border); color: white; padding: 0.5rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem;">
        <button id="submit-btn" class="btn btn--primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">SUBMIT</button>
      </div>
      <div id="msg-area" style="font-size: 0.7rem; margin-top: 0.5rem;"></div>
    </div>
  `;

  const input = container.querySelector('#nickname-entry');
  const btn = container.querySelector('#submit-btn');
  const msgArea = container.querySelector('#msg-area');

  btn.onclick = async () => {
    const nick = input.value.trim();
    if (!nick) {
      msgArea.textContent = 'ENTER NICKNAME';
      msgArea.style.color = 'var(--color-error)';
      return;
    }

    btn.disabled = true;
    msgArea.textContent = 'SUBMITTING...';
    msgArea.style.color = 'var(--color-accent-blue)';

    try {
      await LeaderboardAPI.submitScore({
        nickname: nick,
        game_id: gameId,
        difficulty: difficulty,
        score: currentScore
      });
      
      msgArea.textContent = 'TRANSMISSION COMPLETE! RECORD SECURED.';
      msgArea.style.color = 'var(--color-accent-green)';
      btn.style.display = 'none';
      input.style.display = 'none';

      // Refresh scores after submission
      const newScores = await LeaderboardAPI.getTopScores(gameId, difficulty);
      const list = container.querySelector('#scores-list');
      list.innerHTML = newScores.map((s, i) => `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-family: var(--font-mono);">
          <span>${i + 1}. <span style="color: var(--color-text-primary); font-weight: bold;">${s.nickname}</span></span>
          <span style="color: var(--color-accent-green);">${gameId === 'card-match' ? s.score : s.score}</span>
        </div>
      `).join('');

    } catch (e) {
      msgArea.textContent = e.message;
      msgArea.style.color = 'var(--color-error)';
      btn.disabled = false;
    }
  };

  return container;
}
