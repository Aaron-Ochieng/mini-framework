import { diffList } from "./diff.js";
import { apply } from "./Dom.js";

export default (root, initialState, update, view) => {
  let state = initialState;
  let nodes = [];
  let queue = [];

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
