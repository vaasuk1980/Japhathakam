/**
 * ============================================================================
 * JAPHATHAKAM
 * RenderGraha
 * ============================================================================
 *
 * Frontend Rendering Model
 *
 * Represents a single graha ready for rendering inside a Kundali.
 *
 * Responsibilities
 * ----------------
 * • Store rendering information
 * • Store calculated coordinates
 * • Store rendering metadata
 *
 * Non-Responsibilities
 * --------------------
 * • No astrology calculations
 * • No rendering calculations
 * • No React logic
 * • No DOM manipulation
 * ============================================================================
 */

class RenderGraha {

    constructor({
        id,
        name,
        displayName,

        sthana,
        relationship,

        longitude,
        nakshatra,
        pada,

        nature = null,

        x = 0,
        y = 0

    }) {

        /**
         * Unique graha identifier.
         */
        this.id = id;

        /**
         * Internal graha name.
         * Example: "BUDHA"
         */
        this.name = name;

        /**
         * Display name.
         * Example: "బు"
         */
        this.displayName = displayName;

        /**
         * Sthana number (1–12)
         */
        this.sthana = sthana;

        /**
         * Rendering relationship.
         * Example:
         * OCCUPANT
         * SEVENTH_ASPECT
         * KUJA_ASPECT
         * GURU_ASPECT
         * SHANI_ASPECT
         */
        this.relationship = relationship;

        /**
         * Longitude within sign.
         * Used by GrahaOrderingPolicy.
         */
        this.longitude = longitude;

        /**
         * Nakshatra occupied by the graha.
         * Example: { id, englishName, teluguName, sequence }
         */
        this.nakshatra = nakshatra;

        /**
         * Pada index.
         */
        this.pada = pada;

        /**
         * Punya/Papa classification (Tritha Siddhantha).
         * "PUNYA" | "PAPA" | null (Lagna is never classified).
         */
        this.nature = nature;

        /**
         * Final render coordinates.
         */
        this.x = x;
        this.y = y;

    }

}

export default RenderGraha;