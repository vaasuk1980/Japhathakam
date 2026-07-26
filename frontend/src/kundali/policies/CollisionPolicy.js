/**
 * ============================================================================
 * JAPHATHAKAM
 * CollisionPolicy
 * ============================================================================
 *
 * Handles collisions between grahas in the same pada group.
 *
 * Responsibilities
 * ----------------
 * • Prevent overlapping display of multiple grahas in one group
 * • Assign simple fallback layout positions when needed
 * ============================================================================
 */

class CollisionPolicy {

    apply(region) {

        if (!region || !Array.isArray(region.padaGroups)) {
            return region;
        }

        region.padaGroups.forEach((group) => {

            const grahas = group.grahas || [];

            grahas.forEach((graha, index) => {
                graha.x = index * 18;
                graha.y = 0;
            });

        });

        return region;
    }

}

export default new CollisionPolicy();
