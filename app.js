import { initWithRouter } from "./MiniMvc/routeLoader.js";
import { navigateTo } from "./MiniMvc/router.js";

// Define your routes
const routes = {
  '/': './pages/home.js',
  '/about': './pages/about.js',
  '/users/[id]': './pages/users/[id].js'
};

// Initial application state
const initialState = {
  user: null,
  loading: false
};

// Update function handles both app logic and routing
function update(state, msg) {
  switch (msg.type) {
    case 'ROUTE_CHANGE':
      return {
        ...state,
        route: msg.route,
        params: msg.params
      };
    
    case 'SET_USER':
      return { ...state, user: msg.user };
    
    default:
      return state;
  }
}

// Enhanced event handling for navigation
window.navigate = (event) => {
  event.preventDefault();
  const href = event.target.getAttribute('href');
  if (href) {
    navigateTo(href);
  }
};

// Initialize the app with routing
const root = document.getElementById('app');
initWithRouter(root, initialState, update, routes);