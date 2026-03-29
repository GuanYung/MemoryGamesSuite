import { describe, it, expect, beforeEach } from 'vitest';
import { createNavbar } from './navbar.js';

describe('Navbar component', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        window.location.hash = '';
    });

    it('renders the correct navigation links', () => {
        const nav = createNavbar();
        document.body.appendChild(nav);

        const links = [...document.querySelectorAll('.navbar__link')];
        expect(links.length).toBe(2);
        expect(links[0].textContent).toBe('Games');
        expect(links[1].textContent).toBe('Journey');
        expect(links[0].getAttribute('href')).toBe('#/');
        expect(links[1].getAttribute('href')).toBe('#/journey');
    });

    it('marks the active route based on the hash', () => {
        window.location.hash = '#/journey';
        const nav = createNavbar();
        document.body.appendChild(nav);

        const activeLink = document.querySelector('.navbar__link--active');
        expect(activeLink).not.toBeNull();
        expect(activeLink.textContent).toBe('Journey');
    });

    it('toggles the mobile nav menu when hamburger is clicked', () => {
        const nav = createNavbar();
        document.body.appendChild(nav);

        const navLinks = document.getElementById('navbar-nav');
        const hamburger = document.getElementById('navbar-hamburger');

        expect(navLinks.classList.contains('navbar__nav--open')).toBe(false);
        hamburger.click();
        expect(navLinks.classList.contains('navbar__nav--open')).toBe(true);
        hamburger.click();
        expect(navLinks.classList.contains('navbar__nav--open')).toBe(false);
    });
});
