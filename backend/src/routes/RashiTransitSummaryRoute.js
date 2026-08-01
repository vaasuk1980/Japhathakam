import { Router } from "express";

import PanchangamEngine from "../astrology/engines/PanchangamEngine.js";
import RashiTransitEngine from "../astrology/engines/RashiTransitEngine.js";
import LagnaRegistry from "../astrology/constants/LagnaRegistry.js";
import DashaDurationFormatter from "../presentation/formatters/DashaDurationFormatter.js";
import DateTimeFormatter from "../presentation/formatters/DateTimeFormatter.js";

// Same order the Gochara Today table and Planetary Positions table
// already use, minus the Moon — the Moon changes Rashi every ~2.25
// days, so a full year would be 140+ rows, not useful in this table.
const GRAHA_ORDER = [
    "SUN", "MARS", "MERCURY", "JUPITER", "VENUS", "SATURN", "RAHU", "KETU",
    "BHUMI", "MITRA", "CHITRA",
];

const DAYS_PER_YEAR = 365.25;

function validate(body) {

    const year = Number(body.year);

    if (!Number.isInteger(year) || year < 1800 || year > 2400) {
        return "A valid year is required.";
    }

    const timezone = Number(body.timezone);

    if (Number.isNaN(timezone) || timezone < -12 || timezone > 14) {
        return "Valid timezone offset is required.";
    }

    return null;

}

// No location needed — a Graha's Rashi is the same everywhere on
// Earth (unlike the Lagna/ascendant); timezone is only for
// formatting the Ugadi window's and each transition's dates in
// local clock time.
export default function RashiTransitSummaryRoute() {

    const router = Router();

    router.post("/", (req, res, next) => {

        try {

            const body = req.body || {};

            const error = validate(body);

            if (error) {
                return res.status(400).json({ message: error });
            }

            const year = Number(body.year);
            const timezone = Number(body.timezone);

            const { startJd, endJd } = PanchangamEngine.findUgadiWindowForYear(year);
            const samvatsaraName = PanchangamEngine.calculateSamvatsara(startJd);

            const grahas = GRAHA_ORDER.map((graha) => {

                const events = RashiTransitEngine.listTransitions(graha, startJd, endJd);

                const transitions = events.map((event) => {

                    const durationDays = event.leavesJd - event.enteredJd;

                    return {
                        rasiEnglishName: LagnaRegistry[event.signIndex].englishName,
                        rasiTeluguName: LagnaRegistry[event.signIndex].teluguName,
                        entered: DateTimeFormatter.formatLocal(event.enteredJd, timezone),
                        leaves: DateTimeFormatter.formatLocal(event.leavesJd, timezone),
                        // Epoch millis alongside the formatted display strings —
                        // lets the frontend find "the row containing right now"
                        // (e.g. when deep-linking from a chart's retrograde
                        // marker) without re-parsing a DD-MM-YYYY string.
                        enteredEpochMs: DateTimeFormatter.toEpochMillis(event.enteredJd),
                        leavesEpochMs: DateTimeFormatter.toEpochMillis(event.leavesJd),
                        durationDisplay: DashaDurationFormatter.format(durationDays / DAYS_PER_YEAR),
                        vakri: event.vakri && {
                            start: event.vakri.startJd !== null
                                ? DateTimeFormatter.formatLocal(event.vakri.startJd, timezone)
                                : null,
                            end: event.vakri.endJd !== null
                                ? DateTimeFormatter.formatLocal(event.vakri.endJd, timezone)
                                : null,
                        },
                    };

                });

                return { graha, transitions };

            });

            return res.status(200).json({
                year,
                samvatsaraName,
                ugadiStart: DateTimeFormatter.formatLocal(startJd, timezone),
                ugadiEnd: DateTimeFormatter.formatLocal(endJd, timezone),
                grahas,
            });

        } catch (error) {
            next(error);
        }

    });

    return router;

}
