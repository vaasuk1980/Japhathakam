export default function isCurrentPeriod(period, now = Date.now()) {

    return (
        period != null &&
        now >= period.startEpochMs &&
        now < period.endEpochMs
    );

}
