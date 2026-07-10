import swisseph from "@swisseph/node";

const SupportedGrahas = [

    {
        code: "SUN",
        swissPlanet: swisseph.Planet.Sun
    },

    {
        code: "MOON",
        swissPlanet: swisseph.Planet.Moon
    },

    {
        code: "MERCURY",
        swissPlanet: swisseph.Planet.Mercury
    },

    {
        code: "VENUS",
        swissPlanet: swisseph.Planet.Venus
    },

    {
        code: "MARS",
        swissPlanet: swisseph.Planet.Mars
    },

    {
        code: "JUPITER",
        swissPlanet: swisseph.Planet.Jupiter
    },

    {
        code: "SATURN",
        swissPlanet: swisseph.Planet.Saturn
    },

    {
        code: "RAHU",
        swissPlanet: swisseph.LunarPoint.MeanNode
    },

    {
        code: "KETU",
        swissPlanet: null
    }

];

export default SupportedGrahas;