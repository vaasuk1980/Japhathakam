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
 * ============================================================================
 */

export const VARA_NAMES = [
    "ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం",
    "గురువారం", "శుక్రవారం", "శనివారం",
];

export const TITHI_NAMES = [
    "పాడ్యమి", "విదియ", "తదియ", "చవితి", "పంచమి",
    "షష్ఠి", "సప్తమి", "అష్టమి", "నవమి", "దశమి",
    "ఏకాదశి", "ద్వాదశి", "త్రయోదశి", "చతుర్దశి",
];

export function computeTithi(sunLongitude, moonLongitude) {

    const diff = ((moonLongitude - sunLongitude) % 360 + 360) % 360;
    const tithiIndex = Math.floor(diff / 12); // 0-29

    const paksha = tithiIndex < 15 ? "శుక్ల పక్షం" : "కృష్ణ పక్షం";
    const dayInPaksha = tithiIndex % 15; // 0-14

    const name = dayInPaksha === 14
        ? (tithiIndex < 15 ? "పౌర్ణమి" : "అమావాస్య")
        : TITHI_NAMES[dayInPaksha];

    return { paksha, name };

}

export function computeVara(isoDate) {

    if (!isoDate) {
        return "—";
    }

    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return VARA_NAMES[date.getDay()];

}

function signIndexForLongitude(longitude) {
    const normalized = ((longitude % 360) + 360) % 360;
    return Math.floor(normalized / 30);
}

export function computeAyana(sunLongitude) {
    const signIndex = signIndexForLongitude(sunLongitude);
    // Makara (9) through Mithuna (2), wrapping: Uttarayana.
    const isUttarayana = signIndex >= 9 || signIndex <= 2;
    return isUttarayana ? "ఉత్తరాయణం" : "దక్షిణాయనం";
}
