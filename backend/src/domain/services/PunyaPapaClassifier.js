import GRAHA_PARTY from "../constants/GrahaParty.js";
import GRAHA_NATURE from "../constants/GrahaNature.js";

/**
 * ============================================================================
 * JAPHATHAKAM
 * PunyaPapaClassifier
 * ============================================================================
 *
 * Tritha Siddhantha Punya/Papa Graha classification.
 *
 *   1. The Janma Lagna has a permanent Adhipati (Lagna Lord) —
 *      see LAGNA_LORDS below.
 *   2. The Lagna Lord's Party becomes the Native's Party.
 *   3. Every graha in the Native's Party is Punya; every graha
 *      in the opposite Party is Papa.
 *
 * This is domain knowledge only, computed once per Kundali from
 * the Janma Lagna alone — it never depends on where a graha is
 * placed, so the same result applies to a graha's Janma
 * occupation, its Gochara transit, and any future report. No
 * renderer may re-derive this independently.
 * ============================================================================
 */

const LAGNA_LORDS = {

    MESHA: "MARS",
    VRISHABHA: "MITRA",
    MITHUNA: "CHITRA",
    KARKA: "MOON",
    SIMHA: "SUN",
    KANYA: "MERCURY",
    TULA: "VENUS",
    VRISCHIKA: "BHUMI",
    DHANU: "KETU",
    MAKARA: "RAHU",
    KUMBHA: "SATURN",
    MEENA: "JUPITER"

};

const GURU_PARTY_GRAHAS = [
    "SUN", "MOON", "MARS", "JUPITER", "KETU", "BHUMI"
];

const SHANI_PARTY_GRAHAS = [
    "MERCURY", "VENUS", "SATURN", "RAHU", "MITRA", "CHITRA"
];

const PARTY_BY_GRAHA = {};

GURU_PARTY_GRAHAS.forEach((graha) => {
    PARTY_BY_GRAHA[graha] = GRAHA_PARTY.GURU;
});

SHANI_PARTY_GRAHAS.forEach((graha) => {
    PARTY_BY_GRAHA[graha] = GRAHA_PARTY.SHANI;
});

class PunyaPapaClassifier {

    /**
     * @param {string} lagnaId - Janma Lagna sign id, e.g. "MESHA"
     *   (see LagnaRegistry).
     * @returns {{
     *   lagnaLord: string,
     *   nativeParty: string,
     *   natureByGraha: Record<string, "PUNYA"|"PAPA">
     * }}
     */
    classify(lagnaId) {

        const lagnaLord = LAGNA_LORDS[lagnaId];

        if (!lagnaLord) {
            throw new Error(
                `PunyaPapaClassifier: unknown Janma Lagna "${lagnaId}".`
            );
        }

        const nativeParty = PARTY_BY_GRAHA[lagnaLord];

        const natureByGraha = {};

        Object.keys(PARTY_BY_GRAHA).forEach((graha) => {

            natureByGraha[graha] =
                PARTY_BY_GRAHA[graha] === nativeParty
                    ? GRAHA_NATURE.PUNYA
                    : GRAHA_NATURE.PAPA;

        });

        return {
            lagnaLord,
            nativeParty,
            natureByGraha
        };

    }

}

export default new PunyaPapaClassifier();
