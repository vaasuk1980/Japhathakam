import { Link } from "react-router-dom";

import { PADA_ROW_STEP_CQW } from "../../kundali/constants/RenderConstants";

function GrahaBadge({ graha }) {

    if (!graha) {
        return null;
    }

    const isAspect = graha.relationship !== "OCCUPANT";

    // Punya/Papa (Tritha Siddhantha) applies to the graha itself,
    // whether shown as an occupant or as a Drishti (aspect) —
    // it only overrides color, so the aspect's own italic/
    // distance styling is unaffected. The Lagna (nature === null)
    // keeps the default color, never Punya's or Papa's.
    const isPapa = graha.nature === "PAPA";
    const isPunya = graha.nature === "PUNYA";

    const className =
        "graha-symbol" +
        (isAspect ? " graha-symbol--aspect" : " graha-symbol--occupant") +
        (isPapa ? " graha-symbol--papa" : "") +
        (isPunya ? " graha-symbol--punya" : "");

    // graha.y is a dimensionless stack level (0, 1, 2…) assigned by
    // CollisionPolicy — scale it here into the same cqw unit as the
    // Pada row's own height (see PADA_ROW_STEP_CQW) so a stacked
    // graha drops by exactly one row, proportionally to the
    // chart's actual rendered size.
    const style = {
        left: `${graha.x ?? 0}%`,
        top: `${(graha.y ?? 0) * PADA_ROW_STEP_CQW}cqw`,
    };

    return (
        <span
            className={className}
            style={style}
            title={graha.isRetrograde ? `${graha.name} (Retrograde)` : graha.name}
        >
            {graha.displayName}
            {graha.isRetrograde && (
                // Jumps to this Graha's current retrograde episode on the
                // Panchangam page's Rashi-transit table — stopPropagation
                // so a click here doesn't also trigger whatever the parent
                // chart cell/tooltip does with clicks.
                <Link
                    to={`/panchangam?graha=${graha.name}`}
                    className="graha-symbol__retrograde"
                    onClick={(event) => event.stopPropagation()}
                    title="ప్రస్తుత వక్రి కాలం చూడండి · View current retrograde period"
                >
                    R
                </Link>
            )}
        </span>
    );

}

export default GrahaBadge;
