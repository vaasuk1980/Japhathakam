/**
 * ============================================================================
 * JAPHATHAKAM
 * Panchangam pure math — Tithi and Vara
 * ----------------------------------------------------------------------------
 * Pulled out of PanchangamDetails.jsx (which shows these for an already-
 * generated birth Kundali) so the Dashboard's standalone "Today's
 * Panchangam" widget can compute the exact same Tithi/Vara from a plain
 * Sun/Moon longitude pair — no Kundali document required, no duplicated
 * math to drift out of sync between the two call sites.
 *
 * Every name here returns as { en, te } — both call sites read a bilingual
 * value and select the language-appropriate field themselves, the same
 * pattern already used for Nakshatra/Rasi names.
 * ============================================================================
 */

export const VARA_NAMES = [
    { en: "Sunday", te: "ఆదివారం" },
    { en: "Monday", te: "సోమవారం" },
    { en: "Tuesday", te: "మంగళవారం" },
    { en: "Wednesday", te: "బుధవారం" },
    { en: "Thursday", te: "గురువారం" },
    { en: "Friday", te: "శుక్రవారం" },
    { en: "Saturday", te: "శనివారం" },
];

export const TITHI_NAMES = [
    { en: "Padyami", te: "పాడ్యమి" },
    { en: "Vidiya", te: "విదియ" },
    { en: "Tadiya", te: "తదియ" },
    { en: "Chaviti", te: "చవితి" },
    { en: "Panchami", te: "పంచమి" },
    { en: "Shashti", te: "షష్ఠి" },
    { en: "Saptami", te: "సప్తమి" },
    { en: "Ashtami", te: "అష్టమి" },
    { en: "Navami", te: "నవమి" },
    { en: "Dashami", te: "దశమి" },
    { en: "Ekadashi", te: "ఏకాదశి" },
    { en: "Dwadashi", te: "ద్వాదశి" },
    { en: "Trayodashi", te: "త్రయోదశి" },
    { en: "Chaturdashi", te: "చతుర్దశి" },
];

const PAKSHA_SHUKLA = { en: "Shukla Paksha", te: "శుక్ల పక్షం" };
const PAKSHA_KRISHNA = { en: "Krishna Paksha", te: "కృష్ణ పక్షం" };
const PURNIMA = { en: "Purnima", te: "పౌర్ణమి" };
const AMAVASYA = { en: "Amavasya", te: "అమావాస్య" };

export function computeTithi(sunLongitude, moonLongitude) {

    const diff = ((moonLongitude - sunLongitude) % 360 + 360) % 360;
    const tithiIndex = Math.floor(diff / 12); // 0-29

    const paksha = tithiIndex < 15 ? PAKSHA_SHUKLA : PAKSHA_KRISHNA;
    const dayInPaksha = tithiIndex % 15; // 0-14

    const name = dayInPaksha === 14
        ? (tithiIndex < 15 ? PURNIMA : AMAVASYA)
        : TITHI_NAMES[dayInPaksha];

    return { paksha, name };

}

export function computeVara(isoDate) {

    if (!isoDate) {
        return null;
    }

    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return VARA_NAMES[date.getDay()];

}

function signIndexForLongitude(longitude) {
    const normalized = ((longitude % 360) + 360) % 360;
    return Math.floor(normalized / 30);
}

const UTTARAYANA = { en: "Uttarayana", te: "ఉత్తరాయణం" };
const DAKSHINAYANA = { en: "Dakshinayana", te: "దక్షిణాయనం" };

export function computeAyana(sunLongitude) {
    const signIndex = signIndexForLongitude(sunLongitude);
    // Makara (9) through Mithuna (2), wrapping: Uttarayana.
    const isUttarayana = signIndex >= 9 || signIndex <= 2;
    return isUttarayana ? UTTARAYANA : DAKSHINAYANA;
}
