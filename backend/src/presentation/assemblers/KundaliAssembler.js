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
import DashaPeriod from "../contracts/DashaPeriod.js";
import LongitudeFormatter from "../formatters/LongitudeFormatter.js";
import DateTimeFormatter from "../formatters/DateTimeFormatter.js";
import DashaDurationFormatter from "../formatters/DashaDurationFormatter.js";
import GrahaDisplayMapper from "../GrahaDisplayMapper.js";

class KundaliAssembler {

    assemble(kundali) {

        if (!kundali) {

            throw new Error(
                "Kundali is required."
            );

        }

        // -----------------------------------------
        // Janma Chart
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

        const janmaChart =

            new KundaliChart({

                cells: this.buildCells(kundali.grahaPlacements),

                lagna: lagna || null

            });

        // -----------------------------------------
        // Gochara Chart (transit) — same Sthana grid as
        // the Janma chart (relative to the natal Lagna),
        // populated with the requested moment's grahas.
        // -----------------------------------------

        const gocharaChart =
            kundali.gocharaPlacements && kundali.gocharaPlacements.length > 0
                ? new KundaliChart({
                    cells: this.buildCells(kundali.gocharaPlacements),
                    // Same natal Lagna as the Janma chart — the
                    // Gochara grid's house numbering is relative
                    // to the same fixed reference, not a freshly
                    // computed "current" ascendant.
                    lagna: lagna || null
                })
                : null;

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
        // Dasha (Trāitha Siddhānta Dasha System v1.0)
        // -----------------------------------------

        const dasha =
            this.buildDasha(kundali.dasha, kundali.birthContext?.timezone);

        // -----------------------------------------
        // Document
        // -----------------------------------------

        return new KundaliDocument({

            janmaChart,

            gocharaChart,

            lagnaLord: kundali.lagnaLord,

            nativeParty: kundali.nativeParty,

            panchangam: panchangam || null,

            dasha

        });

    }

    /**
     * Assembles the birth Mahadasha timeline: 12 Mahadashas, each
     * eagerly carrying its 12 Antardashas as `children` (Rule 7).
     * Deeper levels (Pratyantardasha, Sukshmadasha, Pranadasha) are
     * computed on demand by the frontend, using the identical
     * proportional rule (Rule 12) — see DashaSubdivisionEngine.
     */
    buildDasha(dasha, timezone) {

        if (!dasha) {
            return null;
        }

        return {

            birthGraha: dasha.birthGraha,

            birthGrahaDisplayName:
                GrahaDisplayMapper.getDisplayName(dasha.birthGraha),

            balanceYears: dasha.balanceYears,

            balanceDisplay:
                DashaDurationFormatter.format(dasha.balanceYears),

            mahadashas: dasha.mahadashas.map(
                (mahadasha) => this.buildDashaPeriod(mahadasha, timezone)
            )

        };

    }

    buildDashaPeriod(period, timezone) {

        return new DashaPeriod({

            graha: period.graha,
            displayName: GrahaDisplayMapper.getDisplayName(period.graha),

            start: DateTimeFormatter.formatLocal(period.startJd, timezone),
            end: DateTimeFormatter.formatLocal(period.endJd, timezone),

            startEpochMs: DateTimeFormatter.toEpochMillis(period.startJd),
            endEpochMs: DateTimeFormatter.toEpochMillis(period.endJd),

            durationYears: period.durationYears,
            durationDisplay: DashaDurationFormatter.format(period.durationYears),

            children: (period.antardashas || []).map(
                (antardasha) => this.buildDashaPeriod(antardasha, timezone)
            )

        });

    }

    /**
     * Builds the 12 fixed-sign Kundali cells and places the
     * given Graha placements into them. Shared by both the
     * Janma and Gochara charts — a placement is just a graha
     * code + Sthana + longitude/nakshatra/pada regardless of
     * which moment it came from.
     */
    buildCells(placements) {

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

        for (const placement of placements) {

            const cell =
                cells[placement.sthana.number - 1];

            cell.grahas.push(

                new DisplayGraha({

                    id: placement.graha,
                    code: placement.graha,

                    name: placement.graha,
                    displayName: GrahaDisplayMapper.getDisplayName
                        (placement.graha),

                    longitude: placement.longitude,

                    formattedLongitude:
                        LongitudeFormatter.format(
                            placement.longitude
                        ),

                    nakshatra: placement.nakshatra,

                    pada: placement.pada?.number,

                    nature: placement.nature

                })

            );

        }

        return cells.map(cell =>

            new KundaliCell({

                sthana: cell.sthana,

                isJanmaLagna: cell.isJanmaLagna,

                grahas: cell.grahas

            })

        );

    }

}

export default new KundaliAssembler();
