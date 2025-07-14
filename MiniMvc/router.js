import domParser from "./domParser.js";

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.params = {};
    this.onRouteChange = null;
  }

  // Register a route with its component loader
  addRoute(path, componentLoader) {
    this.routes.set(path, componentLoader);
  }

  // Parse route pattern and extract parameters
  parseRoute(pattern, pathname) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = pathname.split('/').filter(Boolean);
    
    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      
      if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
        const paramName = patternPart.slice(1, -1);
        params[paramName] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }
    
    return params;
  }

  // Find matching route for current pathname
  matchRoute(pathname) {
    for (const [pattern, loader] of this.routes) {
      const params = this.parseRoute(pattern, pathname);
      if (params !== null) {
        return { pattern, loader, params };
      }
    }
    return null;
  }

  // Navigate to a new route
  async navigate(path, pushState = true) {
    const match = this.matchRoute(path);
    if (!match) {
      console.warn(`No route found for ${path}`);
      return;
    }

    if (pushState) {
      history.pushState(null, '', path);
    }

    this.currentRoute = match.pattern;
    this.params = match.params;

    try {
      const component = await match.loader();
      if (this.onRouteChange) {
        this.onRouteChange(component, this.params);
      }
    } catch (error) {
      console.error(`Failed to load route ${path}:`, error);
    }
  }

  // Initialize router with current URL
  init(onRouteChange) {
    this.onRouteChange = onRouteChange;
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    // Navigate to current URL
    this.navigate(window.location.pathname, false);
  }
}

export const router = new Router();

// Helper function to register file-based routes
export function registerRoutes(routeMap) {
  for (const [path, filePath] of Object.entries(routeMap)) {
    router.addRoute(path, () => import(filePath));
  }
}

// Navigation helper
export function navigateTo(path) {
  router.navigate(path);
}