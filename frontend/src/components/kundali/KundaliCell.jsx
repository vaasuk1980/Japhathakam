import GrahaBadge from "./GrahaBadge";

function KundaliCell({ cell }) {

    if (!cell) {
        return <div className="kundali-cell" />;
    }

    return (
        <div className="kundali-cell">

            <div className="sthana-number">
                {cell.sthana}
            </div>

            {cell.isJanmaLagna && (
                <div className="janma-lagna-marker">
                    //
                </div>
            )}

            <div className="graha-list">
                {cell.grahas.map((graha) => (
                    <GrahaBadge
                        key={graha.id}
                        graha={graha}
                    />
                ))}
            </div>

        </div>
    );

}

export default KundaliCell;