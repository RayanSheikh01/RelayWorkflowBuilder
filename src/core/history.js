let stateSnapshots = [];
let currentStateIndex = -1;

export function saveState(state) {
    stateSnapshots = stateSnapshots.slice(0, currentStateIndex + 1);
    stateSnapshots.push(JSON.parse(JSON.stringify(state)));
    currentStateIndex++;
}

export function undoState() {
    if (currentStateIndex > 0) {
        currentStateIndex--;
        return stateSnapshots[currentStateIndex];
    }
    return null;
}

export function redoState() {
    if (currentStateIndex < stateSnapshots.length - 1) {
        currentStateIndex++;
        return stateSnapshots[currentStateIndex];
    }
    return null;
}

export function canUndo() {
    return currentStateIndex > 0;
}

export function canRedo() {
    return currentStateIndex < stateSnapshots.length - 1;
}

export function clearHistory() {
    stateSnapshots = [];
    currentStateIndex = -1;
}

export function wireToCtrlZ(notify) {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
            undoState();
            notify();
        }
        if (e.ctrlKey && e.key === 'y') {
            redoState();
            notify();
        }
    })
};