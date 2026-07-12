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

        Object.freeze(this);

    }

}

export default PlanetPosition;