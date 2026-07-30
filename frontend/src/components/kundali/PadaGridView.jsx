import GrahaBadge from "./GrahaBadge";
import { RASI_PADA_COUNT, PADA_ROW_STEP_CQW } from "../../kundali/constants/RenderConstants";

function findRegion(regions, type) {
    return regions.find((region) => region.type === type);
}

function grahasForPada(region, pada) {

    if (!region) {
        return [];
    }

    const group = region.padaGroups.find((item) => item.pada === pada);

    return group ? group.grahas : [];

}

// Renders all 9 Rasi Pada rows for a cell in one shared coordinate
// space. An occupant graha (left, bold) and any aspect that lands
// in the same Pada (right, colored/italic) sit on the SAME row —
// differentiated by which side of the row they're pinned to, not
// by splitting the cell into two half-width columns.
function PadaGridView({ regions }) {

    if (!regions || regions.length === 0) {
        return null;
    }

    const occupantRegion = findRegion(regions, "OCCUPANT");
    const aspectRegion = findRegion(regions, "ASPECT");

    const padaSlots = Array.from(
        { length: RASI_PADA_COUNT },
        (_, i) => i + 1
    );

    return (

        <div className="pada-grid">

            {padaSlots.map((pada) => {

                const occupants = grahasForPada(occupantRegion, pada);
                const aspects = grahasForPada(aspectRegion, pada);

                const deepestStack = Math.max(
                    0,
                    ...occupants.map((graha) => graha.y ?? 0),
                    ...aspects.map((graha) => graha.y ?? 0)
                );

                // Any row with at least one graha needs a full
                // PADA_ROW_STEP_CQW of height, not just the tiny
                // empty-row baseline — a single occupant's/aspect's
                // own glyph is already taller than that baseline, so
                // without this, two adjacent occupied Pada rows (not
                // even stacked in the same Pada, just neighbouring
                // ones) visually bleed into each other. A row with
                // 2+ grahas stacked on the same side gets one more
                // step per extra graha (see PADA_ROW_STEP_CQW).
                const rowStyle =
                    (occupants.length || aspects.length)
                        ? { minHeight: `${(deepestStack + 1) * PADA_ROW_STEP_CQW}cqw` }
                        : undefined;

                return (

                    <div key={pada} className="pada-row" style={rowStyle}>

                        {occupants.map((graha) => (
                            <GrahaBadge key={graha.id} graha={graha} />
                        ))}

                        {aspects.map((graha) => (
                            <GrahaBadge key={graha.id} graha={graha} />
                        ))}

                    </div>

                );

            })}

        </div>

    );

}

export default PadaGridView;
