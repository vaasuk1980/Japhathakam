/**
 * ============================================================
 * JAPHATHAKAM
 * Dasha Changes Service
 * ------------------------------------------------------------
 * Layer : Presentation Infrastructure
 *
 * Responsibility:
 *   Fetches the Mahadasha/Antardasha changes coming up across
 *   all saved horoscopes (computed server-side).
 * ============================================================
 */

class DashaChangesService {

    constructor() {

        this.baseUrl = "http://localhost:3000/api/dasha-changes";

    }

    // -> { days, count, events: [...], next: {...} | null }
    async get(days = 30) {

        const response = await fetch(`${this.baseUrl}?days=${encodeURIComponent(days)}`);
        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Failed to load upcoming Dasha changes.");
        }

        return body;

    }

}

export default new DashaChangesService();
