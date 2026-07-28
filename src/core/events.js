export function emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
}

export function on(eventName, callback) {
    const handler = (event) => callback(event.detail);
    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
}

export function off(eventName, callback) {
    document.removeEventListener(eventName, callback);
}

export function once(eventName, callback) {
    const handler = (event) => {
        callback(event.detail);
        document.removeEventListener(eventName, handler);
    };
    document.addEventListener(eventName, handler);
}