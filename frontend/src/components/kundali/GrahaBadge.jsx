function GrahaBadge({ graha }) {

    if (!graha) {
        return null;
    }

    const isAspect = graha.relationship !== "OCCUPANT";

    const className =
        "graha-symbol" +
        (isAspect ? " graha-symbol--aspect" : " graha-symbol--occupant");

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
