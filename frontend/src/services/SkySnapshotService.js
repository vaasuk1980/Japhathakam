/**
 * ============================================================
 * JAPHATHAKAM
 * Sky Snapshot Service
 * ------------------------------------------------------------
 * Layer : Presentation Infrastructure
 *
 * Responsibility:
 *   Communicates with the backend's date+place-only planetary
 *   snapshot (no saved Person involved) — powers the Dashboard's
 *   "Today" widgets (Gochara Summary, Today's Panchangam).
 * ============================================================
 */

class SkySnapshotService {

    constructor() {

        this.baseUrl = "http://localhost:3000/api/sky-snapshot";

    }

    async get({ date, time, latitude, longitude, timezone }) {

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, time, latitude, longitude, timezone }),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Failed to load today's sky snapshot.");
        }

        return body;

    }

}

export default new SkySnapshotService();
