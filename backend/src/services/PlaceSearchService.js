class PlaceSearchService {

    async search(query) {
        if (!query || typeof query !== "string") {
            throw new Error("Search query is required.");
        }

        const encodedQuery = encodeURIComponent(query.trim());
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&addressdetails=0&limit=10`;

        const response = await fetch(nominatimUrl, {
            headers: {
                "User-Agent": "Japhathakam/1.0 (contact@example.com)",
            },
        });

        if (!response.ok) {
            throw new Error("Unable to fetch place suggestions.");
        }

        const places = await response.json();

        return Promise.all(
            places.map(async (place) => {
                const latitude = Number(place.lat);
                const longitude = Number(place.lon);
                const timezone = await this.getTimezoneOffset(latitude, longitude);

                return {
                    label: place.display_name,
                    value: place.display_name,
                    latitude,
                    longitude,
                    timezone,
                };
            })
        );
    }

    async getTimezoneOffset(latitude, longitude) {
        try {
            const url = `https://timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`;
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Japhathakam/1.0 (contact@example.com)",
                },
            });

            if (!response.ok) {
                throw new Error("Timezone lookup failed.");
            }

            const timezoneData = await response.json();
            return Number(timezoneData.utcOffset) ?? this.estimateTimezoneOffset(longitude);
        } catch (error) {
            return this.estimateTimezoneOffset(longitude);
        }
    }

    estimateTimezoneOffset(longitude) {
        const offset = Math.round((longitude / 15) * 4) / 4;
        return Math.max(Math.min(offset, 14), -12);
    }

}

export default new PlaceSearchService();
