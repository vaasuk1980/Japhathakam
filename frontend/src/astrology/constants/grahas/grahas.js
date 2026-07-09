/* ==========================================================
   JAPHATHAKAM ASTROLOGY ENGINE
   Master Graha Registry

   Defines the master list of grahas supported by the
   astrology engine.

   This file contains only graha identity information.
========================================================== */

const grahas = Object.freeze([

    {
        code: "SUN",
        englishName: "Sun",
        teluguName: "రవి",
        order: 1
    },

    {
        code: "MOON",
        englishName: "Moon",
        teluguName: "చంద్ర",
        order: 2
    },

    {
        code: "MARS",
        englishName: "Mars",
        teluguName: "కుజ",
        order: 3
    },

    {
        code: "MERCURY",
        englishName: "Mercury",
        teluguName: "బుధ",
        order: 4
    },

    {
        code: "JUPITER",
        englishName: "Jupiter",
        teluguName: "గురు",
        order: 5
    },

    {
        code: "VENUS",
        englishName: "Venus",
        teluguName: "శుక్ర",
        order: 6
    },

    {
        code: "SATURN",
        englishName: "Saturn",
        teluguName: "శని",
        order: 7
    },

    {
        code: "RAHU",
        englishName: "Rahu",
        teluguName: "రాహు",
        order: 8
    },

    {
        code: "KETU",
        englishName: "Ketu",
        teluguName: "కేతు",
        order: 9
    },

    {
        code: "EARTH",
        englishName: "Earth",
        teluguName: "భూమి",
        order: 10
    },

    {
        code: "MITRA",
        englishName: "Mitra",
        teluguName: "మిత్ర",
        order: 11
    },

    {
        code: "CHITRA",
        englishName: "Chitra",
        teluguName: "చిత్ర",
        order: 12
    }

]);

export default grahas;