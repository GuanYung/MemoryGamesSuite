/**
 * Word Memory Game Configuration
 */

export const INITIAL_WORDS = [
  'apple', 'beach', 'cactus', 'desert', 'eagle', 'forest', 'garden', 'haven', 'island', 'jungle',
  'koala', 'lagoon', 'mountain', 'nature', 'ocean', 'palm', 'quartz', 'river', 'sunset', 'tiger',
  'valley', 'water', 'xenon', 'yellow', 'zebra', 'acorn', 'balloon', 'castle', 'dolphin', 'earth',
  'flame', 'galaxy', 'honey', 'igloo', 'jacket', 'knight', 'lemon', 'meteor', 'nebula', 'orange',
  'planet', 'quiver', 'rocket', 'silver', 'tunnel', 'unique', 'velvet', 'winter', 'yellow', 'zenith',
  'anchor', 'bridge', 'candle', 'dragon', 'engine', 'frost', 'glacier', 'hammer', 'ivory', 'joker',
  'kingdom', 'lunar', 'mirror', 'narrow', 'orient', 'pinnacle', 'quest', 'rapid', 'shadow', 'timber',
  'uphill', 'vortex', 'wizard', 'x-ray', 'yacht', 'zodiac', 'artist', 'beacon', 'clover', 'dancer',
  'emblem', 'fossil', 'geyser', 'helmet', 'impact', 'journey', 'kernel', 'legend', 'mantle', 'notion',
  'object', 'player', 'quality', 'rhythm', 'spirit', 'theory', 'urgent', 'vision', 'wisdom', 'yield',
  'active', 'brave', 'clever', 'direct', 'eager', 'famous', 'gentle', 'honest', 'inner', 'joyful',
  'kind', 'loyal', 'modern', 'noble', 'open', 'pure', 'quick', 'rare', 'solid', 'true', 'urban', 'vivid',
  'warm', 'young', 'zesty'
];

export const GAME_CONSTANTS = {
  MIN_SEEN_RATIO: 0.3, // Chance of showing a "seen" word vs a new one
  MAX_SEEN_RATIO: 0.6, // As you go further, increase the "seen" frequency
  STARTING_POOL: 5,
};
