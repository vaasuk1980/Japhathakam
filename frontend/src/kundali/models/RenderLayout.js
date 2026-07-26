/**
 * ============================================================================
 * JAPHATHAKAM
 * RenderLayout
 * ============================================================================
 *
 * Root Presentation Model
 *
 * Represents the complete Kundali ready for rendering.
 *
 * Responsibilities
 * ----------------
 * • Hold the 12 RenderCell objects
 *
 * Non-Responsibilities
 * --------------------
 * • No astrology calculations
 * • No rendering logic
 * • No coordinate calculations
 * ============================================================================
 */

class RenderLayout {

    constructor({
        cells = []
    }) {

        /**
         * Collection of the 12 RenderCell objects.
         */
        this.cells = cells;

    }

}

export default RenderLayout;