import { store } from "../store.js";
import { saveWorkflow, loadWorkflow } from "../core/storage.js";
import { executeWorkflow } from "../engine/executor.js";

let currentWorkflowId = "default";

// Viewport lives under ui, but persists with the workflow blob.
function snapshotWorkflow() {
    const state = store.getState();
    return { ...state.workflow, viewport: state.ui.viewport };
}

export function setupTopbar() {
    const btnSave = document.getElementById("btn-save");
    const inputName = document.getElementById("workflow-name");

    // Try to load existing workflow on startup
    const loadedData = loadWorkflow(currentWorkflowId);
    if (loadedData) {
        // We do a merge to ensure we don't wipe out structures if loadedData is malformed
        const { viewport, ...workflow } = loadedData;
        const currentState = store.getState().workflow;
        store.setState("workflow", { ...currentState, ...workflow });

        if (viewport) {
            store.setState("ui.viewport", viewport);
        }

        if (loadedData.name) {
            inputName.value = loadedData.name;
        }
    } else {
        store.setState("workflow.name", inputName.value);
    }

    let saveTimeout;
    // Sync input name with state and auto-save
    inputName.addEventListener("input", (e) => {
        store.setState("workflow.name", e.target.value);
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveWorkflow(currentWorkflowId, snapshotWorkflow());
            
            // Visual feedback
            if (btnSave) {
                const originalText = btnSave.textContent;
                btnSave.textContent = "Auto-saved";
                btnSave.disabled = true;
                setTimeout(() => {
                    btnSave.textContent = originalText;
                    btnSave.disabled = false;
                }, 1000);
            }
        }, 800);
    });

    // Save button click
    btnSave.addEventListener("click", () => {
        saveWorkflow(currentWorkflowId, snapshotWorkflow());

        // Visual feedback
        const originalText = btnSave.textContent;
        btnSave.textContent = "Saved!";
        btnSave.disabled = true;
        setTimeout(() => {
            btnSave.textContent = originalText;
            btnSave.disabled = false;
        }, 1500);
    });

    // Execute button click
    const btnExecute = document.getElementById("btn-execute");
    if (btnExecute) {
        btnExecute.addEventListener("click", () => {
            executeWorkflow(store);
        });
    }
}
