/* ==========================================================
   Sitara Jatakam — Sample Reference Data
   ----------------------------------------------------------
   Static sample payload used by the Sitara Jatakam reference
   page. Mirrors the shape of the original spreadsheet-derived
   report (hero facts, panchanga, chart, graha positions,
   dasha timeline, phalabhaga).
========================================================== */

export const heroInfo = {
    title: "సితార జాఫతకం",
    subtitle: "పుట్టిన తేదీ, సమయం మరియు స్థలం ఆధారంగా రూపొందించిన జాతక వివరాలు",
    facts: [
        { label: "జననం", value: "15 మార్చి 2025, 00:54 (శనివారం)" },
        { label: "లగ్నం", value: "వృశ్చికం (Scorpio)" },
        { label: "నక్షత్రం", value: "హస్త, 1వ పాదం" },
        { label: "రాశి", value: "కన్య (Virgo Moon)" },
        { label: "సంవత్సరం", value: "విశ్వావసు" },
    ],
};

export const panchangaCells = [
    { label: "Vara · వారం", value: "శనివారం" },
    { label: "Masam · మాసం", value: "ఫాల్గుణ" },
    { label: "Paksham · పక్షం", value: "కృష్ణ పక్షం" },
    { label: "Thidhi · తిథి", value: "పాడ్యమి" },
    { label: "Ayanam · అయనం", value: "ఉత్తరాయణం" },
    { label: "Samvatsara", value: "విశ్వావసు" },
    { label: "Nakshatra Span", value: "14-Mar 20:24 – 15-Mar 23:15", mono: true },
    { label: "Gender · లింగం", value: "స్త్రీ (Female)" },
];

export const planets = [
    { key: "lagna", name: "లగ్నం", en: "Ascendant", deg: "10° 16' 44\"", nak: "అనూరాధ", pada: 3, rasi: "వృశ్చికం", bhava: "—", isLagna: true },
    { key: "ravi", name: "రవి", en: "Sun", deg: "00° 46' 13\"", nak: "పూర్వాభాద్ర", pada: 4, rasi: "మీనం", bhava: "5-విద్యా" },
    { key: "chandra", name: "చంద్ర", en: "Moon", deg: "12° 14' 27\"", nak: "హస్త", pada: 1, rasi: "కన్య", bhava: "11-లాభ" },
    { key: "kuja", name: "కుజ", en: "Mars", deg: "24° 53' 57\"", nak: "పునర్వసు", pada: 2, rasi: "మిథునం", bhava: "8-ఆయు" },
    { key: "budha", name: "బుధ", en: "Mercury", deg: "15° 22' 46\"", nak: "ఉత్తరాభాద్ర", pada: 4, rasi: "మీనం", bhava: "5-విద్యా" },
    { key: "guru", name: "గురు", en: "Jupiter", deg: "19° 29' 01\"", nak: "రోహిణి", pada: 3, rasi: "వృషభం", bhava: "7-కళత్ర" },
    { key: "shukra", name: "శుక్ర", en: "Venus", deg: "13° 01' 03\"", nak: "ఉత్తరాభాద్ర", pada: 3, rasi: "మీనం", bhava: "5-విద్యా" },
    { key: "shani", name: "శని", en: "Saturn", deg: "28° 14' 38\"", nak: "పూర్వాభాద్ర", pada: 3, rasi: "కుంభం", bhava: "4-మాతృ" },
    { key: "rahu", name: "రాహు", en: "Rahu", deg: "03° 24' 18\"", nak: "ఉత్తరాభాద్ర", pada: 1, rasi: "మీనం", bhava: "5-విద్యా" },
    { key: "ketu", name: "కేతు", en: "Ketu", deg: "03° 24' 18\"", nak: "ఉత్తర ఫల్గుణి", pada: 3, rasi: "కన్య", bhava: "11-లాభ" },
    { key: "bhumi", name: "భూమి", en: "Bhumi (upagraha)", deg: "00° 46' 13\"", nak: "ఉత్తర ఫల్గుణి", pada: 2, rasi: "కన్య", bhava: "11-లాభ" },
    { key: "mitra", name: "మిత్ర", en: "Mitra (upagraha)", deg: "06° 44' 18\"", nak: "ఉత్తర ఫల్గుణి", pada: 4, rasi: "కన్య", bhava: "11-లాభ" },
    { key: "chitra", name: "చిత్ర", en: "Chitra (upagraha)", deg: "06° 44' 18\"", nak: "ఉత్తరాభాద్ర", pada: 2, rasi: "మీనం", bhava: "5-విద్యా" },
];

/* South Indian fixed-sign 4x4 grid layout order (row-major, clockwise from top-left).
   `null` marks the 2x2 centre block reserved for the title card. */
export const gridLayout = [
    { tel: "మీనం", en: "Pisces" }, { tel: "మేషం", en: "Aries" }, { tel: "వృషభం", en: "Taurus" }, { tel: "మిథునం", en: "Gemini" },
    { tel: "కుంభం", en: "Aquarius" }, null, null, { tel: "కర్కాటకం", en: "Cancer" },
    { tel: "మకరం", en: "Capricorn" }, null, null, { tel: "సింహం", en: "Leo" },
    { tel: "ధనుస్సు", en: "Sagittarius" }, { tel: "వృశ్చికం", en: "Scorpio" }, { tel: "తుల", en: "Libra" }, { tel: "కన్య", en: "Virgo" },
];

export const lagnaRasi = "వృశ్చికం";

export const currentDasha = {
    tag: "ప్రస్తుతం నడుస్తున్నది · Currently Running",
    title: "భూమి మహాదశ – బుధ భుక్తి",
    range: "29-Oct-2025 – 28-Nov-2026",
    daysElapsed: 269,
    daysTotal: 395,
    percentComplete: 68,
};

export const dashaBhuktis = [
    { name: "భూమి / భూమి", range: "జననం నాటికి పూర్తయింది", current: false },
    { name: "భూమి / శని", range: "– 29-Oct-2025", current: false },
    { name: "భూమి / బుధ", range: "29-Oct-2025 – 28-Nov-2026", current: true },
    { name: "భూమి / కేతు", range: "28-Nov-2026 – 28-Aug-2027", current: false },
    { name: "భూమి / శుక్ర", range: "28-Aug-2027 – 21-Jan-2029", current: false },
    { name: "భూమి / మిత్ర", range: "21-Jan-2029 – 21-Oct-2029", current: false },
];

export const phalabhagaCards = [
    { label: "Colors · రంగులు", value: "గోధుమ రంగు, తెలుపు, నలుపు, సిమెంటు రంగు, వెండి రంగు, లేత పసుపు" },
    { label: "Gemstones · రత్నాలు", value: "గోమేధికం, ముత్యం, పగడం, పుష్యరాగం, వైడూర్యం, నల్ల రాయి" },
    { label: "Directions · దిక్కులు", value: "తూర్పు, దక్షిణ, వాయువ్య, ఈశాన్య దిశలు" },
    { label: "Lagna Lord · లగ్నాధిపతి", value: "బుధ (Mercury rules Vrischika Lagna in this scheme)" },
];

export const footerNote =
    "ఈ పేజీ మీరు అందించిన Excel జాతక ఫైల్‌ని పంచాంగం, గ్రహస్థితి మరియు దశా గణాంకాల ఆధారంగా రూపొందించబడింది. ఇది సాంప్రదాయ జ్యోతిష సమాచారం మాత్రమే — వృత్తిపరమైన సలహా కాదు.";
