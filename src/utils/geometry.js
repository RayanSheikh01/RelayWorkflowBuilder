export function screenToCanvasCoordinates(screenX, screenY, viewport) {
    return {
        x: (screenX - viewport.x) / viewport.zoom,
        y: (screenY - viewport.y) / viewport.zoom
    };
}

export function canvasToScreenCoordinates(canvasX, canvasY, viewport) {
    return {
        x: canvasX * viewport.zoom + viewport.x,
        y: canvasY * viewport.zoom + viewport.y
    };
}
