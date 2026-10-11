import { Router } from "express";

import PersonRepository from "../repositories/PersonRepository.js";
import GenerateKundaliRequest from "../application/requests/GenerateKundaliRequest.js";

const MS_PER_DAY = 86400000;
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

/*
|--------------------------------------------------------------------------
| Upcoming Dasha changes
|--------------------------------------------------------------------------
|
| GET /api/dasha-changes?days=30
|
| Across every saved person, lists the Mahadasha and Antardasha
| changes that fall between now and now + `days`.
|
| A person's Dasha timeline is fixed by their birth details, so the
| list of change points (every Maha/Antar start) is computed once per
| person — keyed by id + updatedAt, so an edit invalidates it — and
| only the cheap "which of these fall in the window" filter runs per
| request. That keeps this fast with many saved persons.
|
*/

function clampDays(raw) {

    const days = parseInt(raw, 10);

    if (!Number.isFinite(days) || days < 1) {
        return DEFAULT_DAYS;
    }

    return Math.min(days, MAX_DAYS);

}

// Every moment a ruling Graha changes at Mahadasha or Antardasha
// level. An Antardasha that begins exactly with its Mahadasha is
// reported once, as the Mahadasha change.
function extractChangePoints(dasha) {

    const points = [];
    const mahadashas = dasha?.mahadashas ?? [];

    mahadashas.forEach((mahadasha, mahaIndex) => {

        points.push({
            level: "mahadasha",
            maha: mahadasha.graha,
            fromGraha: mahaIndex > 0 ? mahadashas[mahaIndex - 1].graha : null,
            toGraha: mahadasha.graha,
            atEpochMs: mahadasha.startEpochMs,
            at: mahadasha.start,
        });

        const antardashas = mahadasha.children ?? [];

        antardashas.forEach((antardasha, antarIndex) => {

            if (antarIndex === 0) {
                return;
            }

            points.push({
                level: "antardasha",
                maha: mahadasha.graha,
                fromGraha: antardashas[antarIndex - 1].graha,
                toGraha: antardasha.graha,
                atEpochMs: antardasha.startEpochMs,
                at: antardasha.start,
            });

        });

    });

    return points;

}

export default function DashaChangesRoute({ generateKundaliUseCase }) {

    const router = Router();
    const cache = new Map();

    async function changePointsFor(person) {

        const key = `${person.id}:${person.updatedAt ?? ""}`;

        if (!cache.has(key)) {

            cache.set(key, (async () => {

                try {

                    const response = await generateKundaliUseCase.execute(
                        new GenerateKundaliRequest({ birthDetails: person, gocharaDetails: null })
                    );

                    return extractChangePoints(response.kundali?.dasha);

                } catch (error) {

                    // One person's bad record must not break the whole list.
                    console.error(`Dasha changes: skipped ${person.id}:`, error.message);
                    return [];

                }

            })());

        }

        return cache.get(key);

    }

    router.get("/", async (req, res, next) => {

        try {

            const days = clampDays(req.query.days);
            const now = Date.now();
            const until = now + days * MS_PER_DAY;

            const persons = await PersonRepository.list();
            const events = [];
            // Nearest change after the window too, so an empty window can
            // still say "next change in N days".
            let next = null;

            for (const person of persons) {

                const points = await changePointsFor(person);

                for (const point of points) {

                    if (point.atEpochMs < now) {
                        continue;
                    }

                    const event = {
                        personId: person.id,
                        firstName: person.firstName,
                        lastName: person.lastName,
                        ...point,
                        daysAway: Math.max(0, Math.ceil((point.atEpochMs - now) / MS_PER_DAY)),
                    };

                    if (point.atEpochMs <= until) {
                        events.push(event);
                    }
                    else if (!next || point.atEpochMs < next.atEpochMs) {
                        next = event;
                    }

                }

            }

            events.sort((a, b) => a.atEpochMs - b.atEpochMs);

            return res.status(200).json({ days, count: events.length, events, next });

        } catch (error) {
            next(error);
        }

    });

    return router;

}
