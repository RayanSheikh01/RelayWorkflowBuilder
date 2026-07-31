import { describe, it, expect, beforeEach } from "vitest";
import { setupConnectionHandler } from "../../src/canvas/connectionHandler.js";
import { store } from "../../src/store.js";

function handleEvent(type, target) {
    const e = new MouseEvent(type, { bubbles: true, cancelable: true });
    target.dispatchEvent(e);
}

describe("connectionHandler", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="canvas-container">
                <div id="canvas-world">
                    <svg id="canvas-edges"></svg>
                    <div id="canvas-nodes">
                        <div data-node-id="node_1">
                            <div class="node-handle output-handle" data-node-id="node_1" data-handle-id="output"></div>
                        </div>
                        <div data-node-id="node_2">
                            <div class="node-handle input-handle" data-node-id="node_2" data-handle-id="input"></div>
                        </div>
                    </div>
                </div>
            </div>`;
        store.setState("workflow.edges", {});
        setupConnectionHandler();
    });

    const output = () => document.querySelector(".output-handle");
    const input = () => document.querySelector(".input-handle");
    const edges = () => Object.values(store.getState().workflow.edges);

    it("shows a rubber band while dragging from an output handle", () => {
        handleEvent("pointerdown", output());
        expect(document.querySelector(".rubber-band")).not.toBeNull();

        handleEvent("pointerup", document.getElementById("canvas-container"));
        expect(document.querySelector(".rubber-band")).toBeNull();
    });

    it("creates an edge using the source/target schema the renderer and executor read", () => {
        handleEvent("pointerdown", output());
        handleEvent("pointerup", input());

        expect(edges()).toHaveLength(1);
        expect(edges()[0]).toMatchObject({
            source: "node_1",
            sourceHandle: "output",
            target: "node_2",
            targetHandle: "input"
        });
    });

    it("rejects a duplicate connection", () => {
        handleEvent("pointerdown", output());
        handleEvent("pointerup", input());
        handleEvent("pointerdown", output());
        handleEvent("pointerup", input());

        expect(edges()).toHaveLength(1);
    });

    it("creates no edge when released off a handle", () => {
        handleEvent("pointerdown", output());
        handleEvent("pointerup", document.getElementById("canvas-container"));

        expect(edges()).toHaveLength(0);
    });
});
