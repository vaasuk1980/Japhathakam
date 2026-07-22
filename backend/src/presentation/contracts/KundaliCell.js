/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Contract
 * ------------------------------------------------------------
 * Contract    : KundaliCell
 * Layer       : Presentation
 *
 * Responsibility:
 *   Represents one displayed Kundali cell (Sthana).
 *
 * Notes:
 *   - Presentation contract only.
 *   - Immutable.
 *   - No business logic.
 *   - No astronomy.
 *   - No rendering.
 *   - No calculations.
 * ============================================================
 */

class KundaliCell {

    constructor({

        sthana,

        isJanmaLagna = false,

        grahas = []

    }) {

        if (!Array.isArray(grahas)) {

            throw new Error(
                "KundaliCell grahas must be an array."
            );

        }

        this.sthana = sthana;

        this.isJanmaLagna = isJanmaLagna;

        this.grahas = Object.freeze([...grahas]);

        Object.freeze(this);

    }

}

export default KundaliCell;