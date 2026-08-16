/**
 * Zodiac sign names (Mesha-first, index 0-11), used to label
 * each Kundali cell with the sign it actually represents for
 * a given chart. {en, te} rather than a plain string — the
 * chart's language follows Save PDF's own Telugu/English choice
 * (see KundaliCell.jsx, which picks by language at render time).
 */
export const RASI_NAMES = [
    { te: "మేషం", en: "Aries" },
    { te: "వృషభం", en: "Taurus" },
    { te: "మిథునం", en: "Gemini" },
    { te: "కర్కాటకం", en: "Cancer" },
    { te: "సింహం", en: "Leo" },
    { te: "కన్య", en: "Virgo" },
    { te: "తుల", en: "Libra" },
    { te: "వృశ్చికం", en: "Scorpio" },
    { te: "ధనుస్సు", en: "Sagittarius" },
    { te: "మకరం", en: "Capricorn" },
    { te: "కుంభం", en: "Aquarius" },
    { te: "మీనం", en: "Pisces" },
];

/**
 * Rashi Adhipathi (sign lord), same Mesha-first order as
 * RASI_NAMES. This family's tradition assigns each of the 12
 * signs its own unique lord (using the Bhumi/Mitra/Chitra
 * upagrahas in place of the usual shared dual-lordships).
 */
export const SIGN_LORDS = [
    { te: "కుజ", en: "Mars" },
    { te: "మిత్ర", en: "Mitra" },
    { te: "చిత్ర", en: "Chitra" },
    { te: "చంద్ర", en: "Moon" },
    { te: "రవి", en: "Sun" },
    { te: "బుధ", en: "Mercury" },
    { te: "శుక్ర", en: "Venus" },
    { te: "భూమి", en: "Bhumi" },
    { te: "కేతు", en: "Ketu" },
    { te: "రాహు", en: "Rahu" },
    { te: "శని", en: "Saturn" },
    { te: "గురు", en: "Jupiter" },
];

/**
 * One Pada = 3°20'. A sign (30°) always divides into exactly 9
 * Padas (30 / 3°20' = 9) — this is the rendering-zone grid used
 * to visually separate grahas within a Kundali cell, distinct
 * from Nakshatra Pada (1-4) shown elsewhere in the UI.
 */
export const PADA_SPAN = 10 / 3;
export const RASI_PADA_COUNT = 9;

/**
 * Vertical step (in cqw, relative to .kundali-chart's own inline
 * size) used for the height of any Pada row that has at least one
 * graha in it (occupant and/or aspect) — see PadaGridView, which
 * gives every such row at least one of these steps, and one more
 * per extra graha actually stacked on the same side within that
 * same Pada (see CollisionPolicy, which assigns each stacked
 * graha a 0-based level; GrahaBadge turns that level into an
 * actual pixel offset using this same constant).
 *
 * Matches .graha-symbol--occupant's font-size clamp (3.81cqw),
 * with a little headroom, so a single graha's own glyph doesn't
 * bleed into an adjacent Pada row, and two stacked glyphs in the
 * same row don't overlap each other either. This is deliberately
 * larger than .pada-row's own baseline min-height in
 * KundaliChart.css (which only governs empty rows) — a cell with
 * several populated Padas can need more total height than a
 * perfectly square quarter of the chart provides, making that
 * cell's row-band taller than the others. That's an accepted
 * trade-off: illegible overlapping text is worse than an
 * imperfectly square chart.
 */
export const PADA_ROW_STEP_CQW = 4;
