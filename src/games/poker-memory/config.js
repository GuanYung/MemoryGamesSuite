/**
 * Poker Card Memory Game Configuration
 */

export const SUITS = [
  { id: 'spades', name: 'Spades', icon: '♠️', color: 'var(--color-text-primary)' },
  { id: 'hearts', name: 'Hearts', icon: '♥️', color: 'var(--color-error)' },
  { id: 'diamonds', name: 'Diamonds', icon: '♦️', color: 'var(--color-error)' },
  { id: 'clubs', name: 'Clubs', icon: '♣️', color: 'var(--color-text-primary)' }
];

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const GAME_CONSTANTS = {
  DEFAULT_LENGTH: 5,
  MEMORIZE_TIME_PER_CARD: 2000, // ms
};
