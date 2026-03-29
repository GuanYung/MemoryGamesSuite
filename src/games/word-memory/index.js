/**
 * Word Memory Game — Core logic and rendering.
 * A classic "Seen or New" test integrated into the "Orbital Command" HUD.
 */
import { INITIAL_WORDS, GAME_CONSTANTS } from './config.js';
import { createElement, createConfetti, shuffleArray } from '../../utils/helpers.js';
import { saveScore, getBestScore } from '../../utils/storage.js';
import { createNavbar } from '../../components/navbar.js';
import { createLeaderboardPanel } from '../../components/leaderboard.js';

export const WordMemory = {
  container: null,
  state: {
    seenWords: new Set(),
    remainingPool: [],
    currentWord: '',
    score: 0,
    isGameOver: false,
    status: 'IDLE'
  },

  init(container) {
    this.container = container;
    this.container.innerHTML = '';
    
    // Create Layout Shell
    this.container.appendChild(createNavbar());
    
    this.page = createElement('main', { className: 'page' });
    this.pageContent = createElement('div', { className: 'page-content' });
    this.statusBar = createElement('footer', { className: 'status-bar' }, [
      createElement('div', { className: 'status-bar__links' }, [
        createElement('span', { id: 'game-status-text', textContent: '[ STATUS: READY ]' }),
        createElement('span', { id: 'game-score-text', textContent: '[ SCORE: 0 ]' }),
      ]),
      createElement('div', { id: 'best-score-text' })
    ]);

    this.page.appendChild(this.pageContent);
    this.page.appendChild(this.statusBar);
    this.container.appendChild(this.page);

    this.renderStartScreen();
    return () => this.cleanup();
  },

  cleanup() {
    this.container.innerHTML = '';
  },

  renderStartScreen() {
    this.state.score = 0;
    this.state.seenWords = new Set();
    this.state.remainingPool = shuffleArray([...INITIAL_WORDS]);
    this.state.isGameOver = false;

    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: READY ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-blue)';
    this.statusBar.querySelector('#game-score-text').textContent = '[ SCORE: 0 ]';
    
    const best = getBestScore('word-memory', 'standard');
    this.statusBar.querySelector('#best-score-text').textContent = best ? `BEST: ${best}` : '';

    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="config-card glass-panel animate-fade-in" style="max-width: 500px; text-align: center;">
          <h1 style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 1rem;">Word Memory</h1>
          <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
            A word will be shown. You must decide if it's a <strong>NEW</strong> word or one you have **SEEN** before in this session.
          </p>
          <button class="btn btn--primary btn--lg" id="start-game-btn" style="width: 100%;">Initialize Training Module 🚀</button>
        </div>
      </div>
    `;

    this.pageContent.querySelector('#start-game-btn').onclick = () => this.startGame();
  },

  startGame() {
    this.state.status = 'ACTIVE';
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: ACTIVE ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-green)';
    this.nextTurn();
  },

  nextTurn() {
    // Decide whether to show a seen word or a new word
    const seenCount = this.state.seenWords.size;
    let showSeen = false;

    if (seenCount > 0) {
      const ratio = Math.min(
        GAME_CONSTANTS.MAX_SEEN_RATIO, 
        GAME_CONSTANTS.MIN_SEEN_RATIO + (this.state.score * 0.02)
      );
      showSeen = Math.random() < ratio;
    }

    if (showSeen) {
      const seenArray = Array.from(this.state.seenWords);
      this.state.currentWord = seenArray[Math.floor(Math.random() * seenArray.length)];
    } else {
      // Pick from remaining pool, or reshuffle seen if empty (unlikely with 100+ words)
      if (this.state.remainingPool.length === 0) {
        this.state.remainingPool = shuffleArray([...INITIAL_WORDS]).filter(w => !this.state.seenWords.has(w));
      }
      this.state.currentWord = this.state.remainingPool.pop();
    }

    this.renderWordHUD();
  },

  renderWordHUD() {
    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="word-hud animate-fade-in-scale" style="text-align: center; width: 100%; max-width: 600px;">
          
          <div style="
            background: rgba(255, 255, 255, 0.03); 
            border: 1px solid var(--color-border); 
            border-radius: 24px; 
            padding: 4rem 2rem; 
            margin-bottom: 3rem;
            box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
            position: relative;
            overflow: hidden;
          ">
            <div style="position: absolute; top: 1rem; left: 1rem; color: var(--color-text-muted); font-size: 0.7rem; letter-spacing: 2px;">IDENTIFYING TOKEN...</div>
            <h2 style="
              font-family: var(--font-display); 
              font-size: clamp(3rem, 8vw, 5rem); 
              font-weight: 800; 
              color: var(--color-text-primary); 
              text-transform: uppercase; 
              letter-spacing: 4px;
              margin: 0;
            ">${this.state.currentWord}</h2>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; width: 100%;">
            <button class="btn btn--secondary btn--lg" id="seen-btn" style="padding: 1.5rem; border-color: var(--color-accent-purple);">SEEN</button>
            <button class="btn btn--secondary btn--lg" id="new-btn" style="padding: 1.5rem; border-color: var(--color-accent-cyan);">NEW</button>
          </div>

        </div>
      </div>
    `;

    this.pageContent.querySelector('#seen-btn').onclick = () => this.handleAnswer(true);
    this.pageContent.querySelector('#new-btn').onclick = () => this.handleAnswer(false);
  },

  handleAnswer(userSaidSeen) {
    const isActuallySeen = this.state.seenWords.has(this.state.currentWord);

    if (userSaidSeen === isActuallySeen) {
      // Correct!
      this.state.score++;
      this.state.seenWords.add(this.state.currentWord);
      this.statusBar.querySelector('#game-score-text').textContent = `[ SCORE: ${this.state.score} ]`;
      
      // Flash success in status bar
      const scoreEl = this.statusBar.querySelector('#game-score-text');
      scoreEl.style.color = 'var(--color-accent-green)';
      setTimeout(() => scoreEl.style.color = 'inherit', 200);

      this.nextTurn();
    } else {
      // Failure
      this.handleLoss(userSaidSeen);
    }
  },

  handleLoss(userSaidSeen) {
    this.state.isGameOver = true;
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: TERMINATED ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-error)';

    saveScore('word-memory', 'standard', this.state.score);

    const isActuallySeen = this.state.seenWords.has(this.state.currentWord);
    const correctAns = isActuallySeen ? 'SEEN' : 'NEW';
    const yourAns = userSaidSeen ? 'SEEN' : 'NEW';

    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="result-container error-state animate-fade-in-scale" style="text-align: center;">
          <h2 style="font-family: var(--font-display); font-size: 3rem; color: var(--color-error); margin-bottom: 2rem;">Recall Failure</h2>
          
          <div style="background: rgba(0,0,0,0.6); border: 2px solid rgba(255, 60, 60, 0.2); border-radius: 12px; padding: 2rem; width: 100%; max-width: 500px; margin-bottom: 2rem;">
            <div style="margin-bottom: 1.5rem;">
              <span style="color: var(--color-text-secondary); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px;">Token</span>
              <div style="font-size: 2.5rem; font-weight: 800; text-transform: uppercase;">${this.state.currentWord}</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center;">
              <div>
                <span style="color: var(--color-text-secondary); text-transform: uppercase; font-size: 0.7rem;">Expected</span>
                <div style="color: var(--color-accent-green); font-weight: bold;">${correctAns}</div>
              </div>
              <div>
                <span style="color: var(--color-text-secondary); text-transform: uppercase; font-size: 0.7rem;">Your Entry</span>
                <div style="color: var(--color-error); font-weight: bold; text-decoration: line-through;">${yourAns}</div>
              </div>
            </div>
          </div>

          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 2rem;">Final Score: <strong style="color: var(--color-text-primary); font-size: 2rem;">${this.state.score}</strong></p>
          
          <div style="display: flex; gap: 1rem; width: 100%; max-width: 400px; flex-direction: column;">
            <button class="btn btn--primary btn--lg" id="retry-btn">Re-Initialize Module</button>
            <button class="btn btn--secondary" id="back-home-btn">Exit to Command Center</button>
          </div>
        </div>
      </div>
    `;

    this.pageContent.querySelector('#retry-btn').onclick = () => this.renderStartScreen();
    this.pageContent.querySelector('#back-home-btn').onclick = () => window.location.hash = '#/';

    // Global Leaderboard
    const cardGame = this.pageContent.querySelector('.card-game');
    cardGame.style.overflowY = 'auto'; // ensure scrollability for leaderboard
    cardGame.style.padding = '2rem 0';
    
    createLeaderboardPanel('word-memory', 'standard', this.state.score)
      .then(panel => cardGame.appendChild(panel));
  }
};
