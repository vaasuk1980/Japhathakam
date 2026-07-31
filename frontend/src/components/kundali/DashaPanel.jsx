import { useMemo } from "react";

import DashaPeriodRow from "./DashaPeriodRow";
import DashaGlance from "./DashaGlance";
import isCurrentPeriod from "../../utils/dasha/isCurrentPeriod";

import "./DashaPanel.css";

/**
 * దశ (Dasha) panel — Trāitha Siddhānta Dasha System v1.0.
 *
 * Shows the person's full 12-Mahadasha timeline as an expandable
 * tree: Mahadasha -> Antardasha (both computed server-side) ->
 * Pratyantardasha -> Sukshmadasha -> Pranadasha (computed on demand
 * in the browser as each row is expanded — see DashaPeriodRow /
 * DashaSubdivisionEngine). The Mahadasha currently running (if any)
 * opens by default so the person can see where they are at a glance.
 */
function DashaPanel({ dasha, timezone, natureByGraha }) {

    const activeMahadashaGraha = useMemo(() => {

        if (!dasha?.mahadashas) {
            return null;
        }

        const active = dasha.mahadashas.find((mahadasha) => isCurrentPeriod(mahadasha));

        return active?.graha ?? null;

    }, [dasha]);

    if (!dasha || !Array.isArray(dasha.mahadashas) || dasha.mahadashas.length === 0) {
        return null;
    }

    // The birth Mahadasha always starts exactly at the birth
    // moment (see DashaEngine.buildMahadashas) — reused here as
    // the reference point for the Age column instead of asking
    // the caller to also pass dateOfBirth/timeOfBirth separately.
    const birthEpochMs = dasha.mahadashas[0].startEpochMs;

    return (
        <section className="dasha-panel">

            <h2 className="dasha-panel__title">దశాచారం · Dasacharam</h2>

            <DashaGlance dasha={dasha} timezone={timezone} natureByGraha={natureByGraha} />

            <div className="dasha-panel__scroll">
                <div className="dasha-panel__header-row">
                    <span className="dasha-panel__header-graha">గ్రహం</span>
                    <span className="dasha-panel__header-range">ప్రారంభం → ముగింపు</span>
                    <span className="dasha-panel__header-age">వయస్సు (ప్రారంభం → ముగింపు)</span>
                    <span className="dasha-panel__header-duration">వ్యవధి</span>
                </div>

                <div className="dasha-panel__tree">
                    {dasha.mahadashas.map((mahadasha) => (
                        <DashaPeriodRow
                            key={`${mahadasha.graha}-${mahadasha.startEpochMs}`}
                            period={mahadasha}
                            depth={0}
                            timezone={timezone}
                            birthEpochMs={birthEpochMs}
                            defaultExpanded={mahadasha.graha === activeMahadashaGraha}
                            natureByGraha={natureByGraha}
                        />
                    ))}
                </div>
            </div>

        </section>
    );

}

export default DashaPanel;
