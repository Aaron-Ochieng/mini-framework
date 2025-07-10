import { diffList } from "./diff";
import { apply } from "./Dom";

root

    Type: HTMLElement

    Purpose: The real DOM element your app renders into.

    Example: document.querySelector('#app')

    SMVC will mount and manage the virtual DOM inside this element.

initialState

    Type: Object

    Purpose: The starting state of your application — your model.

    Defines initial values like todos, visibility filter, counters, etc.

update

    Type: (state, msg, enqueue?) => newState

    Purpose: A pure function that takes the current state and a message, then returns a new state.

    It's how you handle events and change state in response to user input.

view

    Type: (state) => VirtualNode[]

    Purpose: A function that takes the current state and returns the virtual DOM tree.

    This is what your UI "looks like" given a state — declarative rendering.

function init(root, initialState, update, view) {
  let state = initialState; // client application state
  let nodes = []; // virtual DOM nodes
  let queue = []; // msg queue

  function enqueue(msg) {
    queue.push(msg);
  }

  // draws the current state
  function draw() {
    let newNodes = view(state);
    apply(root, diffList(nodes, newNodes));
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
