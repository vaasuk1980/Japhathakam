function GrahaBadge({ graha }) {

    if (!graha) {
        return null;
    }

    const isAspect = graha.relationship !== "OCCUPANT";

    // Punya/Papa (Tritha Siddhantha) applies to the graha itself,
    // whether shown as an occupant or as a Drishti (aspect) —
    // it only overrides color, so the aspect's own italic/
    // distance styling is unaffected.
    const isPapa = graha.nature === "PAPA";

    const className =
        "graha-symbol" +
        (isAspect ? " graha-symbol--aspect" : " graha-symbol--occupant") +
        (isPapa ? " graha-symbol--papa" : "");

    const style = {
        left: `${graha.x ?? 0}%`,
        top: `${graha.y ?? 0}px`,
    };

    return (
        <span
            className={className}
            style={style}
            title={graha.name}
        >
            {graha.displayName}
        </span>
    );

}

export default GrahaBadge;
