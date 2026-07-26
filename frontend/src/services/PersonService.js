/**
 * ============================================================
 * JAPHATHAKAM
 * Person Service
 * ------------------------------------------------------------
 * Layer : Presentation Infrastructure
 *
 * Responsibility:
 *   Communicates with the backend Person (saved birth details)
 *   CRUD API.
 * ============================================================
 */

class PersonService {

    constructor() {

        this.baseUrl = "http://localhost:3000/api/persons";

    }

    async list() {

        const response = await fetch(this.baseUrl);
        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Failed to load saved persons.");
        }

        return body.persons;

    }

    async get(id) {

        const response = await fetch(`${this.baseUrl}/${id}`);
        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Failed to load person.");
        }

        return body.person;

    }

    async create(data) {

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Failed to save person.");
        }

        return body.person;

    }

    async update(id, data) {

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message || "Failed to update person.");
        }

        return body.person;

    }

    async remove(id) {

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {

            const body = await response.json().catch(() => ({}));

            throw new Error(body.message || "Failed to delete person.");

        }

    }

}

export default new PersonService();
