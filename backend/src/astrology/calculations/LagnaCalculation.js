import LagnaRegistry from "../constants/LagnaRegistry.js";

class LagnaCalculation {

    calculate(
        siderealLongitude
    ) {

        if (
            typeof siderealLongitude !== "number" ||
            Number.isNaN(siderealLongitude)
        ) {
            throw new Error(
                "Invalid sidereal longitude."
            );
        }

        const normalizedLongitude =
            ((siderealLongitude % 360) + 360) % 360;

        const lagna =
            LagnaRegistry.find(
                lagna =>
                    normalizedLongitude >= lagna.startLongitude &&
                    normalizedLongitude < lagna.endLongitude
            );

        if (!lagna) {
            return LagnaRegistry[0];
        }

        return lagna;

    }

}

export default LagnaCalculation;