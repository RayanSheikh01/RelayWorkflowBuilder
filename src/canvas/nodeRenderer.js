import { store } from "../store.js";
import { getNodeDef } from "../nodes/nodeRegistry.js";

const canvasNodesContainer = document.getElementById("canvas-nodes");

// For node dragging
let draggingNodeId = null;
let dragOffset = { x: 0, y: 0 };

export function setupNodeRenderer() {
    if (!canvasNodesContainer) return;

    // Subscribe to store to render nodes
    store.subscribe((state) => {
        renderNodes(state.workflow.nodes, state.ui.selectedNodeId);
    });

    // Node movement logic
    window.addEventListener("pointermove", (e) => {
        if (!draggingNodeId) return;

        const viewport = store.getState().ui.viewport;
        // The delta in screen space divided by zoom gives canvas space delta
        const dx = e.movementX / viewport.zoom;
        const dy = e.movementY / viewport.zoom;

        const currentNodes = store.getState().workflow.nodes;
        const node = currentNodes[draggingNodeId];
        
        if (node) {
            store.setState("workflow.nodes", {
                ...currentNodes,
                [draggingNodeId]: {
                    ...node,
                    position: {
                        x: node.position.x + dx,
                        y: node.position.y + dy
                    }
                }
            });
        }
    });

    window.addEventListener("pointerup", () => {
        draggingNodeId = null;
    });

    // Delete node logic
    window.addEventListener("keydown", (e) => {
        if (e.key === "Delete") {
            const { selectedNodeId } = store.getState().ui;
            if (selectedNodeId) {
                const currentNodes = store.getState().workflow.nodes;
                const newNodes = { ...currentNodes };
                delete newNodes[selectedNodeId];
                
                store.setState("workflow.nodes", newNodes);
                store.setState("ui.selectedNodeId", null);
            }
        }
    });
}

function renderNodes(nodes, selectedNodeId) {
    // Clear existing nodes (for a simple React-like re-render, though inefficient for large graphs)
    canvasNodesContainer.innerHTML = "";

    for (const [nodeId, node] of Object.entries(nodes)) {
        const def = getNodeDef(node.type);
        if (!def) continue;

        const nodeEl = document.createElement("div");
        nodeEl.className = "node-card";
        if (selectedNodeId === nodeId) {
            nodeEl.classList.add("selected");
            nodeEl.style.boxShadow = `0 0 0 2px ${def.color}`;
        }

        // Set position
        nodeEl.style.position = "absolute";
        nodeEl.style.transform = `translate(${node.position.x}px, ${node.position.y}px)`;
        nodeEl.style.width = "220px";
        nodeEl.style.backgroundColor = "rgba(26, 26, 36, 0.85)";
        nodeEl.style.border = "1px solid #2E2E44";
        nodeEl.style.borderRadius = "12px";
        nodeEl.style.color = "#E8E8F0";

        let outputPreview = '';
        if (node.status === 'running') {
            outputPreview = '<div style="margin-top: 8px; color: var(--accent-warning);">Running...</div>';
        } else if (node.status === 'error') {
            outputPreview = `<div style="margin-top: 8px; color: var(--accent-error); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${node.error}">Error: ${node.error}</div>`;
        } else if (node.status === 'success' && node.output !== undefined) {
            const outStr = typeof node.output === 'object' ? JSON.stringify(node.output) : String(node.output);
            outputPreview = `<div style="margin-top: 8px; color: var(--accent-success); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${outStr.replace(/"/g, '&quot;')}">${outStr}</div>`;
        }

        // Inner HTML
        nodeEl.innerHTML = `
            <div class="node-header" style="padding: 8px; border-bottom: 1px solid #2E2E44; cursor: grab; display: flex; align-items: center; gap: 8px;">
                <div style="width: 4px; height: 16px; background-color: ${def.color}; border-radius: 2px;"></div>
                <span class="node-icon">${def.icon}</span>
                <span class="node-title">${def.label}</span>
            </div>
            <div class="node-content" style="padding: 12px; font-size: 12px; color: #8888A8;">
                <pre style="margin:0; overflow: hidden; text-overflow: ellipsis;">${JSON.stringify(node.data || {}).substring(0, 50)}...</pre>
                ${outputPreview}
            </div>
        `;

        // Handle dragging by header
        const header = nodeEl.querySelector(".node-header");
        header.addEventListener("pointerdown", (e) => {
            e.stopPropagation(); // Prevent canvas panning
            draggingNodeId = nodeId;
            store.setState("ui.selectedNodeId", nodeId);
        });

        // Select node by clicking anywhere on it
        nodeEl.addEventListener("pointerdown", (e) => {
            if (e.target.closest(".node-handle")) {
                // If they clicked a handle, still select the node, 
                // but let the event bubble up to connectionHandler.js
                store.setState("ui.selectedNodeId", nodeId);
                return;
            }
            e.stopPropagation();
            store.setState("ui.selectedNodeId", nodeId);
        });

        // Add handles
        if (def.inputs.length > 0) {
            const inputHandle = document.createElement("div");
            inputHandle.className = "node-handle input-handle";
            inputHandle.dataset.nodeId = nodeId;
            inputHandle.dataset.handleId = "input";
            inputHandle.style.position = "absolute";
            inputHandle.style.left = "-10px";
            inputHandle.style.top = "0";
            inputHandle.style.height = "100%";
            inputHandle.style.width = "20px";
            inputHandle.style.cursor = "crosshair";
            inputHandle.style.zIndex = "10";
            
            // Visual dot
            inputHandle.innerHTML = `<div style="position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; background-color: #8888A8; border-radius: 50%; pointer-events: none;"></div>`;
            nodeEl.appendChild(inputHandle);
        }

        if (def.outputs.length > 0) {
            const outputHandle = document.createElement("div");
            outputHandle.className = "node-handle output-handle";
            outputHandle.dataset.nodeId = nodeId;
            outputHandle.dataset.handleId = "output";
            outputHandle.style.position = "absolute";
            outputHandle.style.right = "-10px";
            outputHandle.style.top = "0";
            outputHandle.style.height = "100%";
            outputHandle.style.width = "20px";
            outputHandle.style.cursor = "crosshair";
            outputHandle.style.zIndex = "10";
            
            // Visual dot
            outputHandle.innerHTML = `<div style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; background-color: #8888A8; border-radius: 50%; pointer-events: none;"></div>`;
            nodeEl.appendChild(outputHandle);
        }

        canvasNodesContainer.appendChild(nodeEl);
    }
}
