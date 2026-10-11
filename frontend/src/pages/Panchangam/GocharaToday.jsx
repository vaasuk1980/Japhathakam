import { useMemo } from "react";
import { Link } from "react-router-dom";

import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import { CHART_GRAHA_SYMBOLS } from "../../kundali/constants/ChartGrahaSymbols";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";
import { useTranslation } from "../../i18n/I18nContext";

import { SkeletonLines } from "../../components/common/Skeleton/Skeleton";
import KundaliChart from "../../components/kundali/KundaliChart";

import "./GocharaToday.css";

// Today's planetary positions (the second half of a traditional
// panchangam): the Gochara table and the Gochara kundali, both from
// the same live sky snapshot as "Today's Panchangam" above them.
// Classical Navagraha first, then the 3 Tritha Siddhanta derived
// grahas — same order as the Planetary Positions table.
const GOCHARA_ORDER = [
    "SUN", "MOON", "MARS", "MERCURY", "JUPITER", "VENUS", "SATURN", "RAHU", "KETU",
    "BHUMI", "MITRA", "CHITRA",
];

function GocharaSummaryCard({ snapshotState, t }) {

    const { language } = useTranslation();
    const data = snapshotState.data;
    const positions = data?.planetPositions ?? [];
    const lagna = data?.lagna;

    const ordered = GOCHARA_ORDER
        .map((code) => positions.find((position) => position.planet === code))
        .filter(Boolean);

    return (
        <section className="rt-table-section today-gochara-section">
            <h2 className="rt-table-title">{t("dashboard.today.gocharaTitle")}</h2>

            {snapshotState.status === "loading" && (
                <SkeletonLines count={6} />
            )}

            {snapshotState.status === "error" && (
                <p className="rt-table-empty">{t("dashboard.today.error")}</p>
            )}

            {snapshotState.status === "success" && (
                <div className="today-gochara-scroll">
                    <table className="today-gochara-table">
                        <thead>
                            <tr>
                                <th>{t("kundali.planetaryPositions.colGraha")}</th>
                                <th>{t("kundali.planetaryPositions.colDegree")}</th>
                                <th>{t("dashboard.today.nakshatraPada")}</th>
                                <th>{t("kundali.planetaryPositions.colLagna")}</th>
                                <th>{t("dashboard.today.gochara.colTransit")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lagna && (
                                <tr>
                                    <td className="today-gochara-table__graha">{t("kundali.planetaryPositions.colLagna")}</td>
                                    <td className="mono">{lagna.formattedLongitude}</td>
                                    <td>
                                        {(language === "te" ? lagna.nakshatra?.teluguName : lagna.nakshatra?.englishName) ?? "—"}
                                        {lagna.pada?.number ? ` - ${lagna.pada.number}` : ""}
                                    </td>
                                    <td>{language === "te" ? lagna.teluguName : lagna.englishName}</td>
                                    {/* The Lagna moves through a Rashi in ~2 hours — an
                                        entered/leaves range isn't meaningful for it the
                                        way it is for a Graha, so this cell stays blank. */}
                                    <td>—</td>
                                </tr>
                            )}

                            {ordered.map((position) => (
                                <tr key={position.planet}>
                                    <td className="today-gochara-table__graha">
                                        {grahaName(position.planet, language)}
                                        {position.isRetrograde && (
                                            <Link
                                                to={`/panchangam?graha=${position.planet}`}
                                                className="today-gochara-table__retrograde"
                                                title={t("common.retrogradeTooltip")}
                                            >
                                                R
                                            </Link>
                                        )}
                                    </td>
                                    <td className="mono">{position.formattedLongitude}</td>
                                    <td>
                                        {(language === "te" ? position.nakshatra?.teluguName : position.nakshatra?.englishName) ?? "—"}
                                        {position.pada?.number ? ` - ${position.pada.number}` : ""}
                                    </td>
                                    <td>{(language === "te" ? position.lagna?.teluguName : position.lagna?.englishName) ?? "—"}</td>
                                    <td className="mono today-gochara-table__transit">
                                        {position.rashiEntered ?? "—"}
                                        <span className="today-gochara-table__arrow">→</span>
                                        {position.rashiLeaves ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );

}

function GocharaKundaliCard({ snapshotState, t }) {

    const data = snapshotState.data;
    const positions = data?.planetPositions ?? [];
    const lagna = data?.lagna;

    const renderLayout = useMemo(() => {

        if (positions.length === 0 || !lagna) {
            return null;
        }

        const grahas = positions.map((position) => ({
            id: position.planet,
            name: position.planet,
            displayName: CHART_GRAHA_SYMBOLS[position.planet] ?? position.planet,
            longitude: position.longitude,
            nakshatra: position.nakshatra,
            pada: position.pada,
            isRetrograde: position.isRetrograde,
        }));

        // The real ascendant for this location/moment (see
        // JanmaLagnaEngine on the backend) — RegionAssignmentPolicy
        // only needs chart.lagna.longitude to number every cell's
        // house relative to it and highlight the Lagna's own cell,
        // exactly like a birth chart. The input chart's own cell
        // grouping doesn't matter — both policies just flatten every
        // cell's grahas and re-place each one by its own longitude,
        // so a single dummy input cell is enough.
        const chart = {
            lagna: { longitude: lagna.longitude },
            cells: [{ sthana: 1, grahas }],
        };

        const layout = KundaliRenderEngine.render(chart);

        // Aspects (Drishti) aren't wanted here — the engine computes
        // them unconditionally (they don't depend on chart.lagna), so
        // drop the ASPECT regions it produced rather than fork the
        // shared engine just for this one widget.
        layout.cells.forEach((cell) => {
            cell.regions = cell.regions.filter((region) => region.type === "OCCUPANT");
        });

        return layout;

    }, [positions, lagna]);

    return (
        <section className="rt-table-section today-gochara-section today-gochara-kundali-card">
            <h2 className="rt-table-title">{t("dashboard.today.gocharaKundaliTitle")}</h2>

            {snapshotState.status === "loading" && (
                <SkeletonLines count={6} />
            )}

            {snapshotState.status === "error" && (
                <p className="rt-table-empty">{t("dashboard.today.error")}</p>
            )}

            {snapshotState.status === "success" && renderLayout && (
                <KundaliChart chart={renderLayout} />
            )}
        </section>
    );

}


function GocharaToday({ snapshotState }) {

    const { t } = useTranslation();

    return (
        <>
            <GocharaSummaryCard snapshotState={snapshotState} t={t} />
            <GocharaKundaliCard snapshotState={snapshotState} t={t} />
        </>
    );

}

export default GocharaToday;
