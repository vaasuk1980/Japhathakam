import { useEffect, useState } from "react";

import GenerateKundaliService from "../services/GenerateKundaliService";
import resolveCurrentDashaChain from "../utils/dasha/resolveCurrentDashaChain";

/* ==========================================================
   Per-person "at a glance" facts for list views: Lagna longitude
   and the Mahadasha/Antardasha running right now. Not stored with
   the person (it changes over time, and Lagna would need a
   migration), so it is derived by generating each Kundali once and
   memoised in-module for the session.

   Returns { [personId]: { lagnaLongitude, mahadasha, antardasha } }.
   A person who is still loading — or whose Kundali failed — has no
   entry; callers show a placeholder.
========================================================== */

const cache = new Map();

function cacheKey(person) {
    return `${person.id}:${person.updatedAt ?? ""}`;
}

async function summarise(person) {

    const response = await GenerateKundaliService.generate(person);
    const kundali = response.kundali;
    const chain = resolveCurrentDashaChain(kundali.dasha, person.timezone);

    return {
        lagnaLongitude: kundali.janmaChart?.lagna?.longitude ?? null,
        mahadasha: chain?.mahadasha?.graha ?? null,
        antardasha: chain?.antardasha?.graha ?? null,
    };

}

export default function usePersonSummaries(persons) {

    const [summaries, setSummaries] = useState({});

    useEffect(() => {

        let cancelled = false;

        persons.forEach((person) => {

            const key = cacheKey(person);

            if (!cache.has(key)) {
                cache.set(key, summarise(person).catch(() => null));
            }

            cache.get(key).then((summary) => {
                if (!cancelled && summary) {
                    setSummaries((previous) => ({ ...previous, [person.id]: summary }));
                }
            });

        });

        return () => {
            cancelled = true;
        };

    }, [persons]);

    return summaries;

}
