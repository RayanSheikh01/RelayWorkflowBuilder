/*
 * Handle-to-handle drag:
 * pointerdown on output handle → rubber band line
 * pointerup on input handle → validate → create edge
 */

import { store } from "../store.js";
import { isValidConnection } from "../engine/validator.js";

export function setupConnectionHandler() {
    let activeConnection = null;

    const canvasEdgesContainer = document.getElementById("canvas-edges");

    if (!canvasEdgesContainer) return;


    function getHandlePosition(handle) {
        const rect = handle.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
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


    document.addEventListener("pointerdown", (e) => {
        const outputHandle = e.target.closest(".output-handle");

        if (!outputHandle) return;

        e.stopPropagation();

        const start = getHandlePosition(outputHandle);

        activeConnection = {
            sourceNodeId: outputHandle.dataset.nodeId,
            sourceHandleId: outputHandle.dataset.handleId,
            line: createRubberBand(start)
        };
    });


    document.addEventListener("pointermove", (e) => {
        if (!activeConnection) return;

        updateRubberBand(activeConnection.line, {
            x: e.clientX,
            y: e.clientY
        });
    });


    document.addEventListener("pointerup", (e) => {
        if (!activeConnection) return;

        const inputHandle = e.target.closest(".input-handle");

        if (inputHandle) {
            const targetNodeId = inputHandle.dataset.nodeId;

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
                            targetNodeId
                        }
                    }
                );
            }
        }


        removeRubberBand(activeConnection.line);

        activeConnection = null;
    });
}