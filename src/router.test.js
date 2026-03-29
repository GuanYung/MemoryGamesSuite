import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Router } from './router.js';

describe('SPA Router', () => {

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<div id="app"></div>';
    
    // Clear URL hash
    window.location.hash = '';

    // Mock scrollTo to avoid errors in JSDOM
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('navigates to the correct route based on the hash', () => {
    const homeSpy = vi.fn();
    const aboutSpy = vi.fn();

    const routes = [
      { path: '/', render: homeSpy },
      { path: '/about', render: aboutSpy },
    ];

    // Initialize the router
    const router = new Router(routes);
    // Explicitly trigger resolution since JSDOM might map load events differently
    router.resolve();

    // Initial load without hash should default to '/'
    expect(homeSpy).toHaveBeenCalledOnce();
    const appEl = homeSpy.mock.calls[0][0];
    expect(appEl.id).toBe('app');

    // Route to /about
    window.location.hash = '#/about';
    // Trigger the hashchange manually as JSDOM doesn't do it instantly sometimes
    window.dispatchEvent(new Event('hashchange'));

    expect(aboutSpy).toHaveBeenCalledOnce();
  });

  it('uses the fallback * route when hash does not match', () => {
    const fallbackSpy = vi.fn();

    const routes = [
      { path: '/', render: vi.fn() },
      { path: '*', render: fallbackSpy },
    ];

    const router = new Router(routes);

    window.location.hash = '#/does-not-exist';
    router.resolve();

    expect(fallbackSpy).toHaveBeenCalledOnce();
  });

  it('calls the cleanup function of the previous route', () => {
    const cleanupSpy = vi.fn();
    const route1Spy = vi.fn(() => cleanupSpy); // route 1 returns a cleanup fn
    const route2Spy = vi.fn();

    const routes = [
      { path: '/1', render: route1Spy },
      { path: '/2', render: route2Spy },
    ];

    const router = new Router(routes);

    // Navigate to 1
    window.location.hash = '#/1';
    router.resolve();
    expect(route1Spy).toHaveBeenCalledOnce();

    // Navigate to 2
    window.location.hash = '#/2';
    router.resolve();
    
    // Cleanup for route 1 should run
    expect(cleanupSpy).toHaveBeenCalledOnce();
    expect(route2Spy).toHaveBeenCalledOnce();
  });

  it('provides a static navigate method', () => {
    Router.navigate('/new-path');
    expect(window.location.hash).toBe('#/new-path');
  });

});
