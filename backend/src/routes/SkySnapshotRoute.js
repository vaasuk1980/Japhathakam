import { Router } from "express";

import BirthDetails from "../astrology/models/input/BirthDetails.js";
import BirthContextEngine from "../astrology/engines/BirthContextEngine.js";
import PlanetPositionEngine from "../astrology/engines/PlanetPositionEngine.js";
import DerivedGrahaEngine from "../astrology/engines/DerivedGrahaEngine.js";
import JanmaLagnaEngine from "../astrology/engines/JanmaLagnaEngine.js";
import SunTimingEngine from "../astrology/engines/SunTimingEngine.js";
import PanchangamEngine from "../astrology/engines/PanchangamEngine.js";
import LongitudeFormatter from "../presentation/formatters/LongitudeFormatter.js";
import DateTimeFormatter from "../presentation/formatters/DateTimeFormatter.js";

// Deliberately not "birth" anything — this is today's (or any date's) sky
// for a plain date+place, with no Person involved. Reuses the same engines
// a Kundali build uses, just without a natal chart in the picture.
function parseDateTime(dateStr, timeStr) {

    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);

    return { year, month, day, localHour: hour + minute / 60 };

}

function validate(body) {

    if (!body.date || !body.time) {
        return "date and time are required.";
    }

    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const timezone = Number(body.timezone);

    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
        return "Valid latitude is required.";
    }

    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
        return "Valid longitude is required.";
    }

    if (Number.isNaN(timezone) || timezone < -12 || timezone > 14) {
        return "Valid timezone offset is required.";
    }

    return null;

}

export default function SkySnapshotRoute() {

    const router = Router();

    router.post("/", (req, res, next) => {

        try {

            const body = req.body || {};

            const error = validate(body);

            if (error) {
                return res.status(400).json({ message: error });
            }

            const { year, month, day, localHour } = parseDateTime(body.date, body.time);

            const latitude = Number(body.latitude);
            const longitude = Number(body.longitude);
            const timezone = Number(body.timezone);

            const birthDetails = new BirthDetails({
                year,
                month,
                day,
                localHour,
                placeName: body.place ?? null,
                latitude,
                longitude,
                timezone,
            });

            const birthContext = BirthContextEngine.create(birthDetails);

            // The ascendant for "right now, here" — same computation the
            // birth-Kundali flow uses (calculateHouses + LagnaMapper), just
            // run against the current moment instead of a birth moment.
            const enrichedBirthContext = JanmaLagnaEngine.calculate(birthContext);
            const janmaLagna = enrichedBirthContext.janmaLagna;

            const classicalPositions = PlanetPositionEngine.calculate(birthContext);
            const derivedPositions = DerivedGrahaEngine.calculate(classicalPositions);

            const planetPositions = [...classicalPositions, ...derivedPositions].map(
                (position) => ({
                    ...position,
                    formattedLongitude: LongitudeFormatter.format(position.longitude),
                })
            );

            const sunTiming = SunTimingEngine.calculate({
                year,
                month,
                day,
                timezone,
                latitude,
                longitude,
            });

            const moonPosition = classicalPositions.find((position) => position.planet === "MOON");

            // Same calculation the birth-Kundali flow uses (Masa/Samvatsara/
            // Nakshatra-boundary all come from one call) — nothing here is
            // birth-specific, it's pure calendar-from-date-and-Moon math.
            const panchangam = PanchangamEngine.calculate(birthContext, moonPosition.nakshatra);

            return res.status(200).json({
                planetPositions,
                lagna: {
                    ...janmaLagna.lagna,
                    longitude: janmaLagna.longitude,
                    formattedLongitude: LongitudeFormatter.format(janmaLagna.longitude),
                    nakshatra: janmaLagna.nakshatra,
                    pada: janmaLagna.pada,
                },
                sunrise: sunTiming.sunrise,
                sunset: sunTiming.sunset,
                masaName: panchangam.masaName,
                masaIsLeap: panchangam.masaIsLeap,
                samvatsaraName: panchangam.samvatsaraName,
                nakshatraStart: DateTimeFormatter.formatLocal(panchangam.nakshatraStartJd, timezone),
                nakshatraEnd: DateTimeFormatter.formatLocal(panchangam.nakshatraEndJd, timezone),
            });

        } catch (error) {
            next(error);
        }

    });

    return router;

}
