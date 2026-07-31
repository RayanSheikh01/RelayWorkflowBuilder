import { store } from "../store.js";
import { undoState, redoState, saveState } from "./history.js";

// Save initial state
setTimeout(() => saveState(store.getState()), 100);

export function setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
        if (isInput) return;

        // Ctrl + S (Save)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            const btnSave = document.getElementById("btn-save");
            if (btnSave) btnSave.click();
        }

        // Ctrl + Z (Undo)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
            e.preventDefault();
            const state = undoState();
            if (state && state.workflow) {
                store.setState("workflow", state.workflow);
            }
        }

        // Ctrl + Shift + Z or Ctrl + Y (Redo)
        if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && e.shiftKey) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y")) {
            e.preventDefault();
            const state = redoState();
            if (state && state.workflow) {
                store.setState("workflow", state.workflow);
            }
        }

        // Ctrl + A (Select All Nodes - fallback to first node)
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
            e.preventDefault();
            const nodeIds = Object.keys(store.getState().workflow.nodes || {});
            if (nodeIds.length > 0) {
                store.setState("ui.selectedNodeId", nodeIds[0]);
            }
        }
    });

    // Save state on pointerup for history (if workflow changed, ideally, but this is simple version)
    window.addEventListener("pointerup", () => {
        // Just save state when mouse is released
        saveState(store.getState());
    });
}
