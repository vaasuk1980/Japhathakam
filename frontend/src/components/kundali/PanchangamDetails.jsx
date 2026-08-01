import { useMemo } from "react";

import { computeTithi, computeVara, computeAyana } from "../../kundali/utils/panchangamMath";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

import "./PanchangamDetails.css";

const RASI_NAMES = [
    { tel: "మేషం", en: "Aries" },
    { tel: "వృషభం", en: "Taurus" },
    { tel: "మిథునం", en: "Gemini" },
    { tel: "కర్కాటకం", en: "Cancer" },
    { tel: "సింహం", en: "Leo" },
    { tel: "కన్య", en: "Virgo" },
    { tel: "తుల", en: "Libra" },
    { tel: "వృశ్చికం", en: "Scorpio" },
    { tel: "ధనుస్సు", en: "Sagittarius" },
    { tel: "మకరం", en: "Capricorn" },
    { tel: "కుంభం", en: "Aquarius" },
    { tel: "మీనం", en: "Pisces" },
];

const GENDER_LABELS = {
    male: "Male",
    female: "Female",
    other: "Transgender",
};

function signIndexForLongitude(longitude) {
    const normalized = ((longitude % 360) + 360) % 360;
    return Math.floor(normalized / 30);
}

function findGraha(kundaliDocument, code) {
    for (const cell of kundaliDocument?.janmaChart?.cells || []) {
        const graha = cell.grahas.find((item) => item.code === code);
        if (graha) {
            return graha;
        }
    }
    return null;
}

function PanchangamDetails({ kundaliDocument, dateOfBirth, timeOfBirth, gender }) {

    const { t, language } = useTranslation();

    const rows = useMemo(() => {

        const sun = findGraha(kundaliDocument, "SUN");
        const moon = findGraha(kundaliDocument, "MOON");
        const lagna = kundaliDocument?.janmaChart?.lagna;

        const tithi = sun && moon
            ? computeTithi(sun.longitude, moon.longitude)
            : null;

        const ayana = sun ? computeAyana(sun.longitude) : "—";

        const lagnaRasi = lagna
            ? RASI_NAMES[signIndexForLongitude(lagna.longitude)]
            : null;

        const lagnamu = lagnaRasi
            ? (language === "te" ? lagnaRasi.tel : lagnaRasi.en)
            : "—";

        const nakshatram = moon?.nakshatra
            ? (language === "te" ? moon.nakshatra.teluguName : moon.nakshatra.englishName)
            : "—";

        const panchangam = kundaliDocument?.panchangam;

        const masam = panchangam
            ? `${panchangam.masaIsLeap ? "అధిక " : ""}${panchangam.masaName}`
            : "—";

        return [
            { label: "DOB", value: formatDateDDMMYYYY(dateOfBirth) },
            { label: "TOB", value: timeOfBirth || "—" },
            { label: "Nakshatra Start", value: panchangam?.nakshatraStart ?? "—" },
            { label: "Nakshtra End", value: panchangam?.nakshatraEnd ?? "—" },
            { label: "Year", value: panchangam?.samvatsaraName ?? "—" },
            { label: "Ayan", value: ayana },
            { label: "Masam", value: masam },
            { label: "Paksham", value: tithi?.paksha ?? "—" },
            { label: "Thidhi", value: tithi?.name ?? "—" },
            { label: "Nakshatram", value: nakshatram ?? "—" },
            { label: "Lagnamu", value: lagnamu },
            { label: "Day", value: computeVara(dateOfBirth) },
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
