import GrahaBadge from "./GrahaBadge";
import { RASI_PADA_COUNT } from "../../kundali/constants/RenderConstants";

const ROW_HEIGHT_PX = 20;

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

                const rowStyle =
                    (occupants.length || aspects.length)
                        ? { minHeight: `${deepestStack + ROW_HEIGHT_PX}px` }
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
