/**
 * ============================================================================
 * JAPHATHAKAM
 * RashiTransitEngine
 * ----------------------------------------------------------------------------
 * For a Graha currently occupying a given Rashi (30 degree zodiac sign),
 * finds the Julian Day it entered that Rashi and the Julian Day it will
 * next leave it.
 *
 * Unlike CrossingTimeSearch (used for the Moon's Nakshatra boundaries),
 * this does NOT assume monotonic motion. Rahu/Ketu move backward through
 * the zodiac permanently, and Mercury/Venus/Mars/Jupiter/Saturn each go
 * retrograde periodically — a Graha can cross a Rashi boundary, retrograde
 * back over it, then cross forward again. Searching for "when did the
 * longitude last cross the boundary" would be wrong if it doesn't account
 * for that; instead this tracks a simple boolean ("is it currently inside
 * this 30 degree Rashi range") and finds where that boolean flips, which
 * stays correct regardless of which direction the Graha is moving.
 * ============================================================================
 */

import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";
import SiderealConversion from "../calculations/SiderealConversion.js";
import SupportedGrahas from "../constants/SupportedGrahas.js";
import GRAHAS_WITH_VARIABLE_DIRECTION from "../constants/GrahasWithVariableDirection.js";

const RASHI_SPAN = 30;
const ONE_PADA = 10 / 3; // 3°20' — Mitra/Chitra's fixed offset from Ketu/Rahu

// Generous per-Graha search windows/step sizes — real transit durations
// are usually shorter, but a retrograde station near a Rashi boundary can
// extend actual dwell time well past the "typical" figure, so these pad
// beyond the nominal case rather than risk missing the true boundary.
// coarseStepDays must stay well under one Rashi-width of travel time so
// a boundary crossing (or a brief retrograde wobble across it) is never
// skipped entirely during the coarse scan.
const SEARCH_WINDOW_BY_GRAHA = {
    SUN: { maxDays: 45, coarseStepDays: 0.5 },
    MOON: { maxDays: 4, coarseStepDays: 0.05 },
    MERCURY: { maxDays: 150, coarseStepDays: 0.5 },
    VENUS: { maxDays: 200, coarseStepDays: 0.5 },
    MARS: { maxDays: 270, coarseStepDays: 1 },
    JUPITER: { maxDays: 450, coarseStepDays: 2 },
    SATURN: { maxDays: 1100, coarseStepDays: 3 },
    RAHU: { maxDays: 650, coarseStepDays: 2 },
    KETU: { maxDays: 650, coarseStepDays: 2 },
    // Derived Grahas move at exactly their parent's speed (fixed offset).
    BHUMI: { maxDays: 45, coarseStepDays: 0.5 },
    MITRA: { maxDays: 650, coarseStepDays: 2 },
    CHITRA: { maxDays: 650, coarseStepDays: 2 },
};

const SWISS_PLANET_BY_CODE = {};
SupportedGrahas.forEach(({ code, swissPlanet }) => {
    SWISS_PLANET_BY_CODE[code] = swissPlanet;
});

function normalize(degrees) {
    return ((degrees % 360) + 360) % 360;
}

class RashiTransitEngine {

    /**
     * Sidereal longitude of the given Graha at an arbitrary Julian Day —
     * generalizes PlanetPositionEngine/DerivedGrahaEngine's per-birth-
     * moment calculation to "any moment", which those two don't need
     * to do since a Kundali is only ever built for one moment.
     */
    longitudeAt(grahaCode, julianDay) {

        if (grahaCode === "KETU") {
            return normalize(this.longitudeAt("RAHU", julianDay) + 180);
        }

        if (grahaCode === "BHUMI") {
            return normalize(this.longitudeAt("SUN", julianDay) + 180);
        }

        if (grahaCode === "MITRA") {
            return normalize(this.longitudeAt("KETU", julianDay) + ONE_PADA);
        }

        if (grahaCode === "CHITRA") {
            return normalize(this.longitudeAt("RAHU", julianDay) + ONE_PADA);
        }

        const swissPlanet = SWISS_PLANET_BY_CODE[grahaCode];

        if (swissPlanet === undefined) {
            throw new Error(`RashiTransitEngine: unknown Graha "${grahaCode}".`);
        }

        const tropical = SwissEphemerisProvider.calculatePosition(julianDay, swissPlanet).longitude;
        const ayanamsa = SwissEphemerisProvider.getAyanamsa(julianDay);

        return SiderealConversion.convert(tropical, ayanamsa);

    }

