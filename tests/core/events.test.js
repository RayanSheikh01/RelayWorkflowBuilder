import { emit, on, once } from "../../src/core/events.js";
import { describe, test, expect, vi } from "vitest";

describe("Event bus", () => {
    test("Listener is called with correct data when event fires", () => {
        const callback = vi.fn();
        on("test:event", callback);

        emit("test:event", { message: "hello" });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({ message: "hello" });
    });

    test("Unsubscribing (via returned function) prevents future calls", () => {
        const callback = vi.fn();
        const unsubscribe = on("test:unsub", callback);

        emit("test:unsub", "first");
        expect(callback).toHaveBeenCalledTimes(1);

        unsubscribe();
        emit("test:unsub", "second");
        // should NOT have been called again
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("once fires callback only on the first emit", () => {
        const callback = vi.fn();
        once("test:once", callback);

        emit("test:once", "first");
        emit("test:once", "second");
        emit("test:once", "third");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith("first");
    });
});
