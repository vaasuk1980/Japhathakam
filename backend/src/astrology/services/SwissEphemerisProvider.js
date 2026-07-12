import swisseph, {
    SiderealMode,
    HouseSystem
} from "@swisseph/node";

import AstronomyConfig from "../../config/AstronomyConfig.js";

import HouseData from "../models/HouseData.js";

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

    calculateHouses(
        julianDayNumber,
        latitude,
        longitude,
        houseSystem = HouseSystem.Placidus
    ) {

        const houses =
            swisseph.calculateHouses(
                julianDayNumber,
                latitude,
                longitude,
                houseSystem
            );

        return new HouseData(

            houses.cusps,

            houses.ascendant,
            houses.mc,
            houses.armc,
            houses.vertex,

            houses.equatorialAscendant,
            houses.coAscendant1,
            houses.coAscendant2,
            houses.polarAscendant,

            houses.houseSystem,

            AstronomyConfig.ayanamsa

        );

    }

}

export default new SwissEphemerisProvider();