/**
 * Card Matching game configuration.
 */

// Emoji sets for card faces
export const CARD_EMOJIS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🦄', '🐝', '🦋', '🐙', '🐳', '🦀', '🐠', '🌸',
];

export const DIFFICULTY = {
  easy: {
    label: 'Easy',
    pairs: 6,     // 12 cards (4×3)
    columns: 4,
  },
  medium: {
    label: 'Medium',
    pairs: 8,     // 16 cards (4×4)
    columns: 4,
  },
  hard: {
    label: 'Hard',
    pairs: 12,    // 24 cards (6×4)
    columns: 6,
  },
};
