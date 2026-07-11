import Nakshatra from "../models/Nakshatra.js";
import { NAKSHATRA_SPAN } from "./NakshatraConstants.js";

const NakshatraRegistry = Object.freeze([

    new Nakshatra("ASHWINI", "Ashwini", "అశ్విని", 1, 0 * NAKSHATRA_SPAN, 1 * NAKSHATRA_SPAN),
    new Nakshatra("BHARANI", "Bharani", "భరణి", 2, 1 * NAKSHATRA_SPAN, 2 * NAKSHATRA_SPAN),
    new Nakshatra("KRITTIKA", "Krittika", "కృత్తిక", 3, 2 * NAKSHATRA_SPAN, 3 * NAKSHATRA_SPAN),
    new Nakshatra("ROHINI", "Rohini", "రోహిణి", 4, 3 * NAKSHATRA_SPAN, 4 * NAKSHATRA_SPAN),
    new Nakshatra("MRIGASHIRA", "Mrigashira", "మృగశిర", 5, 4 * NAKSHATRA_SPAN, 5 * NAKSHATRA_SPAN),
    new Nakshatra("ARDRA", "Ardra", "ఆరుద్ర", 6, 5 * NAKSHATRA_SPAN, 6 * NAKSHATRA_SPAN),
    new Nakshatra("PUNARVASU", "Punarvasu", "పునర్వసు", 7, 6 * NAKSHATRA_SPAN, 7 * NAKSHATRA_SPAN),
    new Nakshatra("PUSHYA", "Pushya", "పుష్యమి", 8, 7 * NAKSHATRA_SPAN, 8 * NAKSHATRA_SPAN),
    new Nakshatra("ASHLESHA", "Ashlesha", "ఆశ్లేష", 9, 8 * NAKSHATRA_SPAN, 9 * NAKSHATRA_SPAN),
    new Nakshatra("MAGHA", "Magha", "మఖ", 10, 9 * NAKSHATRA_SPAN, 10 * NAKSHATRA_SPAN),
    new Nakshatra("PURVA_PHALGUNI", "Purva Phalguni", "పూర్వ ఫల్గుణి", 11, 10 * NAKSHATRA_SPAN, 11 * NAKSHATRA_SPAN),
    new Nakshatra("UTTARA_PHALGUNI", "Uttara Phalguni", "ఉత్తర ఫల్గుణి", 12, 11 * NAKSHATRA_SPAN, 12 * NAKSHATRA_SPAN),
    new Nakshatra("HASTA", "Hasta", "హస్త", 13, 12 * NAKSHATRA_SPAN, 13 * NAKSHATRA_SPAN),
    new Nakshatra("CHITRA", "Chitra", "చిత్త", 14, 13 * NAKSHATRA_SPAN, 14 * NAKSHATRA_SPAN),
    new Nakshatra("SWATI", "Swati", "స్వాతి", 15, 14 * NAKSHATRA_SPAN, 15 * NAKSHATRA_SPAN),
    new Nakshatra("VISHAKHA", "Vishakha", "విశాఖ", 16, 15 * NAKSHATRA_SPAN, 16 * NAKSHATRA_SPAN),
    new Nakshatra("ANURADHA", "Anuradha", "అనూరాధ", 17, 16 * NAKSHATRA_SPAN, 17 * NAKSHATRA_SPAN),
    new Nakshatra("JYESHTHA", "Jyeshtha", "జ్యేష్ఠ", 18, 17 * NAKSHATRA_SPAN, 18 * NAKSHATRA_SPAN),
    new Nakshatra("MULA", "Mula", "మూల", 19, 18 * NAKSHATRA_SPAN, 19 * NAKSHATRA_SPAN),
    new Nakshatra("PURVA_ASHADHA", "Purva Ashadha", "పూర్వాషాఢ", 20, 19 * NAKSHATRA_SPAN, 20 * NAKSHATRA_SPAN),
    new Nakshatra("UTTARA_ASHADHA", "Uttara Ashadha", "ఉత్తరాషాఢ", 21, 20 * NAKSHATRA_SPAN, 21 * NAKSHATRA_SPAN),
    new Nakshatra("SHRAVANA", "Shravana", "శ్రవణం", 22, 21 * NAKSHATRA_SPAN, 22 * NAKSHATRA_SPAN),
    new Nakshatra("DHANISHTHA", "Dhanishtha", "ధనిష్ఠ", 23, 22 * NAKSHATRA_SPAN, 23 * NAKSHATRA_SPAN),
    new Nakshatra("SHATABHISHA", "Shatabhisha", "శతభిషం", 24, 23 * NAKSHATRA_SPAN, 24 * NAKSHATRA_SPAN),
    new Nakshatra("PURVA_BHADRAPADA", "Purva Bhadrapada", "పూర్వాభాద్ర", 25, 24 * NAKSHATRA_SPAN, 25 * NAKSHATRA_SPAN),
    new Nakshatra("UTTARA_BHADRAPADA", "Uttara Bhadrapada", "ఉత్తరాభాద్ర", 26, 25 * NAKSHATRA_SPAN, 26 * NAKSHATRA_SPAN),
    new Nakshatra("REVATI", "Revati", "రేవతి", 27, 26 * NAKSHATRA_SPAN, 27 * NAKSHATRA_SPAN)

]);

export default NakshatraRegistry;