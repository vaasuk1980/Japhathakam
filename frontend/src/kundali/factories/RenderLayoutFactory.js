/**
 * ============================================================================
 * JAPHATHAKAM
 * RenderLayoutFactory
 * ============================================================================
 *
 * Creates the initial rendering object graph.
 *
 * Responsibilities
 * ----------------
 * • Create RenderLayout
 * • Create the 12 RenderCell objects
 *
 * Non-Responsibilities
 * --------------------
 * • No rendering rules
 * • No coordinate generation
 * • No grouping
 * • No ordering
 * ============================================================================
 */

import RenderLayout from "../models/RenderLayout";
import RenderCell from "../models/RenderCell";

class RenderLayoutFactory {

    create() {

        const cells = [];

        for (let sthana = 1; sthana <= 12; sthana++) {

            cells.push(
                new RenderCell({
                    sthana
                })
            );

        }

        return new RenderLayout({
            cells
        });

    }

}

export default new RenderLayoutFactory();