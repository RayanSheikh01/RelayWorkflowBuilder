import { describe, test, expect } from "vitest";
import { uid } from "../../src/utils/uid.js";

describe("uid generator", () => {
    test("Returns a string", () => {
        const id = uid();
        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
    });

    test("Returns unique values (generate 1000, check all different)", () => {
        const generated = new Set();
        for (let i = 0; i < 1000; i++) {
            generated.add(uid());
        }
        expect(generated.size).toBe(1000);
    });

    test("Accepts an optional prefix", () => {
        const nodeId = uid("node");
        const edgeId = uid("edge");
        
        expect(nodeId.startsWith("node_")).toBe(true);
        expect(edgeId.startsWith("edge_")).toBe(true);
    });
});
