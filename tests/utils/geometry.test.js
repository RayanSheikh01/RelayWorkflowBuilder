import { describe, test, expect } from "vitest";
import { screenToCanvas, canvasToScreen } from "../../src/utils/geometry.js";

describe("geometry", () => {
    describe("screenToCanvas and canvasToScreen", () => {
        test("Identity at origin with zoom=1", () => {
            const viewport = { x: 0, y: 0, zoom: 1 };
            
            expect(screenToCanvas(100, 200, viewport)).toEqual({ x: 100, y: 200 });
            expect(canvasToScreen(100, 200, viewport)).toEqual({ x: 100, y: 200 });
        });

        test("Accounts for pan offset correctly", () => {
            // Panned 50px right and 50px down
            const viewport = { x: 50, y: 50, zoom: 1 };
            
            // A click at screen (100, 100) should map to canvas (50, 50)
            expect(screenToCanvas(100, 100, viewport)).toEqual({ x: 50, y: 50 });
            
            // A node at canvas (50, 50) should render at screen (100, 100)
            expect(canvasToScreen(50, 50, viewport)).toEqual({ x: 100, y: 100 });
        });

        test("Accounts for zoom correctly", () => {
            // Zoomed in 2x at the origin
            const viewport = { x: 0, y: 0, zoom: 2 };
            
            // A click at screen (100, 100) maps to canvas (50, 50)
            expect(screenToCanvas(100, 100, viewport)).toEqual({ x: 50, y: 50 });
            
            // A node at canvas (50, 50) renders at screen (100, 100)
            expect(canvasToScreen(50, 50, viewport)).toEqual({ x: 100, y: 100 });
        });

        test("Accounts for both pan and zoom combined", () => {
            // Panned and zoomed
            const viewport = { x: 100, y: -50, zoom: 0.5 };
            
            // Screen (200, 50) -> subtract pan (100, 100) -> divide zoom -> Canvas (200, 200)
            expect(screenToCanvas(200, 50, viewport)).toEqual({ x: 200, y: 200 });
            
            // Canvas (200, 200) -> multiply zoom -> add pan -> Screen (200, 50)
            expect(canvasToScreen(200, 200, viewport)).toEqual({ x: 200, y: 50 });
        });

        test("canvasToScreen is the inverse of screenToCanvas (round-trip)", () => {
            const viewport = { x: -123, y: 456, zoom: 1.25 };
            const screenX = 800;
            const screenY = 600;
            
            const canvasPoint = screenToCanvas(screenX, screenY, viewport);
            const returnedScreen = canvasToScreen(canvasPoint.x, canvasPoint.y, viewport);
            
            // Floating point math might have tiny inaccuracies, so checking close to
            expect(returnedScreen.x).toBeCloseTo(screenX);
            expect(returnedScreen.y).toBeCloseTo(screenY);
        });
    });
});
