import { createStore } from "../../src/core/state.js";
import { describe, test, expect, vi } from "vitest";

describe("createStore", () => {
    test("Returns state with initial values", () => {
        const initialState = {
            name: "Name",
            nodes: {},
            edges: {},
            canvas: { x: 0, y: 0, zoom: 1 },
            history: []
        };
        const store = createStore(initialState);
        expect(store.getState()).toEqual(initialState);
    });

    test("Updates state via setState(key, value)", () => {
        const store = createStore({ name: "Old" });
        store.setState("name", "New");
        expect(store.getState().name).toBe("New");
    });

    test("Updates nested state via dot-path", () => {
        const store = createStore({
            workflow: { name: "Untitled", version: 1 }
        });
        store.setState("workflow.name", "My Workflow");
        expect(store.getState().workflow.name).toBe("My Workflow");
        // other nested keys should be untouched
        expect(store.getState().workflow.version).toBe(1);
    });

    test("Notifies all subscribers on setState", () => {
        const store = createStore({ count: 0 });
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        store.subscribe(listener1);
        store.subscribe(listener2);
        store.setState("count", 1);

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
        // listeners receive the current state
        expect(listener1).toHaveBeenCalledWith(expect.objectContaining({ count: 1 }));
    });

    test("Stops notifying after unsubscribe()", () => {
        const store = createStore({ count: 0 });
        const listener = vi.fn();

        const unsubscribe = store.subscribe(listener);
        store.setState("count", 1);
        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe();
        store.setState("count", 2);
        // should NOT have been called again
        expect(listener).toHaveBeenCalledTimes(1);
    });

    test("Supports multiple concurrent subscribers", () => {
        const store = createStore({ a: 0, b: 0 });
        const calls = [];

        const unsub1 = store.subscribe(() => calls.push("A"));
        const unsub2 = store.subscribe(() => calls.push("B"));
        const unsub3 = store.subscribe(() => calls.push("C"));

        store.setState("a", 1);
        expect(calls).toEqual(["A", "B", "C"]);

        // unsubscribe the middle one
        unsub2();
        store.setState("b", 1);
        expect(calls).toEqual(["A", "B", "C", "A", "C"]);
    });
});