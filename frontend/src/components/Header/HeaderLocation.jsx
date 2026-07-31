import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import GeocodingService from "../../services/GeocodingService";
import { useSavedLocation } from "../../location/LocationContext";
import { useTranslation } from "../../i18n/I18nContext";

import "./HeaderLocation.css";

const SEARCH_DEBOUNCE_MS = 350;

// Replaces the old static "Welcome, {name}" text — this app has one
// user for now, but a place to search/see today's sky from is useful
// every day, unlike a static greeting.
function HeaderLocation() {

    const { t } = useTranslation();
    const { location, setLocation } = useSavedLocation();
    const containerRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const debounceRef = useRef(null);
    const requestIdRef = useRef(0);

    useEffect(() => {

        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    function handleChange(event) {

        const value = event.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {

            const requestId = ++requestIdRef.current;

            if (value.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            setIsSearching(true);

            try {

                const results = await GeocodingService.search(value);

                if (requestId === requestIdRef.current) {
                    setSuggestions(results);
                }

            }
            catch {

                if (requestId === requestIdRef.current) {
                    setSuggestions([]);
                }

            }
            finally {

                if (requestId === requestIdRef.current) {
                    setIsSearching(false);
                }

            }

        }, SEARCH_DEBOUNCE_MS);

    }

    function handleSelect(place) {

        setLocation({
            label: place.label,
            latitude: place.latitude,
            longitude: place.longitude,
            timezoneId: place.timezoneId,
        });

        setQuery("");
        setSuggestions([]);
        setIsOpen(false);

    }

    return (
        <div className="header-location" ref={containerRef}>
            <button
                type="button"
                className="header-location__trigger"
                onClick={() => setIsOpen((open) => !open)}
            >
                <MapPin size={14} className="header-location__icon" />

                <span className="header-location__text">
                    <span className="header-location__label">{t("header.yourLocation")}</span>
                    <span className="header-location__value">{location.label}</span>
                </span>
            </button>

            {isOpen && (
                <div className="header-location__dropdown">
                    <input
                        type="text"
                        className="header-location__input"
                        value={query}
                        placeholder={t("dashboard.today.searchPlaceholder")}
                        onChange={handleChange}
                        autoFocus
                    />

                    {isSearching && (
                        <div className="header-location__status">Searching…</div>
                    )}

                    {suggestions.length > 0 && (
                        <ul className="header-location__suggestions">
                            {suggestions.map((place, index) => (
                                <li key={`${place.label}-${index}`}>
                                    <button
                                        type="button"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            handleSelect(place);
                                        }}
                                    >
                                        {place.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );

}

export default HeaderLocation;
