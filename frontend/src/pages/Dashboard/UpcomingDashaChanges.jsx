import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";

import DashaChangesService from "../../services/DashaChangesService";
import { useSettings } from "../../settings/SettingsContext";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import Sheet from "../../components/common/Sheet/Sheet";
import { useTranslation } from "../../i18n/I18nContext";

const WINDOW_OPTIONS = [30, 60, 90];

function useDashaChanges(days) {

    const [state, setState] = useState({ status: "loading", data: null });

    useEffect(() => {

        let cancelled = false;

        setState((previous) => ({ status: "loading", data: previous.data }));

        DashaChangesService.get(days)
            .then((data) => {
                if (!cancelled) {
                    setState({ status: "success", data });
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setState({ status: "error", data: null });
                }
            });

        return () => {
            cancelled = true;
        };

    }, [days]);

    return state;

}

function whenText(daysAway, t) {

    if (daysAway <= 0) {
        return t("dashboard.dashaChanges.today");
    }

    if (daysAway === 1) {
        return t("dashboard.dashaChanges.tomorrow");
    }

    return t("dashboard.dashaChanges.inDays", { n: daysAway });

}

function EventCard({ event, language, t }) {

    const isMaha = event.level === "mahadasha";
    const levelLabel = isMaha ? t("kundali.dashaBreakdown.mahadasha") : t("kundali.dashaBreakdown.antardasha");
    const name = `${event.firstName ?? ""} ${event.lastName ?? ""}`.trim();

    return (
        <li className="dasha-change">
            <div className="dasha-change__head">
                <Link to={`/person-details?id=${event.personId}`} className="dasha-change__name">
                    {name}
                </Link>
                <span className="dasha-change__when">{whenText(event.daysAway, t)}</span>
            </div>

            <div className="dasha-change__what">
                <span className={"dasha-change__level" + (isMaha ? " is-maha" : "")}>{levelLabel}</span>
                {event.fromGraha && (
                    <>
                        <span className="dasha-change__graha">{grahaName(event.fromGraha, language)}</span>
                        <span className="dasha-change__arrow" aria-hidden="true">→</span>
                    </>
                )}
                <span className="dasha-change__graha dasha-change__graha--to">
                    {grahaName(event.toGraha, language)}
                </span>
                {!isMaha && (
                    <span className="dasha-change__context">
                        {t("dashboard.dashaChanges.within", { graha: grahaName(event.maha, language) })}
                    </span>
                )}
            </div>

            <div className="dasha-change__at">{event.at}</div>
        </li>
    );

}

/**
 * "Coming up" chip for the Dashboard hero: how many Mahadasha /
 * Antardasha changes fall in the next 30 days across every saved
 * horoscope, opening a list (with a 30/60/90-day switch).
 */
function UpcomingDashaChanges() {

    const { t, language } = useTranslation();
    const { settings } = useSettings();

    const defaultWindow = settings.dasha.windowDays;

    const [chosenDays, setDays] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // The chip always reflects the window chosen in Settings; the sheet's
    // 30/60/90 switch only changes what the list shows (until closed).
    const days = chosenDays ?? defaultWindow;

    const chipState = useDashaChanges(defaultWindow);
    const listState = useDashaChanges(days);

    const chipCount = chipState.data?.count ?? 0;
    const hasAttention = chipCount > 0;

    let chipText;

    if (!settings.dasha.showChip || chipState.status === "error") {
        return null;
    }
    else if (!chipState.data) {
        chipText = t("dashboard.dashaChanges.loading");
    }
    else if (chipCount === 0) {
        chipText = t("dashboard.dashaChanges.none", { days: defaultWindow });
    }
    else {
        chipText = t(
            chipCount === 1 ? "dashboard.dashaChanges.chipOne" : "dashboard.dashaChanges.chip",
            { count: chipCount, days: defaultWindow }
        );
    }

    const list = listState.data;
    const next = list?.next;

    return (
        <>
            <button
                type="button"
                className={"dashboard-chip" + (hasAttention ? " dashboard-chip--attention" : "")}
                onClick={() => setIsOpen(true)}
                title={t("dashboard.dashaChanges.title")}
            >
                <CalendarClock size={16} aria-hidden="true" />
                {chipText}
            </button>

            {isOpen && (
                <Sheet
                    title={t("dashboard.dashaChanges.title")}
                    onClose={() => {
                        setIsOpen(false);
                        setDays(null);
                    }}
                >

                    <div className="dasha-changes__window" role="tablist">
                        {WINDOW_OPTIONS.map((option) => (
                            <button
                                key={option}
                                type="button"
                                role="tab"
                                aria-selected={days === option}
                                className={"dasha-changes__window-item" + (days === option ? " is-active" : "")}
                                onClick={() => setDays(option)}
                            >
                                {t("dashboard.dashaChanges.window", { days: option })}
                            </button>
                        ))}
                    </div>

                    {listState.status === "loading" && !list && (
                        <p className="dasha-changes__note">{t("dashboard.dashaChanges.loading")}</p>
                    )}

                    {list && list.events.length === 0 && (
                        <div className="dasha-changes__empty">
                            <p>{t("dashboard.dashaChanges.empty", { days })}</p>

                            {next && (
                                <p className="dasha-changes__next">
                                    {t("dashboard.dashaChanges.next", {
                                        name: `${next.firstName ?? ""} ${next.lastName ?? ""}`.trim(),
                                        days: next.daysAway,
                                    })}
                                </p>
                            )}
                        </div>
                    )}

                    {list && list.events.length > 0 && (
                        <ul className="dasha-changes__list">
                            {list.events.map((event) => (
                                <EventCard
                                    key={`${event.personId}-${event.atEpochMs}-${event.level}`}
                                    event={event}
                                    language={language}
                                    t={t}
                                />
                            ))}
                        </ul>
                    )}

                </Sheet>
            )}
        </>
    );

}

export default UpcomingDashaChanges;
