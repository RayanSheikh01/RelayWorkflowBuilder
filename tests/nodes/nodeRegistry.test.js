import { describe, test, expect } from "vitest";
import { getNodeDef, getAllNodeTypes } from "../../src/nodes/nodeRegistry.js";

const REQUIRED_TYPES = ["prompt", "llm", "search", "database", "python", "api", "email"];
const REQUIRED_DEF_FIELDS = ["type", "label", "icon", "color", "inputs", "outputs", "defaultData", "schema"];

describe("nodeRegistry", () => {
    test("All 7 types are registered", () => {
        const types = getAllNodeTypes();
        for (const t of REQUIRED_TYPES) {
            expect(types).toContain(t);
        }
        expect(types).toHaveLength(7);
    });

    test("getNodeDef returns a definition object for each valid type", () => {
        for (const t of REQUIRED_TYPES) {
            const def = getNodeDef(t);
            expect(def).toBeDefined();
            expect(typeof def).toBe("object");
        }
    });

    test("Every definition has required fields: type, label, icon, color, inputs, outputs, defaultData, schema", () => {
        for (const t of REQUIRED_TYPES) {
            const def = getNodeDef(t);
            for (const field of REQUIRED_DEF_FIELDS) {
                expect(def, `${t} is missing field '${field}'`).toHaveProperty(field);
            }
        }
    });

    test("Every schema entry has key, type, and label", () => {
        for (const t of REQUIRED_TYPES) {
            const def = getNodeDef(t);
            expect(Array.isArray(def.schema)).toBe(true);
            expect(def.schema.length).toBeGreaterThan(0);

            for (const entry of def.schema) {
                expect(entry, `schema entry in '${t}' missing 'key'`).toHaveProperty("key");
                expect(entry, `schema entry in '${t}' missing 'type'`).toHaveProperty("type");
                expect(entry, `schema entry in '${t}' missing 'label'`).toHaveProperty("label");
            }
        }
    });

    test("defaultData keys match schema keys (no orphaned config fields)", () => {
        for (const t of REQUIRED_TYPES) {
            const def = getNodeDef(t);
            const schemaKeys = def.schema.map(s => s.key);
            const dataKeys = Object.keys(def.defaultData);

            for (const dk of dataKeys) {
                expect(schemaKeys, `defaultData key '${dk}' in '${t}' has no matching schema entry`).toContain(dk);
            }
            for (const sk of schemaKeys) {
                expect(dataKeys, `schema key '${sk}' in '${t}' has no matching defaultData entry`).toContain(sk);
            }
        }
    });

    test("Returns undefined for unknown type", () => {
        expect(getNodeDef("nonexistent")).toBeUndefined();
        expect(getNodeDef("")).toBeUndefined();
    });
});