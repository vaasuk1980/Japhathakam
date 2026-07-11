import PadaRegistry from "../constants/PadaRegistry.js";
import {
    PADA_COUNT,
    PADA_SPAN
} from "../constants/PadaConstants.js";

class PadaCalculation {

    calculate(
        siderealLongitude,
        nakshatra
    ) {

        if (
            typeof siderealLongitude !== "number" ||
            Number.isNaN(siderealLongitude)
        ) {
            throw new Error("Invalid sidereal longitude.");
        }

        if (!nakshatra) {
            throw new Error("Nakshatra is required for Pada calculation.");
        }

        const longitudeWithinNakshatra =
            siderealLongitude - nakshatra.startLongitude;

        const index = Math.floor(
            longitudeWithinNakshatra / PADA_SPAN
        );

        if (
            index < 0 ||
            index >= PADA_COUNT
        ) {
            throw new Error(
                `Unable to determine Pada for longitude: ${siderealLongitude}`
            );
        }

        return PadaRegistry[index];

    }

}

export default PadaCalculation;