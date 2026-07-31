import { createContext, useCallback, useContext, useState } from "react";

/* ==========================================================
   A small client-side preference (same storage pattern as the
   language switcher — see i18n/I18nContext.jsx), not shared/
   synced data. Powers the Header's "Your Location" control and
   the Dashboard's "Today" widgets (Gochara Summary, Panchangam),
   which both key off this single shared value.

   Named useSavedLocation, not useLocation — react-router-dom
   already exports a useLocation hook (route location), and this
   file is imported alongside it in places like Header.jsx.
========================================================== */

const STORAGE_KEY = "jp_today_location";

const DEFAULT_LOCATION = Object.freeze({
    label: "Hyderabad, Telangana, India",
    latitude: 17.385,
    longitude: 78.4867,
    timezoneId: "Asia/Kolkata",
});

const LocationContext = createContext(null);

function readStored() {

    try {

        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;

    } catch {

        return null;

    }

}

export function LocationProvider({ children }) {

    const [location, setLocationState] = useState(() => readStored() ?? DEFAULT_LOCATION);

    const setLocation = useCallback((next) => {

        setLocationState(next);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    }, []);

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            {children}
        </LocationContext.Provider>
    );

}

export function useSavedLocation() {

    const context = useContext(LocationContext);

    if (!context) {
        throw new Error("useSavedLocation must be used within a LocationProvider.");
    }

    return context;

}
