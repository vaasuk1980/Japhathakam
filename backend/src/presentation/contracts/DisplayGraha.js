/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Contract
 * ------------------------------------------------------------
 * Contract    : DisplaySthana
 * Layer       : Presentation
 *
 * Responsibility:
 *   Represents one Sthana exactly as it should appear in the UI.
 *
 * Notes:
 *   - Presentation model only.
 *   - Immutable.
 *   - No business logic.
 *   - No calculations.
 * ============================================================
 */

class DisplaySthana {

    constructor({
        sthanaNumber,
        isJanmaLagna,
        grahas
    }) {

        this.sthanaNumber = sthanaNumber;
        this.isJanmaLagna = isJanmaLagna;
        this.grahas = grahas;

        Object.freeze(this);

    }

}

export default DisplaySthana;