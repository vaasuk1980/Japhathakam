import { useEffect, useState } from "react";

import { TOTAL_DASHA_YEARS } from "../../kundali/constants/DashaConstants";
import { DASHA_GRAHA_NAMES } from "../../kundali/constants/DashaGrahaNames";
import isCurrentPeriod from "../../utils/dasha/isCurrentPeriod";
import localDateParts from "../../utils/timezone/localDateParts";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import resolveCurrentDashaChain from "../../utils/dasha/resolveCurrentDashaChain";
import resolveGrahaNature from "../../utils/dasha/resolveGrahaNature";

import "./DashaGlance.css";

const MS_PER_DAY = 86400000;
const PX_PER_YEAR = 14;
const TICK_STEP_YEARS = 10;

// Keeps the progress bar/remaining-days figures fresh without a
// page reload — coarse (once a minute) since Dasha timescales are
// years/months, not seconds.
const REFRESH_MS = 60000;

const CURRENT_LEVEL_ROWS = [
    { key: "mahadasha", label: "మహాదశ" },
    { key: "antardasha", label: "అంతర్దశ (భుక్తి)" },
    { key: "pratyantardasha", label: "ప్రత్యంతర దశ" },
    { key: "sukshmadasha", label: "సూక్ష్మ దశ" },
    { key: "pranadasha", label: "ప్రాణ దశ" },
];

function DashaGlance({ dasha, timezone, natureByGraha }) {

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

    const tickCount = Math.floor(TOTAL_DASHA_YEARS / TICK_STEP_YEARS) + 1;
    const ticks = Array.from({ length: tickCount }, (_, index) => {

        const offsetYears = index * TICK_STEP_YEARS;

        return {
            year: birthYear + offsetYears,
            leftPercent: (offsetYears / TOTAL_DASHA_YEARS) * 100,
        };

    });

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
                    <h3 className="dasha-glance__timeline-title">మహాదశా చక్రం (జనన సమయం నుండి)</h3>
                    <span className="dasha-glance__timeline-total">
                        మొత్తం ఆయువు దశ చక్రం: {TOTAL_DASHA_YEARS} సంవత్సరాలు
                    </span>
                </div>

                <div className="dasha-glance__scroll">
                    <div
                        className="dasha-glance__track"
                        style={{ width: `${TOTAL_DASHA_YEARS * PX_PER_YEAR}px` }}
                    >
                        {dasha.mahadashas.map((period) => {

                            const nature = resolveGrahaNature(period.graha, natureByGraha);

                            return (
                                <div
                                    key={`${period.graha}-${period.startEpochMs}`}
                                    className={
                                        "dasha-glance__segment" +
                                        (isCurrentPeriod(period, now) ? " dasha-glance__segment--current" : "")
                                    }
                                    style={{ flexBasis: `${period.durationYears * PX_PER_YEAR}px` }}
                                >
                                    <span className={
                                        "dasha-glance__segment-graha" +
                                        (nature ? ` dasha-glance__segment-graha--${nature}` : "")
                                    }>
                                        {period.displayName}
                                    </span>
                                    <span className="dasha-glance__segment-duration">{period.durationDisplay}</span>
                                    <span className="dasha-glance__segment-dates">
                                        {formatDateDDMMYYYY(period.startEpochMs)}
                                        <br />
                                        {formatDateDDMMYYYY(period.endEpochMs)}
                                    </span>
                                </div>
                            );

                        })}
                    </div>

                    <div
                        className="dasha-glance__axis"
                        style={{ width: `${TOTAL_DASHA_YEARS * PX_PER_YEAR}px` }}
                    >
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

                <h3 className="dasha-glance__current-title">ప్రస్తుతం జరుగుతున్న దశ</h3>

                <div className="dasha-glance__current-grid">
                    {CURRENT_LEVEL_ROWS.map(({ key, label }) => {

                        const period = chain[key];
                        const nature = resolveGrahaNature(period?.graha, natureByGraha);

                        return (
                            <div className="dasha-glance__current-item" key={key}>
                                <span className="dasha-glance__current-label">{label}</span>
                                <span className={
                                    "dasha-glance__current-value" +
                                    (nature ? ` dasha-glance__current-value--${nature}` : "")
                                }>
                                    {period ? (DASHA_GRAHA_NAMES[period.graha] ?? period.displayName) : "—"}
                                </span>
                            </div>
                        );

                    })}
                </div>

                <div className="dasha-glance__progress">
                    <div className="dasha-glance__progress-label">
                        {DASHA_GRAHA_NAMES[mahadasha.graha] ?? mahadasha.displayName} మహాదశ పురోగతి: {progressPercent.toFixed(2)}% పూర్తయింది
                    </div>

                    <div className="dasha-glance__progress-track">
                        <div
                            className="dasha-glance__progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <div className="dasha-glance__progress-remaining">
                        ముగియుటకు మిగిలిన కాలం: {daysRemaining} రోజులు
                    </div>
                </div>

            </div>

        </div>
    );

}

export default DashaGlance;
