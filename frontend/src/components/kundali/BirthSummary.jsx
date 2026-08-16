import { useMemo } from "react";

import computeBirthFacts from "../../kundali/utils/computeBirthFacts";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

import "./BirthSummary.css";

// Gender-aware phrasing for the birth announcement — this sentence's
// language follows Save PDF's own Telugu/English choice (see
// HoroscopeReport.jsx), unlike the report's traditional invocation
// block, which stays Telugu regardless.
const BIRTH_PHRASE_BY_GENDER = {
    male: "పుత్రరత్న జననము",
    female: "పుత్రికా జననము",
    other: "శిశు జననము",
};

const BIRTH_PHRASE_BY_GENDER_EN = {
    male: "the birth of a son",
    female: "the birth of a daughter",
    other: "the birth of a child",
};

// Ayana/Paksha read in their nominative form ("ఉత్తరాయణం", "కృష్ణ
// పక్షం") in the Panchangam grid, but this sentence needs the
// locative case ("...ఉత్తరాయణే... పక్షే...") grammar requires when
// they're threaded into a flowing clause.
const AYANA_LOCATIVE = {
    "ఉత్తరాయణం": "ఉత్తరాయణే",
    "దక్షిణాయనం": "దక్షిణాయనే",
};

const PAKSHA_LOCATIVE = {
    "శుక్ల పక్షం": "శుక్ల పక్షే",
    "కృష్ణ పక్షం": "కృష్ణ పక్షే",
};

// Masa and Rasi names carry a trailing anusvara on their own
// ("ఫాల్గుణం", "వృషభం", ...), but Sandhi drops it right before the
// word that follows them here ("ఫాల్గుణ మాసే", "వృషభ లగ్నమున") — a
// general rule rather than a 12-entry lookup per list, since every
// name in both lists follows it (the handful that don't already end
// in anusvara — కన్య, తుల, ధనుస్సు — are untouched).
function sandhiStem(word) {
    return word.endsWith("ం") ? word.slice(0, -1) : word;
}

/**
 * A single Telugu prose sentence summarizing the birth moment in
 * traditional Panchangam terms (samvatsara, ayana, masa, paksha,
 * tithi, nakshatra+charana, lagna) — the report's only Panchangam
 * section on page 1, matching the reference report's format.
 */
function BirthSummary({ kundaliDocument, dateOfBirth, timeOfBirth, gender }) {

    const { language } = useTranslation();

    const facts = useMemo(
        () => computeBirthFacts(kundaliDocument, dateOfBirth),
        [kundaliDocument, dateOfBirth]
    );

    if (!facts.samvatsaraName && !facts.lagnaRasi) {
        return null;
    }

    if (language === "en") {

        const birthPhrase = BIRTH_PHRASE_BY_GENDER_EN[gender] ?? BIRTH_PHRASE_BY_GENDER_EN.other;

        return (
            <p className="birth-summary">
                Swasti Sri, in the Chandramana year named{" "}
                <b>{facts.samvatsaraName?.en ?? "—"}</b>, during <b>{facts.ayana?.en ?? "—"}</b>,{" "}
                in the month of <b>{facts.masam?.en ?? "—"}</b>, <b>{facts.tithi?.paksha?.en ?? "—"}</b>,{" "}
                on <b>{facts.tithi?.name?.en ?? "—"}</b> Tithi, in the <b>{facts.pada}</b>{" "}
                pada of <b>{facts.nakshatra?.englishName ?? "—"}</b> Nakshatra, at this auspicious moment{" "}
                in <b>{facts.lagnaRasi?.en ?? "—"}</b> Lagna — {birthPhrase}.
                That is, on <b>{facts.vara?.en ?? "—"}</b>, <b>{formatDateDDMMYYYY(dateOfBirth)}</b>,{" "}
                at <b>{timeOfBirth || "—"}</b> hours.
            </p>
        );

    }

    const birthPhrase = BIRTH_PHRASE_BY_GENDER[gender] ?? BIRTH_PHRASE_BY_GENDER.other;
    const ayanaTe = facts.ayana?.te ?? "—";
    const ayanaLocative = AYANA_LOCATIVE[ayanaTe] ?? ayanaTe;
    const pakshaTe = facts.tithi?.paksha?.te ?? "—";
    const pakshaLocative = facts.tithi
        ? (PAKSHA_LOCATIVE[pakshaTe] ?? pakshaTe)
        : "—";

    return (
        <p className="birth-summary">
            స్వస్తి శ్రీ చాంద్రమానే{" "}
            <b>{facts.samvatsaraName?.te ?? "—"}</b> నామ సంవత్సరే, <b>{ayanaLocative}</b>,{" "}
            <b>{sandhiStem(facts.masam?.te ?? "—")}</b> మాసే, <b>{pakshaLocative}</b>,{" "}
            <b>{facts.tithi?.name?.te ?? "—"}</b> తిథి, <b>{facts.nakshatra?.teluguName ?? "—"}</b>{" "}
            నక్షత్ర <b>{facts.pada}</b>వ చరణంలో జరుగుచున్న శుభ సమయమున{" "}
            <b>{facts.lagnaRasi ? sandhiStem(facts.lagnaRasi.tel) : "—"}</b> లగ్నమున {birthPhrase}.
            అనగా <b>{facts.vara?.te ?? "—"}</b>, <b>{formatDateDDMMYYYY(dateOfBirth)}</b>,{" "}
            <b>{timeOfBirth || "—"}</b> గంటలకు జననము.
        </p>
    );

}

export default BirthSummary;
