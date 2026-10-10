import { useEffect, useRef, useState } from "react";

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
import ReportJumpBar from "./ReportJumpBar";
import NatureMark from "./NatureMark";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import { rasiForLongitude } from "../../kundali/constants/RasiNames";
import resolveCurrentDashaChain from "../../utils/dasha/resolveCurrentDashaChain";
import { useTranslation } from "../../i18n/I18nContext";

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
function HoroscopeReport({ values, kundaliDocument, renderLayout, personId, onEdit }) {

    const { t, language } = useTranslation();

    // Which language's PDF is currently being generated, if any — not
    // a plain boolean, since either of the two Save PDF buttons can
    // trigger this and only the one actually clicked should show its
    // own "Generating…" state.
    const [generatingLanguage, setGeneratingLanguage] = useState(null);
    const [pdfError, setPdfError] = useState(null);

    const reportRef = useRef(null);
    const mastheadRef = useRef(null);
    const jumpBarRef = useRef(null);

    // Publishes the masthead's actual rendered height as a CSS custom
    // property (rather than a guessed pixel value) so every section
    // title below can pin its own `top` right under it — stays correct
    // across a language switch (the Telugu name/facts line can wrap
    // differently) and window resizing, both of which change this
    // height without necessarily unmounting anything.
    useEffect(() => {

        const mastheadEl = mastheadRef.current;
        const reportEl = reportRef.current;

        if (!mastheadEl || !reportEl) {
            return undefined;
        }

        // ResizeObserver's own contentRect excludes padding/border —
        // re-measuring via offsetHeight instead gets the full border-box
        // height, i.e. the masthead's true occupied space (padding and
        // its bottom border included), which is what section titles
        // actually need to clear.
        const jumpBarEl = jumpBarRef.current;

        // The jump bar pins right under the masthead, so section
        // titles must clear BOTH — their combined height is what is
        // published.
        const publish = () => {
            const total = mastheadEl.offsetHeight + (jumpBarEl ? jumpBarEl.offsetHeight : 0);
            reportEl.style.setProperty("--masthead-height", `${total}px`);
            reportEl.style.setProperty("--jumpbar-top", `${mastheadEl.offsetHeight}px`);
        };

        const observer = new ResizeObserver(publish);

        observer.observe(mastheadEl);

        if (jumpBarEl) {
            observer.observe(jumpBarEl);
        }

        return () => observer.disconnect();

    }, [values, kundaliDocument]);

    if (!values || !kundaliDocument) {
        return null;
    }

    const fullName = [values.firstName, values.lastName]
        .filter(Boolean)
        .join(" ");

    const natureByGraha = buildNatureByGraha(kundaliDocument);

    // At-a-glance facts for the profile header.
    const lagna = kundaliDocument.janmaChart?.lagna;
    const lagnaRasi = lagna ? rasiForLongitude(lagna.longitude) : null;

    let moon = null;

    (kundaliDocument.janmaChart?.cells ?? []).forEach((cell) => {
        (cell.grahas || []).forEach((graha) => {
            if (graha.code === "MOON") {
                moon = graha;
            }
        });
    });

    const moonRasi = moon ? rasiForLongitude(moon.longitude) : null;
    const pick = (rasi) => (rasi ? (language === "te" ? rasi.tel : rasi.en) : null);

    const runningChain = resolveCurrentDashaChain(kundaliDocument.dasha, values.timezone);
    const runningMaha = runningChain?.mahadasha;
    const runningAntar = runningChain?.antardasha;

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
    const handleSavePdf = async (language) => {

        setPdfError(null);
        setGeneratingLanguage(language);

        // Opened synchronously, before the await below — browsers
        // only allow window.open() without a popup-blocker prompt
        // when it's a direct result of the click, not after an
        // async gap.
        const previewTab = window.open("", "_blank");

        try {

            const blob = await PersonService.downloadPdf(personId, language);
            const url = URL.createObjectURL(blob);

            if (previewTab) {
                previewTab.location.href = url;
            } else {
                // Popup blocked — fall back to a direct download
                // instead of silently losing the generated PDF.
                const link = document.createElement("a");
                link.href = url;
                link.download = `${fullName || "horoscope"}-${language}.pdf`;
                link.click();
            }

        } catch (error) {
            previewTab?.close();
            setPdfError(error.message || "Failed to generate PDF.");
        } finally {
            setGeneratingLanguage(null);
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
        <div className="horoscope-report" ref={reportRef}>

            <div className="horoscope-report__masthead" ref={mastheadRef}>
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
                    <div className="horoscope-report__save-pdf-buttons">
                        {onEdit && (
                            <Button variant="secondary" onClick={onEdit}>
                                {t("kundali.reportNav.edit")}
                            </Button>
                        )}
                        <Button
                            variant="primary"
                            onClick={() => handleSavePdf("te")}
                            disabled={Boolean(generatingLanguage) || !personId}
                        >
                            {generatingLanguage === "te" ? "Generating…" : "Save PDF (Telugu)"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleSavePdf("en")}
                            disabled={Boolean(generatingLanguage) || !personId}
                        >
                            {generatingLanguage === "en" ? "Generating…" : "Save PDF (English)"}
                        </Button>
                    </div>
                    {pdfError && (
                        <div className="horoscope-report__pdf-error">{pdfError}</div>
                    )}
                </div>
            </div>

            <div className="horoscope-report__keyfacts no-print">
                {lagnaRasi && (
                    <div className="keyfact">
                        <span className="keyfact__label">{t("kundali.reportNav.lagna")}</span>
                        <span className="keyfact__value">{pick(lagnaRasi)}</span>
                    </div>
                )}

                {moonRasi && (
                    <div className="keyfact">
                        <span className="keyfact__label">{t("kundali.reportNav.moon")}</span>
                        <span className="keyfact__value">
                            {pick(moonRasi)}
                            {moon?.nakshatra && (
                                <span className="keyfact__sub">
                                    {" · "}
                                    {language === "te" ? moon.nakshatra.teluguName : moon.nakshatra.englishName}
                                    {moon.pada ? ` - ${moon.pada}` : ""}
                                </span>
                            )}
                        </span>
                    </div>
                )}

                {runningMaha && (
                    <div className="keyfact keyfact--wide">
                        <span className="keyfact__label">{t("kundali.reportNav.running")}</span>
                        <span className="keyfact__value">
                            <NatureMark nature={(natureByGraha[runningMaha.graha] ?? "").toLowerCase()} />
                            {grahaName(runningMaha.graha, language)}
                            {runningAntar && (
                                <>
                                    <span className="keyfact__sep">›</span>
                                    <NatureMark nature={(natureByGraha[runningAntar.graha] ?? "").toLowerCase()} />
                                    {grahaName(runningAntar.graha, language)}
                                </>
                            )}
                        </span>
                    </div>
                )}
            </div>

            <ReportJumpBar reportRef={reportRef} barRef={jumpBarRef} />

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
                dateOfDeath={values.dateOfDeath}
                timeOfDeath={values.timeOfDeath}
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
