import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import PersonService from "../../services/PersonService";
import { useTranslation } from "../../i18n/I18nContext";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";

import "./HoroscopeLibrary.css";

const PAGE_SIZE = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

const CSV_COLUMNS = [
    "firstName", "lastName", "gender",
    "dateOfBirth", "timeOfBirth", "placeOfBirth",
    "createdAt",
];

function isSameLocalMonth(isoString, reference) {

    const date = new Date(isoString);

    return (
        date.getFullYear() === reference.getFullYear() &&
        date.getMonth() === reference.getMonth()
    );

}

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

    const stats = useMemo(() => {

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * DAY_MS);

        return {
            total: requestState.persons.length,
            addedThisMonth: requestState.persons.filter((person) =>
                isSameLocalMonth(person.createdAt, now)
            ).length,
            addedThisWeek: requestState.persons.filter(
                (person) => new Date(person.createdAt) >= weekAgo
            ).length,
        };

    }, [requestState.persons]);

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
                    <div className="horoscope-library__stats">
                        <StatCard label={t("horoscopeLibrary.stats.total")} value={stats.total} />
                        <StatCard
                            label={t("horoscopeLibrary.stats.addedThisMonth")}
                            value={stats.addedThisMonth}
                        />
                        <StatCard
                            label={t("horoscopeLibrary.stats.addedThisWeek")}
                            value={stats.addedThisWeek}
                        />
                    </div>

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
                                                    <td>
                                                        <span className="horoscope-library__avatar">
                                                            {person.firstName?.[0]?.toUpperCase()}
                                                        </span>
                                                        {person.firstName} {person.lastName}
                                                    </td>
                                                    <td>{person.dateOfBirth} {person.timeOfBirth}</td>
                                                    <td>{person.placeOfBirth}</td>
                                                    <td>{new Date(person.createdAt).toLocaleDateString()}</td>
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
