import { DASHA_GRAHA_NAMES } from "../../kundali/constants/DashaGrahaNames";
import resolveAgeAtEpoch from "../../utils/age/resolveAgeAtEpoch";
import formatAgeYMD from "../../utils/age/formatAgeYMD";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";

import "./DashaFullBreakdown.css";

function grahaName(code) {
    return DASHA_GRAHA_NAMES[code] ?? code;
}

// Chrome's print engine doesn't fragment CSS Grid containers across
// page breaks — a grid that doesn't fit the remaining page gets
// pushed whole to the next page (leaving a large blank gap behind
// it), rather than letting individual rows flow naturally. Pairing
// mahadashas into explicit two-up rows (plain block flow, not
// grid) lets each row break independently instead.
function pairUp(items) {

    const pairs = [];

    for (let i = 0; i < items.length; i += 2) {
        pairs.push(items.slice(i, i + 2));
    }

    return pairs;

}

/**
 * Print-only: the full 12-Mahadasha x Antardasha breakdown, laid
 * out as a summary table plus a grid of per-Mahadasha mini-tables —
 * the on-screen Dasha experience stays the expandable tree
 * (DashaPanel.jsx); this component exists purely so the saved PDF
 * carries the same complete Bhukti listing the reference report
 * shows, since the backend already returns every Mahadasha's
 * Antardashas precomputed (dasha.mahadashas[i].children).
 */
function DashaFullBreakdown({ dasha, timezone }) {

    if (!dasha || !Array.isArray(dasha.mahadashas) || dasha.mahadashas.length === 0) {
        return null;
    }

    const birthEpochMs = dasha.mahadashas[0].startEpochMs;

    const ageAt = (epochMs) => formatAgeYMD(
        resolveAgeAtEpoch(birthEpochMs, epochMs, timezone)
    );

    return (
        <section className="dasha-full-breakdown">

            <h2 className="dasha-full-breakdown__title">దశాచారం</h2>

            <h3 className="dasha-full-breakdown__subheading">మహాదశ</h3>

            <table className="dasha-full-breakdown__summary">
                <thead>
                    <tr>
                        <th>మహాదశ</th>
                        <th>వ్యవధి</th>
                        <th>ముగింపు వయస్సు</th>
                        <th>ముగింపు తేదీ</th>
                    </tr>
                </thead>
                <tbody>
                    {dasha.mahadashas.map((mahadasha) => (
                        <tr key={`${mahadasha.graha}-${mahadasha.startEpochMs}`}>
                            <td>{grahaName(mahadasha.graha)}</td>
                            <td className="mono">{mahadasha.durationDisplay}</td>
                            <td className="mono">{ageAt(mahadasha.endEpochMs)}</td>
                            <td className="mono">{formatDateDDMMYYYY(mahadasha.endEpochMs)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="dasha-full-breakdown__subheading dasha-full-breakdown__subheading--antardasha">అంతర్దశ</h3>

            <div className="dasha-full-breakdown__grid">
                {pairUp(dasha.mahadashas).map((pair) => (
                    <div
                        className="dasha-full-breakdown__row"
                        key={pair.map((mahadasha) => mahadasha.graha).join("-")}
                    >
                        {pair.map((mahadasha) => (
                            <table
                                className="dasha-full-breakdown__mahadasha-table"
                                key={`${mahadasha.graha}-${mahadasha.startEpochMs}`}
                            >
                                <thead>
                                    <tr>
                                        <th colSpan={3}>{grahaName(mahadasha.graha)} దశ</th>
                                    </tr>
                                    <tr>
                                        <th>భుక్తి</th>
                                        <th>వయస్సు</th>
                                        <th>తేదీ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(mahadasha.children || []).map((antardasha) => (
                                        <tr key={`${antardasha.graha}-${antardasha.startEpochMs}`}>
                                            <td>
                                                {grahaName(mahadasha.graha)}/{grahaName(antardasha.graha)}
                                            </td>
                                            <td className="mono">{ageAt(antardasha.startEpochMs)}</td>
                                            <td className="mono">{formatDateDDMMYYYY(antardasha.endEpochMs)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ))}
                    </div>
                ))}
            </div>

        </section>
    );

}

export default DashaFullBreakdown;
