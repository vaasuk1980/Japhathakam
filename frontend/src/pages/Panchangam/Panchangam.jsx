import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import RashiTransitSummaryService from "../../services/RashiTransitSummaryService";
import resolveUtcOffsetHours from "../../utils/timezone/resolveUtcOffsetHours";
import { useSavedLocation } from "../../location/LocationContext";

import Card from "../../components/common/Card";
import TodayPanchangamDetails from "./TodayPanchangamDetails";

import "./Panchangam.css";

// Same order the Gochara Today table and Planetary Positions table
// use, minus the Moon (excluded on the backend — see
// RashiTransitSummaryRoute.js — a Moon table would run 140+ rows a
// year).
const GRAHA_LABELS = {
    SUN: { tel: "రవి", en: "Sun" },
    MARS: { tel: "కుజ", en: "Mars" },
    MERCURY: { tel: "బుధ", en: "Mercury" },
    JUPITER: { tel: "గురు", en: "Jupiter" },
    VENUS: { tel: "శుక్ర", en: "Venus" },
    SATURN: { tel: "శని", en: "Saturn" },
    RAHU: { tel: "రాహు", en: "Rahu" },
    KETU: { tel: "కేతు", en: "Ketu" },
    BHUMI: { tel: "భూమి", en: "Bhumi" },
    MITRA: { tel: "మిత్ర", en: "Mitra" },
    CHITRA: { tel: "చిత్ర", en: "Chitra" },
};

// Sun/Bhumi are never retrograde (geocentrically) and Rahu/Ketu/
// Mitra/Chitra are always retrograde (the Moon's nodes, or fixed
// offsets from them) — direction only ever actually varies for
// these 5, so only their tables get the గమనం/వక్రి columns.
const GRAHAS_WITH_VARIABLE_DIRECTION = new Set([
    "MERCURY", "VENUS", "MARS", "JUPITER", "SATURN",
]);

const DEBOUNCE_MS = 400;

function currentYear() {
    return new Date().getFullYear();
}

// The Ugadi-to-Ugadi window for calendar year Y runs from the Ugadi
// nearest June 1st of Y backward to the previous one (see
// findUgadiWindowForYear on the backend) — so before this year's own
// Ugadi has happened yet (Jan/Feb, sometimes early March), "today"
// still belongs to LAST year's window. Used only to pick a sane
// starting year when deep-linking straight to "today's" retrograde
// row (see GrahaBadge.jsx) — the plain year input above just uses
// the calendar year as-is.
function ugadiYearForToday() {
    const now = new Date();
    return now.getMonth() < 2 ? now.getFullYear() - 1 : now.getFullYear();
}

function useRashiTransitSummary(year, timezone) {

    const [state, setState] = useState({ status: "idle", data: null, error: null });

    useEffect(() => {

        if (!Number.isInteger(year) || year < 1800 || year > 2400 || timezone === null) {
            return undefined;
        }

        let cancelled = false;

        const timer = setTimeout(() => {

            setState({ status: "loading", data: null, error: null });

            RashiTransitSummaryService.get({ year, timezone })
                .then((data) => {
                    if (!cancelled) {
                        setState({ status: "success", data, error: null });
                    }
                })
                .catch((error) => {
                    if (!cancelled) {
                        setState({ status: "error", data: null, error: error.message });
                    }
                });

        }, DEBOUNCE_MS);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };

    }, [year, timezone]);

    return state;

}

