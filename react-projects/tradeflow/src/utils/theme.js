const THEME_KEY = "tradeflow_theme";

/**
 * Returns the currently active theme ('light' or 'dark').
 * Defaults to localStorage, or system preference if not explicitly set.
 */
export function getStoredTheme() {
    if (typeof window === "undefined") return "light";
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === "dark" || stored === "light") {
            return stored;
        }
        // Fallback to system preference
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
    } catch (e) {
        console.warn("Could not read theme from localStorage:", e);
    }
    return "light";
}

/**
 * Applies the given theme to documentElement and saves it to localStorage.
 */
export function setStoredTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    try {
        localStorage.setItem(THEME_KEY, nextTheme);
    } catch (e) {
        console.warn("Could not save theme to localStorage:", e);
    }

    if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", nextTheme);
        if (nextTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tradeflow_theme_update", { detail: { theme: nextTheme } }));
    }

    return nextTheme;
}

/**
 * Toggles between 'light' and 'dark' themes.
 */
export function toggleTheme() {
    const current = getStoredTheme();
    const next = current === "dark" ? "light" : "dark";
    return setStoredTheme(next);
}

/**
 * Initializes the theme on application bootstrap.
 */
export function initTheme() {
    const active = getStoredTheme();
    setStoredTheme(active);
    return active;
}

// Cross-tab synchronization
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === THEME_KEY) {
            const next = e.newValue === "dark" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", next);
            if (next === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            window.dispatchEvent(new CustomEvent("tradeflow_theme_update", { detail: { theme: next } }));
        }
    });

    // Run on script execution
    initTheme();
}

export default {
    getStoredTheme,
    setStoredTheme,
    toggleTheme,
    initTheme
};
