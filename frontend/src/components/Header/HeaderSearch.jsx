import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import PersonService from "../../services/PersonService";
import { useTranslation } from "../../i18n/I18nContext";

const MAX_RESULTS = 6;

function matches(person, query) {

    const name = `${person.firstName} ${person.lastName}`.toLowerCase();
    const place = (person.placeOfBirth ?? "").toLowerCase();

    return name.includes(query) || place.includes(query);

}

function HeaderSearch() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [persons, setPersons] = useState([]);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

        let cancelled = false;

        PersonService.list()
            .then((loaded) => {
                if (!cancelled) {
                    setPersons(loaded);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setPersons([]);
                }
            });

        return () => {
            cancelled = true;
        };

    }, []);

    useEffect(() => {

        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const trimmedQuery = query.trim().toLowerCase();

    const results = trimmedQuery
        ? persons.filter((person) => matches(person, trimmedQuery)).slice(0, MAX_RESULTS)
        : [];

    const goToLibrary = () => {

        setIsOpen(false);
        navigate(`/horoscope-library?q=${encodeURIComponent(query.trim())}`);

    };

    const goToPerson = (person) => {

        setIsOpen(false);
        setQuery("");
        navigate(`/person-details?id=${person.id}`);

    };

    const handleKeyDown = (event) => {

        if (event.key === "Enter" && trimmedQuery) {
            goToLibrary();
        }
        else if (event.key === "Escape") {
            setIsOpen(false);
        }

    };

    return (
        <div className="header-search" ref={containerRef}>
            <Search className="header-search__icon" size={16} aria-hidden="true" />

            <input
                type="search"
                className="header-search__input"
                placeholder={t("header.searchPlaceholder")}
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(Boolean(trimmedQuery))}
                onKeyDown={handleKeyDown}
            />

            {isOpen && trimmedQuery && (
                <div className="header-search__dropdown">
                    {results.length === 0 ? (
                        <div className="header-search__empty">
                            {t("header.searchNoResults")}
                        </div>
                    ) : (
                        results.map((person) => (
                            <button
                                key={person.id}
                                type="button"
                                className="header-search__result"
                                onClick={() => goToPerson(person)}
                            >
                                <span className="header-search__result-name">
                                    {person.firstName} {person.lastName}
                                </span>
                                <span className="header-search__result-meta">
                                    {person.dateOfBirth} · {person.placeOfBirth}
                                </span>
                            </button>
                        ))
                    )}

                    <button
                        type="button"
                        className="header-search__view-all"
                        onClick={goToLibrary}
                    >
                        {t("header.searchViewAll", { query: query.trim() })}
                    </button>
                </div>
            )}
        </div>
    );

}

export default HeaderSearch;
