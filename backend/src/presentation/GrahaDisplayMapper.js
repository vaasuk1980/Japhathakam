/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Mapper
 * ------------------------------------------------------------
 * Mapper      : GrahaDisplayMapper
 * Layer       : Presentation
 *
 * Responsibility:
 *   Maps graha codes to their Kundali display labels.
 *
 * Notes:
 *   - Presentation only.
 *   - No business logic.
 *   - No astrology calculations.
 * ============================================================
 */

class GrahaDisplayMapper {

    static #DISPLAY_NAMES = Object.freeze({

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
        CHITRA: "చి"

    });

    static getDisplayName(code) {

        return this.#DISPLAY_NAMES[code] ?? code;

    }

}

export default GrahaDisplayMapper;