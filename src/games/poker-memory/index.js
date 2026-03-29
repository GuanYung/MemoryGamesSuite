/**
 * Poker Card Memory Game — Core logic and rendering.
 * Challenges players to memorize and recall a sequence of playing cards.
 */
import { SUITS, RANKS, GAME_CONSTANTS } from './config.js';
import { createElement, createConfetti, shuffleArray } from '../../utils/helpers.js';
import { saveScore, getBestScore } from '../../utils/storage.js';
import { createNavbar } from '../../components/navbar.js';
import { createLeaderboardPanel } from '../../components/leaderboard.js';

export const PokerMemory = {
  container: null,
  state: {
    length: GAME_CONSTANTS.DEFAULT_LENGTH,
    targetSequence: [],
    userSequence: [],
    currentIndex: 0,
    status: 'IDLE',
    timer: null,
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
        createElement('span', { id: 'game-status-text', textContent: '[ STATUS: IDLE ]' }),
        createElement('span', { id: 'game-progress-text', textContent: '' }),
      ]),
      createElement('div', { id: 'best-score-text' })
    ]);

    this.page.appendChild(this.pageContent);
    this.page.appendChild(this.statusBar);
    this.container.appendChild(this.page);

    this.renderConfig();
    return () => this.cleanup();
  },

  cleanup() {
    if (this.state.timer) clearTimeout(this.state.timer);
    this.container.innerHTML = '';
  },

  renderConfig() {
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: CONFIG ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-blue)';
    this.statusBar.querySelector('#game-progress-text').textContent = '';

    const best = getBestScore('poker-memory', 'standard');
    this.statusBar.querySelector('#best-score-text').textContent = best ? `LEVEL RECORD: ${best}` : '';

    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="config-card glass-panel animate-fade-in" style="max-width: 500px; text-align: center; width: 100%;">
          <h1 style="font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 0.5rem;">Poker Memory</h1>
          <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">Memorize a sequence of poker cards and recall them in exact order.</p>
          
          <div style="margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
            <label style="color: var(--color-text-primary); font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 2px;">SEQUENCE LENGTH</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <button class="btn btn--secondary" id="dec-len" style="width: 50px;">-</button>
              <span id="len-val" style="font-size: 2.5rem; font-weight: 800; min-width: 60px;">${this.state.length}</span>
              <button class="btn btn--secondary" id="inc-len" style="width: 50px;">+</button>
            </div>
          </div>

          <button class="btn btn--primary btn--lg" id="start-game-btn" style="width: 100%;">Begin Sequential Scan ♠️</button>
        </div>
      </div>
    `;

    const updateLen = (val) => {
      this.state.length = Math.max(1, Math.min(52, this.state.length + val));
      this.pageContent.querySelector('#len-val').textContent = this.state.length;
    };

    this.pageContent.querySelector('#dec-len').onclick = () => updateLen(-1);
    this.pageContent.querySelector('#inc-len').onclick = () => updateLen(1);
    this.pageContent.querySelector('#start-game-btn').onclick = () => this.startMemorization();
  },

  startMemorization() {
    // Generate random card sequence (unique cards)
    const allCards = [];
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        allCards.push({ suit, rank });
      });
    });

    this.state.targetSequence = shuffleArray(allCards).slice(0, this.state.length);
    this.state.currentIndex = 0;
    this.state.status = 'MEMORIZING';
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: MEMORIZING ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-pink)';
    
    this.showNextCard();
  },

  showNextCard() {
    if (this.state.currentIndex >= this.state.targetSequence.length) {
      this.startRecall();
      return;
    }

    const card = this.state.targetSequence[this.state.currentIndex];
    this.statusBar.querySelector('#game-progress-text').textContent = `[ SCAN: ${this.state.currentIndex + 1}/${this.state.length} ]`;

    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="poker-card-display animate-fade-in-scale" style="
          background: white; 
          color: ${card.suit.color === 'var(--color-error)' ? '#e74c3c' : '#2c3e50'};
          width: 280px;
          height: 400px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          padding: 2rem;
          position: relative;
          user-select: none;
        ">
          <div style="font-size: 2.5rem; font-weight: 800; line-height: 1;">${card.rank}</div>
          <div style="font-size: 2.5rem; line-height: 1;">${card.suit.icon}</div>
          
          <div style="flex: 1; display: flex; justify-content: center; align-items: center; font-size: 8rem;">
            ${card.suit.icon}
          </div>

          <div style="font-size: 2.5rem; font-weight: 800; line-height: 1; text-align: right; transform: rotate(180deg);">${card.rank}</div>
          <div style="font-size: 2.5rem; line-height: 1; text-align: right; transform: rotate(180deg);">${card.suit.icon}</div>
        </div>
      </div>
    `;

    this.state.currentIndex++;
    this.state.timer = setTimeout(() => this.showNextCard(), GAME_CONSTANTS.MEMORIZE_TIME_PER_CARD);
  },

  startRecall() {
    this.state.userSequence = [];
    this.state.currentIndex = 0;
    this.state.status = 'RECALLING';
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: RECALLING ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-cyan)';
    this.statusBar.querySelector('#game-progress-text').textContent = `[ ENTRY: 0/${this.state.length} ]`;

    this.renderRecallGrid();
  },

  renderRecallGrid() {
    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; padding: 1rem; padding-bottom: 2rem;">
        <h2 style="text-align: center; margin-bottom: 1.5rem; font-family: var(--font-mono); letter-spacing: 2px;">SELECT SEQUENCE IN ORDER</h2>
        
        <div id="recall-grid-container" style="
          flex: 1; 
          display: grid; 
          grid-template-rows: repeat(4, 1fr); 
          gap: 0.5rem; 
          max-width: 1000px; 
          margin: 0 auto; 
          width: 100%;
        ">
          ${SUITS.map(suit => `
            <div style="display: grid; grid-template-columns: repeat(13, 1fr); gap: 0.4rem;">
              ${RANKS.map(rank => `
                <button class="recall-card-btn" data-rank="${rank}" data-suit-id="${suit.id}" style="
                  background: rgba(255,255,255,0.03);
                  border: 1px solid var(--color-border);
                  border-radius: 6px;
                  color: ${suit.color};
                  aspect-ratio: 2/3;
                  padding: 0;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  font-size: 0.8rem;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">
                  <span style="font-weight: bold;">${rank}</span>
                  <span style="font-size: 0.7rem;">${suit.icon}</span>
                </button>
              `).join('')}
            </div>
          `).join('')}
        </div>

        <div id="current-entry-visual" style="
          margin-top: 1.5rem; 
          display: flex; 
          gap: 0.5rem; 
          justify-content: center;
          height: 80px;
          flex-wrap: wrap;
        ">
          ${Array(this.state.length).fill(0).map((_, i) => `
            <div style="width: 50px; height: 70px; border: 2px dashed var(--color-border); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: var(--color-text-muted);">
              ${this.state.userSequence[i] ? `
                <div style="color: ${this.state.userSequence[i].suit.color}; text-align: center;">
                  <div style="font-weight: bold;">${this.state.userSequence[i].rank}</div>
                  <div>${this.state.userSequence[i].suit.icon}</div>
                </div>
              ` : `[ ${i+1} ]`}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.pageContent.querySelectorAll('.recall-card-btn').forEach(btn => {
      btn.onclick = (e) => {
        const rank = e.currentTarget.dataset.rank;
        const suitId = e.currentTarget.dataset.suitId;
        const suit = SUITS.find(s => s.id === suitId);
        
        this.handleCardSelection({ rank, suit });
      };
    });
  },

  handleCardSelection(card) {
    // Check if card already exists in userSequence (only if we want unique selection)
    const exists = this.state.userSequence.find(c => c.rank === card.rank && c.suit.id === card.suit.id);
    if (exists) return;

    this.state.userSequence.push(card);
    this.statusBar.querySelector('#game-progress-text').textContent = `[ ENTRY: ${this.state.userSequence.length}/${this.state.length} ]`;

    if (this.state.userSequence.length === this.state.length) {
      this.checkResults();
    } else {
      this.renderRecallGrid();
    }
  },

  checkResults() {
    let correctCount = 0;
    this.state.targetSequence.forEach((target, i) => {
      const user = this.state.userSequence[i];
      if (user.rank === target.rank && user.suit.id === target.suit.id) {
        correctCount++;
      }
    });

    if (correctCount === this.state.length) {
      this.handleWin();
    } else {
      this.handleLoss(correctCount);
    }
  },

  handleWin() {
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: VERIFIED ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-green)';
    createConfetti(document.body);
    saveScore('poker-memory', 'standard', this.state.length);

    this.renderResults(true);
  },

  handleLoss(correctCount) {
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: FAILED ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-error)';
    this.renderResults(false, correctCount);
  },

  renderResults(isWin, correctCount) {
    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem;">
        <div class="result-container ${isWin ? 'success' : 'error-state'} animate-fade-in-scale" style="text-align: center; width: 100%; max-width: 900px;">
          <h2 style="font-family: var(--font-display); font-size: 3rem; margin-bottom: 2rem; color: ${isWin ? 'var(--color-accent-green)' : 'var(--color-error)'};">
            ${isWin ? 'Sequence Perfect!' : 'Data Mismatch'}
          </h2>

          <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem;">
            
            <div style="text-align: left;">
              <h3 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">TARGET SEQUENCE</h3>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${this.state.targetSequence.map(c => `
                  <div style="width: 60px; height: 90px; background: white; border-radius: 6px; position: relative; padding: 0.5rem; color: ${c.suit.color === 'var(--color-error)' ? '#e74c3c' : '#2c3e50'}; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-weight: 900; line-height: 1;">${c.rank}</div>
                    <div style="font-size: 1.5rem; line-height: 1;">${c.suit.icon}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            ${!isWin ? `
              <div style="text-align: left;">
                <h3 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">YOUR SEQUENCE</h3>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  ${this.state.userSequence.map((c, i) => {
                    const isCorrect = c.rank === this.state.targetSequence[i].rank && c.suit.id === this.state.targetSequence[i].suit.id;
                    return `
                      <div style="width: 60px; height: 90px; background: white; border-radius: 6px; position: relative; padding: 0.5rem; color: ${c.suit.color === 'var(--color-error)' ? '#e74c3c' : '#2c3e50'}; display: flex; flex-direction: column; align-items: center; justify-content: center; ${!isCorrect ? 'border: 3px solid var(--color-error);' : 'border: 3px solid var(--color-accent-green);'}">
                        <div style="font-weight: 900; line-height: 1;">${c.rank}</div>
                        <div style="font-size: 1.5rem; line-height: 1;">${c.suit.icon}</div>
                        ${!isCorrect ? '<div style="position: absolute; top: -5px; right: -5px; background: var(--color-error); width: 20px; height: 20px; border-radius: 50%; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; color: white;">×</div>' : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

          </div>

          <div style="display: flex; gap: 1rem; width: 100%; max-width: 400px; margin: 0 auto; flex-direction: column;">
            <button class="btn btn--primary btn--lg" id="retry-btn">Re-Initialize Sequence</button>
            <button class="btn btn--secondary" id="back-home-btn">Return to Headquarters</button>
          </div>
        </div>
      </div>
    `;

    this.pageContent.querySelector('#retry-btn').onclick = () => this.renderConfig();
    this.pageContent.querySelector('#back-home-btn').onclick = () => window.location.hash = '#/';

    // Global Leaderboard
    const cardGame = this.pageContent.querySelector('.card-game');
    cardGame.style.overflowY = 'auto'; // ensure scrollability for leaderboard
    cardGame.style.padding = '2rem 0';
    
    createLeaderboardPanel('poker-memory', 'standard', this.state.length)
      .then(panel => cardGame.appendChild(panel));
  }
};
