import PadaGridView from "./PadaGridView";

function KundaliCell({ cell, edge }) {

    if (!cell) {
        return <div className="kundali-cell" />;
    }

    const cellClassName =
        "kundali-cell" +
        (cell.isJanmaLagna ? " kundali-cell--lagna" : "");

    return (

        <div className={cellClassName}>

            {cell.rasi && (
                <div className={`rasi-label rasi-label--${edge}`}>
                    {cell.rasi}
                    {cell.lord && (
                        <span className="rasi-label__lord"> ({cell.lord})</span>
                    )}
                </div>
            )}

            <div className="sthana-number">
                {cell.houseNumber ?? cell.sthana}
            </div>

            <PadaGridView regions={cell.regions} />

        </div>

    );

}

export default KundaliCell;
