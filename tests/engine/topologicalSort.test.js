import { describe, test, expect } from "vitest";
import { topologicalSort } from "../../src/engine/topologicalSort.js";

describe("topologicalSort", () => {

    test("Single node returns ['a']", () => {
        const nodes = { a: {} };
        const edges = {};
        const result = topologicalSort(nodes, edges);
        expect(result).toEqual(['a']);
    });

    test("Chain A→B→C produces correct ordering", () => {
        const nodes = { A: {}, B: {}, C: {} };
        const edges = { edge1: { source: 'A', target: 'B' }, edge2: { source: 'B', target: 'C' } };
        const result = topologicalSort(nodes, edges);
        expect(result).toEqual(['A', 'B', 'C']);
    });

    test("Diamond A→B, A→C, B→D, C→D: A is first, D is last", () => {
        const nodes = { A: {}, B: {}, C: {}, D: {} };
        const edges = {
            edge1: { source: 'A', target: 'B' },
            edge2: { source: 'A', target: 'C' },
            edge3: { source: 'B', target: 'D' },
            edge4: { source: 'C', target: 'D' }
        };
        const result = topologicalSort(nodes, edges);
        expect(result[0]).toBe('A');
        expect(result[result.length - 1]).toBe('D');
    });

    test("Multiple root nodes (disconnected inputs): all are included", () => {
        const nodes = { A: {}, B: {}, C: {} };
        const edges = {};
        const result = topologicalSort(nodes, edges);
        expect(result).toEqual(expect.arrayContaining(['A', 'B', 'C']));
    });

    test("Throws on direct cycle (A→B→A)", () => {
        const nodes = { A: {}, B: {} };
        const edges = {
            edge1: { source: 'A', target: 'B' },
            edge2: { source: 'B', target: 'A' }
        };
        expect(() => topologicalSort(nodes, edges)).toThrow("Graph has at least one cycle");
    });

    test("Throws on indirect cycle (A→B→C→A)", () => {
        const nodes = { A: {}, B: {}, C: {} };
        const edges = {
            edge1: { source: 'A', target: 'B' },
            edge2: { source: 'B', target: 'C' },
            edge3: { source: 'C', target: 'A' }
        };
        expect(() => topologicalSort(nodes, edges)).toThrow("Graph has at least one cycle");
    });

    test("Disconnected nodes are still included in the output", () => {
        const nodes = { A: {}, B: {}, C: {}, D: {} };
        const edges = {
            edge1: { source: 'A', target: 'B' }
        };
        const result = topologicalSort(nodes, edges);
        expect(result).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D']));
    });

});