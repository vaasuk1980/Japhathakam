import RenderRegion from "../models/RenderRegion";
import RenderGraha from "../models/RenderGraha";
import RenderPadaGroup from "../models/RenderPadaGroup";
import { RASI_NAMES, SIGN_LORDS, PADA_SPAN } from "../constants/RenderConstants";

class RegionAssignmentPolicy {

    /**
     * The Kundali grid is fixed to the zodiac — Sthana 1 is
     * always Mesha, Sthana 2 always Vrishabha, and so on; the
     * signs never move. Grahas (and the Lagna) are placed by
     * their own absolute longitude into that fixed grid.
     *
     * What changes per chart is only the *displayed* house
     * number on each fixed cell: whichever fixed cell holds the
     * Lagna's sign is labelled "1", and the rest are numbered
     * 2-12 in natural zodiac order from there — the numbers
     * rotate around the fixed grid, not the signs themselves.
     */
    apply(chart, renderLayout) {

        this.assignCellIdentity(chart, renderLayout);

        const grahas = this.flattenGrahas(chart);

        grahas.forEach((graha) => {

            const sthana =
                this.fixedSthanaForLongitude(graha.longitude);

            const renderCell = this.findRenderCell(
                renderLayout,
                sthana
            );

            if (!renderCell) {
                return;
            }

            const region = this.getOrCreateOccupantRegion(renderCell);

            const renderGraha =
                this.createRenderGraha(graha, sthana);

            const rasiPada =
                this.rasiPadaForLongitude(graha.longitude);

            const padaGroup =
                this.getOrCreatePadaGroup(
                    region,
                    rasiPada
                );

            padaGroup.grahas.push(renderGraha);

        });

        return renderLayout;

    }

    /**
     * Labels every fixed cell with its (unchanging) sign, and —
     * if a Lagna is present — the Lagna-relative house number
     * and whether it's the Lagna's own cell.
     */
    assignCellIdentity(chart, renderLayout) {

        const lagna = chart.lagna;

        const lagnaSignIndex =
            lagna ? this.signIndexForLongitude(lagna.longitude) : null;

        renderLayout.cells.forEach((renderCell) => {

            const signIndex = renderCell.sthana - 1;

            renderCell.rasi = RASI_NAMES[signIndex];
            renderCell.lord = SIGN_LORDS[signIndex];

            if (lagnaSignIndex === null) {
                return;
            }

            renderCell.houseNumber =
                ((signIndex - lagnaSignIndex + 12) % 12) + 1;

            renderCell.isJanmaLagna =
                renderCell.houseNumber === 1;

        });

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

    /**
     * Rasi-relative Pada (1-9) — which of the sign's own 9 equal
     * 3°20' slices the graha falls into. This is the Stage 1
     * rendering zone: it groups/separates grahas within a single
     * Kundali cell by their true position across the whole sign,
     * unlike Nakshatra Pada (1-4) which can repeat across
     * unrelated nakshatras within the same sign.
     */
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

    getOrCreateOccupantRegion(renderCell) {

        const existing = renderCell.regions.find(
            region => region.type === "OCCUPANT"
        );

        if (existing) {
            return existing;
        }

        const region = new RenderRegion({
            type: "OCCUPANT",
            padaGroups: []
        });

        renderCell.regions.push(region);

        return region;

    }

    createRenderGraha(graha, sthana) {

        return new RenderGraha({

            id: graha.id,
            name: graha.name,
            displayName: graha.displayName,

            sthana,
            relationship: "OCCUPANT",

            longitude: graha.longitude,
            nakshatra: graha.nakshatra,
            pada: graha.pada,

            nature: graha.nature,
            isRetrograde: graha.isRetrograde

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

export default new RegionAssignmentPolicy();
