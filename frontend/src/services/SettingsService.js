/**
 * ============================================================
 * JAPHATHAKAM
 * Settings Service
 * ------------------------------------------------------------
 * Layer : Presentation Infrastructure
 *
 * Responsibility:
 *   Reads and writes the application settings that live on the
 *   server (report branding, Dasha alert window) — the PDF is
 *   rendered there, so it has to see them too.
 * ============================================================
 */

class SettingsService {

    constructor() {

        this.baseUrl = "http://localhost:3000/api/settings";

    }

    async #request(method, body) {

        const response = await fetch(this.baseUrl, {
            method,
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined,
        });

        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || "Failed to update settings.");
        }

        return payload.settings;

    }

    get() {
        return this.#request("GET");
    }

    // Partial update: only the keys present are changed.
    update(patch) {
        return this.#request("PUT", patch);
    }

    reset() {
        return this.#request("DELETE");
    }

}

export default new SettingsService();
