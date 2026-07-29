import { store } from "../store.js";

export function setupCanvas() {
    const canvasContainer = document.getElementById("canvas-container");
    const canvasWorld = document.getElementById("canvas-world");
    
    if (!canvasContainer || !canvasWorld) return;

    let isPanning = false;
    let lastMousePos = { x: 0, y: 0 };

    // Update DOM when viewport state changes
    store.subscribe((state) => {
        const { x, y, zoom } = state.ui.viewport;
        canvasWorld.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    });

    // Middle-click pan or Space+drag pan (we'll just do middle-click for now)
    canvasContainer.addEventListener("pointerdown", (e) => {
        if (e.button === 1 || e.button === 0 && e.altKey) {
            e.preventDefault();
            isPanning = true;
            lastMousePos = { x: e.clientX, y: e.clientY };
            canvasContainer.style.cursor = "grabbing";
        }
    });

    window.addEventListener("pointermove", (e) => {
        if (!isPanning) return;
        
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        lastMousePos = { x: e.clientX, y: e.clientY };
        
        const currentViewport = store.getState().ui.viewport;
        store.setState("ui.viewport", {
            ...currentViewport,
            x: currentViewport.x + dx,
            y: currentViewport.y + dy
        });
    });

    window.addEventListener("pointerup", (e) => {
        if (isPanning) {
            isPanning = false;
            canvasContainer.style.cursor = "default";
        }
    });

    // Zoom
    canvasContainer.addEventListener("wheel", (e) => {
        e.preventDefault();
        
        const currentViewport = store.getState().ui.viewport;
        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        
        let newZoom = currentViewport.zoom * Math.exp(delta);
        newZoom = Math.min(Math.max(0.1, newZoom), 5); // clamp between 0.1 and 5
        
        // Zoom towards mouse cursor
        const rect = canvasContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomRatio = newZoom / currentViewport.zoom;
        
        const newX = mouseX - (mouseX - currentViewport.x) * zoomRatio;
        const newY = mouseY - (mouseY - currentViewport.y) * zoomRatio;
        
        store.setState("ui.viewport", {
            x: newX,
            y: newY,
            zoom: newZoom
        });
    }, { passive: false });
}