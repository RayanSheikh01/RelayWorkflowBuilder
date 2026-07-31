/*
Handle-to-handle drag:
pointerdown on output handle → rubber band line
pointerup on input handle → validate → create edge
*/

import { store } from "../store.js";
import { isValidConnection } from "../engine/validator.js";
import { screenToCanvas, computeEdgePath } from "../utils/geometry.js";
import { uid } from "../utils/uid.js";

export function setupConnectionHandler() {
    let activeConnection = null;

    const canvasContainer = document.getElementById("canvas-container");
    const canvasEdgesContainer = document.getElementById("canvas-edges");

    if (!canvasEdgesContainer || !canvasContainer) return;

    function screenToWorld(clientX, clientY) {
        const rect = canvasContainer.getBoundingClientRect();
        return screenToCanvas(
            clientX - rect.left,
            clientY - rect.top,
            store.getState().ui.viewport
        );
    }

    function getHandlePositionWorld(handle) {
        const rect = handle.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        return screenToWorld(centerX, centerY);
    }

    function createRubberBand(start) {
        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        path.setAttribute("d", computeEdgePath(start.x, start.y, start.x, start.y));
        path.classList.add("rubber-band");

        canvasEdgesContainer.appendChild(path);

        return path;
    }

    function updateRubberBand(path, point) {
        const { x, y } = activeConnection.start;
        path.setAttribute("d", computeEdgePath(x, y, point.x, point.y));
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
            source: outputHandle.dataset.nodeId,
            sourceHandle: outputHandle.dataset.handleId || "output",
            start,
            line: createRubberBand(start)
        };
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
                const target = inputHandle.dataset.nodeId;
                const targetHandle = inputHandle.dataset.handleId || "input";

                const edges = store.getState().workflow.edges;

                const valid = isValidConnection(
                    activeConnection.source,
                    target,
                    edges
                );

                if (valid) {
                    const edgeId = uid("edge");

                    store.setState(
                        "workflow.edges",
                        {
                            ...edges,
                            [edgeId]: {
                                id: edgeId,
                                source: activeConnection.source,
                                sourceHandle: activeConnection.sourceHandle,
                                target,
                                targetHandle
                            }
                        }
                    );
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