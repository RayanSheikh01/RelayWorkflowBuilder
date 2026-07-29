import { describe, test, expect } from "vitest";
import { isValidConnection } from "../../src/engine/validator.js";

describe("validator", () => {
    describe("isValidConnection", () => {
        test("Rejects self-connections", () => {
            const sourceId = "node1";
            const targetId = "node1";
            const existingEdges = {};
            expect(isValidConnection(sourceId, targetId, existingEdges)).toBe(false);
        });

        test("Rejects duplicate edges", () => {
            const sourceId = "node1";
            const targetId = "node2";
            const existingEdges = { "edge1": { sourceNodeId: "node1", targetNodeId: "node2" } };
            expect(isValidConnection(sourceId, targetId, existingEdges)).toBe(false);
        });

        test("Allows valid new connections", () => {
            const sourceId = "node1";
            const targetId = "node2";
            const existingEdges = {};
            expect(isValidConnection(sourceId, targetId, existingEdges)).toBe(true);
        });

        test("Allows reverse direction of an existing edge", () => {
            const sourceId = "node1";
            const targetId = "node2";
            const existingEdges = { "edge1": { sourceNodeId: "node1", targetNodeId: "node2" } };
            expect(isValidConnection(targetId, sourceId, existingEdges)).toBe(true);
        });
    });
})