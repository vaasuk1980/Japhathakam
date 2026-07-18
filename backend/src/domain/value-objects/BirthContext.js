export default class BirthContext {
  constructor({
    date,
    time,
    timezone,
    latitude,
    longitude,
    place
  }) {
    this.date = date;
    this.time = time;
    this.timezone = timezone;
    this.latitude = latitude;
    this.longitude = longitude;
    this.place = place;

    Object.freeze(this);
  }
}