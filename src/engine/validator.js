export function isValidConnection(sourceNodeId, targetNodeId, nodes) {
    // Prevent self-connections
    if (sourceNodeId === targetNodeId) {
        return false;
    }

    // Prevent duplicate edges
    for (const edgeId in nodes) {
        const edge = nodes[edgeId];
        if (edge.sourceNodeId === sourceNodeId && edge.targetNodeId === targetNodeId) {
            return false;
        }
    }
    return true;
}