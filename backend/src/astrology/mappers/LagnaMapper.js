import SupportedLagnas from "../constants/SupportedLagnas.js";

import LagnaInfo from "../models/LagnaInfo.js";

class LagnaMapper {

    map(
        longitude
    ) {

        const normalizedLongitude =
            ((longitude % 360) + 360) % 360;

        const signIndex =
            Math.floor(
                normalizedLongitude / 30
            );

        const lagna =
            SupportedLagnas[
                signIndex
            ];

        if (!lagna) {
            throw new Error(
                `Unable to determine Lagna for longitude ${longitude}.`
            );
        }

        const degreesInLagna =
            normalizedLongitude - (signIndex * 30);

        return new LagnaInfo(

            lagna,

            signIndex,

            degreesInLagna

        );

    }

}

export default new LagnaMapper();