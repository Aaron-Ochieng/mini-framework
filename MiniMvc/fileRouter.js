class FileRouter {
  constructor(pagesDir = './pages') {
    this.pagesDir = pagesDir;
    this.routeCache = new Map();
    this.moduleCache = new Map();
  }

  // Convert file path to route path
  pathToRoute(filePath) {
    return filePath
      .replace(/^\.\/pages/, '')
      .replace(/\.js$/, '')
      .replace(/\/index$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1') // [id] -> :id for params
      || '/';
  }

  // Convert route path to file path
  routeToPath(route) {
    const normalized = route === '/' ? '/index' : route;
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

  // Get available routes (for development/debugging)
  async discoverRoutes() {
    // This would need to be implemented based on build system
    // For now, return common patterns
    return [
      '/',
      '/about',
      '/contact',
      '/users/:id'
    ];
  }
}

export default FileRouter;