    /**
     * @param {string} grahaCode
     * @param {number} currentLongitude - the Graha's sidereal longitude
     *   at referenceJd (already computed by the caller — not re-derived
     *   here, so this stays consistent with whatever position the rest
     *   of the response is built from).
     * @param {number} referenceJd
     * @returns {{ enteredJd: number, leavesJd: number }}
     */
    calculateBoundaries(grahaCode, currentLongitude, referenceJd) {

        const signIndex = Math.floor(normalize(currentLongitude) / RASHI_SPAN);
        const signStart = signIndex * RASHI_SPAN;
        const signEnd = signStart + RASHI_SPAN;

        const inSign = (jd) => {
            const longitude = this.longitudeAt(grahaCode, jd);
            return longitude >= signStart && longitude < signEnd;
        };

        const { maxDays, coarseStepDays } =
            SEARCH_WINDOW_BY_GRAHA[grahaCode] ?? { maxDays: 60, coarseStepDays: 1 };

        const enteredJd = this.findBoundary(inSign, referenceJd, -1, maxDays, coarseStepDays);
        const leavesJd = this.findBoundary(inSign, referenceJd, 1, maxDays, coarseStepDays);

        return { enteredJd, leavesJd };

    }

    /**
     * Every individual Rashi "stay" the Graha has between startJd and
     * endJd, as a chained sequence of exact entry/exit moments — the
     * first stay's entry (and the last stay's exit) are the TRUE
     * boundary even if that falls outside [startJd, endJd], since a
     * stay in progress at the window's edge didn't actually begin or
     * end exactly on that edge.
     *
     * @returns {Array<{ signIndex: number, enteredJd: number,
     *   leavesJd: number, isRetrograde: boolean|null }>}
     */
    listTransitions(grahaCode, startJd, endJd) {

        const transitions = [];

        let { enteredJd, leavesJd } = this.calculateBoundaries(
            grahaCode, this.longitudeAt(grahaCode, startJd), startJd
        );

        // Guards against runaway loops if a Graha/window combination
        // somehow never satisfies the endJd exit condition.
        for (let guard = 0; guard < 500; guard++) {

            const midJd = (enteredJd + leavesJd) / 2;

            transitions.push({
                signIndex: Math.floor(normalize(this.longitudeAt(grahaCode, midJd)) / RASHI_SPAN),
                enteredJd,
                leavesJd,
                vakri: this.findVakriEpisode(grahaCode, enteredJd, leavesJd),
            });

            if (leavesJd >= endJd) {
                break;
            }

            // The next stay begins exactly where this one ended — sample
            // a hair past the boundary so the "current sign" lookup
            // inside calculateBoundaries lands unambiguously in the new
            // Rashi rather than right on the dividing line.
            const nextSampleJd = leavesJd + 0.0005;
            const next = this.calculateBoundaries(
                grahaCode, this.longitudeAt(grahaCode, nextSampleJd), nextSampleJd
            );

            enteredJd = next.enteredJd;
            leavesJd = next.leavesJd;

        }

        return transitions;

    }

