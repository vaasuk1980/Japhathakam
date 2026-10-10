import { Fragment } from "react";

import NatureMark from "./NatureMark";
import { CURRENT_LEVEL_KEYS } from "./DashaGlance";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import resolveGrahaNature from "../../utils/dasha/resolveGrahaNature";
import { useTranslation } from "../../i18n/I18nContext";
import {
    formatDay,
    formatExact,
    formatMonthYear,
    formatRemaining,
    progressPercent,
} from "./dashaFormat";

/**
 * "Running now" hero card: the five-level chain as a breadcrumb,
 * then one row per level — a numbered, stair-stepped label (level
 * is shown by position and number, never by hue), the graha with
 * its Punya/Papa colour AND shape, dates, a neutral blue progress
 * bar, and the time left.
 */
function DashaRunning({ chain, timezone, natureByGraha, now }) {

    const { t, language } = useTranslation();

    if (!chain) {
        return null;
    }

    const levels = CURRENT_LEVEL_KEYS
        .map(({ key, labelKey }, index) => ({ key, labelKey, index, period: chain[key] }))
        .filter((level) => level.period);

    return (
        <div className="dasha-running">

            <div className="dasha-running__header">
                <h3 className="dasha-running__title">{t("kundali.dashaUi.runningTitle")}</h3>
                <span className="dasha-running__live">{t("kundali.dashaUi.live")}</span>
            </div>

            <div className="dasha-running__chain" aria-label={t("kundali.dashaUi.runningTitle")}>
                {levels.map(({ key, period }, position) => {

                    const nature = resolveGrahaNature(period.graha, natureByGraha);

                    return (
                        <Fragment key={key}>
                            {position > 0 && <span className="dasha-running__sep" aria-hidden="true">›</span>}
                            <span className={"dasha-chip" + (nature ? ` dasha-chip--${nature}` : "")}>
                                <NatureMark nature={nature} />
                                {grahaName(period.graha, language)}
                            </span>
                        </Fragment>
                    );

                })}
            </div>

            <ul className="dasha-running__levels">
                {levels.map(({ key, labelKey, index, period }) => {

                    const nature = resolveGrahaNature(period.graha, natureByGraha);
                    // Mahadasha/Antardasha last years — a month is enough; the
                    // deeper ones last days to months, so show the day.
                    const fmt = index < 2 ? formatMonthYear : formatDay;
                    const percent = progressPercent(period, now);

                    return (
                        <li className="dasha-running__level" key={key}>
                            <span
                                className="dasha-running__level-label"
                                style={{ "--step": index }}
                            >
                                {index > 0 && <span className="dasha-running__elbow" aria-hidden="true" />}
                                <span className="dasha-level-num">{index + 1}</span>
                                {t(labelKey)}
                            </span>

                            <span className={"dasha-running__level-graha" + (nature ? ` dasha-running__level-graha--${nature}` : "")}>
                                <NatureMark nature={nature} />
                                {grahaName(period.graha, language)}
                            </span>

                            <span
                                className="dasha-running__level-range"
                                title={`${formatExact(period.startEpochMs, timezone)} → ${formatExact(period.endEpochMs, timezone)}`}
                            >
                                {fmt(period.startEpochMs, timezone, language)}
                                {" – "}
                                {fmt(period.endEpochMs, timezone, language)}
                            </span>

                            <span className="dasha-running__level-bar" aria-hidden="true">
                                <span style={{ width: `${percent}%` }} />
                            </span>

                            <span className="dasha-running__level-left">
                                {t("kundali.dashaUi.left", { time: formatRemaining(period.endEpochMs - now, language) })}
                            </span>
                        </li>
                    );

                })}
            </ul>

        </div>
    );

}

export default DashaRunning;
