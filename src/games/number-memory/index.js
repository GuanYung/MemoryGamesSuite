import { NUMBER_MODE, PROGRESSION, generateSequence } from './config.js';
import { createElement, createConfetti } from '../../utils/helpers.js';
import { createNavbar } from '../../components/navbar.js';
import { saveScore, getBestScore, getTotalGamesPlayed } from '../../utils/storage.js';
import { createLeaderboardPanel } from '../../components/leaderboard.js';

export const NumberMemory = {
  container: null,
  state: {
    mode: NUMBER_MODE.SINGLE,
    progression: PROGRESSION.PROGRESSIVE,
    customTime: 5,
    startingLength: 3,
    currentLength: 3,
    sequence: [],
    timer: null,
    timeRemaining: 0,
    interval: null
  },

  init(container) {
    this.container = container;
    this.container.innerHTML = '';
    
    // Create Layout Shell
    this.container.appendChild(createNavbar());
    
    this.page = createElement('main', { className: 'page' });
    this.pageContent = createElement('div', { className: 'page-content' });
    
    // Status Bar
    this.statusBar = createElement('footer', { className: 'status-bar' }, [
      createElement('div', { className: 'status-bar__links' }, [
        createElement('span', { id: 'game-status-text', textContent: '[ STATUS: IDLE ]' }),
        createElement('span', { id: 'game-level-text' }),
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
    if (this.state.interval) clearInterval(this.state.interval);
    this.container.innerHTML = '';
  },

  renderConfig() {
    // Reset state to starting configuration
    this.state.currentLength = this.state.startingLength;
    this.state.sequence = [];

    const configHtml = `
      <div class="card-game">
        <a href="#/" class="back-btn">← Back to Games</a>
        <div class="card-game__header animate-fade-in">
          <h1 class="card-game__title">
            <span class="card-game__title-icon">🔢</span>Number Memory
          </h1>
          <p class="card-game__subtitle">Memorize the sequence. Test your brain.</p>
        </div>

        <div class="config-card glass-panel animate-fade-in-up">
          <h3>Game Settings</h3>
          
          <div class="config-group">
            <label>Mode</label>
            <div style="display: flex; gap: 1rem;" id="mode-toggle">
              <button class="btn ${this.state.mode === NUMBER_MODE.SINGLE ? 'btn--primary' : 'btn--secondary'}" style="flex: 1;" data-value="${NUMBER_MODE.SINGLE}">Single Digits (0-9)</button>
              <button class="btn ${this.state.mode === NUMBER_MODE.DOUBLE ? 'btn--primary' : 'btn--secondary'}" style="flex: 1;" data-value="${NUMBER_MODE.DOUBLE}">Double Digits (00-99)</button>
            </div>
          </div>

          <div class="config-group">
            <label>Progression</label>
            <div style="display: flex; gap: 1rem;" id="progression-toggle">
              <button class="btn ${this.state.progression === PROGRESSION.PROGRESSIVE ? 'btn--primary' : 'btn--secondary'}" style="flex: 1;" data-value="${PROGRESSION.PROGRESSIVE}">Progressive (Level Up)</button>
              <button class="btn ${this.state.progression === PROGRESSION.FIXED ? 'btn--primary' : 'btn--secondary'}" style="flex: 1;" data-value="${PROGRESSION.FIXED}">Fixed Length (Test)</button>
            </div>
          </div>

          <div class="config-group">
            <label>Memorization Time (Seconds)</label>
            <div style="display: flex;">
              <input type="number" id="custom-time-input" min="1" max="999" value="${this.state.customTime}" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: white; font-size: 1.1rem;">
            </div>
          </div>

          <div class="config-group">
            <label>Sequence Length</label>
            <div class="slider-container">
              <input type="range" class="styled-slider" id="length-slider" min="1" max="15" value="${this.state.startingLength}">
              <span id="length-display" class="highlight-text">${this.state.startingLength}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: center; margin-top: 3rem;">
            <button class="btn btn--primary btn--lg" style="width: 100%; max-width: 400px; padding: 1.25rem; font-size: 1.25rem; box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);" id="start-btn">Start Game 🎮</button>
          </div>
        </div>
      </div>
    `;

    this.pageContent.innerHTML = configHtml;
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: CONFIGURING ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-blue)';
    this.statusBar.querySelector('#game-level-text').textContent = '';
    
    const best = getBestScore('number-memory-wins', `${this.state.mode}-${this.state.progression}`);
    this.statusBar.querySelector('#best-score-text').textContent = best ? `BEST: ${best}` : '';

    // Attach Interactivity
    this.pageContent.querySelectorAll('#mode-toggle .btn, #progression-toggle .btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const parent = e.target.parentElement;
        
        // Reset all siblings back to secondary
        parent.querySelectorAll('.btn').forEach(b => {
          b.className = 'btn btn--secondary';
          b.style.flex = '1';
        });
        
        // Make the clicked one active (primary)
        e.target.className = 'btn btn--primary';
        e.target.style.flex = '1';

        // Update state
        if (parent.id === 'mode-toggle') {
          this.state.mode = e.target.dataset.value;
        } else if (parent.id === 'progression-toggle') {
          this.state.progression = e.target.dataset.value;
        }
      });
    });

    const timeInput = this.pageContent.querySelector('#custom-time-input');
    timeInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (val < 1) val = 1;
      if (val > 999) val = 999;
      if (!isNaN(val)) {
        this.state.customTime = val;
      }
    });

    const slider = this.pageContent.querySelector('#length-slider');
    const display = this.pageContent.querySelector('#length-display');
    slider.addEventListener('input', (e) => {
      this.state.startingLength = parseInt(e.target.value, 10);
      display.textContent = this.state.startingLength;
    });

    this.page.querySelector('#start-btn').addEventListener('click', () => {
      this.state.currentLength = this.state.startingLength;
      this.startGame();
    });
  },

  startGame() {
    this.state.sequence = generateSequence(this.state.mode, this.state.currentLength);
    const displayTimeMs = this.state.customTime * 1000;
    
    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 2rem;">
        <div class="number-display-container animate-fade-in-up">
          <div class="sequence-display string-sequence">${this.state.sequence.join(' ')}</div>
          <div class="timer-bar-container" style="position: relative;">
            <div class="timer-bar" id="game-timer-bar"></div>
          </div>
          <div id="countdown-text" style="text-align: right; color: var(--color-text-secondary); margin-top: 0.5rem; font-family: var(--font-mono); font-weight: bold;"></div>
          
          <div style="display: flex; justify-content: center; margin-top: 2rem;">
            <button class="btn btn--secondary" id="ready-btn" style="width: 100%; max-width: 300px;">I'm Ready! (Skip Timer)</button>
          </div>
        </div>
      </div>
    `;

    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: MEMORIZING ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-pink)';
    this.statusBar.querySelector('#game-level-text').textContent = `Lvl ${this.state.currentLength}`;

    // Start Timer animation
    const bar = this.pageContent.querySelector('#game-timer-bar');
    // Force reflow
    void bar.offsetWidth;
    bar.style.transition = `width ${displayTimeMs}ms linear`;
    bar.style.width = '0%';

    let timeLeft = displayTimeMs;
    const textEl = this.pageContent.querySelector('#countdown-text');
    textEl.textContent = (timeLeft / 1000).toFixed(1) + 's';

    this.pageContent.querySelector('#ready-btn').addEventListener('click', () => {
      clearInterval(this.state.interval);
      clearTimeout(this.state.timer);
      this.renderInputPhase();
    });

    this.state.interval = setInterval(() => {
      timeLeft -= 100;
      if (timeLeft <= 0) {
        timeLeft = 0;
        clearInterval(this.state.interval);
      }
      textEl.textContent = (timeLeft / 1000).toFixed(1) + 's';
    }, 100);

    this.state.timer = setTimeout(() => {
      clearInterval(this.state.interval);
      this.renderInputPhase();
    }, displayTimeMs);
  },

  renderInputPhase() {
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: INPUTTING ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-cyan)';

    const isSingle = this.state.mode === NUMBER_MODE.SINGLE;
    const maxLength = isSingle ? 1 : 2;
    
    // Generate the inputs HTML
    let inputsHtml = '';
    for (let i = 0; i < this.state.currentLength; i++) {
      inputsHtml += `
        <input 
          type="text" 
          class="otp-input ${isSingle ? 'otp-single' : 'otp-double'}"
          data-index="${i}"
          maxlength="${maxLength}"
          inputmode="numeric"
          autocomplete="off"
        />
      `;
    }

    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 2rem;">
        <div class="number-input-container animate-fade-in-scale">
          <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Input Sequence</h2>
          <form id="answer-form">
            <div class="otp-container">
              ${inputsHtml}
            </div>
            <button type="submit" class="btn btn--primary btn--lg w-full mt-4" style="max-width: 400px; margin: 2rem auto 0; display: block;">Submit</button>
          </form>
        </div>
      </div>
    `;

    // Input interaction logic
    const inputs = Array.from(this.pageContent.querySelectorAll('.otp-input'));
    if (inputs.length > 0) setTimeout(() => inputs[0].focus(), 10);

    inputs.forEach((input, index) => {
      // Auto-advance
      input.addEventListener('input', (e) => {
        // Only allow numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (e.target.value.length === maxLength) {
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      });

      // Handle backspace navigation
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '') {
          if (index > 0) {
            inputs[index - 1].focus();
          }
        }
        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0 && e.target.selectionStart === 0) {
          inputs[index - 1].focus();
        }
        if (e.key === 'ArrowRight' && index < inputs.length - 1 && e.target.selectionEnd === e.target.value.length) {
          inputs[index + 1].focus();
        }
      });
      
      // Paste handler (highly convenient if user pastes "1234")
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        if (!pastedData) return;
        
        let charIndex = 0;
        for (let i = index; i < inputs.length; i++) {
          if (charIndex >= pastedData.length) break;
          const chunk = pastedData.slice(charIndex, charIndex + maxLength);
          inputs[i].value = chunk;
          charIndex += chunk.length;
          
          if (i < inputs.length - 1 && chunk.length === maxLength) {
            inputs[i + 1].focus();
          } else {
            inputs[i].focus();
          }
        }
      });
    });

    this.pageContent.querySelector('#answer-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const userInput = inputs.map(inp => inp.value).join('');
      this.checkAnswer(userInput);
    });
  },

  checkAnswer(userInput) {
    // Normalize input (strip spaces) and answer
    const normalizedInput = userInput.replace(/\s/g, '');
    const correctAnswer = this.state.sequence.join('');
    
    if (normalizedInput === correctAnswer) {
      this.handleWin();
    } else {
      this.handleLoss(userInput, this.state.sequence.join(' '));
    }
  },

  handleWin() {
    createConfetti(document.body);
    saveScore('number-memory-wins', `${this.state.mode}-${this.state.progression}`, this.state.currentLength);

    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: WIN ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-accent-green)';

    if (this.state.progression === PROGRESSION.PROGRESSIVE) {
      this.pageContent.innerHTML = `
        <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div class="result-container success-state animate-fade-in-scale">
            <h2>Success</h2>
            <div style="display: flex; gap: 1rem; margin-top: 2rem; width: 100%; max-width: 400px; flex-direction: column;">
              <button class="btn btn--primary btn--lg" style="width: 100%;" id="next-level-btn">Next Level 🚀</button>
              <button class="btn btn--secondary" style="width: 100%;" id="quit-btn">Quit to Menu</button>
            </div>
          </div>
        </div>
      `;
      this.pageContent.querySelector('#next-level-btn').addEventListener('click', () => {
        this.state.currentLength++;
        this.startGame();
      });
      this.pageContent.querySelector('#quit-btn').addEventListener('click', () => this.renderConfig());
    } else {
      // Fixed Mode - Game Over
      this.pageContent.innerHTML = `
        <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div class="result-container success-state animate-fade-in-scale">
            <h2>Perfect!</h2>
            <div style="display: flex; gap: 1rem; margin-top: 2rem; width: 100%; max-width: 400px; flex-direction: column;">
              <button class="btn btn--primary btn--lg" style="width: 100%;" id="play-again-btn">Play Again</button>
              <button class="btn btn--secondary" style="width: 100%;" id="back-config-btn">Change Settings</button>
            </div>
          </div>
        </div>
      `;
      this.pageContent.querySelector('#play-again-btn').addEventListener('click', () => this.startGame());
      this.pageContent.querySelector('#back-config-btn').addEventListener('click', () => this.renderConfig());

      // Global Leaderboard
      const cardGame = this.pageContent.querySelector('.card-game');
      createLeaderboardPanel('number-memory', `${this.state.mode}-${this.state.progression}`, this.state.currentLength)
        .then(panel => cardGame.appendChild(panel));
    }
  },

  handleLoss(userInput, correctString) {
    this.statusBar.querySelector('#game-status-text').textContent = '[ STATUS: FAILURE ]';
    this.statusBar.querySelector('#game-status-text').style.color = 'var(--color-error)';

    const rawUser = String(userInput || '').replace(/\s+/g, '');
    let formattedUserInput = 'Nothing';
    
    if (rawUser) {
      if (this.state.mode === NUMBER_MODE.SINGLE) {
        formattedUserInput = rawUser.split('').join(' ');
      } else {
        const chunks = rawUser.match(/.{1,2}/g);
        if (chunks) formattedUserInput = chunks.join(' ');
      }
    }

    this.pageContent.innerHTML = `
      <div class="card-game" style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <div class="result-container error-state animate-fade-in-scale">
          <h2 style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-error); text-shadow: 0 0 15px rgba(255, 60, 60, 0.4); margin-bottom: 2rem;">Game Over</h2>
          
          <div style="background: rgba(0,0,0,0.6); border: 2px solid rgba(255, 60, 60, 0.2); border-radius: 12px; padding: 2rem; width: 100%; max-width: 500px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8);">
            
            <div style="margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
              <span style="color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 0.5rem;">Correct Answer</span>
              <span style="font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: var(--color-text-primary); letter-spacing: 6px; word-break: break-all;">${correctString}</span>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
              <span style="color: var(--color-error); text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 0.5rem;">Your Input</span>
              <span style="
                font-family: var(--font-display); 
                font-size: clamp(2rem, 5vw, 3rem); 
                font-weight: 800; 
                letter-spacing: 6px; 
                word-break: break-all;
                color: rgba(255, 255, 255, 0.5);
                text-decoration: line-through; 
                text-decoration-color: var(--color-error); 
                text-decoration-thickness: 4px;
                text-shadow: 0 0 10px rgba(255,60,60,0.4);
              ">${formattedUserInput}</span>
            </div>

          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2rem; width: 100%; max-width: 400px; flex-direction: column;">
            <button class="btn btn--primary btn--lg" style="width: 100%; background: var(--color-error); border-color: rgba(255,60,60,0.5);" id="retry-btn">Try Again</button>
            <button class="btn btn--secondary" style="width: 100%;" id="back-config-btn">Change Settings</button>
          </div>
        </div>
      </div>
    `;

    this.pageContent.querySelector('#retry-btn').addEventListener('click', () => {
      // If progressive, restart from starting length
      this.state.currentLength = this.state.startingLength;
      this.startGame();
    });
    this.pageContent.querySelector('#back-config-btn').addEventListener('click', () => this.renderConfig());

    // Global Leaderboard
    const cardGame = this.pageContent.querySelector('.card-game');
    createLeaderboardPanel('number-memory', `${this.state.mode}-${this.state.progression}`, this.state.currentLength)
      .then(panel => cardGame.appendChild(panel));
  }
};
