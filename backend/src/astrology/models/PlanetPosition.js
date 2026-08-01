import GrahasWithVariableDirection from "../constants/GrahasWithVariableDirection.js";

class PlanetPosition {

    constructor({
        planet,

        longitude,
        latitude,
        distance,

        longitudeSpeed,
        latitudeSpeed,
        distanceSpeed,

        lagna = null,
        sthana = null,

        nakshatra = null,
        pada = null

    }) {

        this.planet = planet;

        this.longitude = longitude;
        this.latitude = latitude;
        this.distance = distance;

        this.longitudeSpeed = longitudeSpeed;
        this.latitudeSpeed = latitudeSpeed;
        this.distanceSpeed = distanceSpeed;

        this.lagna = lagna;
        this.sthana = sthana;

        this.nakshatra = nakshatra;
        this.pada = pada;

        // Only the 5 classical planets whose direction actually
        // varies are ever marked retrograde — Rahu/Ketu/Bhumi/Mitra/
        // Chitra always carry a negative-signed speed (they mirror a
        // node or the Sun), so flagging them here would just restate
        // a constant fact rather than a finding.
        this.isRetrograde =
            GrahasWithVariableDirection.has(planet) && longitudeSpeed < 0;

        Object.freeze(this);

    }

}

export default PlanetPosition;