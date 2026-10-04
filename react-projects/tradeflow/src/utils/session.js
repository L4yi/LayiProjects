import { CURRENT_USER } from "../data/storeData";

const SESSION_USER_KEY = "tradeflow_active_user";

export function getInitials(name = "") {
    if (!name) return "TU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getSessionUser() {
    try {
        const stored = sessionStorage.getItem(SESSION_USER_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...CURRENT_USER,
                ...parsed,
                initials: parsed.initials || getInitials(parsed.name || CURRENT_USER.name)
            };
        }
    } catch (e) {
        console.warn("Could not read session user:", e);
    }

    const defaultUser = {
        ...CURRENT_USER,
        initials: CURRENT_USER.initials || getInitials(CURRENT_USER.name)
    };
    
    // Initialize session if empty
    try {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(defaultUser));
    } catch (e) {}

    return defaultUser;
}

export function setSessionUser(userData) {
    try {
        const current = getSessionUser();
        const updated = {
            ...current,
            ...userData,
            initials: getInitials(userData.name || current.name)
        };
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updated));
        // Dispatch storage event for live tab/component reactivity
        window.dispatchEvent(new Event("tradeflow_session_update"));
        return updated;
    } catch (e) {
        console.warn("Could not save session user:", e);
        return userData;
    }
}
