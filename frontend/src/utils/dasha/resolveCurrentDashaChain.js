import DashaSubdivisionEngine from "../../kundali/engines/DashaSubdivisionEngine";
import isCurrentPeriod from "./isCurrentPeriod";

/* ==========================================================
   Walks Mahadasha -> Antardasha -> Pratyantardasha ->
   Sukshmadasha -> Pranadasha to find the single period active
   "right now" at each of the 5 levels — the "at a glance" chain
   DashaGlance needs. Mahadasha/Antardasha are already computed
   (period.children); the deeper 3 levels aren't eagerly computed
   by the backend, so this subdivides on demand exactly like
   DashaPeriodRow does when a row is expanded, just walking
   straight down the "current" branch instead of waiting for the
   user to click through it.
========================================================== */

export default function resolveCurrentDashaChain(dasha, timezone, now = Date.now()) {

    if (!dasha || !Array.isArray(dasha.mahadashas)) {
        return null;
    }

    const mahadasha = dasha.mahadashas.find((period) => isCurrentPeriod(period, now));

    if (!mahadasha) {
        return null;
    }

    const antardasha = (mahadasha.children || []).find((period) => isCurrentPeriod(period, now));

    if (!antardasha) {
        return { mahadasha, antardasha: null, pratyantardasha: null, sukshmadasha: null, pranadasha: null };
    }

    const pratyantardashas = DashaSubdivisionEngine.subdivide(
        antardasha.graha, antardasha.startEpochMs, antardasha.durationYears, timezone
    );
    const pratyantardasha = pratyantardashas.find((period) => isCurrentPeriod(period, now));

    if (!pratyantardasha) {
        return { mahadasha, antardasha, pratyantardasha: null, sukshmadasha: null, pranadasha: null };
    }

    const sukshmadashas = DashaSubdivisionEngine.subdivide(
        pratyantardasha.graha, pratyantardasha.startEpochMs, pratyantardasha.durationYears, timezone
    );
    const sukshmadasha = sukshmadashas.find((period) => isCurrentPeriod(period, now));

    if (!sukshmadasha) {
        return { mahadasha, antardasha, pratyantardasha, sukshmadasha: null, pranadasha: null };
    }

    const pranadashas = DashaSubdivisionEngine.subdivide(
        sukshmadasha.graha, sukshmadasha.startEpochMs, sukshmadasha.durationYears, timezone
    );
    const pranadasha = pranadashas.find((period) => isCurrentPeriod(period, now));

    return { mahadasha, antardasha, pratyantardasha, sukshmadasha, pranadasha: pranadasha ?? null };

}
