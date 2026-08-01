/**
 * ============================================================
 * JAPHATHAKAM
 * Rashi Transit Summary Service
 * ------------------------------------------------------------
 * Layer : Presentation Infrastructure
 *
 * Responsibility:
 *   Communicates with the backend's per-Graha Rashi transit
 *   listing (Entry/Exit/Duration/Retrograde per stay) for a given
 *   Ugadi-to-Ugadi year window — powers the Panchangam page.
 * ============================================================
 */

class RashiTransitSummaryService {

    constructor() {

        this.baseUrl = "http://localhost:3000/api/rashi-transit-summary";

    }

    async get({ year, timezone }) {

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ year, timezone }),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Failed to load Rashi transit summary.");
        }

        return body;

    }

}

export default new RashiTransitSummaryService();
