/**
 * Shared helper utilities.
 */

/**
 * Shuffle an array using Fisher-Yates algorithm.
 */
export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Format seconds into mm:ss display.
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Create a DOM element with properties.
 */
export function createElement(tag, props = {}, children = []) {
  const el = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'innerHTML') {
      el.innerHTML = value;
    } else if (key === 'textContent') {
      el.textContent = value;
    } else if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dk, dv]) => {
        el.dataset[dk] = dv;
      });
    } else {
      el.setAttribute(key, value);
    }
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child) {
      el.appendChild(child);
    }
  });

  return el;
}

/**
 * Generate random confetti burst.
 */
export function createConfetti(container) {
  const colors = ['#7c3aed', '#06b6d4', '#ec4899', '#f97316', '#10b981', '#f59e0b'];
  const celebration = createElement('div', { className: 'celebration' });

  for (let i = 0; i < 50; i++) {
    const piece = createElement('div', { className: 'confetti-piece' });
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `${-10 + Math.random() * 20}px`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    celebration.appendChild(piece);
  }

  container.appendChild(celebration);
  setTimeout(() => celebration.remove(), 3000);
}
