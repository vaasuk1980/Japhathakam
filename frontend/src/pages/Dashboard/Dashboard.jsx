import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PersonService from "../../services/PersonService";
import GenerateKundaliService from "../../services/GenerateKundaliService";
import isCurrentPeriod from "../../utils/dasha/isCurrentPeriod";
import formatLocalDateTime from "../../utils/dasha/formatLocalDateTime";
import { DASHA_GRAHA_NAMES } from "../../kundali/constants/DashaGrahaNames";
import getGreetingKey from "../../utils/greeting/getGreetingKey";
import { useTranslation } from "../../i18n/I18nContext";
import menuItems from "../../components/Sidebar/menuConfig";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";

import "./Dashboard.css";

const RECENT_COUNT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

function findActivePeriod(periods) {

    return (Array.isArray(periods) ? periods : []).find((period) => isCurrentPeriod(period)) ?? null;

}

function isSameLocalDay(isoString, reference) {

    const date = new Date(isoString);

    return (
        date.getFullYear() === reference.getFullYear() &&
        date.getMonth() === reference.getMonth() &&
        date.getDate() === reference.getDate()
    );

}

function usePersons() {

    const [state, setState] = useState({ status: "loading", persons: [], error: null });

    useEffect(() => {

        let cancelled = false;

        PersonService.list()
            .then((persons) => {
                if (!cancelled) {
                    setState({ status: "success", persons, error: null });
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setState({ status: "error", persons: [], error: error.message });
                }
            });

        return () => {
            cancelled = true;
        };

    }, []);

    return state;

}

function useCurrentDasha(person) {

    const [state, setState] = useState({ status: "idle", dasha: null });

    useEffect(() => {

        if (!person) {
            setState({ status: "idle", dasha: null });
            return;
        }

        let cancelled = false;

        setState({ status: "loading", dasha: null });

        GenerateKundaliService.generate(person)
            .then((response) => {
                if (!cancelled) {
                    setState({ status: "success", dasha: response.kundali?.dasha ?? null });
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setState({ status: "error", dasha: null });
                }
            });

        return () => {
            cancelled = true;
        };

    }, [person]);

    return state;

}

