/**
 * ============================================================================
 * JAPHATHAKAM
 * KundaliRenderEngine
 * ============================================================================
 *
 * Orchestrates the Kundali rendering pipeline.
 *
 * Responsibilities
 * ----------------
 * • Accept a KundaliDocument
 * • Create an initial RenderLayout
 * • Execute rendering policies
 * • Return RenderLayout
 * ============================================================================
 */

import RenderLayoutFactory from "../factories/RenderLayoutFactory";
import RegionAssignmentPolicy from "../policies/RegionAssignmentPolicy";
import GrahaOrderingPolicy from "../policies/GrahaOrderingPolicy";
import PadaGroupingPolicy from "../policies/PadaGroupingPolicy";
import CollisionPolicy from "../policies/CollisionPolicy";

class KundaliRenderEngine {

    render(kundaliDocument) {

        const renderLayout =
            RenderLayoutFactory.create();

        RegionAssignmentPolicy.apply(
            kundaliDocument,
            renderLayout
        );

        renderLayout.cells.forEach((cell) => {
            cell.regions.forEach((region) => {
                region.padaGroups.forEach((group) => {
                    group.grahas = GrahaOrderingPolicy.apply(group.grahas);
                });

                PadaGroupingPolicy.apply(region);
                CollisionPolicy.apply(region);
            });
        });

        return renderLayout;

    }

}

export default new KundaliRenderEngine();