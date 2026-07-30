import { createContext, useCallback, useContext, useMemo, useState } from "react";

import translations from "./translations";

const STORAGE_KEY = "jp_language";
const DEFAULT_LANGUAGE = "en";

const I18nContext = createContext(null);

function readDictionaryValue(language, key) {

    const path = key.split(".");
    let node = translations[language];

    for (const segment of path) {
        node = node?.[segment];
    }

    return typeof node === "string" ? node : null;

}

function interpolate(template, vars) {

    if (!vars) {
        return template;
    }

    return template.replace(/{{\s*(\w+)\s*}}/g, (match, name) =>
        Object.hasOwn(vars, name) ? vars[name] : match
    );

}

export function LanguageProvider({ children }) {

    const [language, setLanguageState] = useState(() => {

        const stored = window.localStorage.getItem(STORAGE_KEY);

        return stored && translations[stored] ? stored : DEFAULT_LANGUAGE;

    });

    const setLanguage = useCallback((nextLanguage) => {

        if (!translations[nextLanguage]) {
            return;
        }

        setLanguageState(nextLanguage);
        window.localStorage.setItem(STORAGE_KEY, nextLanguage);

    }, []);

    const t = useCallback((key, vars) => {

        const value =
            readDictionaryValue(language, key) ??
            readDictionaryValue(DEFAULT_LANGUAGE, key) ??
            key;

        return interpolate(value, vars);

    }, [language]);

    const value = useMemo(
        () => ({ language, setLanguage, t }),
        [language, setLanguage, t]
    );

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );

}

export function useTranslation() {

    const context = useContext(I18nContext);

    if (!context) {
        throw new Error("useTranslation must be used within a LanguageProvider.");
    }

    return context;

}
