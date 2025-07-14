import createElement from "../../MiniMvc/createElement.js";

export default function(state, params) {
  const userId = params?.id || 'unknown';
  
  return createElement('div', {
    attrs: { class: 'user-page' },
    children: [
      createElement('h1', { children: [{ text: `User Profile: ${userId}` }] }),
      createElement('p', { children: [{ text: `Viewing details for user ${userId}` }] }),
      createElement('a', {
        attrs: { href: '/', onclick: 'navigate' },
        children: [{ text: 'Back to Home' }]
      })
    ]
  });
}