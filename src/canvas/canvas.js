
import {screenToCanvasCoordinates, canvasToScreenCoordinates} from './canvasUtils.js';

let isPanning = false;
let lastPanPosition = { x: 0, y: 0 };

export function setupCanvasInteractions(canvasContainer, canvasWorld) {
    // Pan (middle mouse button)
    canvasContainer.addEventListener("pointerdown", (e) => {
        if (e.button === 1) { // Middle mouse button
            isPanning = true;
            lastPanPosition = { x: e.clientX, y: e.clientY };
            canvasContainer.style.cursor = "grabbing";
        }
    });
};

export function handlePointerMove(e, canvasContainer, canvasWorld) {
    if (isPanning) {
        const dx = e.clientX - lastPanPosition.x;
        const dy = e.clientY - lastPanPosition.y;
    }
};

export function transformCanvasCoordinates(screenX, screenY, canvasContainer, canvasWorld) {
    const canvasCoords = screenToCanvasCoordinates(screenX, screenY, canvasContainer);
    const worldX = (canvasCoords.x - canvasWorld.offsetX) / canvasWorld.scale;
    const worldY = (canvasCoords.y - canvasWorld.offsetY) / canvasWorld.scale;
    return { x: worldX, y: worldY };
}