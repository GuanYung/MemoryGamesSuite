import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveScore, getScores, getBestScore, getTotalGamesPlayed } from './storage.js';

describe('Storage utilities', () => {

  beforeEach(() => {
    // Clear localStorage before every test to ensure a clean slate
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initially returns empty arrays for scores', () => {
    expect(getScores('card-match', 'easy')).toEqual([]);
    expect(getBestScore('test-game', 'hard')).toBeNull();
  });

  it('saves a score properly under the correct game and difficulty key', () => {
    saveScore('card-match', 'easy', 45);
    const scores = getScores('card-match', 'easy');
    
    expect(scores.length).toBe(1);
    expect(scores[0].score).toBe(45);
    expect(scores[0].date).toBeDefined();
  });

  it('sorts the top scores correctly (lower is better)', () => {
    saveScore('test-game', 'medium', 100);
    saveScore('test-game', 'medium', 50);
    saveScore('test-game', 'medium', 75);

    const scores = getScores('test-game', 'medium');
    
    expect(scores.length).toBe(3);
    // Lower score should be first
    expect(scores[0].score).toBe(50);
    expect(scores[1].score).toBe(75);
    expect(scores[2].score).toBe(100);
  });

  it('keeps exactly the top 5 scores when more are added', () => {
    saveScore('top5-test', 'hard', 100);
    saveScore('top5-test', 'hard', 110);
    saveScore('top5-test', 'hard', 120);
    saveScore('top5-test', 'hard', 80);
    saveScore('top5-test', 'hard', 90);
    
    // We have 5 scores now: 80, 90, 100, 110, 120
    let scores = getScores('top5-test', 'hard');
    expect(scores.length).toBe(5);

    // Save a new best score
    saveScore('top5-test', 'hard', 50);
    scores = getScores('top5-test', 'hard');
    
    // Still 5 scores
    expect(scores.length).toBe(5);
    // 50 should be first, and 120 should be dropped
    expect(scores[0].score).toBe(50);
    expect(scores[4].score).toBe(110);
  });

  it('correctly returns the best score using getBestScore', () => {
    saveScore('best-test', 'easy', 800);
    saveScore('best-test', 'easy', 200);

    const best = getBestScore('best-test', 'easy');
    expect(best).not.toBeNull();
    expect(best.score).toBe(200);
  });

  it('accurately counts total games played across different games and difficulties', () => {
    expect(getTotalGamesPlayed()).toBe(0);

    saveScore('game1', 'easy', 10);
    saveScore('game1', 'hard', 20);
    saveScore('game2', 'medium', 30);

    expect(getTotalGamesPlayed()).toBe(3);
  });

  it('gracefully handles JSON parsing errors if storage is corrupted', () => {
    localStorage.setItem('memory_games_suite', '{ invalid_json ]');
    
    // Should fallback to empty state rather than crash
    expect(getScores('bad-data', 'easy')).toEqual([]);
    expect(getTotalGamesPlayed()).toBe(0);
  });
});
