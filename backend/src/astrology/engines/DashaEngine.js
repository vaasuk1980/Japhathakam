/**
 * ============================================================================
 * JAPHATHAKAM
 * DashaEngine — Trāitha Siddhānta Dasha System v1.0
 * ----------------------------------------------------------------------------
 * Implements Rules 5-12: birth Mahadasha, Balance Mahadasha, and the
 * recursive Antardasha -> Pratyantardasha -> Sukshmadasha -> Pranadasha
 * subdivision. Every level uses the SAME proportional rule (Rule 12):
 * a period's children are the fixed 12-Graha cycle starting from that
 * period's own Graha, each child's duration = parent duration x child
 * Graha's Mahadasha years / 120.
 *
 * Dates are tracked internally as UTC Julian Day (consistent with the
 * rest of the astrology layer) using the traditional Vimshottari
 * convention of 365.25 days per Dasha year (Rules 6, 8-11: "the
 * traditional proportional method").
 * ============================================================================
 */

import {
    DASHA_GRAHA_ORDER,
    DASHA_YEARS,
    TOTAL_DASHA_YEARS,
    DASHA_YEAR_DAYS
} from "../constants/DashaConstants.js";

import { OWNERSHIP_BY_GRAHA, getOwnerGraha } from "../constants/DashaNakshatraOwnership.js";
import { NAKSHATRA_SPAN } from "../constants/NakshatraConstants.js";

// --- Self-check: guards Rules 1-4 as frozen invariants -----------------

(function verifyFrozenRules() {

    const yearsSum = DASHA_GRAHA_ORDER.reduce(
        (sum, graha) => sum + DASHA_YEARS[graha],
        0
    );

    if (yearsSum !== TOTAL_DASHA_YEARS) {
        throw new Error(
            `DashaEngine: Mahadasha years must total ${TOTAL_DASHA_YEARS}, got ${yearsSum}.`
        );
    }

    if (DASHA_GRAHA_ORDER.length !== 12) {
        throw new Error("DashaEngine: exactly 12 Grahas are required.");
    }

    const coveredQuarterPadas = new Set();

    OWNERSHIP_BY_GRAHA.forEach(({ spans }) => {
        spans.forEach(([sequence, fromPada, toPada]) => {
            for (let pada = fromPada; pada <= toPada; pada++) {
                coveredQuarterPadas.add(`${sequence}.${pada}`);
            }
        });
    });

    if (coveredQuarterPadas.size !== 27 * 4) {
        throw new Error(
            `DashaEngine: Nakshatra ownership must cover exactly 108 quarter-Padas, got ${coveredQuarterPadas.size}.`
        );
    }

})();

class DashaEngine {

    /**
     * Rotates the fixed 12-Graha cycle to start at the given Graha
     * (Rule 12: every subdivision starts from the current ruling
     * Graha and wraps cyclically after Chitra back to Ravi).
     */
    rotateFrom(graha) {

        const index = DASHA_GRAHA_ORDER.indexOf(graha);

        if (index === -1) {
            throw new Error(`DashaEngine: unknown Graha "${graha}".`);
        }

        return [
            ...DASHA_GRAHA_ORDER.slice(index),
            ...DASHA_GRAHA_ORDER.slice(0, index)
        ];

    }

    /**
     * One proportional subdivision level (Rules 7-12) — used
     * identically for Antardasha, Pratyantardasha, Sukshmadasha,
     * and Pranadasha. The parent's own Graha always leads.
     *
     * @param {string} parentGraha
     * @param {number} parentStartJd - UTC Julian Day
     * @param {number} parentDurationYears
     * @returns {Array<{graha:string, startJd:number, endJd:number, durationYears:number}>}
     */
    subdivide(parentGraha, parentStartJd, parentDurationYears) {

        const order = this.rotateFrom(parentGraha);

        let cursorJd = parentStartJd;

        return order.map((graha) => {

            const durationYears =
                parentDurationYears * DASHA_YEARS[graha] / TOTAL_DASHA_YEARS;

            const startJd = cursorJd;
            const endJd = startJd + durationYears * DASHA_YEAR_DAYS;

            cursorJd = endJd;

            return { graha, startJd, endJd, durationYears };

        });

    }

    /**
     * Rule 6: remaining portion of the birth Nakshatra, as a
     * fraction of one full Nakshatra span (0 exclusive - 1 inclusive).
     */
    remainingNakshatraFraction(moonLongitude, nakshatra) {

        const traversed = moonLongitude - nakshatra.startLongitude;

        return (NAKSHATRA_SPAN - traversed) / NAKSHATRA_SPAN;

    }

    /**
     * Rule 5 + Rule 6: the birth Mahadasha Graha and its Balance
     * (remaining) duration in years.
     */
    calculateBirthMahadasha(moonPosition) {

        const graha = getOwnerGraha(
            moonPosition.nakshatra.sequence,
            moonPosition.pada.number
        );

        const fraction = this.remainingNakshatraFraction(
            moonPosition.longitude,
            moonPosition.nakshatra
        );

        const balanceYears = fraction * DASHA_YEARS[graha];

        return { graha, balanceYears };

    }

    /**
     * Builds the 12 Mahadashas of the person's Dasha timeline: the
     * birth Graha's Balance (partial) Mahadasha, followed by the
     * remaining 11 Grahas at their full duration, in the fixed
     * cyclic order (Rule 2). Each Mahadasha is itself subdivided
     * into its 12 Antardashas (Rule 7).
     */
    buildMahadashas(birthGraha, balanceYears, birthJd) {

        const order = this.rotateFrom(birthGraha);

        let cursorJd = birthJd;

        return order.map((graha, index) => {

            const durationYears =
                index === 0 ? balanceYears : DASHA_YEARS[graha];

            const startJd = cursorJd;
            const endJd = startJd + durationYears * DASHA_YEAR_DAYS;

            cursorJd = endJd;

            return {
                graha,
                startJd,
                endJd,
                durationYears,
                antardashas: this.subdivide(graha, startJd, durationYears)
            };

        });

    }

    /**
     * @param {import("../models/BirthContext.js").default} birthContext
     * @param {import("../models/PlanetPosition.js").default} moonPosition
     */
    calculate(birthContext, moonPosition) {

        const { graha: birthGraha, balanceYears } =
            this.calculateBirthMahadasha(moonPosition);

        const mahadashas = this.buildMahadashas(
            birthGraha,
            balanceYears,
            birthContext.julianDay
        );

        return {
            birthGraha,
            balanceYears,
            mahadashas
        };

    }

}

export default new DashaEngine();
