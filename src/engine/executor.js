//  Validate → sort → execute sequentially, updating node status in UI state

export function executeWorkflow(store) {
    const state = store.getState();
    const nodes = state.workflow.nodes;
    const edges = state.workflow.edges;

    // Validate workflow
    if (!validateWorkflow(nodes, edges)) {
        console.error("Workflow validation failed. Execution aborted.");
        return;
    }

    // Topologically sort nodes
    const sortedNodes = topologicalSort(nodes, edges);

    // Execute nodes sequentially
    for (const nodeId of sortedNodes) {
        const node = nodes[nodeId];
        if (!node) continue;

        // Update node status to "running"
        store.setState(`workflow.nodes.${nodeId}.status`, "running");

        try {
            // Execute node logic (placeholder for actual execution logic)
            console.log(`Executing node ${nodeId} of type ${node.type}`);
            // Simulate execution delay
            // In a real scenario, you would call the node's execution function here
            // For example: await executeNode(node);

            // Update node status to "completed"
            store.setState(`workflow.nodes.${nodeId}.status`, "completed");
        }

        catch (error) {
            console.error(`Error executing node ${nodeId}:`, error);
            // Update node status to "error"
            store.setState(`workflow.nodes.${nodeId}.status`, "error");
        }
    }
}