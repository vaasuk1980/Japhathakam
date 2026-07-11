class Nakshatra {

    constructor(
        id,
        englishName,
        teluguName,
        sequence,
        startLongitude,
        endLongitude
    ) {
        this.id = id;
        this.englishName = englishName;
        this.teluguName = teluguName;
        this.sequence = sequence;
        this.startLongitude = startLongitude;
        this.endLongitude = endLongitude;

        Object.freeze(this);
    }

}

export default Nakshatra;