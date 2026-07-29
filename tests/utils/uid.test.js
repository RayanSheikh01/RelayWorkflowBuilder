import { describe, test, expect } from "vitest";
import { generateUID } from "../../src/utils/uid.js";

describe("uid generator", () => {
    test("Returns a string", () => {
        const id = generateUID();
        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
    });

    test("Returns unique values (generate 1000, check all different)", () => {
        const generated = new Set();
        for (let i = 0; i < 1000; i++) {
            generated.add(generateUID());
        }
        expect(generated.size).toBe(1000);
    });

    test("Accepts an optional prefix", () => {
        const nodeId = generateUID("node");
        const edgeId = generateUID("edge");
        
        expect(nodeId.startsWith("node_")).toBe(true);
        expect(edgeId.startsWith("edge_")).toBe(true);
    });
});
