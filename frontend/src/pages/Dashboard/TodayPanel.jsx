import { useEffect, useMemo, useState } from "react";

import SkySnapshotService from "../../services/SkySnapshotService";
import resolveUtcOffsetHours from "../../utils/timezone/resolveUtcOffsetHours";
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

// The ascendant moves roughly one Rashi every ~2 hours, so a snapshot
// that only re-fetches on location change would silently go stale if
// the Dashboard is left open — refresh periodically so Lagna (and
// everything relative to it) stays live.
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

// Sthana relative to a given ascendant — mirrors the backend's
// SthanaCalculation.js exactly (both take 1-based, Mesha=1 sequence
// numbers).
function bhavaForSequence(planetSequence, lagnaSequence) {
    return ((planetSequence - lagnaSequence + 12) % 12) + 1;
}

function todayIsoDate() {

    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

}

function nowHHMM() {

    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;

}

function useSkySnapshot(location) {

    const [state, setState] = useState({ status: "idle", data: null, error: null });

    useEffect(() => {

        if (!location) {
            setState({ status: "idle", data: null, error: null });
            return;
        }

        let cancelled = false;

        function fetchSnapshot(isRefresh) {

            if (!isRefresh) {
                setState({ status: "loading", data: null, error: null });
            }

            const date = todayIsoDate();
            const time = nowHHMM();
            const timezone = resolveUtcOffsetHours(location.timezoneId, date, time);

            SkySnapshotService.get({
                date,
                time,
                latitude: location.latitude,
                longitude: location.longitude,
                timezone,
            })
                .then((data) => {
                    if (!cancelled) {
                        setState({ status: "success", data: { ...data, date }, error: null });
                    }
                })
                .catch((error) => {
                    if (!cancelled) {
                        setState({ status: "error", data: null, error: error.message });
                    }
                });

        }

        fetchSnapshot(false);

        // The ascendant (and, to a lesser extent, the planets) keep
        // moving — re-fetch periodically so a Dashboard left open
        // doesn't silently show a stale Lagna. Passes isRefresh=true
        // so this doesn't flash the loading state over live data.
        const timer = setInterval(() => fetchSnapshot(true), REFRESH_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(timer);
        };

    // Re-fetch (and restart the refresh timer) only when the location
    // actually changes — the timer above is what handles time passing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.latitude, location?.longitude, location?.timezoneId]);

    return state;

}

function GocharaSummaryCard({ snapshotState, t }) {

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
                                <th>నక్షత్రం</th>
                                <th>పాదం</th>
                                <th>రాశి</th>
                                <th>భావం</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lagna && (
                                <tr>
                                    <td className="today-gochara-table__graha">లగ్నం</td>
                                    <td className="mono">{lagna.formattedLongitude}</td>
                                    <td>{lagna.nakshatra?.teluguName ?? "—"}</td>
                                    <td>{lagna.pada?.number ?? "—"}</td>
                                    <td>{lagna.teluguName}</td>
                                    <td>1</td>
                                </tr>
                            )}

                            {ordered.map((position) => (
                                <tr key={position.planet}>
                                    <td className="today-gochara-table__graha">
                                        {DASHA_GRAHA_NAMES[position.planet] ?? position.planet}
                                    </td>
                                    <td className="mono">{position.formattedLongitude}</td>
                                    <td>{position.nakshatra?.teluguName ?? "—"}</td>
                                    <td>{position.pada?.number ?? "—"}</td>
                                    <td>{position.lagna?.teluguName ?? "—"}</td>
                                    <td>
                                        {lagna && position.lagna
                                            ? bhavaForSequence(position.lagna.sequence, lagna.sequence)
                                            : "—"}
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
                            {moon?.nakshatra?.teluguName ?? "—"}
                            {moon?.pada?.number ? ` - ${moon.pada.number}` : ""}
                        </span>
                    </div>

                    <div className="today-panchangam-grid__item today-panchangam-grid__item--wide">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.nakshatraDuration")}</span>
                        <span className="today-panchangam-grid__value today-panchangam-grid__value--range">
                            {data.nakshatraStart} → {data.nakshatraEnd}
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );

}

// recentSlot is rendered under the Gochara table, in the same
// right-hand column — not because they're topically related, but
// because the left column (Panchangam + Kundali chart) runs
// noticeably taller than the table alone, and a two-column grid
// with mismatched column heights just leaves the shorter column's
// bottom half as dead background space above whatever comes next.
// Continuing the right column downward with more content is the
// direct fix — an empty two-column grid isn't "organised" just
// because it's a grid.
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
                </div>

                <div className="today-panel__column">
                    <GocharaSummaryCard snapshotState={snapshotState} t={t} />
                    {recentSlot}
                </div>
            </div>
        </div>
    );

}

export default TodayPanel;
