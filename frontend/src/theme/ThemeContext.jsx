import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
 * Light / Dark / System. This is a per-device preference, so it lives
 * in the browser (not with the server-side settings). The resolved
 * theme is applied as <html data-theme="light|dark">, which variables.css
 * keys the dark palette off. index.html applies the stored choice
 * before React starts so there is no flash of the wrong theme.
 */

const STORAGE_KEY = "jp_theme";
const CHOICES = ["light", "dark", "system"];

const ThemeContext = createContext(null);

function readChoice() {

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return CHOICES.includes(stored) ? stored : "system";
    }
    catch {
        return "system";
    }

}

function systemPrefersDark() {

    return typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-color-scheme: dark)").matches;

}

function apply(choice) {

    const resolved = choice === "system"
        ? (systemPrefersDark() ? "dark" : "light")
        : choice;

    document.documentElement.dataset.theme = resolved;

    return resolved;

}

export function ThemeProvider({ children }) {

    const [choice, setChoiceState] = useState(readChoice);
    const [resolved, setResolved] = useState(() => apply(readChoice()));

    useEffect(() => {

        setResolved(apply(choice));

        if (choice !== "system" || typeof window.matchMedia !== "function") {
            return undefined;
        }

        // Follow the OS while "System" is selected.
        const query = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => setResolved(apply("system"));

        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);

    }, [choice]);

    const setChoice = useCallback((next) => {

        if (!CHOICES.includes(next)) {
            return;
        }

        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        }
        catch {
            // storage unavailable — the choice just won't persist
        }

        setChoiceState(next);

    }, []);

    const value = useMemo(
        () => ({ choice, resolved, setChoice }),
        [choice, resolved, setChoice]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {

    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside <ThemeProvider>.");
    }

    return context;

}
