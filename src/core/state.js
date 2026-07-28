export function createStore(initialState) {
    const state = new Proxy(initialState, {
        set(target, property, value) {
            target[property] = value;
            return true;
        }
    });

    const listeners = new Set();

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    const notify = () => {
        listeners.forEach(listener => listener(state));
    };

    let getState = () => state;
    let setState = (path, value) => {
        const keys = path.split('.');
        let current = state;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        notify();
    };

    return {
        state,
        subscribe,
        notify,
        getState,
        setState
    };

}