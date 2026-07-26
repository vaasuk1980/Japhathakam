import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";

import BirthContext from "../models/BirthContext.js";
import JanmaLagna from "../models/JanmaLagna.js";

import LagnaMapper from "../mappers/LagnaMapper.js";

import NakshatraCalculation from "../calculations/NakshatraCalculation.js";
import PadaCalculation from "../calculations/PadaCalculation.js";

const nakshatraCalculation = new NakshatraCalculation();
const padaCalculation = new PadaCalculation();

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

                const lagnaInfo =
            LagnaMapper.map(
                houseData.ascendant
            );

        const nakshatra =
            nakshatraCalculation.calculate(
                houseData.ascendant
            );

        const pada =
            padaCalculation.calculate(
                houseData.ascendant,
                nakshatra
            );

        const janmaLagna =
            new JanmaLagna(

                lagnaInfo.lagna,

                houseData.ascendant,

                lagnaInfo.signIndex,

                lagnaInfo.degreesInLagna,

                nakshatra,

                pada

            );

        return birthContext.withJanmaLagna(
            janmaLagna
        );

    }

}

export default new JanmaLagnaEngine();