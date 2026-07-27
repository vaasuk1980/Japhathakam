/**
 * ============================================================================
 * JAPHATHAKAM
 * AspectAssignmentPolicy
 * ============================================================================
 *
 * Graha Drishti (aspect) placement.
 *
 * Every graha aspects the 7th Sthana counted from its own placement.
 * Kuja (Mars), Guru (Jupiter) and Sani (Saturn) additionally cast
 * special aspects:
 *
 *   MARS    -> 4th, 7th, 8th
 *   JUPITER -> 5th, 7th, 9th
 *   SATURN  -> 3rd, 7th, 10th
 *
 * An aspect is rendered into its TARGET Sthana's own ASPECT region,
 * using the same Stage 1 (Pada)/Stage 2 (degree) placement concept
 * as occupants: it keeps the source graha's own Rasi Pada and
 * longitude, so an aspect from a graha sitting in Pada 3 of its own
 * sign always renders in Pada 3's row of the aspected cell too.
 * ============================================================================
 */

import RenderRegion from "../models/RenderRegion";
import RenderGraha from "../models/RenderGraha";
import RenderPadaGroup from "../models/RenderPadaGroup";
import { PADA_SPAN } from "../constants/RenderConstants";

const SEVENTH_ASPECT = { offset: 6, relationship: "SEVENTH_ASPECT" };

const DEFAULT_ASPECTS = [SEVENTH_ASPECT];

const SPECIAL_ASPECTS = {

    MARS: [
        { offset: 3, relationship: "KUJA_ASPECT" },
        SEVENTH_ASPECT,
        { offset: 7, relationship: "KUJA_ASPECT" },
    ],

    JUPITER: [
        { offset: 4, relationship: "GURU_ASPECT" },
        SEVENTH_ASPECT,
        { offset: 8, relationship: "GURU_ASPECT" },
    ],

    SATURN: [
        { offset: 2, relationship: "SHANI_ASPECT" },
        SEVENTH_ASPECT,
        { offset: 9, relationship: "SHANI_ASPECT" },
    ],

};

class AspectAssignmentPolicy {

    apply(chart, renderLayout) {

        const grahas = this.flattenGrahas(chart);

        grahas.forEach((graha) => {

            const sourceSthana =
                this.fixedSthanaForLongitude(graha.longitude);

            const sourceRasiPada =
                this.rasiPadaForLongitude(graha.longitude);

            const aspects =
                SPECIAL_ASPECTS[graha.name] || DEFAULT_ASPECTS;

            aspects.forEach(({ offset, relationship }) => {

                const targetSthana =
                    ((sourceSthana - 1 + offset) % 12) + 1;

                const renderCell =
                    this.findRenderCell(renderLayout, targetSthana);

                if (!renderCell) {
                    return;
                }

                const region =
                    this.getOrCreateAspectRegion(renderCell);

                const renderGraha =
                    this.createRenderGraha(
                        graha,
                        targetSthana,
                        relationship
                    );

                const padaGroup =
                    this.getOrCreatePadaGroup(region, sourceRasiPada);

                padaGroup.grahas.push(renderGraha);

            });

        });

        return renderLayout;

    }

    flattenGrahas(chart) {

        const grahas = [];

        chart.cells.forEach((cell) => {
            cell.grahas.forEach((graha) => grahas.push(graha));
        });

        return grahas;

    }

    signIndexForLongitude(longitude) {

        const normalized = ((longitude % 360) + 360) % 360;

        return Math.floor(normalized / 30);

    }

    fixedSthanaForLongitude(longitude) {

        return this.signIndexForLongitude(longitude) + 1;

    }

    rasiPadaForLongitude(longitude) {

        const normalized = ((longitude % 360) + 360) % 360;
        const withinSign = normalized % 30;

        return Math.floor(withinSign / PADA_SPAN) + 1;

    }

    findRenderCell(renderLayout, sthana) {

        return renderLayout.cells.find(
            cell => cell.sthana === sthana
        );

    }

    getOrCreateAspectRegion(renderCell) {

        const existing = renderCell.regions.find(
            region => region.type === "ASPECT"
        );

        if (existing) {
            return existing;
        }

        const region = new RenderRegion({
            type: "ASPECT",
            padaGroups: []
        });

        renderCell.regions.push(region);

        return region;

    }

    createRenderGraha(graha, targetSthana, relationship) {

        return new RenderGraha({

            id: `${graha.id}__${relationship}__${targetSthana}`,
            name: graha.name,
            displayName: graha.displayName,

            sthana: targetSthana,
            relationship,

            longitude: graha.longitude,
            nakshatra: graha.nakshatra,
            pada: graha.pada,

            nature: graha.nature

        });

    }

    getOrCreatePadaGroup(region, pada) {

        let group =
            region.padaGroups.find(
                item => item.pada === pada
            );

        if (group) {
            return group;
        }

        group = new RenderPadaGroup({
            pada,
            grahas: []
        });

        region.padaGroups.push(group);

        return group;

    }

}

export default new AspectAssignmentPolicy();
