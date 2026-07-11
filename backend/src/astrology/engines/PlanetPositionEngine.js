import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";

import SupportedGrahas from "../constants/SupportedGrahas.js";

import PositionMapper from "../mappers/PositionMapper.js";
import PositionValidator from "../validators/PositionValidator.js";

import SiderealConversion from "../calculations/SiderealConversion.js";
import NakshatraCalculation from "../calculations/NakshatraCalculation.js";

const nakshatraCalculation = new NakshatraCalculation();

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

        let rahuPosition = null;

        for (const graha of SupportedGrahas) {

            // Ketu is derived from Rahu.
            if (graha.code === "KETU") {
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

            const nakshatra =
                nakshatraCalculation.calculate(
                    siderealLongitude
                );

            const planetPosition =
                PositionMapper.map(
                    graha.code,
                    {
                        ...swissPosition,
                        longitude: siderealLongitude,
                        nakshatra
                    }
                );

            PositionValidator.validate(
                planetPosition
            );

            planetPositions.push(
                planetPosition
            );

            if (graha.code === "RAHU") {
                rahuPosition = planetPosition;
            }

        }

        if (rahuPosition) {

            const ketuLongitude =
                (rahuPosition.longitude + 180) % 360;

            const ketuNakshatra =
                nakshatraCalculation.calculate(
                    ketuLongitude
                );

            const ketuPosition =
                PositionMapper.map(
                    "KETU",
                    {
                        ...rahuPosition,
                        longitude: ketuLongitude,
                        longitudeSpeed:
                            rahuPosition.longitudeSpeed,
                        latitude: 0,
                        latitudeSpeed: 0,
                        nakshatra: ketuNakshatra
                    }
                );

            PositionValidator.validate(
                ketuPosition
            );

            planetPositions.push(
                ketuPosition
            );

        }

        return planetPositions;

    }

}

export default new PlanetPositionEngine();