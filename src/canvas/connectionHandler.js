/*
Handle-to-handle drag:
pointerdown on output handle → rubber band line
pointerup on input handle → validate → create edge
*/

import { store } from "../store.js";
import { isValidConnection } from "../engine/validator.js";

export function setupConnectionHandler() {
    let activeConnection = null;

    const canvasContainer = document.getElementById("canvas-container");
    const canvasEdgesContainer = document.getElementById("canvas-edges");

    if (!canvasEdgesContainer || !canvasContainer) return;

    function screenToWorld(clientX, clientY) {
        const rect = canvasContainer.getBoundingClientRect();
        const { x, y, zoom } = store.getState().ui.viewport;

        return {
            x: (clientX - rect.left - x) / zoom,
            y: (clientY - rect.top - y) / zoom
        };
    }

    function getHandlePositionWorld(handle) {
        const rect = handle.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        return screenToWorld(centerX, centerY);
    }

    function createRubberBand(start) {
        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);
        line.setAttribute("x2", start.x);
        line.setAttribute("y2", start.y);

        line.classList.add("rubber-band");

        canvasEdgesContainer.appendChild(line);

        return line;
    }

    function updateRubberBand(line, point) {
        line.setAttribute("x2", point.x);
        line.setAttribute("y2", point.y);
    }

    function removeRubberBand(line) {
        if (line) {
            line.remove();
        }
    }

    function clearConnection() {
        if (!activeConnection) return;

        removeRubberBand(activeConnection.line);
        activeConnection = null;
    }


    // Start connection
    document.addEventListener("pointerdown", (e) => {
        const target = e.target;

        if (!(target instanceof Element)) return;

        const outputHandle = target.closest(".output-handle");

        if (!outputHandle) return;

        e.stopPropagation();
        e.preventDefault();

        const start = getHandlePositionWorld(outputHandle);

        activeConnection = {
            sourceNodeId: outputHandle.dataset.nodeId,
            sourceHandleId: outputHandle.dataset.handleId,
            line: createRubberBand(start)
        };

        console.log("Started connection", activeConnection);
    });


    // Move rubber band
    document.addEventListener("pointermove", (e) => {
        if (!activeConnection) return;

        const currentPos = screenToWorld(
            e.clientX,
            e.clientY
        );

        updateRubberBand(
            activeConnection.line,
            currentPos
        );
    });


    // Finish connection
    document.addEventListener("pointerup", (e) => {
        if (!activeConnection) return;

        const target = e.target;

        if (target instanceof Element) {
            const inputHandle = target.closest(".input-handle");

            if (inputHandle) {
                const targetNodeId = inputHandle.dataset.nodeId;
                const targetHandleId = inputHandle.dataset.handleId;

                const edges = store.getState().workflow.edges;

                const valid = isValidConnection(
                    activeConnection.sourceNodeId,
                    targetNodeId,
                    edges
                );

                if (valid) {
                    const edgeId = crypto.randomUUID();

                    store.setState(
                        "workflow.edges",
                        {
                            ...edges,
                            [edgeId]: {
                                id: edgeId,
                                sourceNodeId: activeConnection.sourceNodeId,
                                sourceHandleId: activeConnection.sourceHandleId,
                                targetNodeId,
                                targetHandleId
                            }
                        }
                    );

                    console.log("Created edge", edgeId);
                }
            }
        }

        clearConnection();
    });


    // Cancel interrupted drags
    document.addEventListener("pointercancel", () => {
        clearConnection();
    });
}