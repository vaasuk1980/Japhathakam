import { useMemo } from "react";

import computeBirthFacts from "../../kundali/utils/computeBirthFacts";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

import "./PanchangamDetails.css";

const GENDER_LABELS = {
    male: { en: "Male", te: "పురుషుడు" },
    female: { en: "Female", te: "స్త్రీ" },
    other: { en: "Transgender", te: "లింగమార్పిడి" },
};

function PanchangamDetails({ kundaliDocument, dateOfBirth, timeOfBirth, gender }) {

    const { t, language } = useTranslation();

    const rows = useMemo(() => {

        const facts = computeBirthFacts(kundaliDocument, dateOfBirth);
        const pick = (bilingual) => (bilingual ? (language === "te" ? bilingual.te : bilingual.en) : "—");

        const lagnamu = facts.lagnaRasi
            ? (language === "te" ? facts.lagnaRasi.tel : facts.lagnaRasi.en)
            : "—";

        const nakshatram = facts.nakshatra
            ? `${language === "te" ? facts.nakshatra.teluguName : facts.nakshatra.englishName}-${facts.pada ?? "—"}`
            : "—";

        const genderLabel = GENDER_LABELS[gender]
            ? pick(GENDER_LABELS[gender])
            : (gender ?? "—");

        return [
            { label: t("kundali.panchangamGrid.dob"), value: formatDateDDMMYYYY(dateOfBirth) },
            { label: t("kundali.panchangamGrid.tob"), value: timeOfBirth || "—" },
            { label: t("kundali.panchangamGrid.nakshatraStart"), value: facts.nakshatraStart ?? "—" },
            { label: t("kundali.panchangamGrid.nakshatraEnd"), value: facts.nakshatraEnd ?? "—" },
            { label: t("kundali.panchangamGrid.year"), value: pick(facts.samvatsaraName) },
            { label: t("kundali.panchangamGrid.ayan"), value: pick(facts.ayana) },
            { label: t("kundali.panchangamGrid.masam"), value: pick(facts.masam) },
            { label: t("kundali.panchangamGrid.paksham"), value: pick(facts.tithi?.paksha) },
            { label: t("kundali.panchangamGrid.thidhi"), value: pick(facts.tithi?.name) },
            { label: t("kundali.panchangamGrid.nakshatram"), value: nakshatram ?? "—" },
            { label: t("kundali.panchangamGrid.lagnamu"), value: lagnamu },
            { label: t("kundali.panchangamGrid.day"), value: pick(facts.vara) },
            { label: t("kundali.panchangamGrid.time"), value: timeOfBirth || "—" },
            { label: t("kundali.panchangamGrid.gender"), value: genderLabel },
        ];

    }, [kundaliDocument, dateOfBirth, timeOfBirth, gender, language, t]);

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
