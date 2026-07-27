/**
 * ============================================================================
 * JAPHATHAKAM
 * Dasha Constants — Trāitha Siddhānta Dasha System v1.0
 * ----------------------------------------------------------------------------
 * Frozen business rules (Rules 1-3). Twelve Grahas, a fixed cyclic
 * Mahadasha order, and each Graha's fixed Mahadasha year allocation.
 * Total cycle is exactly 120 years — no other sequence, count, or
 * duration is permitted.
 *
 * Graha codes are the same English identifiers used everywhere else
 * in this codebase (GrahaPlacement.graha, SupportedGrahas, Punya/Papa
 * classification) — Ravi=SUN, Chandra=MOON, Kuja=MARS, Guru=JUPITER,
 * Budha=MERCURY, Sukra=VENUS, Shani=SATURN — so Dasha shares one
 * vocabulary with the rest of the domain instead of introducing a
 * second (Sanskrit-named) one.
 * ============================================================================
 */

const DASHA_GRAHA_ORDER = Object.freeze([
    "SUN",      // Ravi
    "MOON",     // Chandra
    "MARS",     // Kuja
    "RAHU",
    "JUPITER",  // Guru
    "BHUMI",
    "SATURN",   // Shani
    "MERCURY",  // Budha
    "KETU",
    "VENUS",    // Sukra
    "MITRA",
    "CHITRA"
]);

const DASHA_YEARS = Object.freeze({
    SUN: 10,
    MOON: 10,
    MARS: 7,
    RAHU: 10,
    JUPITER: 13,
    BHUMI: 13,
    SATURN: 13,
    MERCURY: 10,
    KETU: 7,
    VENUS: 13,
    MITRA: 7,
    CHITRA: 7
});

const TOTAL_DASHA_YEARS = 120;

// Traditional Vimshottari convention: one Dasha year = 365.25 days.
const DASHA_YEAR_DAYS = 365.25;

export {
    DASHA_GRAHA_ORDER,
    DASHA_YEARS,
    TOTAL_DASHA_YEARS,
    DASHA_YEAR_DAYS
};
