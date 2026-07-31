import { store } from "../store.js";
import { computeEdgePath } from "../utils/geometry.js";

const canvasEdgesContainer = document.getElementById("canvas-edges");

export function setupEdgeRenderer() {
    if (!canvasEdgesContainer) return;

    store.subscribe((state) => {
        renderEdges(state.workflow.nodes, state.workflow.edges, state.ui.selectedEdgeId);
    });

    // Delete edge logic
    window.addEventListener("keydown", (e) => {
        if (e.key === "Delete") {
            const { selectedEdgeId } = store.getState().ui;
            if (selectedEdgeId) {
                const currentEdges = store.getState().workflow.edges || {};
                const newEdges = { ...currentEdges };
                delete newEdges[selectedEdgeId];
                
                store.setState("workflow.edges", newEdges);
                store.setState("ui.selectedEdgeId", null);
            }
        }
    });

    // Deselect edge on canvas click
    window.addEventListener("pointerdown", (e) => {
        if (!e.target.closest(".edge-path")) {
            store.setState("ui.selectedEdgeId", null);
        }
    });
}

function renderEdges(nodes, edges, selectedEdgeId) {
    // Only clear edges — an in-progress .rubber-band must survive a re-render
    canvasEdgesContainer.querySelectorAll(".edge-path").forEach((p) => p.remove());
    if (!edges) return;

    const canvasRect = canvasEdgesContainer.getBoundingClientRect();
    // #canvas-edges lives inside the transformed #canvas-world, so screen-space
    // deltas must be divided by zoom to become world coordinates.
    const { zoom } = store.getState().ui.viewport;

    for (const [edgeId, edge] of Object.entries(edges)) {
        const sourceNode = document.querySelector(`[data-node-id="${edge.source}"]`);
        const targetNode = document.querySelector(`[data-node-id="${edge.target}"]`);

        if (!sourceNode || !targetNode) continue;

        const sourceHandle = sourceNode.querySelector(".output-handle");
        const targetHandle = targetNode.querySelector(".input-handle");

        if (!sourceHandle || !targetHandle) continue;

        const sourceRect = sourceHandle.getBoundingClientRect();
        const targetRect = targetHandle.getBoundingClientRect();

        const x1 = (sourceRect.left + sourceRect.width / 2 - canvasRect.left) / zoom;
        const y1 = (sourceRect.top + sourceRect.height / 2 - canvasRect.top) / zoom;
        const x2 = (targetRect.left + targetRect.width / 2 - canvasRect.left) / zoom;
        const y2 = (targetRect.top + targetRect.height / 2 - canvasRect.top) / zoom;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", computeEdgePath(x1, y1, x2, y2));
        
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "2");
        path.classList.add("edge-path");
        path.style.cursor = "pointer";

        if (selectedEdgeId === edgeId) {
            path.setAttribute("stroke", "var(--accent-primary)");
            path.setAttribute("stroke-width", "3");
        } else {
            path.setAttribute("stroke", "var(--text-muted)");
        }

        const sourceState = nodes[edge.source];
        if (sourceState && sourceState.status === 'running') {
            path.classList.add("edge-flowing");
            path.setAttribute("stroke", "var(--accent-warning)");
        }

        path.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            store.setState("ui.selectedEdgeId", edgeId);
            store.setState("ui.selectedNodeId", null);
        });

        canvasEdgesContainer.appendChild(path);
    }
}