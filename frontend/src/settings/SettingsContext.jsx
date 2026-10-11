import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import SettingsService from "../services/SettingsService";

/*
 * Application settings held on the server (see SettingsRepository on
 * the backend). The defaults below mirror the server's, so the UI has
 * sensible values before the first response arrives.
 */

export const DEFAULT_SETTINGS = Object.freeze({
    version: 1,
    branding: Object.freeze({
        invocationLine: "ఓం నమః శివాయ",
        blessingLine: "శ్రీ శ్రీ శ్రీ ఆచార్య ప్రబోధానంద యోగీశ్వరులవారి దివ్య ఆశీస్సులతో",
        astrologerName: "",
        organisation: "",
        contact: "",
        footerNote: "",
    }),
    dasha: Object.freeze({
        windowDays: 30,
        showChip: true,
    }),
});

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [status, setStatus] = useState("loading");

    useEffect(() => {

        let cancelled = false;

        SettingsService.get()
            .then((loaded) => {
                if (!cancelled) {
                    setSettings(loaded);
                    setStatus("ready");
                }
            })
            .catch(() => {
                // Keep working on the defaults if the server is unreachable.
                if (!cancelled) {
                    setStatus("error");
                }
            });

        return () => {
            cancelled = true;
        };

    }, []);

    const save = useCallback(async (patch) => {

        const saved = await SettingsService.update(patch);
        setSettings(saved);
        setStatus("ready");

        return saved;

    }, []);

    const reset = useCallback(async () => {

        const saved = await SettingsService.reset();
        setSettings(saved);

        return saved;

    }, []);

    const value = useMemo(
        () => ({ settings, status, save, reset }),
        [settings, status, save, reset]
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );

}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {

    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error("useSettings must be used inside <SettingsProvider>.");
    }

    return context;

}
