import { describe, it, expect, beforeEach } from 'vitest';
import { renderJourney } from './journey.js';

function createAppContainer() {
    const appEl = document.createElement('div');
    appEl.id = 'app';
    document.body.appendChild(appEl);
    return appEl;
}

describe('Journey page renderer', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        window.location.hash = '';
    });

    it('renders the journey page with a timeline and status bar', () => {
        const appEl = createAppContainer();
        renderJourney(appEl);

        expect(appEl.querySelector('.navbar')).not.toBeNull();
        const title = appEl.querySelector('.journey__title');
        expect(title).not.toBeNull();
        expect(title.textContent).toContain('System Log');
        expect(appEl.querySelectorAll('.timeline__entry').length).toBe(5);
        expect(appEl.querySelector('.status-bar__link')).not.toBeNull();
    });

    it('includes a back link pointing to the home route', () => {
        const appEl = createAppContainer();
        renderJourney(appEl);

        const backLink = appEl.querySelector('.status-bar__link');
        expect(backLink).not.toBeNull();
        expect(backLink.getAttribute('href')).toBe('#/');
    });
});
