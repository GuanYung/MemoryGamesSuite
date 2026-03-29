export const NUMBER_MODE = {
  SINGLE: 'single', // Single digits (0-9)
  DOUBLE: 'double'  // Two digits (00-99)
};

export const PROGRESSION = {
  FIXED: 'fixed',
  PROGRESSIVE: 'progressive'
};

/**
 * Generates a random sequence of numbers based on mode and length.
 * 
 * @param {string} mode - 'single' or 'double'
 * @param {number} length - the number of items to generate
 * @returns {Array<string>}
 */
export function generateSequence(mode, length) {
  const sequence = [];
  for (let i = 0; i < length; i++) {
    if (mode === NUMBER_MODE.SINGLE) {
      // 0 to 9
      sequence.push(String(Math.floor(Math.random() * 10)));
    } else {
      // 00 to 99
      sequence.push(String(Math.floor(Math.random() * 100)).padStart(2, '0'));
    }
  }
  return sequence;
}