function RecentHoroscopesCard({ persons, t }) {

    return (
        <Card className="dashboard-card" padding="medium" shadow="medium">
            <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">{t("dashboard.recent.title")}</h2>
                <Link to="/horoscope-library" className="dashboard-card__link">
                    {t("dashboard.recent.viewAll")}
                </Link>
            </div>

            {persons.length === 0 ? (
                <p className="dashboard-card__empty">{t("dashboard.recent.empty")}</p>
            ) : (
                <div className="dashboard-table-scroll">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>{t("dashboard.recent.colName")}</th>
                                <th>{t("dashboard.recent.colDob")}</th>
                                <th>{t("dashboard.recent.colPlace")}</th>
                                <th>{t("dashboard.recent.colUpdated")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {persons.map((person) => (
                                <tr key={person.id}>
                                    <td>
                                        <Link to={`/person-details?id=${person.id}`}>
                                            {person.firstName} {person.lastName}
                                        </Link>
                                    </td>
                                    <td>{person.dateOfBirth}</td>
                                    <td>{person.placeOfBirth}</td>
                                    <td>{new Date(person.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

}

function CurrentDashaCard({ person, dashaState, t }) {

    const activeMahadasha = useMemo(
        () => findActivePeriod(dashaState.dasha?.mahadashas),
        [dashaState.dasha]
    );

    const activeAntardasha = useMemo(
        () => findActivePeriod(activeMahadasha?.children),
        [activeMahadasha]
    );

    return (
        <Card className="dashboard-card" padding="medium" shadow="medium">
            <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">{t("dashboard.dasha.title")}</h2>
            </div>

            <p className="dashboard-dasha__for">
                {t("dashboard.dasha.for", { name: `${person.firstName} ${person.lastName}` })}
            </p>

            {dashaState.status === "loading" && (
                <p className="dashboard-card__empty">{t("dashboard.dasha.loading")}</p>
            )}

            {dashaState.status === "success" && !activeMahadasha && (
                <p className="dashboard-card__empty">{t("dashboard.dasha.none")}</p>
            )}

            {dashaState.status === "success" && activeMahadasha && (
                <div className="dashboard-dasha__periods">
                    <div className="dashboard-dasha__period">
                        <span className="dashboard-dasha__period-label">
                            {t("dashboard.dasha.mahadasha")}
                        </span>
                        <span className="dashboard-dasha__period-graha">
                            {DASHA_GRAHA_NAMES[activeMahadasha.graha] ?? activeMahadasha.graha}
                        </span>
                        <span className="dashboard-dasha__period-range">
                            {formatLocalDateTime(activeMahadasha.startEpochMs, person.timezone)}
                            {" → "}
                            {formatLocalDateTime(activeMahadasha.endEpochMs, person.timezone)}
                        </span>
                    </div>

                    {activeAntardasha && (
                        <div className="dashboard-dasha__period">
                            <span className="dashboard-dasha__period-label">
                                {t("dashboard.dasha.antardasha")}
                            </span>
                            <span className="dashboard-dasha__period-graha">
                                {DASHA_GRAHA_NAMES[activeAntardasha.graha] ?? activeAntardasha.graha}
                            </span>
                            <span className="dashboard-dasha__period-range">
                                {formatLocalDateTime(activeAntardasha.startEpochMs, person.timezone)}
                                {" → "}
                                {formatLocalDateTime(activeAntardasha.endEpochMs, person.timezone)}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <Link
                to={`/person-details?id=${person.id}`}
                className="dashboard-card__link"
            >
                {t("dashboard.dasha.viewChart")}
            </Link>
        </Card>
    );

}

function Dashboard() {

    const { t } = useTranslation();
    const personsState = usePersons();

    const sortedByUpdated = useMemo(() => {

        return [...personsState.persons].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

    }, [personsState.persons]);

    const recentPersons = sortedByUpdated.slice(0, RECENT_COUNT);
    const mostRecentPerson = sortedByUpdated[0] ?? null;

    const dashaState = useCurrentDasha(mostRecentPerson);

    const stats = useMemo(() => {

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * DAY_MS);

        const total = personsState.persons.length;

        const addedToday = personsState.persons.filter((person) =>
            isSameLocalDay(person.createdAt, now)
        ).length;

        const addedThisWeek = personsState.persons.filter(
            (person) => new Date(person.createdAt) >= weekAgo
        ).length;

        return { total, addedToday, addedThisWeek };

    }, [personsState.persons]);

    const greetingKey = getGreetingKey();

    // Every sidebar item (see menuConfig.js) except Dashboard itself
    // (you're already here) automatically gets its own shortcut
    // below — add a new item to the sidebar and it shows up here
    // with no further changes needed.
    const shortcutItems = menuItems.filter((item) => item.path !== "/");

    return (
        <main className="page dashboard-page">
            <h1 className="page-title">{t(`dashboard.greeting.${greetingKey}`)}</h1>
            <p className="dashboard-subtitle">{t("dashboard.subtitle")}</p>

            <div className="dashboard-quick-actions">
                <Link to="/new-horoscope">
                    <Button>{t("dashboard.quickActions.newHoroscope")}</Button>
                </Link>

                {shortcutItems.map((item) => {

                    const Icon = item.icon;

                    return (
                        <Link key={item.id} to={item.path}>
                            <Button variant="secondary">
                                <Icon size={16} />
                                {t(item.labelKey)}
                            </Button>
                        </Link>
                    );

                })}
            </div>

            {personsState.status === "success" && personsState.persons.length === 0 && (
                <Card className="dashboard-card" padding="large" shadow="medium">
                    <h2 className="dashboard-card__title">{t("dashboard.empty.title")}</h2>
                    <p className="dashboard-card__empty">{t("dashboard.empty.subtitle")}</p>
                    <Link to="/new-horoscope">
                        <Button>{t("dashboard.empty.cta")}</Button>
                    </Link>
                </Card>
            )}

            {personsState.status === "success" && personsState.persons.length > 0 && (
                <>
                    <div className="dashboard-stats">
                        <StatCard label={t("dashboard.stats.total")} value={stats.total} />
                        <StatCard label={t("dashboard.stats.addedToday")} value={stats.addedToday} />
                        <StatCard label={t("dashboard.stats.addedThisWeek")} value={stats.addedThisWeek} />
                    </div>

                    <div className="dashboard-columns">
                        <RecentHoroscopesCard persons={recentPersons} t={t} />

                        {mostRecentPerson && (
                            <CurrentDashaCard
                                person={mostRecentPerson}
                                dashaState={dashaState}
                                t={t}
                            />
                        )}
                    </div>
                </>
            )}
        </main>
    );
}

export default Dashboard;
