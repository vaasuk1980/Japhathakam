import NakshatraRegistry from "../constants/NakshatraRegistry.js";
import {
    NAKSHATRA_COUNT,
    NAKSHATRA_SPAN
} from "../constants/NakshatraConstants.js";

class NakshatraCalculation {

    calculate(siderealLongitude) {

        if (
            typeof siderealLongitude !== "number" ||
            Number.isNaN(siderealLongitude)
        ) {
            throw new Error("Invalid sidereal longitude.");
        }

        let normalizedLongitude = siderealLongitude;

        if (normalizedLongitude === 360) {
            normalizedLongitude = 0;
        }

        if (
            normalizedLongitude < 0 ||
            normalizedLongitude >= 360
        ) {
            throw new Error(
                `Sidereal longitude must be between 0 (inclusive) and 360 (exclusive). Received: ${siderealLongitude}`
            );
        }

        const index = Math.floor(
            normalizedLongitude / NAKSHATRA_SPAN
        );

        if (index < 0 || index >= NAKSHATRA_COUNT) {
            throw new Error(
                `Unable to determine Nakshatra for longitude: ${siderealLongitude}`
            );
        }

        return NakshatraRegistry[index];

    }

}

export default NakshatraCalculation;