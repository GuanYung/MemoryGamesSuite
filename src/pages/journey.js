/**
 * Journey page — Your dev story timeline.
 */
import { createElement } from '../utils/helpers.js';
import { createNavbar } from '../components/navbar.js';

const TIMELINE_ENTRIES = [
  {
    date: 'March 2026',
    title: '🚀 The Beginning',
    content: 'Decided to build a Memory Games Suite as a portfolio project and a way to learn web development. The goal: create something fun that people can actually play, while growing my skills along the way.',
  },
  {
    date: 'March 2026',
    title: '🃏 First Game — Card Matching',
    content: 'Built the Card Matching game with 3D flip animations, multiple difficulty levels, and local score tracking. Learned about CSS 3D transforms, vanilla JavaScript state management, and responsive design.',
  },
  {
    date: 'March 2026',
    title: '🔢 Number Memory Added',
    content: 'Built a highly customizable Number Memory game. Implemented advanced configurations so players can choose between Single Digits or Double Digits, and decide whether they want a fixed-length memory test or an infinitely scaling progressive level-up challenge. Also added an automated testing suite using Vitest achieving 81% code coverage before launching this game.',
  },
  {
    date: 'Future',
    title: '🔐 User Accounts & Leaderboards',
    content: 'Planning to add a Python FastAPI backend for user authentication and global leaderboards. This will let players compete with each other and track their progress over time.',
  },
  {
    date: 'Future',
    title: '🌍 Community & Social Features',
    content: 'The dream: a community of memory game enthusiasts who challenge each other, share strategies, and push their cognitive abilities. One step at a time!',
  },
];

export function renderJourney(appEl) {
  appEl.innerHTML = '';
  appEl.appendChild(createNavbar());

  const page = createElement('main', { className: 'page' });
  const pageContent = createElement('div', { className: 'page-content' });

  const journey = createElement('div', { 
    className: 'journey',
    style: 'max-width: 800px; margin: 0 auto;'
  }, [
    // Hero
    createElement('div', { className: 'journey__hero animate-fade-in', style: 'margin-bottom: 3rem;' }, [
      createElement('h1', { className: 'journey__title', textContent: 'System Log: Development Journey' }),
      createElement('p', {
        className: 'journey__intro',
        style: 'color: var(--color-text-secondary);',
        textContent: 'Loading developmental chronicles... Every feature represents a lesson learned and a challenge overcome.',
      }),
    ]),

    // Timeline
    createElement('div', { className: 'timeline stagger-children' },
      TIMELINE_ENTRIES.map(entry =>
        createElement('div', { className: 'timeline__entry animate-fade-in-up' }, [
          createElement('div', { className: 'timeline__dot' }),
          createElement('span', { className: 'timeline__date', textContent: entry.date }),
          createElement('h3', { className: 'timeline__title', textContent: entry.title }),
          createElement('p', { className: 'timeline__content', textContent: entry.content }),
        ])
      )
    ),
  ]);

  const statusBar = createElement('footer', { className: 'status-bar' }, [
    createElement('div', { className: 'status-bar__links' }, [
      createElement('span', { textContent: `[ LOG ANALYZER: ACTIVE ]`, style: 'color: var(--color-accent-blue);' }),
    ]),
    createElement('div', { style: 'display: flex; gap: 1.5rem;' }, [
      createElement('a', { className: 'status-bar__link', href: '#/', textContent: 'BACK TO TERMINAL' }),
    ]),
  ]);

  pageContent.appendChild(journey);
  page.appendChild(pageContent);
  page.appendChild(statusBar);
  appEl.appendChild(page);

  return null;
}
