const THEME_KEY = "tradeflow_theme";

/**
 * Returns the currently active theme (enforced as 'light').
 */
export function getStoredTheme() {
    return "light";
}

/**
 * Applies light theme to documentElement and clears dark mode attributes.
 */
export function setStoredTheme() {
    const nextTheme = "light";
    try {
        localStorage.setItem(THEME_KEY, nextTheme);
    } catch (e) {
        console.warn("Could not save theme to localStorage:", e);
    }

    if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", nextTheme);
        document.documentElement.classList.remove("dark");
    }

    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tradeflow_theme_update", { detail: { theme: nextTheme } }));
    }

    return nextTheme;
}

/**
 * Keeps theme locked to light mode.
 */
export function toggleTheme() {
    return setStoredTheme("light");
}

/**
 * Initializes the theme on application bootstrap.
 */
export function initTheme() {
    return setStoredTheme("light");
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
