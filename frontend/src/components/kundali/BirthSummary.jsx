import { useMemo } from "react";

import computeBirthFacts from "../../kundali/utils/computeBirthFacts";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";

import "./BirthSummary.css";

// Gender-aware phrasing for the birth announcement — always Telugu,
// independent of the app's language toggle (see HoroscopeReport.jsx).
const BIRTH_PHRASE_BY_GENDER = {
    male: "పుత్రరత్న జననము",
    female: "పుత్రికా జననము",
    other: "శిశు జననము",
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

    const facts = useMemo(
        () => computeBirthFacts(kundaliDocument, dateOfBirth),
        [kundaliDocument, dateOfBirth]
    );

    if (!facts.samvatsaraName && !facts.lagnaRasi) {
        return null;
    }

    const birthPhrase = BIRTH_PHRASE_BY_GENDER[gender] ?? BIRTH_PHRASE_BY_GENDER.other;
    const ayanaLocative = AYANA_LOCATIVE[facts.ayana] ?? facts.ayana;
    const pakshaLocative = facts.tithi
        ? (PAKSHA_LOCATIVE[facts.tithi.paksha] ?? facts.tithi.paksha)
        : "—";

    return (
        <p className="birth-summary">
            స్వస్తి శ్రీ చాంద్రమానే{" "}
            <b>{facts.samvatsaraName ?? "—"}</b> నామ సంవత్సరే, <b>{ayanaLocative}</b>,{" "}
            <b>{sandhiStem(facts.masam)}</b> మాసే, <b>{pakshaLocative}</b>,{" "}
            <b>{facts.tithi?.name ?? "—"}</b> తిథి, <b>{facts.nakshatra?.teluguName ?? "—"}</b>{" "}
            నక్షత్ర <b>{facts.pada}</b>వ చరణంలో జరుగుచున్న శుభ సమయమున{" "}
            <b>{facts.lagnaRasi ? sandhiStem(facts.lagnaRasi.tel) : "—"}</b> లగ్నమున {birthPhrase}.
            అనగా <b>{facts.vara}</b>, <b>{formatDateDDMMYYYY(dateOfBirth)}</b>,{" "}
            <b>{timeOfBirth || "—"}</b> గంటలకు జననము.
        </p>
    );

}

export default BirthSummary;
