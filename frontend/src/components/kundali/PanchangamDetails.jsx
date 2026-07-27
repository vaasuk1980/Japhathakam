import { useMemo } from "react";

import "./PanchangamDetails.css";

const RASI_NAMES = [
    "మేషం", "వృషభం", "మిథునం", "కర్కాటకం",
    "సింహం", "కన్య", "తుల", "వృశ్చికం",
    "ధనుస్సు", "మకరం", "కుంభం", "మీనం",
];

const VARA_NAMES = [
    "ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం",
    "గురువారం", "శుక్రవారం", "శనివారం",
];

const TITHI_NAMES = [
    "పాడ్యమి", "విదియ", "తదియ", "చవితి", "పంచమి",
    "షష్ఠి", "సప్తమి", "అష్టమి", "నవమి", "దశమి",
    "ఏకాదశి", "ద్వాదశి", "త్రయోదశి", "చతుర్దశి",
];

const GENDER_LABELS = {
    male: "Male",
    female: "Female",
    other: "Transgender",
};

function formatDateDDMMYYYY(isoDate) {

    if (!isoDate) {
        return "—";
    }

    const [year, month, day] = isoDate.split("-");

    return `${day}-${month}-${year}`;

}

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

function computeTithi(sunLongitude, moonLongitude) {

    const diff = ((moonLongitude - sunLongitude) % 360 + 360) % 360;
    const tithiIndex = Math.floor(diff / 12); // 0-29

    const paksha = tithiIndex < 15 ? "శుక్ల పక్షం" : "కృష్ణ పక్షం";
    const dayInPaksha = tithiIndex % 15; // 0-14

    const name = dayInPaksha === 14
        ? (tithiIndex < 15 ? "పౌర్ణమి" : "అమావాస్య")
        : TITHI_NAMES[dayInPaksha];

    return { paksha, name };

}

function computeAyana(sunLongitude) {
    const signIndex = signIndexForLongitude(sunLongitude);
    // Makara (9) through Mithuna (2), wrapping: Uttarayana.
    const isUttarayana = signIndex >= 9 || signIndex <= 2;
    return isUttarayana ? "ఉత్తరాయణం" : "దక్షిణాయనం";
}

function computeVara(dateOfBirth) {

    if (!dateOfBirth) {
        return "—";
    }

    const [year, month, day] = dateOfBirth.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return VARA_NAMES[date.getDay()];

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
