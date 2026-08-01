import { useMemo } from "react";

import computeBirthFacts from "../../kundali/utils/computeBirthFacts";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

import "./PanchangamDetails.css";

const GENDER_LABELS = {
    male: "Male",
    female: "Female",
    other: "Transgender",
};

function PanchangamDetails({ kundaliDocument, dateOfBirth, timeOfBirth, gender }) {

    const { t, language } = useTranslation();

    const rows = useMemo(() => {

        const facts = computeBirthFacts(kundaliDocument, dateOfBirth);

        const lagnamu = facts.lagnaRasi
            ? (language === "te" ? facts.lagnaRasi.tel : facts.lagnaRasi.en)
            : "—";

        const nakshatram = facts.nakshatra
            ? (language === "te" ? facts.nakshatra.teluguName : facts.nakshatra.englishName)
            : "—";

        return [
            { label: "DOB", value: formatDateDDMMYYYY(dateOfBirth) },
            { label: "TOB", value: timeOfBirth || "—" },
            { label: "Nakshatra Start", value: facts.nakshatraStart ?? "—" },
            { label: "Nakshtra End", value: facts.nakshatraEnd ?? "—" },
            { label: "Year", value: facts.samvatsaraName ?? "—" },
            { label: "Ayan", value: facts.ayana },
            { label: "Masam", value: facts.masam },
            { label: "Paksham", value: facts.tithi?.paksha ?? "—" },
            { label: "Thidhi", value: facts.tithi?.name ?? "—" },
            { label: "Nakshatram", value: nakshatram ?? "—" },
            { label: "Lagnamu", value: lagnamu },
            { label: "Day", value: facts.vara },
            { label: "సమయము", value: timeOfBirth || "—" },
            { label: "Gender", value: GENDER_LABELS[gender] ?? gender ?? "—" },
        ];

    }, [kundaliDocument, dateOfBirth, timeOfBirth, gender, language]);

    return (
        <section className="pd-table-section">
            <h2 className="pd-table-title">{t("kundali.panchangamDetailsTitle")}</h2>

            <div className="pd-grid">
                {rows.map((row) => (
                    <div className="pd-grid__item" key={row.label}>
                        <span className="pd-grid__label">{row.label}</span>
                        <span className="pd-grid__value">{row.value}</span>
                    </div>
                ))}
            </div>
        </section>
    );

}

export default PanchangamDetails;
