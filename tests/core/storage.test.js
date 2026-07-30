import { describe, test, expect } from "vitest";
import { saveWorkflow, loadWorkflow, listWorkflows, deleteWorkflow } from "../../src/core/storage.js";

describe("Storage functions", () => {
    test("Save and load round-trips correctly", () => {
        const workflowData = {
            nodes: {
                node1: { type: "typeA", data: { key: "value" } },
                node2: { type: "typeB", data: { key: "value2" } },
            },
            edges: {
                edge1: { sourceNodeId: "node1", targetNodeId: "node2" },
            },
            viewport: { x: 100, y: 200, zoom: 1.5 },
        };

        const workflowId = saveWorkflow("test-id", workflowData);
        const loadedData = loadWorkflow(workflowId);

        expect(loadedData).toEqual(workflowData);
    });

    test("Returns null for nonexistent workflow ID", () => {
        const loadedData = loadWorkflow("nonexistent-id");
        expect(loadedData).toBeNull();
    });

    test("Lists multiple saved workflows", () => {
        const workflowData1 = {
            nodes: { node1: { type: "typeA", data: { key: "value" } } },
            edges: {},
            viewport: { x: 100, y: 200, zoom: 1.5 },
        };

        const workflowData2 = {
            nodes: { node2: { type: "typeB", data: { key: "value2" } } },
            edges: {},
            viewport: { x: 300, y: 400, zoom: 2.0 },
        };

        const workflowId1 = saveWorkflow("test-id-1", workflowData1);
        const workflowId2 = saveWorkflow("test-id-2", workflowData2);

        const listedWorkflows = listWorkflows();
        expect(listedWorkflows).toContain(workflowId1);
        expect(listedWorkflows).toContain(workflowId2);
    });

    test("Delete removes the workflow", () => {
        const workflowData = {
            nodes: { node1: { type: "typeA", data: { key: "value" } } },
            edges: {},
            viewport: { x: 100, y: 200, zoom: 1.5 },
        };

        const workflowId = saveWorkflow("test-id", workflowData);
        deleteWorkflow(workflowId);
        const loadedData = loadWorkflow(workflowId);
        expect(loadedData).toBeNull();
    });

    test("Re-saving overwrites existing workflow data", () => {
        const initialData = {
            nodes: { node1: { type: "typeA", data: { key: "value" } } },
            edges: {},
            viewport: { x: 100, y: 200, zoom: 1.5 },
        };

        const updatedData = {
            nodes: { node1: { type: "typeA", data: { key: "newValue" } } },
            edges: {},
            viewport: { x: 300, y: 400, zoom: 2.0 },
        };

        const workflowId = saveWorkflow("test-id", initialData);
        saveWorkflow(workflowId, updatedData);
        const loadedData = loadWorkflow(workflowId);
        expect(loadedData).toEqual(updatedData);
    });

})