/* ==========================================================
   Export / import of saved horoscopes.

   CSV  — a human-readable list (spreadsheets). Not a backup: it
          leaves out coordinates and timezone.
   JSON — a full backup (every field of every person, plus the
          settings), which importBackup() can restore.
========================================================== */

import PersonService from "../../services/PersonService";

export const CSV_COLUMNS = [
    "firstName", "lastName", "gender",
    "dateOfBirth", "timeOfBirth", "placeOfBirth",
    "createdAt",
];

const BACKUP_APP = "japhathakam";
const BACKUP_VERSION = 1;

// Fields that identify a person for duplicate detection on import.
const IDENTITY_FIELDS = ["firstName", "lastName", "dateOfBirth", "timeOfBirth"];

// Server-assigned bookkeeping that must not be carried into a new record.
const SERVER_FIELDS = ["id", "createdAt", "updatedAt", "lastOpenedAt"];

const REQUIRED_FIELDS = [
    "firstName", "lastName", "dateOfBirth", "timeOfBirth",
    "placeOfBirth", "latitude", "longitude", "timezone",
];

function download(filename, content, mimeType) {

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

}

function stamp() {

    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

}

export function downloadCsv(persons, filename = "horoscopes.csv") {

    const rows = [
        CSV_COLUMNS,
        ...persons.map((person) => CSV_COLUMNS.map((column) => person[column] ?? "")),
    ];

    const csv = rows
        .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    // BOM so Excel opens Telugu names as UTF-8.
    download(filename, "﻿" + csv, "text/csv;charset=utf-8;");

}

export function downloadBackup({ persons, settings }) {

    const backup = {
        app: BACKUP_APP,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        settings: settings ?? null,
        persons,
    };

    download(
        `japhathakam-backup-${stamp()}.json`,
        JSON.stringify(backup, null, 2),
        "application/json"
    );

    return persons.length;

}

const identityKey = (person) =>
    IDENTITY_FIELDS.map((field) => String(person[field] ?? "").trim().toLowerCase()).join("|");

/**
 * Parses and validates a backup file's text. Throws a readable Error
 * when it is not a Japhathakam backup.
 */
export function parseBackup(text) {

    let data;

    try {
        data = JSON.parse(text);
    }
    catch {
        throw new Error("This file is not valid JSON.");
    }

    if (!data || data.app !== BACKUP_APP || !Array.isArray(data.persons)) {
        throw new Error("This is not a Japhathakam backup file.");
    }

    if (data.version > BACKUP_VERSION) {
        throw new Error("This backup was made by a newer version of the app.");
    }

    return data;

}

/**
 * Adds the backup's horoscopes that are not already saved (same name,
 * date and time of birth), leaving existing records untouched.
 *
 * @returns {{ imported:number, duplicates:number, invalid:number }}
 */
export async function importPersons(persons) {

    const existing = await PersonService.list();
    const known = new Set(existing.map(identityKey));

    let imported = 0;
    let duplicates = 0;
    let invalid = 0;

    for (const source of persons) {

        const complete = source
            && REQUIRED_FIELDS.every((field) => source[field] !== undefined && source[field] !== "");

        if (!complete) {
            invalid += 1;
            continue;
        }

        const key = identityKey(source);

        if (known.has(key)) {
            duplicates += 1;
            continue;
        }

        const payload = { ...source };
        SERVER_FIELDS.forEach((field) => delete payload[field]);

        await PersonService.create(payload);

        known.add(key);
        imported += 1;

    }

    return { imported, duplicates, invalid };

}
