import { useMemo, useState } from "react";

import Card from "../../components/common/Card";

import {
    heroInfo,
    panchangaCells,
    planets,
    gridLayout,
    lagnaRasi,
    currentDasha,
    dashaBhuktis,
    phalabhagaCards,
    footerNote,
} from "../../data/sitaraJatakamSample";

import "./SitaraJatakam.css";

function SitaraJatakam() {

    const [selectedKey, setSelectedKey] = useState(null);

    const planetsByRasi = useMemo(() => {

        const map = {};

        planets.forEach((planet) => {
            if (!map[planet.rasi]) {
                map[planet.rasi] = [];
            }
            map[planet.rasi].push(planet);
        });

        return map;

    }, []);

    const selectedPlanet =
        planets.find((planet) => planet.key === selectedKey) || null;

    return (
        <div className="sj-page">

            <header className="sj-hero">
                <h1 className="page-title sj-hero-title">
                    {heroInfo.title}
                </h1>
                <p className="body-md sj-hero-subtitle">
                    {heroInfo.subtitle}
                </p>
                <div className="sj-fact-pills">
                    {heroInfo.facts.map((fact) => (
                        <span className="sj-pill" key={fact.label}>
                            <b>{fact.label}</b> · {fact.value}
                        </span>
                    ))}
                </div>
            </header>

            {/* ================= PANCHANGA ================= */}
            <Card
                title="పంచాంగ వివరాలు · Panchanga"
                padding="large"
                shadow="small"
                fullWidth
                className="sj-section"
            >
                <div className="sj-panchanga-grid">
                    {panchangaCells.map((cell) => (
                        <div className="sj-panchanga-cell" key={cell.label}>
                            <div className="sj-cell-label">{cell.label}</div>
                            <div className={`sj-cell-value ${cell.mono ? "mono" : ""}`}>
                                {cell.value}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* ================= CHART ================= */}
            <Card
                title="రాశి చక్రం · Birth Chart (South Indian Style)"
                padding="large"
                shadow="small"
                fullWidth
                className="sj-section"
            >
                <p className="body-sm sj-lede">
                    ప్రతి ఖానాలో ఉన్న గ్రహాలను చూడడానికి వాటిపై నొక్కండి. హైలైట్ చేయబడిన ఖానా లగ్న స్థానం (వృశ్చికం).
                </p>

                <div className="sj-chart-shell">
                    <div className="sj-rasi-grid">
                        {gridLayout.map((sign, index) => {

                            if (sign === null) {

                                if (index === 5) {
                                    return (
                                        <div className="sj-center-box" key="center">
                                            <div className="sj-center-title">సితార</div>
                                            <div className="sj-center-sub mono">JATAKAM</div>
                                        </div>
                                    );
                                }

                                return null;
                            }

                            const occupants = planetsByRasi[sign.tel] || [];
                            const isLagna = sign.tel === lagnaRasi;

                            return (
                                <div
                                    className={`sj-rasi-cell ${isLagna ? "sj-active-cell" : ""}`}
                                    key={sign.tel}
                                >
                                    <div className="sj-sign">
                                        {sign.tel}
                                        <br />
                                        <span className="sj-sign-en">{sign.en}</span>
                                    </div>

                                    {isLagna && (
                                        <div className="sj-lagna-tag">LAG</div>
                                    )}

                                    <div className="sj-planet-chips">
                                        {occupants.map((planet) => (
                                            <button
                                                type="button"
                                                key={planet.key}
                                                className={`sj-chip ${
                                                    selectedKey === planet.key ? "sj-chip-active" : ""
                                                }`}
                                                onClick={() => setSelectedKey(planet.key)}
                                            >
                                                {planet.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="sj-planet-detail">
                        {selectedPlanet ? (
                            <>
                                <h3 className="sj-detail-title">
                                    {selectedPlanet.name}
                                    <span className="sj-detail-en"> · {selectedPlanet.en}</span>
                                </h3>
                                <div className="sj-detail-row">
                                    <span>అంశలు (Degree)</span>
                                    <span className="mono">{selectedPlanet.deg}</span>
                                </div>
                                <div className="sj-detail-row">
                                    <span>రాశి (Sign)</span>
                                    <span>{selectedPlanet.rasi}</span>
                                </div>
                                <div className="sj-detail-row">
                                    <span>నక్షత్రం (Nakshatra)</span>
                                    <span>{selectedPlanet.nak}</span>
                                </div>
                                <div className="sj-detail-row">
                                    <span>పాదం (Pada)</span>
                                    <span>{selectedPlanet.pada}</span>
                                </div>
                                <div className="sj-detail-row">
                                    <span>భావం (House)</span>
                                    <span>{selectedPlanet.bhava}</span>
                                </div>
                            </>
                        ) : (
                            <div className="sj-detail-placeholder">
                                ఒక గ్రహాన్ని ఎంచుకోండి — వివరాలు ఇక్కడ కనిపిస్తాయి.
                                <br />
                                <span>Tap a planet chip in the chart to see its details here.</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* ================= GRAHA STHITI ================= */}
            <Card
                title="గ్రహస్థితి · Planetary Positions"
                padding="large"
                shadow="small"
                fullWidth
                className="sj-section"
            >
                <div className="sj-table-scroll">
                    <table className="sj-table">
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
                            {planets.map((planet) => (
                                <tr
                                    key={planet.key}
                                    className={planet.isLagna ? "sj-row-lagna" : ""}
                                >
                                    <td>{planet.name}</td>
                                    <td className="mono">{planet.deg}</td>
                                    <td>{planet.nak}</td>
                                    <td>{planet.pada}</td>
                                    <td>{planet.rasi}</td>
                                    <td>{planet.bhava}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* ================= DASHA ================= */}
            <Card
                title="దశాభుక్తులు · Running Dasha (Bhumi Mahadasha)"
                padding="large"
                shadow="small"
                fullWidth
                className="sj-section"
            >
                <div className="sj-dasha-now">
                    <div className="sj-dasha-tag">{currentDasha.tag}</div>
                    <h3 className="sj-dasha-title">{currentDasha.title}</h3>
                    <div className="mono sj-dasha-range">{currentDasha.range}</div>

                    <div className="sj-progress">
                        <div style={{ width: `${currentDasha.percentComplete}%` }} />
                    </div>

                    <div className="sj-progress-labels">
                        <span>
                            {currentDasha.daysElapsed} / {currentDasha.daysTotal} రోజులు పూర్తయ్యాయి
                        </span>
                        <span>{currentDasha.percentComplete}% complete</span>
                    </div>
                </div>

                <div className="sj-timeline">
                    {dashaBhuktis.map((item) => (
                        <div
                            className={`sj-tl-item ${item.current ? "sj-tl-current" : ""}`}
                            key={item.name}
                        >
                            <div className="sj-tl-name">
                                {item.name}
                                {item.current && (
                                    <span className="sj-tl-badge">NOW</span>
                                )}
                            </div>
                            <div className="mono sj-tl-range">{item.range}</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* ================= PHALABHAGA ================= */}
            <Card
                title="ఫలభాగం · Lagna Phalabhaga (Vrischika Lagna)"
                padding="large"
                shadow="small"
                fullWidth
                className="sj-section"
            >
                <div className="sj-phala-grid">
                    {phalabhagaCards.map((card) => (
                        <div className="sj-phala-card" key={card.label}>
                            <div className="sj-phala-label">{card.label}</div>
                            <div className="sj-phala-value">{card.value}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <p className="caption sj-footnote">{footerNote}</p>

        </div>
    );
}

export default SitaraJatakam;
