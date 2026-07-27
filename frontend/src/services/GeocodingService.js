/**
 * ============================================================
 * JAPHATHAKAM
 * Geocoding Service
 * ------------------------------------------------------------
 * Worldwide place search via the Open-Meteo Geocoding API
 * (free, no API key required for non-commercial use; keyless
 * access is rate-limited for heavier/commercial traffic — see
 * https://open-meteo.com/en/docs/geocoding-api).
 *
 * Returns each place's IANA timezone id (e.g. "Asia/Kolkata"),
 * NOT a fixed UTC offset — the actual numeric offset for a
 * birth date is resolved separately (see resolveUtcOffsetHours),
 * since many places observe DST and the offset isn't constant
 * across the year.
 * ============================================================
 */

const SEARCH_URL = "https://geocoding-api.open-meteo.com/v1/search";

class GeocodingService {

    async search(query) {

        const trimmed = (query || "").trim();

        if (trimmed.length < 2) {
            return [];
        }

        const url =
            `${SEARCH_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Place search failed.");
        }

        const body = await response.json();

        return (body.results || []).map((result) => this.toPlace(result));

    }

    toPlace(result) {

        const region = [result.admin1, result.country]
            .filter(Boolean)
            .join(", ");

        return {
            label: region ? `${result.name}, ${region}` : result.name,
            latitude: result.latitude,
            longitude: result.longitude,
            timezoneId: result.timezone,
        };

    }

}

export default new GeocodingService();
