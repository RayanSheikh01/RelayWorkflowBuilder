
export function saveWorkflow(id, data) {
    const key = `relay_wf_${id}`;
    localStorage.setItem(key, JSON.stringify(data));
    return id;
}

export function loadWorkflow(id) {
    const key = `relay_wf_${id}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function listWorkflows() {
    const workflows = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("relay_wf_")) {
            workflows.push(key.substring("relay_wf_".length));
        }
    }
    return workflows;
}

export function deleteWorkflow(id) {
    const key = `relay_wf_${id}`;
    localStorage.removeItem(key);
}

