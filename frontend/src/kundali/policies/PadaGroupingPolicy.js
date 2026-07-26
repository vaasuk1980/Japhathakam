/**
 * ============================================================================
 * JAPHATHAKAM
 * PadaGroupingPolicy
 * ============================================================================
 *
 * Groups grahas within a region by pada number.
 *
 * Responsibilities
 * ----------------
 * • Group render grahas by pada
 * • Preserve ordering within each group
 * ============================================================================
 */

import RenderPadaGroup from "../models/RenderPadaGroup";

class PadaGroupingPolicy {

    apply(region) {

        if (!region || !Array.isArray(region.padaGroups)) {
            return region;
        }

        const groups = new Map();

        region.padaGroups.forEach((group) => {

            const existingGroup = groups.get(group.pada);

            if (existingGroup) {
                existingGroup.grahas.push(...group.grahas);
                return;
            }

            groups.set(group.pada, group);

        });

        region.padaGroups = Array.from(groups.values())
            .sort((a, b) => a.pada - b.pada);

        return region;
    }

}

export default new PadaGroupingPolicy();
