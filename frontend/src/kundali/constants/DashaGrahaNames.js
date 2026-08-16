/* ==========================================================
   Full Telugu Graha names for the Dasha tree — a list view has
   room for the full name, unlike the compact Kundali chart cells
   (see GrahaDisplayMapper on the backend, which uses short
   abbreviations there instead). The on-screen Dasha tree/glance
   (DashaGlance.jsx, DashaPeriodRow.jsx, Dashboard's TodayPanel.jsx)
   are Telugu-only by design and read DASHA_GRAHA_NAMES directly —
   DASHA_GRAHA_NAMES_EN/grahaName() below exist only for the
   print-only DashaFullBreakdown, whose language follows Save PDF's
   own Telugu/English choice.
========================================================== */

export const DASHA_GRAHA_NAMES = Object.freeze({
    SUN: "రవి",
    MOON: "చంద్ర",
    MARS: "కుజ",
    RAHU: "రాహు",
    JUPITER: "గురు",
    BHUMI: "భూమి",
    SATURN: "శని",
    MERCURY: "బుధ",
    KETU: "కేతు",
    VENUS: "శుక్ర",
    MITRA: "మిత్ర",
    CHITRA: "చిత్ర"
});

export const DASHA_GRAHA_NAMES_EN = Object.freeze({
    SUN: "Sun",
    MOON: "Moon",
    MARS: "Mars",
    RAHU: "Rahu",
    JUPITER: "Jupiter",
    BHUMI: "Bhumi",
    SATURN: "Saturn",
    MERCURY: "Mercury",
    KETU: "Ketu",
    VENUS: "Venus",
    MITRA: "Mitra",
    CHITRA: "Chitra"
});

export function grahaName(code, language) {
    const names = language === "en" ? DASHA_GRAHA_NAMES_EN : DASHA_GRAHA_NAMES;
    return names[code] ?? code;
}
