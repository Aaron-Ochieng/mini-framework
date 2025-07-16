import FileRouter from "./fileRouter.js";

const router = new FileRouter('./pages');

export default async (state) => {
  console.log('viewRoute called with state:', state);
  const currentPath = state.path || '/';
  
  try {
    let component = await router.loadPage(currentPath);
    let params = {};

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
      const enhancedState = { ...state, params };
      console.log('Component found, calling with state:', enhancedState);
      const result = component(enhancedState);
      console.log('Component returned:', result);
      return result;
    }

    console.log('No component found, returning 404');
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
    return { 
      tag: "div",
      attr: { class: "error" },
      children: [{ text: "Error loading page: " + error.message }]
    };
  }
};
