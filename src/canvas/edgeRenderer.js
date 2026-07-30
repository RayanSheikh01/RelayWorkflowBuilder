import { store } from "../store.js";

const canvasEdgesContainer = document.getElementById("canvas-edges");

export function setupEdgeRenderer() {
    if (!canvasEdgesContainer) return;

    const edges = store.getState().workflow.edges;

    for (const edgeId in edges) {
        renderEdge(edges[edgeId]);
    }
}


export function renderEdge(edge) {
    const {
        sourceNodeId,
        targetNodeId
    } = edge;

    const sourceNode = document.querySelector(
        `[data-node-id="${sourceNodeId}"]`
    );

    const targetNode = document.querySelector(
        `[data-node-id="${targetNodeId}"]`
    );

    if (!sourceNode || !targetNode) return;


    const sourceHandle = sourceNode.querySelector(".output-handle");
    const targetHandle = targetNode.querySelector(".input-handle");

    if (!sourceHandle || !targetHandle) return;


    const sourceRect = sourceHandle.getBoundingClientRect();
    const targetRect = targetHandle.getBoundingClientRect();


    const canvasRect = canvasEdgesContainer.getBoundingClientRect();


    const x1 = sourceRect.left + sourceRect.width / 2 - canvasRect.left;
    const y1 = sourceRect.top + sourceRect.height / 2 - canvasRect.top;

    const x2 = targetRect.left + targetRect.width / 2 - canvasRect.left;
    const y2 = targetRect.top + targetRect.height / 2 - canvasRect.top;


    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    line.classList.add("edge");

    canvasEdgesContainer.appendChild(line);
}