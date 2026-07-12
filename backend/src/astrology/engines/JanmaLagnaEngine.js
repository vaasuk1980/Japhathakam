import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";

import BirthContext from "../models/BirthContext.js";
import JanmaLagna from "../models/JanmaLagna.js";

import LagnaMapper from "../mappers/LagnaMapper.js";

class JanmaLagnaEngine {

    calculate(
        birthContext
    ) {

        if (!(birthContext instanceof BirthContext)) {
            throw new Error(
                "BirthContext instance is required."
            );
        }

        const houseData =
            SwissEphemerisProvider.calculateHouses(
                birthContext.julianDay,
                birthContext.latitude,
                birthContext.longitude
            );

        /*
        console.log("\n==============================");
        console.log(" HOUSE DATA ");
        console.log("==============================");
        console.log(houseData);
        console.log("==============================\n");
        */

        const lagnaInfo =
            LagnaMapper.map(
                houseData.ascendant
            );

        const janmaLagna =
            new JanmaLagna(

                lagnaInfo.lagna,

                houseData.ascendant,

                lagnaInfo.signIndex,

                lagnaInfo.degreesInLagna

            );

        return birthContext.withJanmaLagna(
            janmaLagna
        );

    }

}

export default new JanmaLagnaEngine();