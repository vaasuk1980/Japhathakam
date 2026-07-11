class PlanetPosition {

    constructor({
        planet,
        longitude,
        latitude,
        distance,
        longitudeSpeed,
        latitudeSpeed,
        distanceSpeed,
        nakshatra = null
    }) {

        this.planet = planet;

        this.longitude = longitude;
        this.latitude = latitude;
        this.distance = distance;

        this.longitudeSpeed = longitudeSpeed;
        this.latitudeSpeed = latitudeSpeed;
        this.distanceSpeed = distanceSpeed;

        this.nakshatra = nakshatra;

    }

}

export default PlanetPosition;