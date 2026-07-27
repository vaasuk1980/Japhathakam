/**
 * Zodiac sign names (Mesha-first, index 0-11), used to label
 * each Kundali cell with the sign it actually represents for
 * a given chart.
 */
export const RASI_NAMES = [
    "మేషం", "వృషభం", "మిథునం", "కర్కాటకం",
    "సింహం", "కన్య", "తుల", "వృశ్చికం",
    "ధనుస్సు", "మకరం", "కుంభం", "మీనం",
];

/**
 * Rashi Adhipathi (sign lord), same Mesha-first order as
 * RASI_NAMES. This family's tradition assigns each of the 12
 * signs its own unique lord (using the Bhumi/Mitra/Chitra
 * upagrahas in place of the usual shared dual-lordships).
 */
export const SIGN_LORDS = [
    "కుజ", "మిత్ర", "చిత్ర", "చంద్ర",
    "రవి", "బుధ", "శుక్ర", "భూమి",
    "కేతు", "రాహు", "శని", "గురు",
];

/**
 * One Pada = 3°20'. A sign (30°) always divides into exactly 9
 * Padas (30 / 3°20' = 9) — this is the rendering-zone grid used
 * to visually separate grahas within a Kundali cell, distinct
 * from Nakshatra Pada (1-4) shown elsewhere in the UI.
 */
export const PADA_SPAN = 10 / 3;
export const RASI_PADA_COUNT = 9;
