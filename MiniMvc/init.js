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

  // draws the current state
  function draw() {
    let newNodes = view(state);
    apply(root, enqueue, diffList(nodes, newNodes));
    nodes = newNodes;
  }

  function updateState() {
    if (queue.length > 0) {
      let msgs = queue;
      // replace queue with an empty array so that we don't process
      // newly queued messages on this round.
      queue = [];

      for (let msg of msgs) {
        state = update(state, msg);
      }

      draw();
    }

    // schedule next round of state updates
    window.requestAnimationFrame(updateState);
  }

  draw(); // draw initial state
  updateState(); // kick-off state update cycle

  return { enqueue };
}
