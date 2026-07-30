import { topologicalSort } from "./topologicalSort.js";

export function isValidConnection(source, target, edges) {
    // Prevent self-connections
    if (source === target) {
        return false;
    }

    // Prevent duplicate edges
    for (const edgeId in edges) {
        const edge = edges[edgeId];
        if (edge.source === source && edge.target === target) {
            return false;
        }
    }
    return true;
}

export function validateWorkflow(nodes, edges) {
    if (!nodes || Object.keys(nodes).length === 0) {
        return false;
    }
    try {
        topologicalSort(nodes, edges);
        return true; // No cycles detected
    } catch (error) {
        console.error(error.message);
        return false; // Cycle detected
    }
}