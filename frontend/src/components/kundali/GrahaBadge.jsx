function GrahaBadge({ graha }) {

    if (!graha) {
        return null;
    }

    return (
        <div className="graha-badge">
            {graha.displayName}
        </div>
    );

}

export default GrahaBadge;