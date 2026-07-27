import { useMemo } from "react";

import "./PlanetaryPositionsTable.css";

/* ==========================================================
   Table format mirrors the Graha Sthiti table on the
   Sitara Jatakam reference page (Graham / Degree / Nakshatra /
   Pada / Rasi / Bhava columns, full Telugu graha names).
========================================================== */

const GRAHA_ORDER = [
    "LAGNA",
    "SUN", "MOON", "MARS", "MERCURY",
    "JUPITER", "VENUS", "SATURN", "RAHU", "KETU",
    "BHUMI", "MITRA", "CHITRA",
];

const GRAHA_TELUGU_NAMES = {
    LAGNA: "లగ్నం",
    SUN: "రవి",
    MOON: "చంద్ర",
    MARS: "కుజ",
    MERCURY: "బుధ",
    JUPITER: "గురు",
    VENUS: "శుక్ర",
    SATURN: "శని",
    RAHU: "రాహు",
    KETU: "కేతు",
    // Tritha Siddhanta derived grahas (see DerivedGrahaEngine on
    // the backend) — not fetched from Swiss Ephemeris.
    BHUMI: "భూమి",
    MITRA: "మిత్ర",
    CHITRA: "చిత్ర",
};

const RASI_NAMES = [
    { tel: "మేషం", en: "Aries" },
    { tel: "వృషభం", en: "Taurus" },
    { tel: "మిథునం", en: "Gemini" },
    { tel: "కర్కాటకం", en: "Cancer" },
    { tel: "సింహం", en: "Leo" },
    { tel: "కన్య", en: "Virgo" },
    { tel: "తుల", en: "Libra" },
    { tel: "వృశ్చికం", en: "Scorpio" },
    { tel: "ధనుస్సు", en: "Sagittarius" },
    { tel: "మకరం", en: "Capricorn" },
    { tel: "కుంభం", en: "Aquarius" },
    { tel: "మీనం", en: "Pisces" },
];

const BHAVA_LABELS = [
    "1-తనువు", "2-ధనం", "3-సహజం", "4-మాతృ",
    "5-విద్యా", "6-శత్రు", "7-కళత్ర", "8-ఆయు",
    "9-భాగ్య", "10-కర్మ", "11-లాభ", "12-వ్యయ",
];

function rasiForLongitude(longitude) {
    const normalized = ((longitude % 360) + 360) % 360;
    return RASI_NAMES[Math.floor(normalized / 30)];
}

function buildRows(kundaliDocument) {

    const cells = kundaliDocument?.janmaChart?.cells;

    if (!Array.isArray(cells)) {
        return [];
    }

    const rows = [];

    const lagna = kundaliDocument.janmaChart.lagna;

    if (lagna) {
        rows.push({
            key: lagna.id,
            name: GRAHA_TELUGU_NAMES[lagna.code] ?? lagna.displayName,
            en: lagna.code,
            deg: lagna.formattedLongitude,
            nak: lagna.nakshatra?.teluguName ?? "—",
            pada: lagna.pada ?? "—",
            rasi: rasiForLongitude(lagna.longitude),
            // The Lagna always defines the 1st house (Tanu bhava).
            bhava: BHAVA_LABELS[0],
        });
    }

    cells.forEach((cell) => {
        (cell.grahas || []).forEach((graha) => {
            rows.push({
                key: graha.id,
                name: GRAHA_TELUGU_NAMES[graha.code] ?? graha.displayName,
                en: graha.code,
                deg: graha.formattedLongitude,
                nak: graha.nakshatra?.teluguName ?? "—",
                pada: graha.pada ?? "—",
                rasi: rasiForLongitude(graha.longitude),
                bhava: BHAVA_LABELS[cell.sthana - 1] ?? "—",
            });
        });
    });

    rows.sort((a, b) => GRAHA_ORDER.indexOf(a.en) - GRAHA_ORDER.indexOf(b.en));

    return rows;

}

function PlanetaryPositionsTable({ kundaliDocument }) {

    const rows = useMemo(
        () => buildRows(kundaliDocument),
        [kundaliDocument]
    );

    if (rows.length === 0) {
        return null;
    }

    return (
        <section className="pp-table-section">
            <h2 className="pp-table-title">గ్రహస్థితి · Planetary Positions</h2>

            <div className="pp-table-scroll">
                <table className="pp-table">
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
                        {rows.map((row) => (
                            <tr key={row.key}>
                                <td>{row.name}</td>
                                <td className="mono">{row.deg}</td>
                                <td>{row.nak}</td>
                                <td>{row.pada}</td>
                                <td>{row.rasi.tel}</td>
                                <td>{row.bhava}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

}

export default PlanetaryPositionsTable;
