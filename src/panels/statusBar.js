import { store } from "../store.js";

export function setupStatusBar() {
    const nodesEl = document.getElementById("status-nodes");
    const edgesEl = document.getElementById("status-edges");
    const stateEl = document.getElementById("status-state");
    const emptyState = document.getElementById("canvas-empty-state");

    store.subscribe((state) => {
        const nodes = Object.keys(state.workflow.nodes || {}).length;
        const edges = Object.keys(state.workflow.edges || {}).length;

        if (nodesEl) nodesEl.textContent = `Nodes: ${nodes}`;
        if (edgesEl) edgesEl.textContent = `Edges: ${edges}`;

        if (emptyState) {
            if (nodes === 0) {
                emptyState.style.display = "flex";
            } else {
                emptyState.style.display = "none";
            }
        }

        // Determine execution status
        let isRunning = false;
        let hasError = false;
        Object.values(state.workflow.nodes || {}).forEach(n => {
            if (n.status === 'running') isRunning = true;
            if (n.status === 'error') hasError = true;
        });

        if (stateEl) {
            if (isRunning) {
                stateEl.textContent = "Executing...";
                stateEl.style.color = "var(--accent-warning)";
            } else if (hasError) {
                stateEl.textContent = "Failed";
                stateEl.style.color = "var(--accent-error)";
            } else if (nodes > 0) {
                stateEl.textContent = "Idle";
                stateEl.style.color = "var(--text-secondary)";
            } else {
                stateEl.textContent = "Empty";
                stateEl.style.color = "var(--text-muted)";
            }
        }
    });
}
