/**
 * ============================================================================
 * JAPHATHAKAM
 * Dasha Constants — Trāitha Siddhānta Dasha System v1.0
 * ----------------------------------------------------------------------------
 * Mirrors backend/src/astrology/constants/DashaConstants.js exactly.
 * Needed here so the UI can expand Pratyantardasha/Sukshmadasha/
 * Pranadasha on demand (Rule 12) without a round trip to the server —
 * the subdivision rule is pure arithmetic, not an astronomy lookup.
 * ============================================================================
 */

export const DASHA_GRAHA_ORDER = Object.freeze([
    "SUN", "MOON", "MARS", "RAHU", "JUPITER", "BHUMI",
    "SATURN", "MERCURY", "KETU", "VENUS", "MITRA", "CHITRA"
]);

export const DASHA_YEARS = Object.freeze({
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

export const TOTAL_DASHA_YEARS = 120;

// Traditional Vimshottari convention: one Dasha year = 365.25 days.
export const DASHA_YEAR_DAYS = 365.25;

// Depth labels, index 0 = Mahadasha (computed server-side).
export const DASHA_LEVEL_LABELS = Object.freeze([
    "Mahadasha",
    "Antardasha",
    "Pratyantardasha",
    "Sukshmadasha",
    "Pranadasha"
]);
