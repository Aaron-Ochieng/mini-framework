import { diffList } from "./diff.js";
import { apply } from "./Dom.js";

// root The real DOM element your app renders into. the div we target to inject code with
// initialState (object) Defines initial values like todos, visibility filter, counters, etc The starting state of your application
// update Type: (state, msg, enqueue?) => newState == A pure function that takes the current state and a message, then returns a new state.
// view Type: (state) => VirtualNode[] A function that takes the current state and returns the virtual DOM tree.

export default (root, initialState, update, view) => {
  let state = initialState; // client application state
  let nodes = []; // virtual DOM nodes
  let queue = []; // msg queue

  function enqueue(msg) {
    queue.push(msg);
  }

  async function draw() {
    try {
      let newNodes = await view(state);
      apply(root, enqueue, diffList(nodes, newNodes));
      nodes = newNodes;
    } catch (error) {
      console.error('Error in view function:', error);
    }
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

  draw();
  updateState();

  return { enqueue };
};
