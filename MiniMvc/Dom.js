export function apply(el, childrenDiff) {
  const children = Array.from(el.childNodes);

  childrenDiff.forEach((diff, i) => {
    const action = Object.keys(diff)[0];
    switch (action) {
      case "remove":
        children[i].remove();
        break;

      case "modify":
        modify(children[i], diff.modify);
        break;

      case "create": {
        const child = create(diff.create);
        el.appendChild(child);
        break;
      }

      case "replace": {
        const child = create(diff.replace);
        children[i].replaceWith(child);
        break;
      }

      case "noop":
        break;
    }
  });
}

function modify(el, diff) {
  // Remove props
  for (const prop of diff.remove) {
    const event = eventName(prop);
    if (event === null) {
      el.removeAttribute(prop);
    } else {
      el._ui.listeners[event] = undefined;
      el.removeEventListener(event, listener);
    }
  }

  // Set props
  for (const prop in diff.set) {
    const value = diff.set[prop];
    const event = eventName(prop);
    event !== null
      ? setListener(el, event, value)
      : setProperty(prop, value, el);
  }

  // Deal with the children
  apply(el, diff.children);
}
