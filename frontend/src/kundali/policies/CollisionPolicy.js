/**
 * ============================================================================
 * JAPHATHAKAM
 * CollisionPolicy
 * ============================================================================
 *
 * Graha Placement Rule — Stage 2 (secondary placement) and
 * Collision Resolution.
 *
 * Stage 1 (which Pada a graha belongs to — its rendering zone)
 * is already handled upstream by RegionAssignmentPolicy /
 * AspectAssignmentPolicy. This policy positions grahas *within*
 * that shared Pada row:
 *
 *   - Occupants are pinned to the left of the row.
 *   - Aspects (Drishti) are pinned to the right of the SAME row —
 *     both share the row's full width and coordinate space, so an
 *     occupant and an incoming aspect in the same Pada sit at the
 *     same vertical position, differentiated by side, not by
 *     splitting the cell into two half-width columns.
 *
 *   - Collision Resolution: multiple grahas sharing a Pada row on
 *     the same side are stacked *vertically*, in ascending
 *     longitude order, rather than spread out horizontally.
 *
 *   `graha.y` is left as a dimensionless 0-based stack level here
 *   (0 = first/topmost) rather than a pixel offset — this runs in
 *   plain JS with no DOM access, so it can't know the chart's
 *   actual rendered size. The rendering layer (GrahaBadge /
 *   PadaGridView) turns the level into an actual cqw-based offset,
 *   scaled to match the chart's own square size (see
 *   PADA_ROW_STEP_CQW in RenderConstants.js).
 * ============================================================================
 */

const OCCUPANT_LEFT_PERCENT = 4;
const ASPECT_LEFT_PERCENT = 62;

class CollisionPolicy {

    apply(region) {

        if (!region || !Array.isArray(region.padaGroups)) {
            return region;
        }

        const leftPercent =
            region.type === "ASPECT"
                ? ASPECT_LEFT_PERCENT
                : OCCUPANT_LEFT_PERCENT;

        region.padaGroups.forEach((group) => {
            this.positionGroup(group, leftPercent);
        });

        return region;

    }

    positionGroup(group, leftPercent) {

        const grahas = group?.grahas || [];

        // Grahas arrive already sorted ascending by longitude
        // (GrahaOrderingPolicy) — stack them in that order.
        grahas.forEach((graha, index) => {
            graha.x = leftPercent;
            graha.y = index;
        });

    }

}

export default new CollisionPolicy();
