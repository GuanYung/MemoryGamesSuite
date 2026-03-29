/**
 * Home page — Landing with hero section and game selection grid.
 */
import { createElement } from '../utils/helpers.js';
import { createNavbar } from '../components/navbar.js';
import { getTotalGamesPlayed } from '../utils/storage.js';

const GAMES = [
  {
    id: 'card-match',
    title: 'Card Matching',
    desc: 'Flip cards and match pairs. Test your visual memory with increasing difficulty levels.',
    icon: '🃏',
    theme: 'purple',
    status: 'available',
    path: '/games/card-match',
  },
  {
    id: 'number-memory',
    title: 'Number Memory',
    desc: 'Memorize increasingly longer number sequences. How far can you go?',
    icon: '🔢',
    theme: 'pink',
    status: 'available',
    path: '/games/number-memory',
  },
  {
    id: 'word-memory',
    title: 'Word Memory',
    desc: 'Remember and recall words from a growing list. Challenge your verbal memory.',
    icon: '📝',
    theme: 'green',
    status: 'available',
    path: '/games/word-memory',
  },
  {
    id: 'poker-memory',
    title: 'Poker Card Memory',
    desc: 'Memorize and recall a precise sequence of playing cards. A high-stakes test of sequential recall.',
    icon: '♠️',
    theme: 'warm',
    status: 'available',
    path: '/games/poker-memory',
  },
];

function createGameCard(game) {
  const isAvailable = game.status === 'available';

  const card = createElement('button', {
    className: `game-card game-card--${game.theme} animate-fade-in-up`,
    style: 'padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;',
    id: `game-card-${game.id}`,
    onClick: () => {
      if (isAvailable) {
        window.location.hash = game.path;
      }
    },
  }, [
    createElement('div', { 
      className: 'game-card__icon', 
      textContent: game.icon,
      style: 'width: 48px; height: 48px; min-width: 48px; margin-bottom: 0;'
    }),
    createElement('div', { style: 'flex: 1;' }, [
      createElement('h3', { className: 'game-card__title', textContent: game.title, style: 'font-size: 1.1rem; margin-bottom: 0.25rem;' }),
      createElement('p', { className: 'game-card__desc', textContent: game.desc, style: 'font-size: 0.8rem; margin-bottom: 0.75rem; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;' }),
      createElement('div', { className: 'game-card__meta' }, [
        createElement('span', {
          className: `game-card__badge ${isAvailable ? 'game-card__badge--available' : 'game-card__badge--coming'}`,
          textContent: isAvailable ? 'Play Now' : 'Soon',
          style: 'padding: 2px 8px; font-size: 0.7rem;'
        }),
      ]),
    ])
  ]);

  if (!isAvailable) {
    card.style.opacity = '0.5';
    card.style.cursor = 'default';
  }

  return card;
}

export function renderHome(appEl) {
  const totalPlayed = getTotalGamesPlayed();

  appEl.innerHTML = '';
  appEl.appendChild(createNavbar());

  const page = createElement('main', { className: 'page' });
  const pageContent = createElement('div', { className: 'page-content' });

  // Dashboard Header (Simplified Hero)
  const dashboardHeader = createElement('header', { 
    className: 'animate-fade-in',
    style: 'display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;'
  }, [
    createElement('div', { 
      style: 'color: var(--color-accent-blue); text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: bold;' 
    }, 'System: Memory Suite v1.0.4'),
    createElement('h1', { 
      className: 'hero__title', 
      style: 'font-size: 2.5rem; text-align: left; margin: 0;' 
    }, [
      document.createTextNode('Welcome back, '),
      createElement('span', { className: 'hero__title-gradient', textContent: 'Commander' }),
    ]),
    createElement('p', {
      style: 'color: var(--color-text-secondary); max-width: 600px;',
      textContent: 'Select a training module to begin your cognitive exercise.',
    }),
  ]);

  // Main Dashboard Grid
  const dashboardGrid = createElement('div', { 
    style: 'display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;' 
  }, GAMES.map(createGameCard));

  pageContent.appendChild(dashboardHeader);
  pageContent.appendChild(dashboardGrid);

  // Status Bar
  const statusBar = createElement('footer', { className: 'status-bar' }, [
    createElement('div', { className: 'status-bar__links' }, [
      createElement('span', { textContent: `[ STATUS: READY ]`, style: 'color: var(--color-accent-green);' }),
      createElement('span', { textContent: `[ GAMES PLAYED: ${totalPlayed} ]` }),
    ]),
    createElement('div', { style: 'display: flex; gap: 1.5rem;' }, [
      createElement('a', { className: 'status-bar__link', href: 'https://github.com/GuanYung', target: '_blank', textContent: 'SOURCE' }),
      createElement('span', { textContent: `© ${new Date().getFullYear()}` }),
    ]),
  ]);

  page.appendChild(pageContent);
  page.appendChild(statusBar);
  appEl.appendChild(page);

  return null;
}
