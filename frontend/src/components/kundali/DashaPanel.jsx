import { useEffect, useState } from "react";

import DashaRunning from "./DashaRunning";
import DashaTimeline from "./DashaTimeline";
import DashaExplorer from "./DashaExplorer";
import DeathDashaCheck from "./DeathDashaCheck";
import resolveCurrentDashaChain from "../../utils/dasha/resolveCurrentDashaChain";
import { useTranslation } from "../../i18n/I18nContext";

import "./DashaPanel.css";

// Dasha periods are years/months long, so once a minute is plenty.
const REFRESH_MS = 60000;

/**
 * Dasacharam — Trāitha Siddhānta Dasha System v1.0, on screen.
 *
 * Three stacked views of the same data: what is running right now
 * (DashaRunning), the whole lifetime to scale (DashaTimeline), and
 * a drill-down through every level down to Pranadasha
 * (DashaExplorer). Screen-only: the printed/PDF report uses
 * DashaFullBreakdown's tables instead (see print.css).
 */
function DashaPanel({ dasha, timezone, natureByGraha, dateOfDeath, timeOfDeath }) {

    const { t } = useTranslation();
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {

        const timer = setInterval(() => setNow(Date.now()), REFRESH_MS);
        return () => clearInterval(timer);

    }, []);

    if (!dasha || !Array.isArray(dasha.mahadashas) || dasha.mahadashas.length === 0) {
        return null;
    }

    const chain = resolveCurrentDashaChain(dasha, timezone, now);

    // The birth Mahadasha always starts exactly at the birth moment
    // (see DashaEngine.buildMahadashas) — the reference point for
    // ages, instead of asking callers to pass the birth date again.
    const birthEpochMs = dasha.mahadashas[0].startEpochMs;

    return (
        <section className="dasha-panel">

            <h2 className="dasha-panel__title">{t("kundali.dashaTitle")}</h2>

            <DashaRunning
                chain={chain}
                timezone={timezone}
                natureByGraha={natureByGraha}
                now={now}
            />

            <DashaTimeline
                dasha={dasha}
                timezone={timezone}
                natureByGraha={natureByGraha}
                now={now}
            />

            <DeathDashaCheck
                dasha={dasha}
                timezone={timezone}
                natureByGraha={natureByGraha}
                birthEpochMs={birthEpochMs}
                dateOfDeath={dateOfDeath}
                timeOfDeath={timeOfDeath}
            />

            <DashaExplorer
                dasha={dasha}
                chain={chain}
                timezone={timezone}
                natureByGraha={natureByGraha}
                now={now}
            />

        </section>
    );

}

export default DashaPanel;
