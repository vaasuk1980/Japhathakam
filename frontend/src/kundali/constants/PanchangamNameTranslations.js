/**
 * Masa (lunar month) and Samvatsara (60-year cycle) names are computed
 * server-side (see backend/src/astrology/constants/MasaRegistry.js and
 * SamvatsaraRegistry.js) and sent down as Telugu-only strings — unlike
 * Nakshatra/Rasi, which already carry both languages from the backend.
 * These lookup tables translate those fixed, known-in-advance name sets
 * for display, without needing an API/contract change for what's purely
 * a presentation concern. Keys are copied verbatim from the registries
 * above; do not reorder — lookup is by name, not by index.
 */

const MASA_EN = {
    "చైత్రం": "Chaitra",
    "వైశాఖం": "Vaishakha",
    "జ్యేష్ఠం": "Jyeshtha",
    "ఆషాఢం": "Ashadha",
    "శ్రావణం": "Shravana",
    "భాద్రపదం": "Bhadrapada",
    "ఆశ్వయుజం": "Ashwayuja",
    "కార్తీకం": "Karthika",
    "మార్గశిరం": "Margashira",
    "పుష్యం": "Pushya",
    "మాఘం": "Magha",
    "ఫాల్గుణం": "Phalguna",
};

const SAMVATSARA_EN = {
    "ప్రభవ": "Prabhava",
    "విభవ": "Vibhava",
    "శుక్ల": "Shukla",
    "ప్రమోదూత": "Pramoduta",
    "ప్రజోత్పత్తి": "Prajotpatti",
    "ఆంగీరస": "Angirasa",
    "శ్రీముఖ": "Shrimukha",
    "భావ": "Bhava",
    "యువ": "Yuva",
    "ధాత": "Dhata",
    "ఈశ్వర": "Ishvara",
    "బహుధాన్య": "Bahudhanya",
    "ప్రమాది": "Pramadi",
    "విక్రమ": "Vikrama",
    "వృష": "Vrisha",
    "చిత్రభాను": "Chitrabhanu",
    "స్వభాను": "Svabhanu",
    "తారణ": "Tarana",
    "పార్థివ": "Parthiva",
    "వ్యయ": "Vyaya",
    "సర్వజిత్": "Sarvajit",
    "సర్వధారి": "Sarvadhari",
    "విరోధి": "Virodhi",
    "వికృతి": "Vikruti",
    "ఖర": "Khara",
    "నందన": "Nandana",
    "విజయ": "Vijaya",
    "జయ": "Jaya",
    "మన్మథ": "Manmatha",
    "దుర్ముఖి": "Durmukhi",
    "హేవిళంబి": "Hevilambi",
    "విళంబి": "Vilambi",
    "వికారి": "Vikari",
    "శార్వరి": "Sharvari",
    "ప్లవ": "Plava",
    "శుభకృత్": "Shubhakrit",
    "శోభకృత్": "Shobhakrit",
    "క్రోధి": "Krodhi",
    "విశ్వావసు": "Vishvavasu",
    "పరాభవ": "Parabhava",
    "ప్లవంగ": "Plavanga",
    "కీలక": "Kilaka",
    "సౌమ్య": "Saumya",
    "సాధారణ": "Sadharana",
    "విరోధికృత్": "Virodhikrit",
    "పరిధావి": "Paridhavi",
    "ప్రమాదీచ": "Pramadicha",
    "ఆనంద": "Ananda",
    "రాక్షస": "Rakshasa",
    "నల": "Nala",
    "పింగళ": "Pingala",
    "కాళయుక్తి": "Kalayukti",
    "సిద్ధార్థి": "Siddharthi",
    "రౌద్రి": "Raudri",
    "దుర్మతి": "Durmati",
    "దుందుభి": "Dundubhi",
    "రుధిరోద్గారి": "Rudhirodgari",
    "రక్తాక్షి": "Raktakshi",
    "క్రోధన": "Krodhana",
    "అక్షయ": "Akshaya",
};

/**
 * Bilingual masa string, "Adhika "/"అధిక " prefix included — mirrors the
 * { en, te } shape of computeAyana/computeVara/computeTithi so every
 * Panchangam consumer selects its display language the same way.
 *
 * @param {string} masaName - Telugu masa name, as sent by the backend.
 * @param {boolean} isLeap - Adhika (intercalary) month flag.
 */
export function translateMasa(masaName, isLeap) {

    if (!masaName) {
        return null;
    }

    return {
        en: `${isLeap ? "Adhika " : ""}${MASA_EN[masaName] ?? masaName}`,
        te: `${isLeap ? "అధిక " : ""}${masaName}`,
    };

}

/**
 * @param {string} samvatsaraName - Telugu samvatsara name, as sent by the backend.
 */
export function translateSamvatsara(samvatsaraName) {

    if (!samvatsaraName) {
        return null;
    }

    return {
        en: SAMVATSARA_EN[samvatsaraName] ?? samvatsaraName,
        te: samvatsaraName,
    };

}
