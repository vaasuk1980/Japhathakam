import swisseph, { SiderealMode } from "@swisseph/node";

import AstronomyConfig from "../../config/AstronomyConfig.js";

class SwissEphemerisProvider {

    constructor() {
        this.initialize();
    }

    initialize() {

        switch (AstronomyConfig.ayanamsa) {

            case "LAHIRI":
                swisseph.setSiderealMode(
                    SiderealMode.Lahiri
                );
                break;

            default:
                throw new Error(
                    `Unsupported ayanamsa: ${AstronomyConfig.ayanamsa}`
                );

        }

    }

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

    getAyanamsa(
        julianDayNumber
    ) {
        return swisseph.getAyanamsa(
            julianDayNumber
        );
    }

}

export default new SwissEphemerisProvider();