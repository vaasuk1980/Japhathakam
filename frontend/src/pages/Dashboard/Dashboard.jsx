import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2, Library, CalendarDays, Clock } from "lucide-react";

import PersonService from "../../services/PersonService";
import getGreetingKey from "../../utils/greeting/getGreetingKey";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import TodayPanel from "./TodayPanel";

import "./Dashboard.css";

const RECENT_COUNT = 5;

// Curated, not derived from the sidebar menu — this is the astrology
// work-hub row (Sprint 8.19 spec), a deliberately different set from
// general app navigation. Add a destination here only once its page
// is real (see Dasa Calculator / Compare Horoscopes, still stubs).
const QUICK_ACTIONS = [
    { labelKey: "dashboard.quickActions.newHoroscope", path: "/new-horoscope", icon: FilePlus2 },
    { labelKey: "dashboard.quickActions.horoscopeLibrary", path: "/horoscope-library", icon: Library },
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
                                <th>{t("dashboard.recent.colOpened")}</th>
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
                                    <td>{formatDateDDMMYYYY(person.dateOfBirth)}</td>
                                    <td>{person.placeOfBirth}</td>
                                    <td>{formatDateDDMMYYYY(lastOpenedAt(person))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

}

function Dashboard() {

    const { t } = useTranslation();
    const personsState = usePersons();

    const recentPersons = useMemo(() => {

        return [...personsState.persons]
            .sort((a, b) => new Date(lastOpenedAt(b)) - new Date(lastOpenedAt(a)))
            .slice(0, RECENT_COUNT);

    }, [personsState.persons]);

    const greetingKey = getGreetingKey();

    return (
        <main className="page dashboard-page">
            <h1 className="page-title">{t(`dashboard.greeting.${greetingKey}`)}</h1>

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
                recentSlot={
                    personsState.status === "success" && personsState.persons.length > 0
                        ? <RecentHoroscopesCard persons={recentPersons} t={t} />
                        : null
                }
            />

            {personsState.status === "success" && personsState.persons.length === 0 && (
                <Card className="dashboard-card" padding="large" shadow="medium">
                    <h2 className="dashboard-card__title">{t("dashboard.empty.title")}</h2>
                    <p className="dashboard-card__empty">{t("dashboard.empty.subtitle")}</p>
                    <Link to="/new-horoscope">
                        <Button>{t("dashboard.empty.cta")}</Button>
                    </Link>
                </Card>
            )}
        </main>
    );
}

export default Dashboard;
