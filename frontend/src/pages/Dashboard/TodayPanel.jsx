import { useMemo } from "react";
import { Link } from "react-router-dom";

import useSkySnapshot from "../../hooks/useSkySnapshot";
import { computeTithi, computeVara, computeAyana } from "../../kundali/utils/panchangamMath";
import { DASHA_GRAHA_NAMES } from "../../kundali/constants/DashaGrahaNames";
import { CHART_GRAHA_SYMBOLS } from "../../kundali/constants/ChartGrahaSymbols";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";
import { useSavedLocation } from "../../location/LocationContext";
import { useTranslation } from "../../i18n/I18nContext";

import Card from "../../components/common/Card";
import KundaliChart from "../../components/kundali/KundaliChart";

import "./TodayPanel.css";

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
        <Card className="dashboard-card today-card" padding="medium" shadow="medium">
            <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">{t("dashboard.today.gocharaTitle")}</h2>
            </div>

            {snapshotState.status === "loading" && (
                <p className="dashboard-card__empty">{t("dashboard.today.loading")}</p>
            )}

            {snapshotState.status === "error" && (
                <p className="dashboard-card__empty">{t("dashboard.today.error")}</p>
            )}

            {snapshotState.status === "success" && (
                <div className="today-gochara-scroll">
                    <table className="today-gochara-table">
                        <thead>
                            <tr>
                                <th>గ్రహం</th>
                                <th>అంశలు</th>
                                <th>నక్షత్రం - పాదం</th>
                                <th>లగ్నం</th>
                                <th>ప్రవేశం → నిష్క్రమణ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lagna && (
                                <tr>
                                    <td className="today-gochara-table__graha">లగ్నం</td>
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
                                        {DASHA_GRAHA_NAMES[position.planet] ?? position.planet}
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
        </Card>
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
        <Card className="dashboard-card today-card today-gochara-kundali-card" padding="medium" shadow="medium">
            <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">{t("dashboard.today.gocharaKundaliTitle")}</h2>
            </div>

            {snapshotState.status === "loading" && (
                <p className="dashboard-card__empty">{t("dashboard.today.loading")}</p>
            )}

            {snapshotState.status === "error" && (
                <p className="dashboard-card__empty">{t("dashboard.today.error")}</p>
            )}

            {snapshotState.status === "success" && renderLayout && (
                <KundaliChart chart={renderLayout} />
            )}
        </Card>
    );

}

function TodayPanchangamCard({ snapshotState, t }) {

    const { language } = useTranslation();
    const data = snapshotState.data;

    const sun = data?.planetPositions?.find((position) => position.planet === "SUN");
    const moon = data?.planetPositions?.find((position) => position.planet === "MOON");

    const tithi = sun && moon ? computeTithi(sun.longitude, moon.longitude) : null;
    const vara = data ? computeVara(data.date) : null;
    const ayanam = sun ? computeAyana(sun.longitude) : null;
    const masam = data ? `${data.masaIsLeap ? "అధిక " : ""}${data.masaName}` : null;

    return (
        <Card className="dashboard-card today-card" padding="medium" shadow="medium">
            <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">{t("dashboard.today.panchangamTitle")}</h2>
                <Link to="/panchangam" className="dashboard-card__link">
                    {t("dashboard.today.viewAll")}
                </Link>
            </div>

            {snapshotState.status === "loading" && (
                <p className="dashboard-card__empty">{t("dashboard.today.loading")}</p>
            )}

            {snapshotState.status === "error" && (
                <p className="dashboard-card__empty">{t("dashboard.today.error")}</p>
            )}

            {snapshotState.status === "success" && (
                <div className="today-panchangam-grid">
                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.ayanam")}</span>
                        <span className="today-panchangam-grid__value">{ayanam ?? "—"}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.samvatsaram")}</span>
                        <span className="today-panchangam-grid__value">{data.samvatsaraName}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.masam")}</span>
                        <span className="today-panchangam-grid__value">{masam}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.tithi")}</span>
                        <span className="today-panchangam-grid__value">
                            {tithi ? `${tithi.paksha} · ${tithi.name}` : "—"}
                        </span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.vara")}</span>
                        <span className="today-panchangam-grid__value">{vara ?? "—"}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.sunrise")}</span>
                        <span className="today-panchangam-grid__value">{data.sunrise}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.sunset")}</span>
                        <span className="today-panchangam-grid__value">{data.sunset}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.nakshatra")}</span>
                        <span className="today-panchangam-grid__value">
                            {(language === "te" ? moon?.nakshatra?.teluguName : moon?.nakshatra?.englishName) ?? "—"}
                            {moon?.pada?.number ? ` - ${moon.pada.number}` : ""}
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );

}

function TodayPanel({ recentSlot }) {

    const { t } = useTranslation();
    const { location } = useSavedLocation();
    const snapshotState = useSkySnapshot(location);

    return (
        <div className="today-panel">
            <div className="today-panel__cards">
                <div className="today-panel__column">
                    <TodayPanchangamCard snapshotState={snapshotState} t={t} />
                    <GocharaKundaliCard snapshotState={snapshotState} t={t} />
                    {recentSlot}
                </div>

                <div className="today-panel__column">
                    <GocharaSummaryCard snapshotState={snapshotState} t={t} />
                </div>
            </div>
        </div>
    );

}

export default TodayPanel;
