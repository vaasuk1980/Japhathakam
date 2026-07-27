import { DASHA_GRAHA_ORDER, DASHA_YEARS, TOTAL_DASHA_YEARS, DASHA_YEAR_DAYS } from "../constants/DashaConstants";
import { DASHA_GRAHA_NAMES } from "../constants/DashaGrahaNames";
import formatLocalDateTime from "../../utils/dasha/formatLocalDateTime";
import formatDashaDuration from "../../utils/dasha/formatDashaDuration";

/**
 * ============================================================================
 * JAPHATHAKAM
 * DashaSubdivisionEngine — Trāitha Siddhānta Dasha System v1.0 (frontend)
 * ----------------------------------------------------------------------------
 * Mirrors DashaEngine.subdivide() on the backend exactly (Rules 7-12):
 * a period's 12 children are the fixed Graha cycle starting from that
 * period's own Graha, each child's duration = parent duration x child
 * Graha's Mahadasha years / 120.
 *
 * The backend already computes Mahadasha and Antardasha (Rule 7) up
 * front. This engine exists so the UI can drill into Pratyantardasha,
 * Sukshmadasha, and Pranadasha on demand, in the browser, with no
 * server round trip — the rule is pure arithmetic, not an astronomy
 * lookup, so it needs nothing the client doesn't already have.
 * ============================================================================
 */

const MILLISECONDS_PER_DAY = 86400000;

function rotateFrom(graha) {

    const index = DASHA_GRAHA_ORDER.indexOf(graha);

    if (index === -1) {
        throw new Error(`DashaSubdivisionEngine: unknown Graha "${graha}".`);
    }

    return [
        ...DASHA_GRAHA_ORDER.slice(index),
        ...DASHA_GRAHA_ORDER.slice(0, index)
    ];

}

function subdivide(parentGraha, parentStartEpochMs, parentDurationYears, timezoneOffsetHours) {

    const order = rotateFrom(parentGraha);

    let cursorMs = parentStartEpochMs;

    return order.map((graha) => {

        const durationYears =
            parentDurationYears * DASHA_YEARS[graha] / TOTAL_DASHA_YEARS;

        const durationMs = durationYears * DASHA_YEAR_DAYS * MILLISECONDS_PER_DAY;

        const startEpochMs = cursorMs;
        const endEpochMs = startEpochMs + durationMs;

        cursorMs = endEpochMs;

        return {
            graha,
            displayName: DASHA_GRAHA_NAMES[graha] ?? graha,
            start: formatLocalDateTime(startEpochMs, timezoneOffsetHours),
            end: formatLocalDateTime(endEpochMs, timezoneOffsetHours),
            startEpochMs,
            endEpochMs,
            durationYears,
            durationDisplay: formatDashaDuration(durationYears),
            children: []
        };

    });

}

export default { subdivide };