    /**
     * Every station (direction reversal) the Graha makes between
     * startJd and endJd — a coarse scan of longitudeSpeed's sign,
     * bisected to the exact moment at each flip. Reuses the same
     * per-Graha coarseStepDays as the Rashi-boundary search, which
     * is already tuned well under that Graha's real retrograde-loop
     * length, so a station is never skipped.
     *
     * @returns {Array<{ type: "STATION_RETROGRADE"|"STATION_DIRECT", jd: number }>}
     */
    findDirectionChanges(grahaCode, startJd, endJd) {

        const swissPlanet = SWISS_PLANET_BY_CODE[grahaCode];
        const { coarseStepDays } = SEARCH_WINDOW_BY_GRAHA[grahaCode] ?? { coarseStepDays: 1 };

        const speedAt = (jd) =>
            SwissEphemerisProvider.calculatePosition(jd, swissPlanet).longitudeSpeed;

        const changes = [];
        let prevJd = startJd;
        let prevSpeed = speedAt(startJd);

        for (let jd = startJd + coarseStepDays; jd <= endJd; jd += coarseStepDays) {

            const speed = speedAt(jd);

            if (Math.sign(speed) !== Math.sign(prevSpeed)) {

                let lo = prevJd;
                let hi = jd;

                for (let iteration = 0; iteration < 40; iteration++) {
                    const mid = (lo + hi) / 2;
                    if (Math.sign(speedAt(mid)) === Math.sign(prevSpeed)) lo = mid; else hi = mid;
                }

                changes.push({
                    type: prevSpeed > 0 ? "STATION_RETROGRADE" : "STATION_DIRECT",
                    jd: (lo + hi) / 2,
                });

            }

            prevJd = jd;
            prevSpeed = speed;

        }

        return changes;

    }

    /**
     * Whether a Rashi stay [enteredJd, leavesJd] contains a retrograde
     * loop, and if so, exactly when it started/ended — a single
     * direction sample (e.g. at the stay's midpoint) can't tell you
     * this, since a stay is often mostly direct motion with only a
     * few weeks of retrograde inside it (see the Mercury/Kumbha
     * example this was built for: 2m 5d total, only ~23 days of that
     * actually retrograde).
     *
     * @returns {null|{ startJd: number|null, endJd: number|null }}
     *   null for Grahas whose direction never varies, or for a stay
     *   with no retrograde loop at all. startJd/endJd are individually
     *   null when the loop's station fell outside this stay's window
     *   (already retrograde at entry, or still retrograde at exit).
     */
    findVakriEpisode(grahaCode, enteredJd, leavesJd) {

        if (!GRAHAS_WITH_VARIABLE_DIRECTION.has(grahaCode)) {
            return null;
        }

        const changes = this.findDirectionChanges(grahaCode, enteredJd, leavesJd);

        const retrogradeStations = changes.filter((c) => c.type === "STATION_RETROGRADE");
        const directStations = changes.filter((c) => c.type === "STATION_DIRECT");

        if (retrogradeStations.length === 0 && directStations.length === 0) {
            return null;
        }

        return {
            startJd: retrogradeStations.length > 0 ? retrogradeStations[0].jd : null,
            endJd: directStations.length > 0 ? directStations[directStations.length - 1].jd : null,
        };

    }

    findBoundary(inSign, referenceJd, direction, maxDays, coarseStepDays) {

        let prevJd = referenceJd;
        const step = coarseStepDays * direction;
        const steps = Math.round(maxDays / coarseStepDays);

        for (let i = 1; i <= steps; i++) {

            const currJd = referenceJd + step * i;

            if (!inSign(currJd)) {
                return this.bisect(inSign, prevJd, currJd);
            }

            prevJd = currJd;

        }

        throw new Error(
            `RashiTransitEngine: boundary not found within ${maxDays} days.`
        );

    }

    // Converges to the exact jd where `inSign` flips, purely from the
    // boolean predicate — works regardless of which edge is being
    // crossed or which direction the Graha is moving at that moment.
    bisect(inSign, inSignJd, outOfSignJd) {

        let lo = inSignJd;
        let hi = outOfSignJd;

        for (let iteration = 0; iteration < 60; iteration++) {

            const mid = (lo + hi) / 2;

            if (inSign(mid)) {
                lo = mid;
            } else {
                hi = mid;
            }

        }

        return (lo + hi) / 2;

    }

}

export default new RashiTransitEngine();
