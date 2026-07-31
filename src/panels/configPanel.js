import { store } from "../store.js";
import { getNodeDef } from "../nodes/nodeRegistry.js";

let lastSelectedId = null;
let lastStatus = null;
let lastOutput = undefined;

export function setupConfigPanel() {
    store.subscribe((state) => {
        const selectedId = state.ui.selectedNodeId;
        const node = selectedId ? state.workflow.nodes[selectedId] : null;

        let needsRender = false;

        if (selectedId !== lastSelectedId) {
            needsRender = true;
        } else if (node) {
            if (node.status !== lastStatus || node.output !== lastOutput) {
                needsRender = true;
            }
        }

        if (needsRender) {
            lastSelectedId = selectedId;
            lastStatus = node ? node.status : null;
            lastOutput = node ? node.output : undefined;
            renderConfigForm(node, selectedId);
        }
    });
}

export function renderConfigForm(node, nodeId) {
    const formContainer = document.getElementById("config-content");
    formContainer.innerHTML = "";
    
    // Trigger animation
    formContainer.classList.remove("config-entering");
    void formContainer.offsetWidth; // trigger reflow
    formContainer.classList.add("config-entering");

    if (!node) {
        formContainer.innerHTML = `
          <div id="config-empty" class="config-placeholder">
            <p>Select a node to configure</p>
          </div>
        `;
        return;
    }

    const def = getNodeDef(node.type);
    if (!def) return;

    const schema = def.schema || [];

    // Header
    const header = document.createElement("div");
    header.className = "config-header";
    header.innerHTML = `<h3>${def.icon} ${def.label}</h3>`;
    formContainer.appendChild(header);

    // Tabs
    const tabs = document.createElement("div");
    tabs.style.display = "flex";
    tabs.style.gap = "16px";
    tabs.style.padding = "0 var(--space-md)";
    tabs.style.borderBottom = "1px solid var(--border)";
    tabs.style.marginBottom = "16px";

    const btnSettings = document.createElement("button");
    btnSettings.textContent = "Settings";
    btnSettings.style.background = "none";
    btnSettings.style.border = "none";
    btnSettings.style.color = "var(--text-primary)";
    btnSettings.style.padding = "8px 0";
    btnSettings.style.borderBottom = "2px solid var(--accent-primary)";
    btnSettings.style.cursor = "pointer";

    const btnOutput = document.createElement("button");
    btnOutput.textContent = "Output";
    btnOutput.style.background = "none";
    btnOutput.style.border = "none";
    btnOutput.style.color = "var(--text-muted)";
    btnOutput.style.padding = "8px 0";
    btnOutput.style.borderBottom = "2px solid transparent";
    btnOutput.style.cursor = "pointer";

    tabs.appendChild(btnSettings);
    tabs.appendChild(btnOutput);
    formContainer.appendChild(tabs);

    const form = document.createElement("div");
    form.className = "config-form";
    
    const outputView = document.createElement("div");
    outputView.style.padding = "0 var(--space-md)";
    outputView.style.display = "none";
    
    if (node.status === 'success' && node.output !== undefined) {
        const outStr = typeof node.output === 'object' ? JSON.stringify(node.output, null, 2) : String(node.output);
        outputView.innerHTML = `<pre style="white-space: pre-wrap; font-size: 12px; color: var(--text-primary); background: var(--bg-elevated); padding: 8px; border-radius: 4px;">${outStr.replace(/</g, '&lt;')}</pre>`;
    } else if (node.status === 'error') {
        outputView.innerHTML = `<div style="color: var(--accent-error); font-size: 12px; background: rgba(248, 113, 113, 0.1); padding: 8px; border-radius: 4px;">Error: ${node.error}</div>`;
    } else if (node.status === 'running') {
        outputView.innerHTML = `<div style="color: var(--accent-warning); font-size: 12px;">Running...</div>`;
    } else {
        outputView.innerHTML = `<div style="color: var(--text-muted); font-size: 12px;">No output yet</div>`;
    }

    btnSettings.addEventListener("click", () => {
        btnSettings.style.color = "var(--text-primary)";
        btnSettings.style.borderBottom = "2px solid var(--accent-primary)";
        btnOutput.style.color = "var(--text-muted)";
        btnOutput.style.borderBottom = "2px solid transparent";
        form.style.display = "block";
        outputView.style.display = "none";
    });

    btnOutput.addEventListener("click", () => {
        btnOutput.style.color = "var(--text-primary)";
        btnOutput.style.borderBottom = "2px solid var(--accent-primary)";
        btnSettings.style.color = "var(--text-muted)";
        btnSettings.style.borderBottom = "2px solid transparent";
        form.style.display = "none";
        outputView.style.display = "block";
    });

    schema.forEach((field) => {
        const fieldContainer = document.createElement("div");
        fieldContainer.classList.add("form-field");

        const label = document.createElement("label");
        label.textContent = field.label || field.key;
        label.setAttribute("for", `config_${field.key}`);
        fieldContainer.appendChild(label);

        let inputElement;

        const updateState = (val) => {
            store.setState(`workflow.nodes.${nodeId}.data.${field.key}`, val);
        };

        switch (field.type) {
            case "text":
            case "password":
            case "number":
                inputElement = document.createElement("input");
                inputElement.type = field.type;
                if (field.min !== undefined) inputElement.min = field.min;
                if (field.max !== undefined) inputElement.max = field.max;
                if (field.step !== undefined) inputElement.step = field.step;
                inputElement.value = node.data[field.key] ?? "";
                inputElement.addEventListener("input", (e) => updateState(field.type === "number" ? Number(e.target.value) : e.target.value));
                fieldContainer.appendChild(inputElement);
                break;

            case "textarea":
                inputElement = document.createElement("textarea");
                inputElement.value = node.data[field.key] ?? "";
                inputElement.addEventListener("input", (e) => updateState(e.target.value));
                fieldContainer.appendChild(inputElement);
                break;

            case "select":
                inputElement = document.createElement("select");
                field.options.forEach((option) => {
                    const opt = document.createElement("option");
                    opt.value = option.value || option;
                    opt.textContent = option.label || option;
                    inputElement.appendChild(opt);
                });
                inputElement.value = node.data[field.key] ?? "";
                inputElement.addEventListener("change", (e) => updateState(e.target.value));
                fieldContainer.appendChild(inputElement);
                break;

            case "slider":
                const sliderContainer = document.createElement("div");
                sliderContainer.className = "slider-container";
                sliderContainer.style.display = "flex";
                sliderContainer.style.alignItems = "center";
                sliderContainer.style.gap = "8px";

                inputElement = document.createElement("input");
                inputElement.type = "range";
                inputElement.min = field.min || 0;
                inputElement.max = field.max || 100;
                inputElement.step = field.step || 1;
                inputElement.value = node.data[field.key] ?? 0;
                inputElement.style.flex = "1";

                const valDisplay = document.createElement("span");
                valDisplay.textContent = inputElement.value;
                valDisplay.className = "slider-value";
                valDisplay.style.minWidth = "30px";

                inputElement.addEventListener("input", (e) => {
                    valDisplay.textContent = e.target.value;
                    updateState(Number(e.target.value));
                });

                sliderContainer.appendChild(inputElement);
                sliderContainer.appendChild(valDisplay);
                fieldContainer.appendChild(sliderContainer);
                break;

            case "key-value":
                inputElement = document.createElement("div");
                inputElement.className = "key-value-container";

                const data = node.data[field.key] || {};

                const renderKV = () => {
                    inputElement.innerHTML = "";
                    Object.entries(data).forEach(([k, v]) => {
                        const row = document.createElement("div");
                        row.className = "kv-row";
                        row.style.display = "flex";
                        row.style.gap = "4px";
                        row.style.marginBottom = "4px";

                        const keyInp = document.createElement("input");
                        keyInp.type = "text";
                        keyInp.value = k;
                        keyInp.placeholder = "Key";
                        keyInp.style.flex = "1";
                        keyInp.style.minWidth = "0";

                        const valInp = document.createElement("input");
                        valInp.type = "text";
                        valInp.value = v;
                        valInp.placeholder = "Value";
                        valInp.style.flex = "1";
                        valInp.style.minWidth = "0";

                        const delBtn = document.createElement("button");
                        delBtn.textContent = "×";
                        delBtn.className = "btn-icon";
                        delBtn.style.padding = "0 8px";

                        const updateKV = () => {
                            const newData = {};
                            Array.from(inputElement.querySelectorAll(".kv-row")).forEach(r => {
                                const key = r.querySelector("input:nth-child(1)").value;
                                const value = r.querySelector("input:nth-child(2)").value;
                                if (key) newData[key] = value;
                            });
                            updateState(newData);
                        };

                        keyInp.addEventListener("input", updateKV);
                        valInp.addEventListener("input", updateKV);
                        delBtn.addEventListener("click", () => {
                            delete data[k];
                            renderKV();
                            updateKV();
                        });

                        row.appendChild(keyInp);
                        row.appendChild(valInp);
                        row.appendChild(delBtn);
                        inputElement.appendChild(row);
                    });

                    const addBtn = document.createElement("button");
                    addBtn.textContent = "+ Add";
                    addBtn.className = "btn-secondary btn-sm";
                    addBtn.style.marginTop = "4px";
                    addBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        data[""] = "";
                        renderKV();
                    });
                    inputElement.appendChild(addBtn);
                };

                renderKV();
                fieldContainer.appendChild(inputElement);
                break;

            default:
                console.warn(`Unsupported field type: ${field.type}`);
        }

        if (inputElement && inputElement.id === undefined) {
            inputElement.id = `config_${field.key}`;
        }
        form.appendChild(fieldContainer);
    });

    formContainer.appendChild(form);
    formContainer.appendChild(outputView);
}