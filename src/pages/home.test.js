import { describe, it, expect, beforeEach } from 'vitest';
import { renderHome } from './home.js';

function createAppContainer() {
    const appEl = document.createElement('div');
    appEl.id = 'app';
    document.body.appendChild(appEl);
    return appEl;
}

describe('Home page renderer', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        window.location.hash = '';
        localStorage.clear();
    });

    it('renders the home page with navbar and game cards', () => {
        const appEl = createAppContainer();
        renderHome(appEl);

        expect(appEl.querySelector('.navbar')).not.toBeNull();
        expect(appEl.querySelector('.hero__title')).not.toBeNull();
        expect(appEl.querySelectorAll('[id^="game-card-"]').length).toBe(4);
    });

    it('updates the hash when a playable game card is clicked', () => {
        const appEl = createAppContainer();
        renderHome(appEl);

        const card = appEl.querySelector('#game-card-card-match');
        expect(card).not.toBeNull();
        card.click();
        expect(window.location.hash).toBe('#/games/card-match');
    });
});
