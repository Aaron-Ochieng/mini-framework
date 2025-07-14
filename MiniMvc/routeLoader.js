import domParser from "./domParser.js";

// Load and parse route component
export async function loadRouteComponent(componentModule, params = {}) {
  if (typeof componentModule.default === 'function') {
    // Component exports a view function
    return componentModule.default;
  }
  
  if (componentModule.template && typeof componentModule.view === 'function') {
    // Component has both template and view function
    const parsedTemplate = domParser(componentModule.template);
    return (state) => componentModule.view(state, params, parsedTemplate);
  }
  
  if (componentModule.template) {
    // Component only has template
    const parsedTemplate = domParser(componentModule.template);
    return () => parsedTemplate;
  }
  
  throw new Error('Invalid route component format');
}

// Enhanced init function with routing
export function initWithRouter(root, initialState, update, routeMap) {
  let state = { ...initialState, route: null, params: {} };
  let currentView = null;
  
  // Import router after defining state
  import('./router.js').then(({ router, registerRoutes }) => {
    registerRoutes(routeMap);
    
    router.init(async (componentModule, params) => {
      try {
        const viewFunction = await loadRouteComponent(componentModule, params);
        currentView = viewFunction;
        
        // Update state with route info
        state = update(state, { 
          type: 'ROUTE_CHANGE', 
          route: router.currentRoute, 
          params 
        });
        
        draw();
      } catch (error) {
        console.error('Route loading error:', error);
      }
    });
  });

  let nodes = [];
  let queue = [];

  function enqueue(msg) {
    queue.push(msg);
  }

  function draw() {
    if (!currentView) return;
    
    let newNodes = currentView(state);
    const { apply, diffList } =  import('./Dom.js').then(m => m);
    const { diffList: diff } =  import('./diff.js');
    
    apply(root, enqueue, diff(nodes, newNodes));
    nodes = newNodes;
  }

  function updateState() {
    if (queue.length > 0) {
      let msgs = queue;
      queue = [];

      for (let msg of msgs) {
        state = update(state, msg);
      }

      draw();
    }

    window.requestAnimationFrame(updateState);
  }

  updateState();
  return { enqueue };
}