import { describe, it, expect, vi } from 'vitest';
import { shuffleArray, formatTime, createElement } from './helpers.js';

describe('shuffleArray', () => {
  it('should return an array of the same length', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled.length).toBe(original.length);
  });

  it('should contain the exact same elements', () => {
    const original = ['A', 'B', 'C', 'D'];
    const shuffled = shuffleArray(original);
    expect(shuffled.sort()).toEqual([...original].sort());
  });

  it('should not mutate the original array', () => {
    const original = [1, 2, 3];
    shuffleArray(original);
    expect(original).toEqual([1, 2, 3]);
  });
});

describe('formatTime', () => {
  it('formats zero seconds perfectly', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats under a minute correctly', () => {
    expect(formatTime(45)).toBe('00:45');
    expect(formatTime(9)).toBe('00:09');
  });

  it('formats over a minute correctly', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(125)).toBe('02:05');
  });

  it('formats exactly one minute', () => {
    expect(formatTime(60)).toBe('01:00');
  });
});

describe('createElement', () => {
  it('creates an element with the correct tag', () => {
    const el = createElement('div');
    expect(el.tagName.toLowerCase()).toBe('div');
  });

  it('applies className and standard properties', () => {
    const el = createElement('span', { className: 'test-class', id: 'test-id' });
    expect(el.className).toBe('test-class');
    expect(el.id).toBe('test-id');
  });

  it('applies textContent correctly', () => {
    const el = createElement('p', { textContent: 'Hello World' });
    expect(el.textContent).toBe('Hello World');
  });

  it('attaches event listeners successfully', () => {
    const spy = vi.fn();
    const el = createElement('button', { onClick: spy });
    el.click();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('sets dataset properties correctly', () => {
    const el = createElement('div', { dataset: { targetId: '123' }});
    expect(el.dataset.targetId).toBe('123');
  });

  it('appends string children as TextNodes', () => {
    const el = createElement('div', {}, ['Child text']);
    expect(el.textContent).toBe('Child text');
    expect(el.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
  });

  it('appends actual DOM element children', () => {
    const inner = createElement('span', { className: 'inner' });
    const outer = createElement('div', {}, [inner]);
    
    expect(outer.children.length).toBe(1);
    expect(outer.children[0].className).toBe('inner');
  });
});
