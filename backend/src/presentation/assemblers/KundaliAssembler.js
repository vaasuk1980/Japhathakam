/**
 * ============================================================
 * JAPHATHAKAM
 * Presentation Assembler
 * ------------------------------------------------------------
 * Assembler   : KundaliAssembler
 * Layer       : Presentation
 *
 * Responsibility:
 *   Converts the Domain Kundali aggregate into immutable
 *   Presentation contracts.
 *
 * ============================================================
 */

import KundaliDocument from "../contracts/KundaliDocument.js";
import KundaliChart from "../contracts/KundaliChart.js";
import KundaliCell from "../contracts/KundaliCell.js";
import DisplayGraha from "../contracts/DisplayGraha.js";
import LongitudeFormatter from "../formatters/LongitudeFormatter.js";
import GrahaDisplayMapper from "../GrahaDisplayMapper.js";

class KundaliAssembler {

    assemble(kundali) {

        if (!kundali) {

            throw new Error(
                "Kundali is required."
            );

        }

        // -----------------------------------------
        // Create 12 empty Kundali cells
        // -----------------------------------------

        const cells = [];

        for (let i = 1; i <= 12; i++) {

            cells.push({

                sthana: i,

                isJanmaLagna:
                    kundali.janmaLagna?.signIndex + 1 === i,

                grahas: []

            });

        }

        // -----------------------------------------
        // Place Grahas into their Sthanas
        // -----------------------------------------

        for (const placement of kundali.grahaPlacements) {

            const cell =
                cells[placement.sthana.number - 1];

            cell.grahas.push(

                new DisplayGraha({

                    id: placement.graha,
                    code: placement.graha,

                    name: placement.graha,
                    displayName: GrahaDisplayMapper.getDisplayName
                        (placement.graha
                            
                        ),

                    longitude: placement.longitude,

                    formattedLongitude:
                        LongitudeFormatter.format(
                            placement.longitude
                        ),

                    nakshatra: placement.nakshatra,

                    pada: placement.pada?.number

                })

            );

        }

        // -----------------------------------------
        // Freeze Cells
        // -----------------------------------------

        const kundaliCells =

            cells.map(cell =>

                new KundaliCell({

                    sthana: cell.sthana,

                    isJanmaLagna: cell.isJanmaLagna,

                    grahas: cell.grahas

                })

            );

        // -----------------------------------------
        // Chart
        // -----------------------------------------

        const janmaChart =

            new KundaliChart({

                cells: kundaliCells

            });

        // -----------------------------------------
        // Document
        // -----------------------------------------

        return new KundaliDocument({

            janmaChart,

            gocharaChart: null

        });

    }

}

export default new KundaliAssembler();