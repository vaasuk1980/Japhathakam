import PadaGridView from "./PadaGridView";
import { useTranslation } from "../../i18n/I18nContext";

function KundaliCell({ cell, edge }) {

    const { language } = useTranslation();

    if (!cell) {
        return <div className="kundali-cell" />;
    }

    const cellClassName =
        "kundali-cell" +
        (cell.isJanmaLagna ? " kundali-cell--lagna" : "");

    const rasiLabel = cell.rasi?.[language] ?? cell.rasi?.te;
    const lordLabel = cell.lord?.[language] ?? cell.lord?.te;

    return (

        <div className={cellClassName}>

            {rasiLabel && (
                <div className={`rasi-label rasi-label--${edge}`}>
                    {rasiLabel}
                    {lordLabel && (
                        <span className="rasi-label__lord"> ({lordLabel})</span>
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
