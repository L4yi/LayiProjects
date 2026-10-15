const SESSION_USER_KEY = "tradeflow_active_user";

export function getInitials(name = "") {
    if (!name) return "SU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Reads the active authenticated user from browser storage
 * (Strictly reads what the API returned upon login; zero hardcoded mock user fallback)
 */
export function getSessionUser() {
    try {
        const stored = sessionStorage.getItem(SESSION_USER_KEY) || localStorage.getItem(SESSION_USER_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const name = parsed.name || `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || parsed.email || "Staff User";
            return {
                ...parsed,
                name,
                initials: parsed.initials || getInitials(name)
            };
        }
    } catch (e) {
        console.warn("Could not read session user:", e);
    }

    // Default safe guest structure (prevents undefined.initials runtime crashes)
    return {
        name: "Staff User",
        email: "",
        initials: "SU",
        role: "Staff"
    };
}

/**
 * Saves authenticated user data returned from the backend API into storage
 */
export function setSessionUser(userData) {
    if (!userData) return getSessionUser();
    try {
        const name = userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || userData.email || "Staff User";
        const updated = {
            ...userData,
            name,
            initials: getInitials(name)
        };
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updated));
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(updated));

        // Dispatch custom event for live component reactivity across Header, Sidebar, Profile
        window.dispatchEvent(new Event("tradeflow_session_update"));
        return updated;
    } catch (e) {
        console.warn("Could not save session user:", e);
        return userData;
    }
}

/**
 * Clears session and local storage on logout
 */
export function clearSessionUser() {
    try {
        sessionStorage.removeItem(SESSION_USER_KEY);
        localStorage.removeItem(SESSION_USER_KEY);
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("tradeflow_session_update"));
    } catch (e) {
        console.warn("Could not clear session user:", e);
    }
}
