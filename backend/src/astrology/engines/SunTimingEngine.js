import swisseph, { RiseTransitFlag } from "@swisseph/node";

import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";

/**
 * ============================================================================
 * JAPHATHAKAM
 * SunTimingEngine
 * ----------------------------------------------------------------------------
 * Sunrise/Sunset for a given local calendar date + location. Distinct from
 * PanchangamEngine (which is scoped to Masa/Samvatsara/Nakshatra-boundary
 * work for a birth Kundali) — this is pure date+place astronomy, no birth
 * chart involved.
 * ============================================================================
 */

const MINUTES_PER_HOUR = 60;

class SunTimingEngine {

    calculate({ year, month, day, timezone, latitude, longitude }) {

        // Rise/Set search runs forward from this Julian Day, so it must
        // start at local midnight (not "now") or a search begun later in
        // the day would return tomorrow's event instead of today's.
        const localMidnightUtcHour = 0 - timezone;

        const midnightJulianDay =
            SwissEphemerisProvider.calculateJulianDay(
                year,
                month,
                day,
                localMidnightUtcHour
            );

        const sunrise =
            SwissEphemerisProvider.calculateRiseTransitSet(
                midnightJulianDay,
                swisseph.Planet.Sun,
                RiseTransitFlag.Rise,
                longitude,
                latitude
            );

        const sunset =
            SwissEphemerisProvider.calculateRiseTransitSet(
                midnightJulianDay,
                swisseph.Planet.Sun,
                RiseTransitFlag.Set,
                longitude,
                latitude
            );

        return {
            sunrise: this.toLocalTime(sunrise.time, timezone),
            sunset: this.toLocalTime(sunset.time, timezone),
        };

    }

    toLocalTime(julianDay, timezone) {

        const { hour } = SwissEphemerisProvider.dateFromJulianDay(julianDay);

        const localHour = ((hour + timezone) % 24 + 24) % 24;

        const wholeHour = Math.floor(localHour);
        const minute = Math.round((localHour - wholeHour) * MINUTES_PER_HOUR);

        return `${String(wholeHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    }

}

export default new SunTimingEngine();
