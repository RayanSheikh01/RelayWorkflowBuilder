import { store } from "../store.js";
import { saveWorkflow, loadWorkflow } from "../core/storage.js";
import { executeWorkflow } from "../engine/executor.js";

let currentWorkflowId = "default";

export function setupTopbar() {
    const btnSave = document.getElementById("btn-save");
    const inputName = document.getElementById("workflow-name");

    // Try to load existing workflow on startup
    const loadedData = loadWorkflow(currentWorkflowId);
    if (loadedData) {
        // We do a merge to ensure we don't wipe out structures if loadedData is malformed
        const currentState = store.getState().workflow;
        store.setState("workflow", { ...currentState, ...loadedData });

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
            const workflowData = store.getState().workflow;
            saveWorkflow(currentWorkflowId, workflowData);
            
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
        const workflowData = store.getState().workflow;
        saveWorkflow(currentWorkflowId, workflowData);

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
