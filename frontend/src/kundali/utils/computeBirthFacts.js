import { computeTithi, computeVara, computeAyana } from "./panchangamMath";
import { translateMasa, translateSamvatsara } from "../constants/PanchangamNameTranslations";

/* ==========================================================
   Derives the Panchangam facts (tithi, ayana, vara, lagna rasi,
   moon's nakshatra/pada, samvatsara) that the printed report's
   Telugu prose summary (BirthSummary.jsx) reads from.
========================================================== */

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

function signIndexForLongitude(longitude) {
    const normalized = ((longitude % 360) + 360) % 360;
    return Math.floor(normalized / 30);
}

function findGraha(kundaliDocument, code) {
    for (const cell of kundaliDocument?.janmaChart?.cells || []) {
        const graha = cell.grahas.find((item) => item.code === code);
        if (graha) {
            return graha;
        }
    }
    return null;
}

export default function computeBirthFacts(kundaliDocument, dateOfBirth) {

    const sun = findGraha(kundaliDocument, "SUN");
    const moon = findGraha(kundaliDocument, "MOON");
    const lagna = kundaliDocument?.janmaChart?.lagna;

    const tithi = sun && moon
        ? computeTithi(sun.longitude, moon.longitude)
        : null;

    const ayana = sun ? computeAyana(sun.longitude) : null;
    const vara = computeVara(dateOfBirth);

    const lagnaRasi = lagna
        ? RASI_NAMES[signIndexForLongitude(lagna.longitude)]
        : null;

    const panchangam = kundaliDocument?.panchangam;

    const masam = translateMasa(panchangam?.masaName, panchangam?.masaIsLeap);

    return {
        sun,
        moon,
        lagna,
        tithi,
        ayana,
        vara,
        masam,
        lagnaRasi,
        nakshatra: moon?.nakshatra ?? null,
        pada: moon?.pada ?? "—",
        samvatsaraName: translateSamvatsara(panchangam?.samvatsaraName),
        nakshatraStart: panchangam?.nakshatraStart ?? null,
        nakshatraEnd: panchangam?.nakshatraEnd ?? null,
    };

}
