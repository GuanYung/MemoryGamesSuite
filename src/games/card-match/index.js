/**
 * Card Matching Game — Core logic and rendering.
 */
import { CARD_EMOJIS, DIFFICULTY } from './config.js';
import { shuffleArray, formatTime, createElement, createConfetti } from '../../utils/helpers.js';
import { saveScore, getBestScore } from '../../utils/storage.js';
import { createNavbar } from '../../components/navbar.js';
import { createLeaderboardPanel } from '../../components/leaderboard.js';

const GAME_ID = 'card-match';

export function renderCardMatch(appEl) {
  let state = {
    difficulty: 'easy',
    cards: [],
    flippedIndices: [],
    matchedPairs: new Set(),
    moves: 0,
    timer: 0,
    timerInterval: null,
    isLocked: false, // lock board while checking
    gameStarted: false,
    gameOver: false,
  };

  // ---- State Management ----

  function initGame(difficulty) {
    clearInterval(state.timerInterval);

    const config = DIFFICULTY[difficulty];
    const selectedEmojis = shuffleArray(CARD_EMOJIS).slice(0, config.pairs);
    const cards = shuffleArray([...selectedEmojis, ...selectedEmojis]).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    }));

    state = {
      difficulty,
      cards,
      flippedIndices: [],
      matchedPairs: new Set(),
      moves: 0,
      timer: 0,
      timerInterval: null,
      isLocked: false,
      gameStarted: false,
      gameOver: false,
    };

    render();
  }

  function startTimer() {
    if (state.gameStarted) return;
    state.gameStarted = true;
    state.timerInterval = setInterval(() => {
      state.timer++;
      updateStatsDisplay();
    }, 1000);
  }

  function handleCardClick(index) {
    if (state.isLocked) return;
    if (state.gameOver) return;
    if (state.cards[index].flipped || state.cards[index].matched) return;
    if (state.flippedIndices.includes(index)) return;

    // Start timer on first click
    startTimer();

    // Flip the card
    state.cards[index].flipped = true;
    state.flippedIndices.push(index);
    updateCardDisplay(index, true);

    if (state.flippedIndices.length === 2) {
      state.moves++;
      updateStatsDisplay();
      checkMatch();
    }
  }

  function checkMatch() {
    state.isLocked = true;
    const [i1, i2] = state.flippedIndices;
    const card1 = state.cards[i1];
    const card2 = state.cards[i2];

    if (card1.emoji === card2.emoji) {
      // Match!
      setTimeout(() => {
        card1.matched = true;
        card2.matched = true;
        state.matchedPairs.add(card1.emoji);

        const cardEl1 = document.querySelector(`[data-card-index="${i1}"]`);
        const cardEl2 = document.querySelector(`[data-card-index="${i2}"]`);
        if (cardEl1) {
          cardEl1.classList.add('memory-card--matched', 'memory-card--match-pop');
        }
        if (cardEl2) {
          cardEl2.classList.add('memory-card--matched', 'memory-card--match-pop');
        }

        state.flippedIndices = [];
        state.isLocked = false;

        // Check win
        const config = DIFFICULTY[state.difficulty];
        if (state.matchedPairs.size === config.pairs) {
          handleWin();
        }
      }, 300);
    } else {
      // No match — shake then flip back
      setTimeout(() => {
        const cardEl1 = document.querySelector(`[data-card-index="${i1}"]`);
        const cardEl2 = document.querySelector(`[data-card-index="${i2}"]`);
        if (cardEl1) cardEl1.classList.add('memory-card--shake');
        if (cardEl2) cardEl2.classList.add('memory-card--shake');

        setTimeout(() => {
          card1.flipped = false;
          card2.flipped = false;
          updateCardDisplay(i1, false);
          updateCardDisplay(i2, false);
          if (cardEl1) cardEl1.classList.remove('memory-card--shake');
          if (cardEl2) cardEl2.classList.remove('memory-card--shake');

          state.flippedIndices = [];
          state.isLocked = false;
        }, 400);
      }, 600);
    }
  }

  function handleWin() {
    clearInterval(state.timerInterval);
    state.gameOver = true;

    // Calculate score (lower = better): moves + time penalty
    const score = state.moves + Math.floor(state.timer / 2);
    saveScore(GAME_ID, state.difficulty, score);

    // Confetti!
    createConfetti(document.body);

    // Show win modal
    setTimeout(() => showWinModal(score), 600);
  }

  // ---- Rendering ----

  function updateCardDisplay(index, isFlipped) {
    const cardEl = document.querySelector(`[data-card-index="${index}"]`);
    if (!cardEl) return;
    if (isFlipped) {
      cardEl.classList.add('memory-card--flipped');
    } else {
      cardEl.classList.remove('memory-card--flipped');
    }
  }

  function updateStatsDisplay() {
    const movesEl = document.getElementById('stat-moves');
    const timerEl = document.getElementById('stat-timer');
    const pairsEl = document.getElementById('stat-pairs');

    if (movesEl) movesEl.textContent = state.moves;
    if (timerEl) timerEl.textContent = formatTime(state.timer);
    if (pairsEl) {
      const config = DIFFICULTY[state.difficulty];
      pairsEl.textContent = `${state.matchedPairs.size}/${config.pairs}`;
    }
  }

  function showWinModal(score) {
    const best = getBestScore(GAME_ID, state.difficulty);
    const isNewBest = best && best.score === score;

    const overlay = createElement('div', {
      className: 'modal-overlay',
      id: 'win-modal',
    }, [
      createElement('div', { className: 'modal' }, [
        createElement('h2', {
          className: 'modal__title',
          textContent: isNewBest ? '🏆 New Best!' : '🎉 Well Done!',
        }),
        createElement('p', {
          className: 'modal__subtitle',
          textContent: `You completed ${DIFFICULTY[state.difficulty].label} mode!`,
        }),
        createElement('div', { className: 'modal__stats' }, [
          createElement('div', { className: 'modal__stat' }, [
            createElement('div', { className: 'modal__stat-value', textContent: state.moves }),
            createElement('div', { className: 'modal__stat-label', textContent: 'Moves' }),
          ]),
          createElement('div', { className: 'modal__stat' }, [
            createElement('div', { className: 'modal__stat-value', textContent: formatTime(state.timer) }),
            createElement('div', { className: 'modal__stat-label', textContent: 'Time' }),
          ]),
          createElement('div', { className: 'modal__stat' }, [
            createElement('div', { className: 'modal__stat-value', textContent: score }),
            createElement('div', { className: 'modal__stat-label', textContent: 'Score' }),
          ]),
        ]),
        createElement('div', { className: 'modal__actions' }, [
          createElement('button', {
            className: 'btn btn--primary',
            textContent: '🔄 Play Again',
            id: 'btn-play-again',
            onClick: () => {
              overlay.remove();
              initGame(state.difficulty);
            },
          }),
          createElement('a', {
            className: 'btn btn--secondary',
            href: '#/',
            textContent: '🏠 Home',
            id: 'btn-go-home',
          }),
        ]),
      ]),
    ]);

    // Global Leaderboard
    const modal = overlay.querySelector('.modal');
    modal.style.overflowY = 'auto';
    modal.style.maxHeight = '80vh';
    createLeaderboardPanel(GAME_ID, state.difficulty, score)
      .then(panel => modal.appendChild(panel));

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  function render() {
    appEl.innerHTML = '';
    appEl.appendChild(createNavbar());

    const config = DIFFICULTY[state.difficulty];

    const page = createElement('main', { className: 'page' });
    const pageContent = createElement('div', { className: 'page-content' });
    const gameWrapper = createElement('div', { className: 'card-game', style: 'max-width: 800px; margin: 0 auto;' });

    // Header
    gameWrapper.appendChild(createElement('div', { className: 'card-game__header animate-fade-in', style: 'margin-bottom: 1.5rem;' }, [
      createElement('h1', { className: 'card-game__title', style: 'font-size: 1.5rem;' }, [
        createElement('span', { className: 'card-game__title-icon', textContent: '🃏' }),
        document.createTextNode('Card Matching'),
      ]),
    ]));

    // Difficulty selector
    const diffSelector = createElement('div', { className: 'difficulty-selector animate-fade-in' });
    Object.entries(DIFFICULTY).forEach(([key, val]) => {
      diffSelector.appendChild(createElement('button', {
        className: `difficulty-btn ${key === state.difficulty ? 'difficulty-btn--active' : ''}`,
        textContent: val.label,
        id: `diff-btn-${key}`,
        onClick: () => initGame(key),
      }));
    });
    gameWrapper.appendChild(diffSelector);

    // Card grid
    const grid = createElement('div', {
      className: `card-grid card-grid--${state.difficulty} stagger-children`,
      id: 'card-grid',
      style: 'margin-top: 1rem;'
    });

    state.cards.forEach((card, index) => {
      const cardEl = createElement('div', {
        className: 'memory-card animate-fade-in-scale',
        dataset: { cardIndex: index },
        onClick: () => handleCardClick(index),
      }, [
        createElement('div', { className: 'memory-card__back' }),
        createElement('div', { className: 'memory-card__front', textContent: card.emoji }),
      ]);

      grid.appendChild(cardEl);
    });

    gameWrapper.appendChild(grid);
    pageContent.appendChild(gameWrapper);

    const best = getBestScore(GAME_ID, state.difficulty);
    const statusBar = createElement('footer', { className: 'status-bar' }, [
      createElement('div', { className: 'status-bar__links' }, [
        createElement('span', { textContent: `MOVES: ` }, [
          createElement('span', { id: 'stat-moves', textContent: state.moves, style: 'color: var(--color-text-primary); font-weight: bold;' })
        ]),
        createElement('span', { textContent: `TIME: ` }, [
          createElement('span', { id: 'stat-timer', textContent: formatTime(state.timer), style: 'color: var(--color-text-primary); font-weight: bold;' })
        ]),
        createElement('span', { textContent: `PAIRS: ` }, [
          createElement('span', { id: 'stat-pairs', textContent: `${state.matchedPairs.size}/${config.pairs}`, style: 'color: var(--color-text-primary); font-weight: bold;' })
        ]),
      ]),
      createElement('div', { style: 'display: flex; gap: 1rem;' }, [
        createElement('span', { textContent: `BEST: ${best ? best.score : '—'}` })
      ])
    ]);

    page.appendChild(pageContent);
    page.appendChild(statusBar);
    appEl.appendChild(page);
  }

  // Initialize with easy difficulty
  initGame('easy');

  // Return cleanup function
  return () => {
    clearInterval(state.timerInterval);
    // Remove any lingering modals
    const modal = document.getElementById('win-modal');
    if (modal) modal.remove();
  };
}
