import { createStore } from "./core/state.js";

const initialState = {
  workflow: {
    nodes: {},
    edges: {},
  },
  ui: {
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedNodeId: null,
    draggingNodeId: null
  }
};

export const store = createStore(initialState);
