function GrahaBadge({ graha }) {

    if (!graha) {
        return null;
    }

    return (
        <span className="graha-symbol" title={graha.name}>
            {graha.displayName}
        </span>
    );

}

export default GrahaBadge;
