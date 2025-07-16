import FileRouter from "./fileRouter.js";

const router = new FileRouter('./pages');

export default async (state) => {
  const currentPath = state.path || '/';
  
  try {
    // Try exact match first
    let component = await router.loadPage(currentPath);
    let params = {};

    // If no exact match, try pattern matching for dynamic routes
    if (!component) {
      const routes = await router.discoverRoutes();
      for (const route of routes) {
        const matchedParams = router.matchRoute(currentPath, route);
        if (matchedParams !== null) {
          component = await router.loadPage(route);
          params = matchedParams;
          break;
        }
      }
    }

    if (component) {
      // Pass both state and route parameters to component
      const enhancedState = { ...state, params };
      return component(enhancedState);
    }

    // 404 fallback
    return { 
      tag: "div", 
      attr: { class: "error-404" },
      children: [
        { text: "404 - Page Not Found" },
        {
          tag: "a",
          attr: { 
            href: "/",
            onclick: (e) => {
              e.preventDefault();
              window.history.pushState({}, "", "/");
              state.enqueue({ type: "ROUTE_CHANGE", path: "/" });
            }
          },
          children: [{ text: "Go Home" }]
        }
      ]
    };
  } catch (error) {
    console.error('Routing error:', error);
    return { text: "Error loading page" };
  }
};
