/**
 * ============================================================================
 * JAPHATHAKAM
 * RenderRegion
 * ============================================================================
 *
 * Frontend Rendering Model
 *
 * Represents a rendering region within a Kundali cell.
 *
 * Responsibilities
 * ----------------
 * • Identify the rendering region
 * • Hold RenderPadaGroup objects
 *
 * Non-Responsibilities
 * --------------------
 * • No astrology calculations
 * • No coordinate calculations
 * • No rendering logic
 * ============================================================================
 */

class RenderRegion {

    constructor({
        type,
        padaGroups = []
    }) {

        /**
         * Region identifier.
         */
        this.type = type;

        /**
         * Collection of RenderPadaGroup objects.
         */
        this.padaGroups = padaGroups;

    }

}

export default RenderRegion;