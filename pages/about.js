import createElement from "../MiniMvc/createElement.js";

export default function(state) {
  return createElement('div', {
    attrs: { class: 'about-page' },
    children: [
      createElement('h1', { children: [{ text: 'About Us' }] }),
      createElement('p', { children: [{ text: 'Learn more about our company' }] }),
      createElement('a', {
        attrs: { href: '/', onclick: 'navigate' },
        children: [{ text: 'Back to Home' }]
      })
    ]
  });
}