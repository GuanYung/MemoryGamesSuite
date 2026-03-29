/**
 * Navbar component.
 */
import { createElement } from '../utils/helpers.js';

export function createNavbar() {
  const currentHash = window.location.hash.slice(1) || '/';

  const links = [
    { label: 'Games', path: '/' },
    { label: 'Journey', path: '/journey' },
  ];

  const navLinks = createElement('nav', {
    className: 'navbar__nav',
    id: 'navbar-nav',
  }, links.map(link =>
    createElement('a', {
      className: `navbar__link ${currentHash === link.path ? 'navbar__link--active' : ''}`,
      href: `#${link.path}`,
      textContent: link.label,
      id: `nav-link-${link.label.toLowerCase()}`,
    })
  ));

  const hamburger = createElement('button', {
    className: 'navbar__hamburger',
    id: 'navbar-hamburger',
    'aria-label': 'Toggle menu',
    onClick: () => {
      navLinks.classList.toggle('navbar__nav--open');
    },
  }, [
    createElement('span'),
    createElement('span'),
    createElement('span'),
  ]);

  const logo = createElement('a', {
    className: 'navbar__logo',
    href: '#/',
    id: 'navbar-logo',
  }, [
    createElement('div', { className: 'navbar__logo-icon', textContent: '🧠' }),
    createElement('span', { textContent: 'MemoryGames' }),
  ]);

  return createElement('header', { className: 'navbar' }, [
    logo,
    navLinks,
    hamburger,
  ]);
}
