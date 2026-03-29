/**
 * Simple hash-based SPA router for Memory Games Suite.
 * No framework dependencies — just plain JS.
 */

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentCleanup = null;

    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes.find(r => r.path === hash) || this.routes.find(r => r.path === '*');

    if (route) {
      // Clean up previous page if needed
      if (this.currentCleanup && typeof this.currentCleanup === 'function') {
        this.currentCleanup();
      }

      const app = document.getElementById('app');
      this.currentCleanup = route.render(app);

      // Scroll to top on navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Navigate to a hash route programmatically.
   */
  static navigate(path) {
    window.location.hash = path;
  }
}
