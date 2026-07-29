export function screenToCanvas(screenX, screenY, viewport) {
    return {
        x: (screenX - viewport.x) / viewport.zoom,
        y: (screenY - viewport.y) / viewport.zoom
    };
}

export function canvasToScreen(canvasX, canvasY, viewport) {
    return {
        x: canvasX * viewport.zoom + viewport.x,
        y: canvasY * viewport.zoom + viewport.y
    };
}

export function computeEdgePath(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const controlPointOffsetX = dx * 0.5;
    const controlPointOffsetY = dy * 0.5;
    return `M ${x1} ${y1} C ${x1 + controlPointOffsetX} ${y1 + controlPointOffsetY}, ${x2 - controlPointOffsetX} ${y2 - controlPointOffsetY}, ${x2} ${y2}`;
}