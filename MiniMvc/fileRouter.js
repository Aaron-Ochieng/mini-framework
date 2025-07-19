class FileRouter {
  constructor(pagesDir = './pages') {
    this.pagesDir = pagesDir;
    this.routeCache = new Map();
    this.moduleCache = new Map();
  }

  // Discover routes from file system structure
  async discoverRoutes() {
    // Try to load common routes and see which ones exist
    const potentialRoutes = [
      '/',
      '/about',
      '/contact',
      '/user/:id',
      '/posts/:slug'
    ];

    const existingRoutes = [];
    
    for (const route of potentialRoutes) {
      // For parameterized routes, check if the base file exists
      if (route.includes(':')) {
        const baseRoute = route.split(':')[0].slice(0, -1); // Remove trailing slash before param
        const testPath = this.routeToPath(baseRoute === '' ? '/user' : baseRoute);
        try {
          const fullPath = new URL(testPath, window.location.origin).pathname;
          await import(fullPath);
          existingRoutes.push(route);
        } catch (error) {
          // Route doesn't exist, skip it
        }
      } else {
        try {
          const testPath = this.routeToPath(route);
          const fullPath = new URL(testPath, window.location.origin).pathname;
          await import(fullPath);
          existingRoutes.push(route);
        } catch (error) {
          // Route doesn't exist, skip it
        }
      }
    }

    return existingRoutes;
  }

  // Convert route path to file path
  routeToPath(route) {
    let normalized = route === '/' ? '/index' : route;
    // Remove parameters from path for file lookup
    normalized = normalized.split(':')[0].replace(/\/$/, '') || '/index';
    return `${this.pagesDir}${normalized}.js`;
  }

  // Dynamically import a page component
  async loadPage(route) {
    const filePath = this.routeToPath(route);
    
    if (this.moduleCache.has(filePath)) {
      return this.moduleCache.get(filePath);
    }

    try {
      const module = await import(filePath);
      const component = module.default;
      this.moduleCache.set(filePath, component);
      return component;
    } catch (error) {
      console.warn(`Failed to load page: ${filePath}`, error);
      return null;
    }
  }

  // Match route with parameters
  matchRoute(requestPath, registeredRoute) {
    const requestSegments = requestPath.split('/').filter(Boolean);
    const routeSegments = registeredRoute.split('/').filter(Boolean);

    // Handle root route
    if (requestPath === '/' && registeredRoute === '/') {
      return {};
    }

    if (requestSegments.length !== routeSegments.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const requestSegment = requestSegments[i];

      if (routeSegment.startsWith(':')) {
        params[routeSegment.slice(1)] = requestSegment;
      } else if (routeSegment !== requestSegment) {
        return null;
      }
    }

    return params;
  }
}

export default FileRouter;
