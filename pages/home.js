import createElement from "../MiniMvc/createElement.js";

export const template = `
  <div class="home-page">
    <h1>Welcome Home</h1>
    <p>This is the home page</p>
    <nav>
      <a href="/about" onclick="navigate">About</a>
      <a href="/users/123" onclick="navigate">User Profile</a>
    </nav>
  </div>
`;

export function view(state, params, parsedTemplate) {
  return parsedTemplate;
}

// Alternative: export default view function
export default function(state) {
  return createElement('div', {
    attrs: { class: 'home-page' },
    children: [
      createElement('h1', { children: [{ text: 'Welcome Home' }] }),
      createElement('p', { children: [{ text: 'This is the home page' }] }),
      createElement('nav', {
        children: [
          createElement('a', {
            attrs: { href: '/about' },
            children: [{ text: 'About' }]
          }),
          createElement('a', {
            attrs: { href: '/users/123' },
            children: [{ text: 'User Profile' }]
          })
        ]
      })
    ]
  });
}