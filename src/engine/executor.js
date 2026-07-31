import { validateWorkflow } from './validator.js';
import { topologicalSort } from './topologicalSort.js';
import { appendLog } from '../panels/logPanel.js';

export async function executeWorkflow(store) {
    const state = store.getState();
    const nodes = state.workflow.nodes || {};
    const edges = state.workflow.edges || {};

    if (!validateWorkflow(nodes, edges)) {
        appendLog(`Workflow validation failed. Cycle detected or no nodes.`, 'error');
        return;
    }

    let sortedNodes;
    try {
        sortedNodes = topologicalSort(nodes, edges);
    } catch (e) {
        appendLog(`Sort failed: ${e.message}`, 'error');
        return;
    }

    appendLog(`Starting execution of ${sortedNodes.length} nodes...`, 'info');

    // Execute nodes sequentially
    for (const nodeId of sortedNodes) {
        const node = nodes[nodeId];
        if (!node) continue;

        store.setState(`workflow.nodes.${nodeId}.status`, "running");
        appendLog(`Running node [${node.type}] ${nodeId}...`, 'info');

        try {
            // Gather inputs from connected edges
            const inputs = {};
            Object.values(edges).forEach(edge => {
                if (edge.target === nodeId) {
                    const sourceNode = nodes[edge.source];
                    if (sourceNode && sourceNode.output !== undefined) {
                        inputs[edge.targetHandle] = sourceNode.output;
                    }
                }
            });

            const response = await fetch('http://localhost:3001/api/execute/node', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: node.type,
                    data: node.data || {},
                    inputs
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP error ${response.status}`);
            }

            store.setState(`workflow.nodes.${nodeId}.status`, "success");
            store.setState(`workflow.nodes.${nodeId}.output`, result.output);
            store.setState(`workflow.nodes.${nodeId}.error`, null);
            
            appendLog(`Node [${node.type}] ${nodeId} succeeded.`, 'success');

        } catch (error) {
            console.error(`Error executing node ${nodeId}:`, error);
            store.setState(`workflow.nodes.${nodeId}.status`, "error");
            store.setState(`workflow.nodes.${nodeId}.error`, error.message);
            appendLog(`Node [${node.type}] ${nodeId} failed: ${error.message}`, 'error');
            appendLog(`Execution aborted due to error.`, 'error');
            break;
        }
    }
    
    appendLog(`Execution workflow completed.`, 'info');
}