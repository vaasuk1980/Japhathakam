class PlanetPosition {

    constructor({
        planet,
        longitude,
        latitude,
        distance,
        longitudeSpeed,
        latitudeSpeed,
        distanceSpeed
    }) {

        this.planet = planet;

        this.longitude = longitude;
        this.latitude = latitude;
        this.distance = distance;

        this.longitudeSpeed = longitudeSpeed;
        this.latitudeSpeed = latitudeSpeed;
        this.distanceSpeed = distanceSpeed;

    }

}

export default PlanetPosition;