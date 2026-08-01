import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";

import "./ReportInvocation.css";

/**
 * The "ఓం నమః శివాయ" / guru blessing / identity block now lives in
 * the PDF's real repeating header instead (see
 * backend/src/services/HoroscopePdfService.js, which reads
 * .report-invocation__identity-name/-facts straight out of this
 * DOM via Puppeteer) — window.print()/Ctrl+P can't repeat a header
 * per page at all, so there's no in-flow fallback rendering for it
 * any more. This markup stays in the document (always
 * display:none, see ReportInvocation.css) purely as that
 * extraction source, so the header text never has to be
 * recomputed/duplicated server-side. Only the invocatory couplet
 * below is still real, visible page-1 print content.
 */
function ReportInvocation({ fullName, dateOfBirth, timeOfBirth, placeOfBirth, genderLabel, age }) {

    return (
        <div className="report-invocation">

            <div className="report-invocation__header-source">

                <div className="report-invocation__shivaya">ఓం నమః శివాయ</div>

                <div className="report-invocation__blessing">
                    శ్రీ శ్రీ శ్రీ ఆచార్య ప్రబోధానంద యోగీశ్వరులవారి దివ్య ఆశీస్సులతో
                </div>

                <div className="report-invocation__identity">
                    <span className="report-invocation__identity-name">{fullName || "—"}</span>
                    <span className="report-invocation__identity-facts">
                        {formatDateDDMMYYYY(dateOfBirth)}
                        <span className="report-invocation__dot">•</span>
                        {timeOfBirth}
                        <span className="report-invocation__dot">•</span>
                        {placeOfBirth}
                        <span className="report-invocation__dot">•</span>
                        {genderLabel}
                        {age && (
                            <>
                                <span className="report-invocation__dot">•</span>
                                {age}
                            </>
                        )}
                    </span>
                </div>

            </div>

            {/* Traditional invocatory couplet about the horoscope
                itself — "జాఫథకా" here is the generic/regional word
                for a horoscope (the same root the app's own name
                comes from), not a borrowed brand term, so it stays
                as-is rather than being swapped for anything else. */}
            <div className="report-invocation__shloka">
                <div>జననీ జన్మ సౌఖ్యానాం వర్ధనీ కులసంపదామ్ ।</div>
                <div>పదవీం పూర్వపుణ్యానాం లిఖ్యతే జాఫథకా ॥</div>
            </div>

        </div>
    );

}

export default ReportInvocation;
