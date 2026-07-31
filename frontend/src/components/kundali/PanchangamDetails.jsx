import { useMemo } from "react";

import { computeTithi, computeVara, computeAyana } from "../../kundali/utils/panchangamMath";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";

import "./PanchangamDetails.css";

const RASI_NAMES = [
    "మేషం", "వృషభం", "మిథునం", "కర్కాటకం",
    "సింహం", "కన్య", "తుల", "వృశ్చికం",
    "ధనుస్సు", "మకరం", "కుంభం", "మీనం",
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

    const rows = useMemo(() => {

        const sun = findGraha(kundaliDocument, "SUN");
        const moon = findGraha(kundaliDocument, "MOON");
        const lagna = kundaliDocument?.janmaChart?.lagna;

        const tithi = sun && moon
            ? computeTithi(sun.longitude, moon.longitude)
            : null;

        const ayana = sun ? computeAyana(sun.longitude) : "—";

        const lagnamu = lagna
            ? RASI_NAMES[signIndexForLongitude(lagna.longitude)]
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
            { label: "Nakshatram", value: moon?.nakshatra?.teluguName ?? "—" },
            { label: "Lagnamu", value: lagnamu },
            { label: "Day", value: computeVara(dateOfBirth) },
            { label: "సమయము", value: timeOfBirth || "—" },
            { label: "Gender", value: GENDER_LABELS[gender] ?? gender ?? "—" },
        ];

    }, [kundaliDocument, dateOfBirth, timeOfBirth, gender]);

    return (
        <section className="pd-table-section">
            <h2 className="pd-table-title">పంచాంగం · Panchangam Details</h2>

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
