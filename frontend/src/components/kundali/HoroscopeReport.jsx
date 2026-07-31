import PanchangamDetails from "./PanchangamDetails";
import PlanetaryPositionsTable from "./PlanetaryPositionsTable";
import KundaliWorkspace from "./KundaliWorkspace";
import DashaPanel from "./DashaPanel";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import resolveAgeAtEpoch from "../../utils/age/resolveAgeAtEpoch";
import formatAgeYMD from "../../utils/age/formatAgeYMD";

import "./HoroscopeReport.css";

const GENDER_LABELS = {
    male: "Male",
    female: "Female",
    other: "Transgender",
};

// Same Punya/Papa classification the Planetary Positions table
// reads per-row — collected here into a flat { graha: "PAPA" |
// "PUNYA" } map so DashaPanel can color its Graha names the same
// way without re-deriving the classification itself (it's computed
// once per Kundali from the Janma Lagna, see PunyaPapaClassifier).
function buildNatureByGraha(kundaliDocument) {

    const natureByGraha = {};

    (kundaliDocument?.janmaChart?.cells ?? []).forEach((cell) => {
        (cell.grahas || []).forEach((graha) => {
            natureByGraha[graha.code] = graha.nature;
        });
    });

    return natureByGraha;

}

/**
 * The full horoscope report, as one continuous printable page:
 * a person masthead, then Panchangam, Graha Sthithi, Kundali
 * (Janma + Gochara), and Dasha — each section keeps its own
 * internal logic/title, this component only supplies the shared
 * page frame and section order.
 */
function HoroscopeReport({ values, kundaliDocument, renderLayout }) {

    if (!values || !kundaliDocument) {
        return null;
    }

    const fullName = [values.firstName, values.lastName]
        .filter(Boolean)
        .join(" ");

    const natureByGraha = buildNatureByGraha(kundaliDocument);

    // Reuses the birth epoch already computed for the Dasha tree's
    // own Age column (see DashaPanel/DashaPeriodRow) — same
    // calendar-accurate Y/M/D convention, so the age shown here
    // matches what the Dasha section shows for "now" exactly,
    // rather than introducing a second age calculation.
    const birthEpochMs = kundaliDocument.dasha?.mahadashas?.[0]?.startEpochMs;
    const age = birthEpochMs
        ? formatAgeYMD(resolveAgeAtEpoch(birthEpochMs, Date.now(), values.timezone))
        : null;

    return (
        <div className="horoscope-report">

            <div className="horoscope-report__masthead">
                <div className="horoscope-report__name">{fullName || "—"}</div>

                <div className="horoscope-report__facts">
                    <span>{formatDateDDMMYYYY(values.dateOfBirth)}</span>
                    <span className="horoscope-report__dot">•</span>
                    <span>{values.timeOfBirth}</span>
                    <span className="horoscope-report__dot">•</span>
                    <span>{values.placeOfBirth}</span>
                    <span className="horoscope-report__dot">•</span>
                    <span>{GENDER_LABELS[values.gender] ?? values.gender}</span>
                    {age && (
                        <>
                            <span className="horoscope-report__dot">•</span>
                            <span>{age}</span>
                        </>
                    )}
                </div>
            </div>

            <PanchangamDetails
                kundaliDocument={kundaliDocument}
                dateOfBirth={values.dateOfBirth}
                timeOfBirth={values.timeOfBirth}
                gender={values.gender}
            />

            <PlanetaryPositionsTable
                kundaliDocument={kundaliDocument}
            />

            <KundaliWorkspace
                renderLayout={renderLayout}
                birthDetails={values}
            />

            <DashaPanel
                dasha={kundaliDocument.dasha}
                timezone={values.timezone}
                natureByGraha={natureByGraha}
            />

        </div>
    );

}

export default HoroscopeReport;
