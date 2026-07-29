
export function setupEdgeRenderer() {
    if (!canvasEdgesContainer) return;
    for (const edgeId in store.getState().workflow.edges) {
        const edge = store.getState().workflow.edges[edgeId];
        renderEdge(edge);
    }
}

export function renderEdge(edge) {
    const { sourceNodeId, targetNodeId } = edge;
    const sourceNode = store.getState().workflow.nodes[sourceNodeId];
    const targetNode = store.getState().workflow.nodes[targetNodeId];
}