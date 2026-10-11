import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2, Library, GitCompare, CalendarDays, Clock, Compass } from "lucide-react";

import PersonService from "../../services/PersonService";
import getGreetingKey from "../../utils/greeting/getGreetingKey";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";
import useSkySnapshot from "../../hooks/useSkySnapshot";
import usePersonSummaries from "../../hooks/usePersonSummaries";
import { useSavedLocation } from "../../location/LocationContext";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import { rasiForLongitude } from "../../kundali/constants/RasiNames";

import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import { SkeletonTable } from "../../components/common/Skeleton/Skeleton";
import TodayPanel from "./TodayPanel";
import UpcomingDashaChanges from "./UpcomingDashaChanges";

import "./Dashboard.css";

const RECENT_COUNT = 5;

// Curated, not derived from the sidebar menu — this is the astrology
// work-hub row (Sprint 8.19 spec), a deliberately different set from
// general app navigation. Add a destination here only once its page
// is real (see Dasa Calculator, still a stub).
const QUICK_ACTIONS = [
    // PersonDetails (no ?id=) IS the "new horoscope" flow — full
    // form, Save creates the person and redirects to its own
    // /person-details?id=, then renders the complete report. The
    // separate /new-horoscope page (removed) was an early-sprint
    // stub that only previewed a bare Kundali chart and never saved
    // anything, left behind once this became the real flow.
    { labelKey: "dashboard.quickActions.horoscopeLibrary", path: "/horoscope-library", icon: Library },
    { labelKey: "dashboard.quickActions.compareKundalis", path: "/compare-kundalis", icon: GitCompare },
    { labelKey: "dashboard.quickActions.panchangam", path: "/panchangam", icon: CalendarDays },
    { labelKey: "dashboard.quickActions.muhurtham", path: "/muhurtham", icon: Clock },
];

// Falls back through updatedAt/createdAt for a person never opened
// since this field was introduced, so older records still sort and
// display sensibly instead of looking blank or sinking to the bottom.
function lastOpenedAt(person) {

    return person.lastOpenedAt ?? person.updatedAt ?? person.createdAt;

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

function initialsOf(person) {

    return [person.firstName, person.lastName]
        .map((part) => part?.trim()?.[0])
        .filter(Boolean)
        .join("")
        .toUpperCase();

}

function RecentHoroscopesCard({ persons, summaries, t, language }) {

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
                                <th>{t("dashboard.recent.colLagna")}</th>
                                <th>{t("dashboard.recent.colDasha")}</th>
                                <th>{t("dashboard.recent.colOpened")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {persons.map((person) => {

                                const summary = summaries[person.id];
                                const lagna = summary?.lagnaLongitude != null
                                    ? rasiForLongitude(summary.lagnaLongitude)
                                    : null;

                                return (
                                    <tr key={person.id}>
                                        <td>
                                            <Link
                                                to={`/person-details?id=${person.id}`}
                                                className="dashboard-person-link"
                                            >
                                                <span className="dashboard-avatar" aria-hidden="true">
                                                    {initialsOf(person)}
                                                </span>
                                                {person.firstName} {person.lastName}
                                            </Link>
                                        </td>
                                        <td>{formatDateDDMMYYYY(person.dateOfBirth)}</td>
                                        <td>
                                            {lagna
                                                ? (language === "te" ? lagna.tel : lagna.en)
                                                : "—"}
                                        </td>
                                        <td>
                                            {summary?.mahadasha
                                                ? `${grahaName(summary.mahadasha, language)} / ${grahaName(summary.antardasha, language)}`
                                                : "—"}
                                        </td>
                                        <td>{formatDateDDMMYYYY(lastOpenedAt(person))}</td>
                                    </tr>
                                );

                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

}

// Greeting + what needs attention (upcoming Dasha changes) + the two
// ways to start a chart: a saved horoscope, or a Prashna chart for now.
function DashboardHero({ t, greetingKey }) {

    return (
        <section className="dashboard-hero">
            <h1 className="page-title">{t(`dashboard.greeting.${greetingKey}`)}</h1>

            <div className="dashboard-hero__actions">
                <UpcomingDashaChanges />

                <Link to="/prashna" className="dashboard-hero__secondary">
                    <Compass size={18} aria-hidden="true" />
                    {t("prashna.button")}
                </Link>

                <Link to="/person-details" className="dashboard-hero__cta">
                    <FilePlus2 size={18} aria-hidden="true" />
                    {t("dashboard.quickActions.newHoroscope")}
                </Link>
            </div>
        </section>
    );

}

function Dashboard() {

    const { t, language } = useTranslation();
    const personsState = usePersons();
    const { location } = useSavedLocation();
    const snapshotState = useSkySnapshot(location);

    const recentPersons = useMemo(() => {

        return [...personsState.persons]
            .sort((a, b) => new Date(lastOpenedAt(b)) - new Date(lastOpenedAt(a)))
            .slice(0, RECENT_COUNT);

    }, [personsState.persons]);

    const summaries = usePersonSummaries(recentPersons);

    const greetingKey = getGreetingKey();

    return (
        <main className="page dashboard-page">
            <DashboardHero t={t} greetingKey={greetingKey} />

            <div className="dashboard-quick-actions">
                {QUICK_ACTIONS.map(({ labelKey, path, icon: Icon }) => (
                    <Link key={path} to={path} className="dashboard-quick-action">
                        <Card
                            className="dashboard-quick-action__card"
                            padding="small"
                            shadow="small"
                        >
                            <Icon className="dashboard-quick-action__icon" size={18} />
                            <span className="dashboard-quick-action__label">{t(labelKey)}</span>
                        </Card>
                    </Link>
                ))}
            </div>

            <TodayPanel
                snapshotState={snapshotState}
                recentSlot={
                    personsState.status === "loading"
                        ? (
                            <Card className="dashboard-card" padding="medium" shadow="medium">
                                <h2 className="dashboard-card__title">{t("dashboard.recent.title")}</h2>
                                <SkeletonTable rows={RECENT_COUNT} columns={4} />
                            </Card>
                        )
                        : personsState.status === "success" && personsState.persons.length > 0
                            ? <RecentHoroscopesCard persons={recentPersons} summaries={summaries} t={t} language={language} />
                            : null
                }
            />

            {personsState.status === "success" && personsState.persons.length === 0 && (
                <Card className="dashboard-card" padding="large" shadow="medium">
                    <EmptyState
                        icon={Library}
                        title={t("dashboard.empty.title")}
                        message={t("dashboard.empty.subtitle")}
                        action={{ label: t("dashboard.empty.cta"), to: "/person-details" }}
                    />
                </Card>
            )}
        </main>
    );
}

export default Dashboard;
