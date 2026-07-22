/**
 * ============================================================
 * JAPHATHAKAM
 * Generate Kundali Service
 * ------------------------------------------------------------
 * Layer : Presentation Infrastructure
 *
 * Responsibility:
 *   Communicates with the backend GenerateKundali API.
 * ============================================================
 */

class GenerateKundaliService {

    constructor() {

        this.baseUrl = "http://localhost:3000/api/kundali";

    }

    async generate(request) {

        console.log("================================");
        console.log("Calling Backend");
        console.log(this.baseUrl);
        console.log(request);

        const response = await fetch(this.baseUrl, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(request)

        });

        console.log("HTTP Status:", response.status);

        const body = await response.json();

        console.log("Backend Response:");
        console.log(body);

        if (!response.ok) {

            throw new Error(
                body.message || "Failed to generate Kundali."
            );

        }

        return body;

    }

}

export default new GenerateKundaliService();