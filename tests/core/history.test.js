import {
    saveState,
    undoState,
    redoState,
    canUndo,
    canRedo,
    clearHistory
} from "../../src/core/history.js";
import { describe, test, expect, beforeEach } from "vitest";

describe("History (undo/redo)", () => {
    beforeEach(() => {
        clearHistory();
    });

    test("Returns null when undoing with no history", () => {
        expect(undoState()).toBeNull();
        expect(canUndo()).toBe(false);
    });

    test("Returns null when redoing with no future", () => {
        saveState({ count: 0 });
        expect(redoState()).toBeNull();
        expect(canRedo()).toBe(false);
    });

    test("Undo returns previous state snapshot", () => {
        saveState({ count: 0 });
        saveState({ count: 1 });
        saveState({ count: 2 });

        expect(canUndo()).toBe(true);
        const prev = undoState();
        expect(prev).toEqual({ count: 1 });
    });

    test("Redo after undo returns the forward state", () => {
        saveState({ count: 0 });
        saveState({ count: 1 });
        saveState({ count: 2 });

        undoState(); // back to { count: 1 }

        expect(canRedo()).toBe(true);
        const forward = redoState();
        expect(forward).toEqual({ count: 2 });
    });

    test("New save after undo discards the redo stack", () => {
        saveState({ count: 0 });
        saveState({ count: 1 });
        saveState({ count: 2 });

        undoState(); // back to { count: 1 }
        saveState({ count: 99 }); // new branch

        expect(canRedo()).toBe(false);
        expect(redoState()).toBeNull();

        const prev = undoState();
        expect(prev).toEqual({ count: 1 });
    });

    test("Snapshots are deep clones (no shared references with original)", () => {
        const original = { nested: { value: 1 } };
        saveState(original);

        // mutate the original after saving
        original.nested.value = 999;

        saveState({ nested: { value: 2 } });
        const restored = undoState();

        // restored snapshot should have the value at save-time, not the mutated value
        expect(restored.nested.value).toBe(1);
        // also confirm it's a different object reference
        expect(restored).not.toBe(original);
        expect(restored.nested).not.toBe(original.nested);
    });
});
