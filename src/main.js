/**
 * Memory Games Suite — Main entry point.
 *
 * This is the app's starting point. It imports styles,
 * sets up the router, and maps routes to pages.
 */

// Styles
import './styles/global.css';
import './styles/components.css';
import './styles/games.css';

// Router
import { Router } from './router.js';

// Pages
import { renderHome } from './pages/home.js';
import { renderJourney } from './pages/journey.js';

// Games
import { renderCardMatch } from './games/card-match/index.js';
import { NumberMemory } from './games/number-memory/index.js';
import { WordMemory } from './games/word-memory/index.js';
import { PokerMemory } from './games/poker-memory/index.js';

// Initialize the router
const router = new Router([
  { path: '/', render: renderHome },
  { path: '/journey', render: renderJourney },
  { path: '/games/card-match', render: renderCardMatch },
  { path: '/games/number-memory', render: container => NumberMemory.init(container) },
  { path: '/games/word-memory', render: container => WordMemory.init(container) },
  { path: '/games/poker-memory', render: container => PokerMemory.init(container) },
  { path: '*', render: renderHome }, // fallback
]);
