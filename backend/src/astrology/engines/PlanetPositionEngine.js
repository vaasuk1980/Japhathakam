import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";

import SupportedGrahas from "../constants/SupportedGrahas.js";

import PositionMapper from "../mappers/PositionMapper.js";
import PositionValidator from "../validators/PositionValidator.js";

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

        const planetPositions = [];

        for (const graha of SupportedGrahas) {

            // Skip only grahas that do not have a Swiss Ephemeris mapping.
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

            const planetPosition =
                PositionMapper.map(
                    graha.code,
                    swissPosition
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