import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star } from "lucide-react";

import PersonService from "../../services/PersonService";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

import "./HoroscopeLibrary.css";

const PAGE_SIZE = 10;

const CSV_COLUMNS = [
    "firstName", "lastName", "gender",
    "dateOfBirth", "timeOfBirth", "placeOfBirth",
    "createdAt",
];

// "favourite" is its own explicit sort choice (favourites first, most
// recently added within each group) rather than something silently
// applied under every other sort — otherwise "Name (A-Z)" wouldn't
// actually be alphabetical, which is more surprising than helpful.
function sortPersons(persons, sortKey) {

    const sorted = [...persons];

    if (sortKey === "nameAsc") {
        sorted.sort((a, b) =>
            `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
    }
    else if (sortKey === "dob") {
        sorted.sort((a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth));
    }
    else if (sortKey === "favourite") {
        sorted.sort((a, b) =>
            Number(Boolean(b.isFavourite)) - Number(Boolean(a.isFavourite)) ||
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
    else {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;

}

function exportToCsv(persons) {

    const rows = [
        CSV_COLUMNS,
        ...persons.map((person) => CSV_COLUMNS.map((column) => person[column] ?? "")),
    ];

    const csv = rows
        .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "horoscopes.csv";
    link.click();

    URL.revokeObjectURL(url);

}

function HoroscopeLibrary() {

    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const [requestState, setRequestState] = useState({
        status: "loading",
        persons: [],
        error: null,
    });

    const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
    const [sortKey, setSortKey] = useState("recent");
    const [page, setPage] = useState(1);

    // The header's global search hands off here via ?q=... — re-sync
    // whenever it changes (including repeated searches from the header
    // while already on this page).
    useEffect(() => {

        const queryFromHeader = searchParams.get("q");

        if (queryFromHeader !== null) {
            setSearch(queryFromHeader);
            setPage(1);
        }

    }, [searchParams]);

    const loadPersons = () => {

        setRequestState((previous) => ({ ...previous, status: "loading", error: null }));

        PersonService.list()
            .then((persons) => {
                setRequestState({ status: "success", persons, error: null });
            })
            .catch((error) => {
                setRequestState({ status: "error", persons: [], error: error.message });
            });

    };

    useEffect(() => {
        loadPersons();
    }, []);

    const handleDelete = async (person) => {

        const confirmed = window.confirm(
            t("horoscopeLibrary.deleteConfirm", { name: `${person.firstName} ${person.lastName}` })
        );

        if (!confirmed) {
            return;
        }

        try {
            await PersonService.remove(person.id);
            loadPersons();
        }
        catch (error) {
            window.alert(error.message);
        }

    };

    // Optimistic — flips the star immediately, then rolls back on
    // failure, since waiting on the network for something this small
    // and frequent (a single click, possibly several per session)
    // would make the UI feel laggy for no real benefit.
    const handleToggleFavourite = async (person) => {

        const nextIsFavourite = !person.isFavourite;

        setRequestState((previous) => ({
            ...previous,
            persons: previous.persons.map((candidate) =>
                candidate.id === person.id
                    ? { ...candidate, isFavourite: nextIsFavourite }
                    : candidate
            ),
        }));

        try {
            await PersonService.setFavourite(person.id, nextIsFavourite);
        }
        catch (error) {

            setRequestState((previous) => ({
                ...previous,
                persons: previous.persons.map((candidate) =>
                    candidate.id === person.id
                        ? { ...candidate, isFavourite: person.isFavourite }
                        : candidate
                ),
            }));

            window.alert(error.message);

        }

    };

    const filteredSorted = useMemo(() => {

        const query = search.trim().toLowerCase();

        const filtered = query
            ? requestState.persons.filter((person) => {
                const name = `${person.firstName} ${person.lastName}`.toLowerCase();
                const place = (person.placeOfBirth ?? "").toLowerCase();
                return name.includes(query) || place.includes(query);
            })
            : requestState.persons;

        return sortPersons(filtered, sortKey);

    }, [requestState.persons, search, sortKey]);

    const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filteredSorted.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleSortChange = (event) => {
        setSortKey(event.target.value);
        setPage(1);
    };

    return (
        <main className="page horoscope-library-page">

            <div className="horoscope-library__header">
                <div>
                    <h1 className="page-title">{t("horoscopeLibrary.title")}</h1>
                    <p className="horoscope-library__subtitle">
                        {t("horoscopeLibrary.subtitle")}
                    </p>
                </div>

                <Link to="/person-details">
                    <Button>{t("horoscopeLibrary.newHoroscope")}</Button>
                </Link>
            </div>

            {requestState.status === "loading" && (
                <p className="horoscope-library__status">Loading…</p>
            )}

            {requestState.status === "error" && (
                <p className="horoscope-library__status">{requestState.error}</p>
            )}

            {requestState.status === "success" && (
                <>
                    <Card className="horoscope-library__card" padding="medium" shadow="medium">

                        <div className="horoscope-library__toolbar">
                            <input
                                className="horoscope-library__search"
                                type="search"
                                placeholder={t("horoscopeLibrary.searchPlaceholder")}
                                value={search}
                                onChange={handleSearchChange}
                            />

                            <label className="horoscope-library__sort">
                                {t("horoscopeLibrary.sort.label")}
                                <select value={sortKey} onChange={handleSortChange}>
                                    <option value="recent">{t("horoscopeLibrary.sort.recent")}</option>
                                    <option value="favourite">{t("horoscopeLibrary.sort.favourite")}</option>
                                    <option value="nameAsc">{t("horoscopeLibrary.sort.nameAsc")}</option>
                                    <option value="dob">{t("horoscopeLibrary.sort.dob")}</option>
                                </select>
                            </label>

                            <Button
                                variant="secondary"
                                onClick={() => exportToCsv(filteredSorted)}
                            >
                                {t("horoscopeLibrary.exportCsv")}
                            </Button>
                        </div>

                        {filteredSorted.length === 0 ? (
                            <p className="horoscope-library__empty">
                                {requestState.persons.length === 0
                                    ? t("horoscopeLibrary.emptyAll")
                                    : t("horoscopeLibrary.empty")}
                            </p>
                        ) : (
                            <>
                                <div className="horoscope-library__table-scroll">
                                    <table className="horoscope-library__table">
                                        <thead>
                                            <tr>
                                                <th className="horoscope-library__favourite-col" />
                                                <th>{t("horoscopeLibrary.colName")}</th>
                                                <th>{t("horoscopeLibrary.colDob")}</th>
                                                <th>{t("horoscopeLibrary.colPlace")}</th>
                                                <th>{t("horoscopeLibrary.colCreated")}</th>
                                                <th>{t("horoscopeLibrary.colActions")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageItems.map((person) => (
                                                <tr key={person.id}>
                                                    <td className="horoscope-library__favourite-col">
                                                        <button
                                                            type="button"
                                                            className="horoscope-library__favourite-toggle"
                                                            onClick={() => handleToggleFavourite(person)}
                                                            aria-pressed={Boolean(person.isFavourite)}
                                                            title={
                                                                person.isFavourite
                                                                    ? t("horoscopeLibrary.unfavourite")
                                                                    : t("horoscopeLibrary.favourite")
                                                            }
                                                        >
                                                            <Star
                                                                size={18}
                                                                fill={person.isFavourite ? "currentColor" : "none"}
                                                            />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/person-details?id=${person.id}`}
                                                            className="horoscope-library__name-link"
                                                        >
                                                            <span className="horoscope-library__avatar">
                                                                {person.firstName?.[0]?.toUpperCase()}
                                                            </span>
                                                            {person.firstName} {person.lastName}
                                                        </Link>
                                                    </td>
                                                    <td>{formatDateDDMMYYYY(person.dateOfBirth)} {person.timeOfBirth}</td>
                                                    <td>{person.placeOfBirth}</td>
                                                    <td>{formatDateDDMMYYYY(person.createdAt)}</td>
                                                    <td className="horoscope-library__actions">
                                                        <Link to={`/person-details?id=${person.id}`}>
                                                            {t("horoscopeLibrary.view")}
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="horoscope-library__delete"
                                                            onClick={() => handleDelete(person)}
                                                        >
                                                            {t("horoscopeLibrary.delete")}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="horoscope-library__pagination">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        disabled={currentPage === 1}
                                        onClick={() => setPage(currentPage - 1)}
                                    >
                                        {t("horoscopeLibrary.previous")}
                                    </Button>

                                    <span>
                                        {t("horoscopeLibrary.pageOf", {
                                            current: currentPage,
                                            total: totalPages,
                                        })}
                                    </span>

                                    <Button
                                        variant="secondary"
                                        size="small"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setPage(currentPage + 1)}
                                    >
                                        {t("horoscopeLibrary.next")}
                                    </Button>
                                </div>
                            </>
                        )}

                    </Card>
                </>
            )}

        </main>
    );
}

export default HoroscopeLibrary;
