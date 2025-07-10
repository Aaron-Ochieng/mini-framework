// browser event listerner which triggers our handler function stored in the event listerner
//  each element has a map of handler for specific event listerners
function listener(event) {
  const el = event.currentTarget;
  const handler = el._ui.listeners[event.type];
  handler(event);
}

// function to set up the vent listerner for the browser to listen
// we also register specific function and thier corresponding functions
export function setListener(el, event, handle) {
  if (el._ui.listeners[event] === undefined) {
    el.addEventListener(event, listener);
  }

  el._ui.listeners[event] = handle;
}

export function eventName(str) {
  if (str.indexOf("on") == 0) {
    // starts with `on`
    return str.slice(2).toLowerCase(); // lowercase name without the `on`
  }
  return null;
}
