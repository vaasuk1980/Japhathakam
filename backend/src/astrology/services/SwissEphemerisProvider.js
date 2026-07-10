import swisseph from "@swisseph/node";

class SwissEphemerisProvider {

    calculateJulianDay(
        year,
        month,
        day,
        hour
    ) {
        return swisseph.julianDay(
            year,
            month,
            day,
            hour
        );
    }

    calculatePosition(
        julianDayNumber,
        celestialBody,
        flags
    ) {
        return swisseph.calculatePosition(
            julianDayNumber,
            celestialBody,
            flags
        );
    }

}

export default new SwissEphemerisProvider();