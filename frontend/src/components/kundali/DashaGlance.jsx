import { useEffect, useState } from "react";

import { TOTAL_DASHA_YEARS } from "../../kundali/constants/DashaConstants";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import { GRAHA_SHORT_NAMES_EN } from "../../kundali/constants/GrahaShortNames";
import isCurrentPeriod from "../../utils/dasha/isCurrentPeriod";
import localDateParts from "../../utils/timezone/localDateParts";
import resolveCurrentDashaChain from "../../utils/dasha/resolveCurrentDashaChain";
import resolveGrahaNature from "../../utils/dasha/resolveGrahaNature";
import translateDurationDisplay from "../../utils/dasha/translateDurationDisplay";
import { useTranslation } from "../../i18n/I18nContext";

import "./DashaGlance.css";

const MS_PER_DAY = 86400000;
const TICK_STEP_YEARS = 10;

// A pure duration/120-years proportional width leaves the birth
// Mahadasha's partial "balance" (often just days or months) as an
// illegible sliver. Every segment instead gets this guaranteed
// baseline share of the track first, and only the remainder is then
// split proportionally by duration — short periods stay readable
// (graha + duration + dates) at the cost of the bar no longer being
// pixel-exact to scale; long periods give up a small, barely-visible
// sliver of their own share to make that room.
const MIN_SEGMENT_SHARE_PERCENT = 4;

// Keeps the progress bar/remaining-days figures fresh without a
// page reload — coarse (once a minute) since Dasha timescales are
// years/months, not seconds.
const REFRESH_MS = 60000;

// Labels resolved via t() inside the component (see CURRENT_LEVEL_ROWS
// usage below) — this just fixes the level order/keys. Exported so
// DeathDashaCheck.jsx can render the exact same 5-level chain shape
// for a different moment (time of death) without redefining it.
export const CURRENT_LEVEL_KEYS = [
    { key: "mahadasha", labelKey: "kundali.dashaBreakdown.mahadasha" },
    { key: "antardasha", labelKey: "kundali.dashaGlance.levelAntardasha" },
    { key: "pratyantardasha", labelKey: "kundali.dashaGlance.levelPratyantardasha" },
    { key: "sukshmadasha", labelKey: "kundali.dashaGlance.levelSukshmadasha" },
    { key: "pranadasha", labelKey: "kundali.dashaGlance.levelPranadasha" },
];

