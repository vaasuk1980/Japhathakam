import {
    julianDay,
    calculatePosition
} from "@swisseph/node";

class SwissEphemerisProvider {

    calculateJulianDay(
        year,
        month,
        day,
        hour
    ) {
        return julianDay(
            year,
            month,
            day,
            hour
        );
    }

    calculatePlanet(
        julianDayNumber,
        celestialBody,
        flags
    ) {
        return calculatePosition(
            julianDayNumber,
            celestialBody,
            flags
        );
    }

}

export default new SwissEphemerisProvider();