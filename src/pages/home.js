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
    status: 'coming',
    path: '/games/number-memory',
  },
  {
    id: 'word-memory',
    title: 'Word Memory',
    desc: 'Remember and recall words from a growing list. Challenge your verbal memory.',
    icon: '📝',
    theme: 'green',
    status: 'coming',
    path: '/games/word-memory',
  },
  {
    id: 'poker-memory',
    title: 'Poker Card Memory',
    desc: 'Memorize poker hands, suits, and sequences. A card shark\'s ultimate test.',
    icon: '♠️',
    theme: 'warm',
    status: 'coming',
    path: '/games/poker-memory',
  },
];

function createGameCard(game) {
  const isAvailable = game.status === 'available';

  const card = createElement('button', {
    className: `game-card game-card--${game.theme} animate-fade-in-up`,
    id: `game-card-${game.id}`,
    onClick: () => {
      if (isAvailable) {
        window.location.hash = game.path;
      }
    },
  }, [
    createElement('div', { className: 'game-card__icon', textContent: game.icon }),
    createElement('h3', { className: 'game-card__title', textContent: game.title }),
    createElement('p', { className: 'game-card__desc', textContent: game.desc }),
    createElement('div', { className: 'game-card__meta' }, [
      createElement('span', {
        className: `game-card__badge ${isAvailable ? 'game-card__badge--available' : 'game-card__badge--coming'}`,
        textContent: isAvailable ? '● Play Now' : '◌ Coming Soon',
      }),
    ]),
  ]);

  if (!isAvailable) {
    card.style.opacity = '0.6';
    card.style.cursor = 'default';
  }

  return card;
}

export function renderHome(appEl) {
  const totalPlayed = getTotalGamesPlayed();

  appEl.innerHTML = '';
  appEl.appendChild(createNavbar());

  const page = createElement('main', { className: 'page container' });

  // Hero
  const hero = createElement('section', { className: 'hero', id: 'hero-section' }, [
    createElement('div', {
      className: 'hero__badge',
      innerHTML: '✨ <span>Free & Open Source Brain Training</span>',
    }),
    createElement('h1', { className: 'hero__title' }, [
      document.createTextNode('Train Your '),
      createElement('span', { className: 'hero__title-gradient', textContent: 'Memory' }),
    ]),
    createElement('p', {
      className: 'hero__subtitle',
      textContent: 'Challenge yourself with a collection of memory games designed to sharpen your mind. Track your progress and compete with yourself.',
    }),
    createElement('div', { className: 'hero__actions' }, [
      createElement('a', {
        className: 'btn btn--primary btn--lg',
        href: '#/games/card-match',
        id: 'hero-play-btn',
        textContent: '🎮  Start Playing',
      }),
      createElement('a', {
        className: 'btn btn--secondary btn--lg',
        href: '#/journey',
        id: 'hero-journey-btn',
        textContent: '📖  My Journey',
      }),
    ]),
  ]);

  // Stats pill
  if (totalPlayed > 0) {
    const statsPill = createElement('div', {
      className: 'hero__badge',
      style: 'margin-top: 1.5rem;',
      textContent: `🏆 ${totalPlayed} game${totalPlayed !== 1 ? 's' : ''} played so far`,
    });
    hero.appendChild(statsPill);
  }

  // Games section
  const gamesSection = createElement('section', { id: 'games-section' }, [
    createElement('div', { className: 'section-header' }, [
      createElement('span', { className: 'section-header__tag', textContent: 'Games' }),
      createElement('h2', { className: 'section-header__title', textContent: 'Choose Your Challenge' }),
      createElement('p', {
        className: 'section-header__subtitle',
        textContent: 'Each game targets different aspects of memory. Start with Card Matching and unlock more games as we grow!',
      }),
    ]),
    createElement('div', { className: 'games-grid stagger-children' },
      GAMES.map(createGameCard)
    ),
  ]);

  page.appendChild(hero);
  page.appendChild(gamesSection);

  // Footer
  const footer = createElement('footer', { className: 'footer' }, [
    createElement('div', { className: 'footer__links' }, [
      createElement('a', {
        className: 'footer__link',
        href: '#/',
        textContent: 'Games',
      }),
      createElement('a', {
        className: 'footer__link',
        href: '#/journey',
        textContent: 'Journey',
      }),
      createElement('a', {
        className: 'footer__link',
        href: 'https://github.com/GuanYung',
        target: '_blank',
        rel: 'noopener',
        textContent: 'GitHub',
      }),
    ]),
    createElement('p', { textContent: `© ${new Date().getFullYear()} Memory Games Suite. Built with ❤️ and vanilla JS.` }),
  ]);

  page.appendChild(footer);
  appEl.appendChild(page);

  return null; // no cleanup needed
}
