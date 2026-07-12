import BirthContext from "../models/BirthContext.js";
import BirthDetails from "../models/input/BirthDetails.js";

import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";

class BirthContextEngine {

    create(
        birthDetails
    ) {

        if (!(birthDetails instanceof BirthDetails)) {
            throw new Error(
                "BirthDetails instance is required."
            );
        }

        const utcHour =
            this.convertLocalHourToUtc(
                birthDetails.localHour,
                birthDetails.timezone
            );

        const julianDay =
            SwissEphemerisProvider.calculateJulianDay(
                birthDetails.year,
                birthDetails.month,
                birthDetails.day,
                utcHour
            );

        return new BirthContext({

            year: birthDetails.year,
            month: birthDetails.month,
            day: birthDetails.day,

            localHour: birthDetails.localHour,
            utcHour,

            latitude: birthDetails.latitude,
            longitude: birthDetails.longitude,
            timezone: birthDetails.timezone,

            julianDay,

            // Future enrichment
            janmaLagna: null

        });

    }

    convertLocalHourToUtc(
        localHour,
        timezone
    ) {

        return localHour - timezone;

    }

}

export default new BirthContextEngine();