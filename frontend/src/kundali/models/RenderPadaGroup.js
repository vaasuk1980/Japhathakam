/**
 * ============================================================================
 * JAPHATHAKAM
 * RenderPadaGroup
 * ============================================================================
 *
 * Frontend Rendering Model
 *
 * Represents a group of grahas occupying the same Rasi-relative
 * Pada (1-9) within a rendering region.
 *
 * Responsibilities
 * ----------------
 * • Identify the Pada
 * • Hold RenderGraha objects belonging to the Pada
 * • Store calculated group coordinates
 *
 * Non-Responsibilities
 * --------------------
 * • No astrology calculations
 * • No grouping logic
 * • No rendering logic
 * ============================================================================
 */

class RenderPadaGroup {

    constructor({
        pada,
        grahas = [],
        x = 0,
        y = 0
    }) {

        /**
         * Rasi-relative Pada number (1-9).
         */
        this.pada = pada;

        /**
         * Collection of RenderGraha objects.
         */
        this.grahas = grahas;

        /**
         * Top-left coordinate of the group.
         */
        this.x = x;
        this.y = y;

    }

}

export default RenderPadaGroup;