import { useState } from "react";

import ReportInvocation from "./ReportInvocation";
import PanchangamDetails from "./PanchangamDetails";
import BirthSummary from "./BirthSummary";
import PlanetaryPositionsTable from "./PlanetaryPositionsTable";
import KundaliWorkspace from "./KundaliWorkspace";
import DashaPanel from "./DashaPanel";
import DashaFullBreakdown from "./DashaFullBreakdown";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import resolveAgeAtEpoch from "../../utils/age/resolveAgeAtEpoch";
import formatAgeYMD from "../../utils/age/formatAgeYMD";
import Button from "../common/Button";
import PersonService from "../../services/PersonService";

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
function HoroscopeReport({ values, kundaliDocument, renderLayout, personId }) {

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfError, setPdfError] = useState(null);

    if (!values || !kundaliDocument) {
        return null;
    }

    const fullName = [values.firstName, values.lastName]
        .filter(Boolean)
        .join(" ");

    const natureByGraha = buildNatureByGraha(kundaliDocument);

    // The PDF is generated server-side (Puppeteer — see
    // backend/src/services/HoroscopePdfService.js) rather than via
    // window.print(), because that's the only way to get a header
    // that actually repeats on every physical page (Chrome's
    // window.print() pipeline has no supported mechanism for that —
    // confirmed by testing position: fixed directly against a real
    // rendered PDF, which printed the header once, in the wrong
    // place). window.print() also used to give a preview (the
    // browser's print dialog) before saving anything — opening the
    // result in a new tab (the browser's own PDF viewer) restores
    // that preview step instead of silently downloading straight to
    // disk with no chance to look at it first.
    const handleSavePdf = async () => {

        setPdfError(null);
        setIsGeneratingPdf(true);

        // Opened synchronously, before the await below — browsers
        // only allow window.open() without a popup-blocker prompt
        // when it's a direct result of the click, not after an
        // async gap.
        const previewTab = window.open("", "_blank");

        try {

            const blob = await PersonService.downloadPdf(personId);
            const url = URL.createObjectURL(blob);

            if (previewTab) {
                previewTab.location.href = url;
            } else {
                // Popup blocked — fall back to a direct download
                // instead of silently losing the generated PDF.
                const link = document.createElement("a");
                link.href = url;
                link.download = `${fullName || "horoscope"}.pdf`;
                link.click();
            }

        } catch (error) {
            previewTab?.close();
            setPdfError(error.message || "Failed to generate PDF.");
        } finally {
            setIsGeneratingPdf(false);
        }

    };

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
                <div className="horoscope-report__identity">
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

                <div className="horoscope-report__save-pdf">
                    <Button
                        variant="primary"
                        onClick={handleSavePdf}
                        disabled={isGeneratingPdf || !personId}
                    >
                        {isGeneratingPdf ? "Generating…" : "Save PDF"}
                    </Button>
                    {pdfError && (
                        <div className="horoscope-report__pdf-error">{pdfError}</div>
                    )}
                </div>
            </div>

            <PanchangamDetails
                kundaliDocument={kundaliDocument}
                dateOfBirth={values.dateOfBirth}
                timeOfBirth={values.timeOfBirth}
                gender={values.gender}
            />

            {/* Print-only — see PanchangamDetails above for the
                on-screen view, and BirthSummary.css / print.css for
                how the two swap for Save PDF. ReportInvocation sits
                directly above it (not at the very top of the page)
                so the mantra block reads right before the "స్వస్తి
                శ్రీ..." birth-summary sentence it introduces. Also
                carries a print-only copy of the identity line (see
                .horoscope-report__masthead below, which is hidden
                for print — its Save PDF button never printed
                anyway, and now its name/facts text is shown here
                instead, just below the guru blessing). */}
            <ReportInvocation
                fullName={fullName}
                dateOfBirth={values.dateOfBirth}
                timeOfBirth={values.timeOfBirth}
                placeOfBirth={values.placeOfBirth}
                genderLabel={GENDER_LABELS[values.gender] ?? values.gender}
                age={age}
            />

            <BirthSummary
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

            <DashaFullBreakdown
                dasha={kundaliDocument.dasha}
                timezone={values.timezone}
            />

            <div className="horoscope-report__footer">
                జాఫతకం · TRUTH OF LIGHT — నివేదిక రూపొందించిన తేదీ: {formatDateDDMMYYYY(new Date())}
            </div>

        </div>
    );

}

export default HoroscopeReport;
