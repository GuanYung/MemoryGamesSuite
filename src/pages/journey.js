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
    date: 'Coming Soon',
    title: '🔢 Number Memory',
    content: 'Next up: a number memory game where sequences get longer and longer. Planning to build this to strengthen my understanding of game state and timing mechanics.',
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

  const page = createElement('main', { className: 'page container' });

  const journey = createElement('div', { className: 'journey' }, [
    // Back button
    createElement('a', {
      className: 'back-btn',
      href: '#/',
      innerHTML: '← Back to Games',
    }),

    // Hero
    createElement('div', { className: 'journey__hero animate-fade-in' }, [
      createElement('h1', { className: 'journey__title', textContent: 'My Journey' }),
      createElement('p', {
        className: 'journey__intro',
        textContent: 'This project is more than just a collection of games — it\'s my story of learning, building, and growing as a developer. Every feature represents a lesson learned and a challenge overcome.',
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

  page.appendChild(journey);
  appEl.appendChild(page);

  return null;
}
