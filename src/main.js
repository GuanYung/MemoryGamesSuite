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

// Initialize the router
const router = new Router([
  { path: '/', render: renderHome },
  { path: '/journey', render: renderJourney },
  { path: '/games/card-match', render: renderCardMatch },
  // Future games will be added here:
  // { path: '/games/number-memory', render: renderNumberMemory },
  // { path: '/games/word-memory', render: renderWordMemory },
  // { path: '/games/poker-memory', render: renderPokerMemory },
  { path: '*', render: renderHome }, // fallback
]);
