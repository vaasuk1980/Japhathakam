/**
 * ============================================================================
 * JAPHATHAKAM
 * ============================================================================
 * Module      : Astrology Constants
 * File        : Sthanas.js
 * Description : Supported Karma Chakra Sthanas
 *
 * This file is the Single Source of Truth for all supported Sthanas.
 * It contains only immutable domain definitions.
 *
 * Sprint      : 8.0 - Sthana Engine
 * Status      : FROZEN
 * ============================================================================
 */

export const SupportedSthanas = Object.freeze([
    Object.freeze({
        id: "TANU",
        number: 1,
        englishName: "Tanu",
        teluguName: "తను"
    }),

    Object.freeze({
        id: "DHANA",
        number: 2,
        englishName: "Dhana",
        teluguName: "ధన"
    }),

    Object.freeze({
        id: "SODARA",
        number: 3,
        englishName: "Sodara",
        teluguName: "సోదర"
    }),

    Object.freeze({
        id: "MATRU",
        number: 4,
        englishName: "Matru",
        teluguName: "మాతృ"
    }),

    Object.freeze({
        id: "VIDYA",
        number: 5,
        englishName: "Vidya",
        teluguName: "విద్యా"
    }),

    Object.freeze({
        id: "SHATRU",
        number: 6,
        englishName: "Shatru",
        teluguName: "శత్రు"
    }),

    Object.freeze({
        id: "KALATRA",
        number: 7,
        englishName: "Kalatra",
        teluguName: "కళత్ర"
    }),

    Object.freeze({
        id: "AYU",
        number: 8,
        englishName: "Ayu",
        teluguName: "ఆయు"
    }),

    Object.freeze({
        id: "BHAGYA",
        number: 9,
        englishName: "Bhagya",
        teluguName: "భాగ్య"
    }),

    Object.freeze({
        id: "RAJYA",
        number: 10,
        englishName: "Rajya",
        teluguName: "రాజ్య"
    }),

    Object.freeze({
        id: "LABHA",
        number: 11,
        englishName: "Labha",
        teluguName: "లాభ"
    }),

    Object.freeze({
        id: "VYAYA",
        number: 12,
        englishName: "Vyaya",
        teluguName: "వ్యయ"
    })
]);

Object.freeze(SupportedSthanas);

export default SupportedSthanas;