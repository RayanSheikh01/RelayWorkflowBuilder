import { describe, test, expect } from "vitest";
import { isValidConnection, validateWorkflow } from "../../src/engine/validator.js";

describe("validator", () => {
    describe("isValidConnection", () => {
        test("Rejects self-connections", () => {
            const source = "node1";
            const target = "node1";
            const existingEdges = {};
            expect(isValidConnection(source, target, existingEdges)).toBe(false);
        });

        test("Rejects duplicate edges", () => {
            const source = "node1";
            const target = "node2";
            const existingEdges = { "edge1": { source: "node1", target: "node2" } };
            expect(isValidConnection(source, target, existingEdges)).toBe(false);
        });

        test("Allows valid new connections", () => {
            const source = "node1";
            const target = "node2";
            const existingEdges = {};
            expect(isValidConnection(source, target, existingEdges)).toBe(true);
        });

        test("Allows reverse direction of an existing edge", () => {
            const source = "node1";
            const target = "node2";
            const existingEdges = { "edge1": { source: "node1", target: "node2" } };
            expect(isValidConnection(target, source, existingEdges)).toBe(true);
        });
    });

    describe("validateWorkflow", () => {
        test("Fails on empty workflow (no nodes)", () => {
            const nodes = {};
            const edges = {};
            expect(validateWorkflow(nodes, edges)).toBe(false);
        });

        test("Fails when a cycle is detected", () => {
            const nodes = { A: {}, B: {} };
            const edges = {
                edge1: { source: 'A', target: 'B' },
                edge2: { source: 'B', target: 'A' }
            };
            expect(validateWorkflow(nodes, edges)).toBe(false);
        });

        test("Passes for a valid acyclic workflow", () => {
            const nodes = { A: {}, B: {}, C: {} };
            const edges = {
                edge1: { source: 'A', target: 'B' },
                edge2: { source: 'B', target: 'C' }
            };
            expect(validateWorkflow(nodes, edges)).toBe(true);
        });
    });
})