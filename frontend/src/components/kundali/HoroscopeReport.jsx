import PanchangamDetails from "./PanchangamDetails";
import PlanetaryPositionsTable from "./PlanetaryPositionsTable";
import KundaliWorkspace from "./KundaliWorkspace";
import DashaPanel from "./DashaPanel";

import "./HoroscopeReport.css";

const GENDER_LABELS = {
    male: "Male",
    female: "Female",
    other: "Transgender",
};

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

    return (
        <div className="horoscope-report">

            <div className="horoscope-report__masthead">
                <div className="horoscope-report__name">{fullName || "—"}</div>

                <div className="horoscope-report__facts">
                    <span>{values.dateOfBirth}</span>
                    <span className="horoscope-report__dot">•</span>
                    <span>{values.timeOfBirth}</span>
                    <span className="horoscope-report__dot">•</span>
                    <span>{values.placeOfBirth}</span>
                    <span className="horoscope-report__dot">•</span>
                    <span>{GENDER_LABELS[values.gender] ?? values.gender}</span>
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
            />

        </div>
    );

}

export default HoroscopeReport;
