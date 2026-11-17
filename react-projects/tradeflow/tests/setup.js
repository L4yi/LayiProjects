// Test environment harness providing in-memory localStorage, sessionStorage, and window event bus
export function initTestEnv() {
    const storageMap = new Map();
    const sessionMap = new Map();

    const createStorage = (map) => ({
        getItem: (key) => map.has(key) ? map.get(key) : null,
        setItem: (key, val) => map.set(key, String(val)),
        removeItem: (key) => map.delete(key),
        clear: () => map.clear(),
        key: (idx) => Array.from(map.keys())[idx] || null,
        get length() { return map.size; }
    });

    const mockLocal = createStorage(storageMap);
    const mockSession = createStorage(sessionMap);

    const listeners = new Map();

    globalThis.localStorage = mockLocal;
    globalThis.sessionStorage = mockSession;

    globalThis.window = {
        localStorage: mockLocal,
        sessionStorage: mockSession,
        addEventListener: (type, cb) => {
            if (!listeners.has(type)) listeners.set(type, []);
            listeners.get(type).push(cb);
        },
        removeEventListener: (type, cb) => {
            if (!listeners.has(type)) return;
            listeners.set(type, listeners.get(type).filter(fn => fn !== cb));
        },
        dispatchEvent: (event) => {
            const handlers = listeners.get(event.type) || [];
            handlers.forEach(fn => fn(event));
            return true;
        }
    };

    if (typeof globalThis.CustomEvent === "undefined") {
        globalThis.CustomEvent = class CustomEvent extends Event {
            constructor(type, init = {}) {
                super(type, init);
                this.detail = init.detail || null;
            }
        };
    }

    return {
        clear: () => {
            storageMap.clear();
            sessionMap.clear();
        },
        listeners
    };
}