function DashaGlance({ dasha, timezone, natureByGraha }) {

    const { t, language } = useTranslation();
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {

        const timer = setInterval(() => setNow(Date.now()), REFRESH_MS);
        return () => clearInterval(timer);

    }, []);

    if (!dasha || !Array.isArray(dasha.mahadashas) || dasha.mahadashas.length === 0) {
        return null;
    }

    const chain = resolveCurrentDashaChain(dasha, timezone, now);

    if (!chain) {
        return null;
    }

    const birthEpochMs = dasha.mahadashas[0].startEpochMs;
    const birthYear = localDateParts(birthEpochMs, timezone).year;

    // This chart's own Mahadasha list, not the fixed 120-year
    // TOTAL_DASHA_YEARS constant, is what the timeline actually
    // depicts — it's always the birth Graha's partial Balance plus
    // one lap of the other 11 Grahas, so its true total is well
    // under 120 whenever birth doesn't land exactly on a Mahadasha
    // boundary (rarely — see DashaEngine.buildMahadashas on the
    // backend). Scaling segments/ticks against 120 anyway leaves a
    // meaningless trailing gap with no data in it (the last segment
    // ending well short of the axis's own final year); scaling
    // against this chart's real total instead makes the bar and its
    // axis end exactly where the data does.
    const actualTotalYears = dasha.mahadashas.reduce(
        (sum, period) => sum + period.durationYears,
        0
    );

    // Each segment's on-screen share (see MIN_SEGMENT_SHARE_PERCENT
    // above) plus where it falls in cumulative years/percent — the
    // latter is what lets the axis ticks below line back up with the
    // actual segment boundaries despite the bar no longer being a
    // pure linear time scale.
    const bonusPoolPercent = 100 - MIN_SEGMENT_SHARE_PERCENT * dasha.mahadashas.length;
    let cumulativeYears = 0;
    let cumulativePercent = 0;

    const segmentLayouts = dasha.mahadashas.map((period) => {

        const flexBasisPercent = MIN_SEGMENT_SHARE_PERCENT +
            (period.durationYears / actualTotalYears) * bonusPoolPercent;

        const layout = {
            period,
            flexBasisPercent,
            startYearOffset: cumulativeYears,
            endYearOffset: cumulativeYears + period.durationYears,
            startPercent: cumulativePercent,
            endPercent: cumulativePercent + flexBasisPercent,
        };

        cumulativeYears = layout.endYearOffset;
        cumulativePercent = layout.endPercent;

        return layout;

    });

    // Linear interpolation WITHIN whichever segment a tick's year
    // offset falls into, using that segment's own (possibly inflated
    // or compressed) percent span — a plain offsetYears/actualTotalYears
    // would drift away from the segment boundaries it's meant to mark.
    function percentForYearOffset(yearOffset) {

        const layout = segmentLayouts.find(
            (segment) => yearOffset >= segment.startYearOffset && yearOffset <= segment.endYearOffset
        ) ?? segmentLayouts[segmentLayouts.length - 1];

        const span = layout.endYearOffset - layout.startYearOffset;
        const fraction = span > 0 ? (yearOffset - layout.startYearOffset) / span : 0;

        return layout.startPercent + fraction * (layout.endPercent - layout.startPercent);

    }

    // Ticks only ever run up to this chart's own real span (never the
    // theoretical 120) — the last one lands exactly at the final
    // Mahadasha's own end year rather than at whatever the nearest
    // round 10-year mark below it is, so the axis always visibly ends
    // together with the last segment instead of stopping just short.
    const tickCount = Math.floor(actualTotalYears / TICK_STEP_YEARS) + 1;
    const ticks = Array.from({ length: tickCount }, (_, index) => {

        const offsetYears = index * TICK_STEP_YEARS;

        return {
            year: birthYear + offsetYears,
            leftPercent: percentForYearOffset(offsetYears),
        };

    });

    // The last regular 10-year tick is almost always a hair short of
    // the true end (rounding), rather than exactly on it — snap it to
    // 100% if it already represents the same year as the true end;
    // only append a distinct final tick when the true end falls on a
    // genuinely different year (avoids ever showing the same year
    // label twice).
    const finalYear = birthYear + Math.round(actualTotalYears);
    const lastTick = ticks[ticks.length - 1];

    if (lastTick.year === finalYear) {
        lastTick.leftPercent = 100;
    } else {
        ticks.push({ year: finalYear, leftPercent: 100 });
    }

    const mahadasha = chain.mahadasha;

    const progressPercent = Math.min(
        100,
        Math.max(0, ((now - mahadasha.startEpochMs) / (mahadasha.endEpochMs - mahadasha.startEpochMs)) * 100)
    );

    const daysRemaining = Math.max(0, Math.ceil((mahadasha.endEpochMs - now) / MS_PER_DAY));

    return (
        <div className="dasha-glance">

            <div className="dasha-glance__timeline-card">

                <div className="dasha-glance__timeline-header">
                    <h3 className="dasha-glance__timeline-title">{t("kundali.dashaGlance.timelineTitle")}</h3>
                    <span className="dasha-glance__timeline-total">
                        {t("kundali.dashaGlance.timelineTotal", { years: TOTAL_DASHA_YEARS })}
                    </span>
                </div>

                <div className="dasha-glance__scroll">
                    <div className="dasha-glance__track">
                        {segmentLayouts.map(({ period, flexBasisPercent }) => {

                            const nature = resolveGrahaNature(period.graha, natureByGraha);
                            const durationText = translateDurationDisplay(period.durationDisplay, language);
                            const startYear = localDateParts(period.startEpochMs, timezone).year;
                            const endYear = localDateParts(period.endEpochMs, timezone).year;

                            // Every segment's own width is proportional to its
                            // Dasha length (see MIN_SEGMENT_SHARE_PERCENT above)
                            // — the short backend form (period.displayName,
                            // already Telugu's compact "బు"/"కే"/... style) is
                            // what makes that fit at all; the fuller
                            // grahaName() used elsewhere in this file (the
                            // current-Dasha cards, the progress sentence) has
                            // real room to spare that this narrow bar doesn't.
                            const label = language === "en"
                                ? (GRAHA_SHORT_NAMES_EN[period.graha] ?? period.displayName)
                                : period.displayName;

                            return (
                                <div
                                    key={`${period.graha}-${period.startEpochMs}`}
                                    className={
                                        "dasha-glance__segment" +
                                        (isCurrentPeriod(period, now) ? " dasha-glance__segment--current" : "")
                                    }
                                    style={{ flexBasis: `${flexBasisPercent}%` }}
                                    // A narrow segment (see the @container
                                    // rules in DashaGlance.css) hides its own
                                    // duration/date-range lines — this title
                                    // keeps that same full detail one hover/
                                    // tap away regardless of what's hidden.
                                    title={`${label} · ${durationText} · ${startYear} → ${endYear}`}
                                >
                                    <span className={
                                        "dasha-glance__segment-graha" +
                                        (nature ? ` dasha-glance__segment-graha--${nature}` : "")
                                    }>
                                        {label}
                                    </span>
                                    <span className="dasha-glance__segment-duration">
                                        {durationText}
                                    </span>
                                    <span className="dasha-glance__segment-dates">
                                        {startYear}
                                        {" → "}
                                        {endYear}
                                    </span>
                                </div>
                            );

                        })}
                    </div>

                    <div className="dasha-glance__axis">
                        {ticks.map((tick, index) => {

                            // Centering every label on its tick position
                            // (translateX(-50%)) clips the first/last
                            // labels at the scroll container's edges,
                            // since half their width lands outside the
                            // 0%-100% track. Anchor those two inward
                            // instead — only the interior ticks center.
                            const align =
                                index === 0
                                    ? "left"
                                    : index === ticks.length - 1
                                        ? "right"
                                        : "center";

                            return (
                                <span
                                    key={tick.year}
                                    className={`dasha-glance__axis-tick dasha-glance__axis-tick--${align}`}
                                    style={{ left: `${tick.leftPercent}%` }}
                                >
                                    {tick.year}
                                </span>
                            );

                        })}
                    </div>
                </div>

            </div>

            <div className="dasha-glance__current-card">

                <h3 className="dasha-glance__current-title">{t("kundali.dashaGlance.currentTitle")}</h3>

                <div className="dasha-glance__current-grid">
                    {CURRENT_LEVEL_KEYS.map(({ key, labelKey }) => {

                        const period = chain[key];
                        const nature = resolveGrahaNature(period?.graha, natureByGraha);

                        return (
                            <div className="dasha-glance__current-item" key={key}>
                                <span className="dasha-glance__current-label">{t(labelKey)}</span>
                                <span className={
                                    "dasha-glance__current-value" +
                                    (nature ? ` dasha-glance__current-value--${nature}` : "")
                                }>
                                    {period ? grahaName(period.graha, language) : "—"}
                                </span>
                            </div>
                        );

                    })}
                </div>

                <div className="dasha-glance__progress">
                    <div className="dasha-glance__progress-label">
                        {t("kundali.dashaGlance.progressLabel", {
                            graha: grahaName(mahadasha.graha, language),
                            percent: progressPercent.toFixed(2),
                        })}
                    </div>

                    <div className="dasha-glance__progress-track">
                        <div
                            className="dasha-glance__progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <div className="dasha-glance__progress-remaining">
                        {t("kundali.dashaGlance.remaining", { days: daysRemaining })}
                    </div>
                </div>

            </div>

        </div>
    );

}

export default DashaGlance;
