// Kahn's algorithm

export function topologicalSort(nodes, edges) {
    const inDegree = {};
    const graph = {};

    // Initialize in-degree and graph
    for (const nodeId in nodes) {
        inDegree[nodeId] = 0;
        graph[nodeId] = [];
    }

    // Build the graph and calculate in-degrees
    for (const edgeId in edges) {
        const edge = edges[edgeId];
        const { source, target } = edge;
        graph[source].push(target);
        inDegree[target]++;
    }

    const queue = [];

    // Enqueue nodes with in-degree of 0
    for (const nodeId in inDegree) {
        if (inDegree[nodeId] === 0) {
            queue.push(nodeId);
        }
    }

    const sortedOrder = [];

    while (queue.length > 0) {
        const currentNode = queue.shift();
        sortedOrder.push(currentNode);

        for (const neighbor of graph[currentNode]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }

    } }

    // If sortedOrder doesn't contain all nodes, there's a cycle
    if (sortedOrder.length !== Object.keys(nodes).length) {
        throw new Error("Graph has at least one cycle. Topological sort not possible.");
    }

    return sortedOrder;
}