import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";

import SupportedGrahas from "../constants/SupportedGrahas.js";

import PositionMapper from "../mappers/PositionMapper.js";
import PositionValidator from "../validators/PositionValidator.js";

import SiderealConversion from "../calculations/SiderealConversion.js";

class PlanetPositionEngine {

    calculate(
        birthContext
    ) {

        const julianDay =
            SwissEphemerisProvider.calculateJulianDay(
                birthContext.year,
                birthContext.month,
                birthContext.day,
                birthContext.hour
            );

        const ayanamsa =
            SwissEphemerisProvider.getAyanamsa(
                julianDay
            );

        const planetPositions = [];

        for (const graha of SupportedGrahas) {

            // Skip grahas without Swiss Ephemeris mapping.
            if (
                graha.swissPlanet === null ||
                graha.swissPlanet === undefined
            ) {
                continue;
            }

            const swissPosition =
                SwissEphemerisProvider.calculatePosition(
                    julianDay,
                    graha.swissPlanet
                );

            const siderealLongitude =
                SiderealConversion.convert(
                    swissPosition.longitude,
                    ayanamsa
                );

            const planetPosition =
                PositionMapper.map(
                    graha.code,
                    {
                        ...swissPosition,
                        longitude: siderealLongitude
                    }
                );

            PositionValidator.validate(
                planetPosition
            );

            planetPositions.push(
                planetPosition
            );

        }

        return planetPositions;

    }

}

export default new PlanetPositionEngine();