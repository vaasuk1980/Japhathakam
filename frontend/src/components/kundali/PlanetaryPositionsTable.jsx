import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "../../i18n/I18nContext";

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

// Matches backend/src/astrology/constants/Sthanas.js's teluguName
// for each Sthana exactly — this table used to keep its own,
// independently-drifted set of names (e.g. "సహజం"/"కర్మ" instead of
// the canonical "సోదర"/"రాజ్య" for Sthanas 3 and 10).
const BHAVA_LABELS = [
    "1-తనువు", "2-ధనం", "3-సోదర", "4-మాతృ",
    "5-విద్యా", "6-శత్రు", "7-కళత్ర", "8-ఆయు",
    "9-భాగ్య", "10-రాజ్య", "11-లాభ", "12-వ్యయ",
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
            nak: lagna.nakshatra,
            pada: lagna.pada ?? "—",
            rasi: rasiForLongitude(lagna.longitude),
            // The Lagna row's bhava is left blank, matching the
            // reference layout — showing "1-తనువు" here is
            // redundant since Lagna always IS house 1.
            bhava: null,
            // The Lagna is a reference point, not a graha — it is
            // never Punya/Papa classified, and never retrograde.
            isPapa: false,
            isPunya: false,
            isRetrograde: false,
        });
    }

    cells.forEach((cell) => {
        (cell.grahas || []).forEach((graha) => {
            rows.push({
                key: graha.id,
                name: GRAHA_TELUGU_NAMES[graha.code] ?? graha.displayName,
                en: graha.code,
                deg: graha.formattedLongitude,
                nak: graha.nakshatra,
                pada: graha.pada ?? "—",
                rasi: rasiForLongitude(graha.longitude),
                bhava: BHAVA_LABELS[cell.sthana - 1] ?? "—",
                // Punya/Papa (Tritha Siddhantha) — same
                // classification the Kundali chart colors by.
                isPapa: graha.nature === "PAPA",
                isPunya: graha.nature === "PUNYA",
                isRetrograde: graha.isRetrograde,
            });
        });
    });

    rows.sort((a, b) => GRAHA_ORDER.indexOf(a.en) - GRAHA_ORDER.indexOf(b.en));

    // Serial numbers run 1-12 over the grahas only — the Lagna row
    // (always first, per GRAHA_ORDER) stays unnumbered, matching
    // the reference table.
    let serial = 0;
    return rows.map((row) => ({
        ...row,
        serial: row.en === "LAGNA" ? null : ++serial,
    }));

}

function PlanetaryPositionsTable({ kundaliDocument }) {

    const { t, language } = useTranslation();

    const rows = useMemo(
        () => buildRows(kundaliDocument),
        [kundaliDocument]
    );

    if (rows.length === 0) {
        return null;
    }

    return (
        <section className="pp-table-section">
            <h2 className="pp-table-title">{t("kundali.planetaryPositionsTitle")}</h2>

            <div className="pp-table-scroll">
                <table className={`pp-table pp-table--lang-${language}`}>
                    <thead>
                        <tr>
                            <th>సం.</th>
                            <th>గ్రహం</th>
                            <th>అంశలు</th>
                            <th>నక్షత్రం</th>
                            <th>పాదం</th>
                            <th>లగ్నం</th>
                            <th>భావం</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.key}>
                                <td className="mono">{row.serial ?? ""}</td>
                                <td className={
                                    "pp-graha-name" +
                                    (row.isPapa
                                        ? " pp-graha-papa"
                                        : row.isPunya
                                            ? " pp-graha-punya"
                                            : "")
                                }>
                                    {row.name}
                                    {row.isRetrograde && (
                                        <Link
                                            to={`/panchangam?graha=${row.en}`}
                                            className="pp-graha-retrograde"
                                            title={t("common.retrogradeTooltip")}
                                        >
                                            R
                                        </Link>
                                    )}
                                </td>
                                <td className="mono">{row.deg}</td>
                                <td>
                                    <span className="report-lang-te">{row.nak?.teluguName ?? "—"}</span>
                                    <span className="report-lang-en">{row.nak?.englishName ?? "—"}</span>
                                </td>
                                <td>{row.pada}</td>
                                <td>
                                    <span className="report-lang-te">{row.rasi.tel}</span>
                                    <span className="report-lang-en">{row.rasi.en}</span>
                                </td>
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
