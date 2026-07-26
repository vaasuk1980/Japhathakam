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
import DateTimeFormatter from "../formatters/DateTimeFormatter.js";
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

                // Grahas are placed via a Sthana that is already
                // relative to the Lagna (see SthanaCalculation),
                // so the Lagna's own house is always Sthana 1.
                isJanmaLagna: i === 1,

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
        // Lagna
        // -----------------------------------------

        const lagna =
            kundali.janmaLagna &&
            new DisplayGraha({

                id: "LAGNA",
                code: "LAGNA",

                name: "LAGNA",
                displayName:
                    GrahaDisplayMapper.getDisplayName("LAGNA"),

                longitude: kundali.janmaLagna.longitude,

                formattedLongitude:
                    LongitudeFormatter.format(
                        kundali.janmaLagna.longitude
                    ),

                nakshatra: kundali.janmaLagna.nakshatra,

                pada: kundali.janmaLagna.pada?.number

            });

        // -----------------------------------------
        // Chart
        // -----------------------------------------

        const janmaChart =

            new KundaliChart({

                cells: kundaliCells,

                lagna: lagna || null

            });

        // -----------------------------------------
        // Panchangam
        // -----------------------------------------

        const panchangam =
            kundali.panchangam && {

                masaName: kundali.panchangam.masaName,
                masaIsLeap: kundali.panchangam.masaIsLeap,

                samvatsaraName: kundali.panchangam.samvatsaraName,

                nakshatraStart:
                    DateTimeFormatter.formatLocal(
                        kundali.panchangam.nakshatraStartJd,
                        kundali.panchangam.timezone
                    ),

                nakshatraEnd:
                    DateTimeFormatter.formatLocal(
                        kundali.panchangam.nakshatraEndJd,
                        kundali.panchangam.timezone
                    ),

            };

        // -----------------------------------------
        // Document
        // -----------------------------------------

        return new KundaliDocument({

            janmaChart,

            gocharaChart: null,

            panchangam: panchangam || null

        });

    }

}

export default new KundaliAssembler();