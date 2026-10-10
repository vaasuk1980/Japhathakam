import NatureMark from "./NatureMark";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import isCurrentPeriod from "../../utils/dasha/isCurrentPeriod";
import localDateParts from "../../utils/timezone/localDateParts";
import resolveGrahaNature from "../../utils/dasha/resolveGrahaNature";
import translateDurationDisplay from "../../utils/dasha/translateDurationDisplay";
import { useTranslation } from "../../i18n/I18nContext";
import { formatMonthYear } from "./dashaFormat";

const TICK_STEP_YEARS = 10;

/**
 * Lifetime Mahadasha bar, drawn strictly to scale (width = real
 * duration), with a "today" marker and a linear year axis. The
 * birth Mahadasha's balance can be only months long, so its block
 * is a sliver — its details live in the tooltip and the list
 * below.
 */
function DashaTimeline({ dasha, timezone, natureByGraha, now }) {

    const { t, language } = useTranslation();

    const periods = dasha.mahadashas;
    const first = periods[0];
    const last = periods[periods.length - 1];
    const spanMs = last.endEpochMs - first.startEpochMs;

    if (!(spanMs > 0)) {
        return null;
    }

    const percentAt = (epochMs) => ((epochMs - first.startEpochMs) / spanMs) * 100;

    const totalYears = periods.reduce((sum, period) => sum + period.durationYears, 0);
    const birthYear = localDateParts(first.startEpochMs, timezone).year;
    const endYear = localDateParts(last.endEpochMs, timezone).year;

    // Decade ticks at their true positions; the final year is added
    // only when there is room (it would otherwise print on top of
    // the last decade tick).
    const ticks = [];
    const firstDecade = Math.ceil(birthYear / TICK_STEP_YEARS) * TICK_STEP_YEARS;

    for (let year = firstDecade; year < endYear; year += TICK_STEP_YEARS) {
        const epoch = Date.UTC(year, 0, 1) - timezone * 3600000;
        const left = percentAt(epoch);

        if (left > 4 && left < 94) {
            ticks.push({ year, left });
        }
    }

    const todayLeft = percentAt(now);
    const showToday = todayLeft >= 0 && todayLeft <= 100;

    return (
        <div className="dasha-timeline">

            <div className="dasha-timeline__header">
                <h3 className="dasha-timeline__title">{t("kundali.dashaGlance.timelineTitle")}</h3>
                <span className="dasha-timeline__total">
                    {t("kundali.dashaGlance.timelineTotal", { years: Math.round(totalYears) })}
                </span>
            </div>

            <div className="dasha-timeline__scroll">
                <div className="dasha-timeline__canvas">

                    <div className="dasha-timeline__track">
                        {periods.map((period) => {

                            const nature = resolveGrahaNature(period.graha, natureByGraha);
                            const width = (period.durationYears / totalYears) * 100;
                            const current = isCurrentPeriod(period, now);
                            const name = grahaName(period.graha, language);
                            const duration = translateDurationDisplay(period.durationDisplay, language);

                            return (
                                <div
                                    key={`${period.graha}-${period.startEpochMs}`}
                                    className={
                                        "dasha-timeline__block" +
                                        (nature ? ` dasha-timeline__block--${nature}` : "") +
                                        (current ? " dasha-timeline__block--current" : "")
                                    }
                                    style={{ width: `${width}%` }}
                                    title={`${name} · ${duration} · ${formatMonthYear(period.startEpochMs, timezone, language)} – ${formatMonthYear(period.endEpochMs, timezone, language)}`}
                                >
                                    {/* The birth balance can be only months long — a sliver too
                                        narrow for any text (see the tooltip). */}
                                    {width >= 3 && (
                                        <>
                                            <span className="dasha-timeline__name">
                                                <NatureMark nature={nature} />
                                                {name}
                                            </span>
                                            <span className="dasha-timeline__years">{duration}</span>
                                        </>
                                    )}
                                </div>
                            );

                        })}

                        {showToday && (
                            <span className="dasha-timeline__today" style={{ left: `${todayLeft}%` }}>
                                <span className="dasha-timeline__today-label">{t("kundali.dashaUi.today")}</span>
                            </span>
                        )}
                    </div>

                    <div className="dasha-timeline__axis">
                        <span className="dasha-timeline__tick dasha-timeline__tick--start" style={{ left: 0 }}>
                            {birthYear}
                        </span>

                        {ticks.map((tick) => (
                            <span
                                key={tick.year}
                                className="dasha-timeline__tick"
                                style={{ left: `${tick.left}%` }}
                            >
                                {tick.year}
                            </span>
                        ))}

                        <span className="dasha-timeline__tick dasha-timeline__tick--end" style={{ left: "100%" }}>
                            {endYear}
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );

}

export default DashaTimeline;