function GrahaTransitTable({ graha, transitions, highlightNowMs }) {

    const label = GRAHA_LABELS[graha] ?? { tel: graha, en: graha };
    const showsVakri = GRAHAS_WITH_VARIABLE_DIRECTION.has(graha);

    // The row whose stay currently contains "now" — only looked up
    // at all when this table is the deep-link target (see
    // GrahaBadge.jsx / PlanetaryPositionsTable.jsx's (R) link),
    // since every other table renders highlightNowMs as null.
    const currentRowIndex = highlightNowMs != null
        ? transitions.findIndex((row) =>
            row.enteredEpochMs <= highlightNowMs && highlightNowMs <= row.leavesEpochMs)
        : -1;

    const currentRowRef = useRef(null);

    useEffect(() => {

        if (currentRowIndex >= 0 && currentRowRef.current) {
            currentRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }

    // Only jump once, when this becomes the deep-link target — not on
    // every re-render, so it doesn't fight the user's own scrolling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRowIndex]);

    return (
        <section className="rt-table-section">
            <h2 className="rt-table-title">{label.tel} · {label.en}</h2>

            {transitions.length === 0 ? (
                <p className="rt-table-empty">ఈ సంవత్సరంలో రాశి మార్పు లేదు · No Rashi change this year.</p>
            ) : (
                <div className="rt-table-scroll">
                    <table className="rt-table">
                        <thead>
                            <tr>
                                <th>రాశి</th>
                                <th>ప్రవేశం</th>
                                <th>నిష్క్రమణ</th>
                                <th>వ్యవధి</th>
                                {showsVakri && <th>గమనం</th>}
                                {showsVakri && <th>వక్రి ప్రారంభం</th>}
                                {showsVakri && <th>వక్రి ముగింపు</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {transitions.map((row, index) => (
                                <tr
                                    key={index}
                                    ref={index === currentRowIndex ? currentRowRef : null}
                                    className={index === currentRowIndex ? "rt-table__row--current" : undefined}
                                >
                                    <td>{row.rasiTeluguName} · {row.rasiEnglishName}</td>
                                    <td className="mono">{row.entered}</td>
                                    <td className="mono">{row.leaves}</td>
                                    <td className="mono">{row.durationDisplay}</td>
                                    {showsVakri && (
                                        <td>{row.vakri ? "వక్రి" : "మార్గి"}</td>
                                    )}
                                    {showsVakri && (
                                        <td className="mono">
                                            {row.vakri
                                                ? (row.vakri.start ?? "ప్రవేశానికి ముందు")
                                                : "—"}
                                        </td>
                                    )}
                                    {showsVakri && (
                                        <td className="mono">
                                            {row.vakri
                                                ? (row.vakri.end ?? "కొనసాగుతోంది")
                                                : "—"}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );

}

function Panchangam() {

    const { location } = useSavedLocation();
    const [searchParams] = useSearchParams();

    // Present only when arriving via a chart/table's (R) retrograde
    // link (see GrahaBadge.jsx, PlanetaryPositionsTable.jsx,
    // TodayPanel.jsx) — in that case we want the year that actually
    // contains "today," not just the current calendar year.
    const targetGraha = searchParams.get("graha");

    const [yearInput, setYearInput] = useState(
        String(targetGraha ? ugadiYearForToday() : currentYear())
    );

    const year = Number(yearInput);
    const timezone = location
        ? resolveUtcOffsetHours(location.timezoneId, `${currentYear()}-06-01`, "12:00")
        : null;

    const summaryState = useRashiTransitSummary(year, timezone);
    const data = summaryState.data;

    return (
        <div className="rt-page">
            <TodayPanchangamDetails />

            <Card className="rt-controls-card" padding="medium" shadow="medium">
                <div className="rt-controls">
                    <label className="rt-year-label" htmlFor="rt-year-input">
                        సంవత్సరం (ఉగాది → ఉగాది) · Year (Ugadi to Ugadi)
                    </label>
                    <input
                        id="rt-year-input"
                        className="rt-year-input"
                        type="number"
                        value={yearInput}
                        onChange={(event) => setYearInput(event.target.value)}
                    />
                </div>

                {summaryState.status === "loading" && (
                    <p className="rt-controls__status">లోడ్ అవుతోంది... · Loading...</p>
                )}

                {summaryState.status === "error" && (
                    <p className="rt-controls__status rt-controls__status--error">{summaryState.error}</p>
                )}

                {summaryState.status === "success" && data && (
                    <p className="rt-controls__status">
                        {data.samvatsaraName} సంవత్సరం &nbsp;·&nbsp; {data.ugadiStart} → {data.ugadiEnd}
                    </p>
                )}
            </Card>

            {summaryState.status === "success" && data && data.grahas.map((entry) => (
                <GrahaTransitTable
                    key={entry.graha}
                    graha={entry.graha}
                    transitions={entry.transitions}
                    highlightNowMs={entry.graha === targetGraha ? Date.now() : null}
                />
            ))}
        </div>
    );

}

export default Panchangam;
