import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, "../../../database/persons.json");

class PersonRepository {

    async readAll() {

        try {

            const raw = await fs.readFile(DATA_FILE, "utf-8");
            return JSON.parse(raw);

        } catch (error) {

            if (error.code === "ENOENT") {
                return [];
            }

            throw error;

        }

    }

    async writeAll(persons) {

        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

        await fs.writeFile(
            DATA_FILE,
            JSON.stringify(persons, null, 2),
            "utf-8"
        );

    }

    async list() {
        return this.readAll();
    }

    async getById(id) {

        const persons = await this.readAll();

        return persons.find(
            (person) => person.id === id
        ) || null;

    }

    async create(data) {

        const persons = await this.readAll();

        const now = new Date().toISOString();

        const person = {
            ...data,
            id: randomUUID(),
            createdAt: now,
            updatedAt: now,
        };

        persons.push(person);

        await this.writeAll(persons);

        return person;

    }

    async update(id, data) {

        const persons = await this.readAll();

        const index = persons.findIndex(
            (person) => person.id === id
        );

        if (index === -1) {
            return null;
        }

        const updated = {
            ...persons[index],
            ...data,
            id,
            updatedAt: new Date().toISOString(),
        };

        persons[index] = updated;

        await this.writeAll(persons);

        return updated;

    }

    // Distinct from update() — viewing a record shouldn't touch
    // updatedAt (that must keep meaning "last edited"), so this is
    // its own narrow write of just lastOpenedAt.
    async touchOpened(id) {

        const persons = await this.readAll();

        const index = persons.findIndex(
            (person) => person.id === id
        );

        if (index === -1) {
            return null;
        }

        const updated = {
            ...persons[index],
            lastOpenedAt: new Date().toISOString(),
        };

        persons[index] = updated;

        await this.writeAll(persons);

        return updated;

    }

    // Distinct from update() for the same reason touchOpened() is —
    // toggling a favourite star in the Library list is a UI-only
    // preference, not an edit to the horoscope's own data, so it
    // shouldn't bump updatedAt ("last edited").
    async setFavourite(id, isFavourite) {

        const persons = await this.readAll();

        const index = persons.findIndex(
            (person) => person.id === id
        );

        if (index === -1) {
            return null;
        }

        const updated = {
            ...persons[index],
            isFavourite,
        };

        persons[index] = updated;

        await this.writeAll(persons);

        return updated;

    }

    async remove(id) {

        const persons = await this.readAll();

        const index = persons.findIndex(
            (person) => person.id === id
        );

        if (index === -1) {
            return false;
        }

        persons.splice(index, 1);

        await this.writeAll(persons);

        return true;

    }

}

export default new PersonRepository();
