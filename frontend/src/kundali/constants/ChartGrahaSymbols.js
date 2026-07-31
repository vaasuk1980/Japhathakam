/**
 * Mirrors backend/src/presentation/GrahaDisplayMapper.js exactly —
 * the short 1-2 char labels shown inside a Kundali chart cell, as
 * opposed to the full names used in lists/tables (see
 * DashaGrahaNames.js). Needed here so the Dashboard's standalone
 * "Gochara Kundali" (today, no saved Person) can build a chart
 * client-side without a round trip through the full Kundali-
 * generation response, which is the only place this mapping
 * otherwise gets applied.
 */
export const CHART_GRAHA_SYMBOLS = Object.freeze({
    LAGNA: "ల",

    SUN: "ర",
    MOON: "చం",
    MARS: "కు",
    MERCURY: "బు",
    JUPITER: "గు",
    VENUS: "శు",
    SATURN: "శ",
    RAHU: "రా",
    KETU: "కే",

    BHUMI: "భూ",
    MITRA: "మి",
    CHITRA: "చి",
});
