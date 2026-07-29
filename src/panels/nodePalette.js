import { getAllNodeTypes, getNodeDef } from "../nodes/nodeRegistry.js";
import { store } from "../store.js";
import { screenToCanvas } from "../utils/geometry.js";
import { uid } from "../utils/uid.js";

// Step 4 Drag-to-canvas flow state
let draggingNodeType = null;
let ghostElement = null;

export function renderNodePalette() {
  const paletteList = document.getElementById("palette-list");
  if (!paletteList) return;
  
  paletteList.innerHTML = "";
  
  const nodeTypes = getAllNodeTypes();
  
  nodeTypes.forEach(type => {
    const nodeDef = getNodeDef(type);
    
    const nodeElement = document.createElement("div");
    nodeElement.className = "node-palette-item";
    nodeElement.style.borderLeft = `4px solid ${nodeDef.color}`;
    
    nodeElement.innerHTML = `
      <span class="node-icon">${nodeDef.icon}</span> 
      <span class="node-label">${nodeDef.label}</span>
    `;
    
    // Setup for Step 4 Drag-and-drop
    nodeElement.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      draggingNodeType = type;
      
      // Create ghost element
      ghostElement = nodeElement.cloneNode(true);
      ghostElement.classList.add("ghost-dragging");
      ghostElement.style.position = "absolute";
      ghostElement.style.pointerEvents = "none";
      ghostElement.style.zIndex = "1000";
      ghostElement.style.opacity = "0.8";
      ghostElement.style.transform = "translate(-50%, -50%)";
      
      // Initial position
      ghostElement.style.left = `${e.clientX}px`;
      ghostElement.style.top = `${e.clientY}px`;
      
      document.body.appendChild(ghostElement);
    });
    
    paletteList.appendChild(nodeElement);
  });
}

// Global listeners for drag and drop
window.addEventListener("pointermove", (e) => {
  if (ghostElement) {
    ghostElement.style.left = `${e.clientX}px`;
    ghostElement.style.top = `${e.clientY}px`;
  }
});

window.addEventListener("pointerup", (e) => {
  if (draggingNodeType && ghostElement) {
    // Check if dropped on canvas
    const canvasContainer = document.getElementById("canvas-container");
    const rect = canvasContainer.getBoundingClientRect();
    
    if (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
      const viewport = store.getState().ui.viewport;
      
      // Calculate logical position on the canvas
      const canvasPos = screenToCanvas(e.clientX, e.clientY, viewport);
      
      // Get defaults
      const nodeDef = getNodeDef(draggingNodeType);
      const newId = uid("node");
      
      const newNode = {
        id: newId,
        type: draggingNodeType,
        position: canvasPos,
        data: JSON.parse(JSON.stringify(nodeDef.defaultData)) // Deep clone default data
      };
      
      // Add to store
      const currentNodes = store.getState().workflow.nodes;
      store.setState("workflow.nodes", {
        ...currentNodes,
        [newId]: newNode
      });
      
      console.log(`Created node ${newId} at`, canvasPos);
    } else {
      console.log("Drop cancelled (outside canvas).");
    }
    
    // Cleanup
    document.body.removeChild(ghostElement);
    ghostElement = null;
    draggingNodeType = null;
  }
});
