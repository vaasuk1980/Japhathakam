import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_FILE = path.resolve(__dirname, "../../../database/settings.json");

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
|
| Application-level settings that must be available to the server too
| (the PDF is rendered here), so they live next to the data rather than
| in the browser. Device-only preferences (theme, collapsed sidebar)
| stay in the browser.
|
| `version` lets a later release migrate stored settings; when the app
| gains user accounts this becomes one document per user.
|
*/

const SETTINGS_VERSION = 1;

const DEFAULT_SETTINGS = Object.freeze({
    version: SETTINGS_VERSION,
    branding: Object.freeze({
        // The two invocation lines at the top of every PDF page.
        invocationLine: "ఓం నమః శివాయ",
        blessingLine: "శ్రీ శ్రీ శ్రీ ఆచార్య ప్రబోధానంద యోగీశ్వరులవారి దివ్య ఆశీస్సులతో",
        // Printed in the footer of every PDF page (all optional).
        astrologerName: "",
        organisation: "",
        contact: "",
        footerNote: "",
    }),
    dasha: Object.freeze({
        // Window used by the Dashboard's "Dasha changes" chip.
        windowDays: 30,
        showChip: true,
    }),
});

const BRANDING_LIMITS = {
    invocationLine: 120,
    blessingLine: 160,
    astrologerName: 80,
    organisation: 100,
    contact: 140,
    footerNote: 200,
};

const ALLOWED_WINDOWS = [30, 60, 90];

function cleanText(value, max) {

    return String(value ?? "")
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max);

}

// Whitelists and normalises a (partial) settings object. Unknown keys
// are dropped, so the stored file can never grow arbitrary content.
function normalise(input, base) {

    const next = {
        version: SETTINGS_VERSION,
        branding: { ...base.branding },
        dasha: { ...base.dasha },
    };

    const branding = input?.branding;

    if (branding && typeof branding === "object") {
        for (const [key, max] of Object.entries(BRANDING_LIMITS)) {
            if (key in branding) {
                next.branding[key] = cleanText(branding[key], max);
            }
        }
    }

    const dasha = input?.dasha;

    if (dasha && typeof dasha === "object") {

        if (ALLOWED_WINDOWS.includes(Number(dasha.windowDays))) {
            next.dasha.windowDays = Number(dasha.windowDays);
        }

        if (typeof dasha.showChip === "boolean") {
            next.dasha.showChip = dasha.showChip;
        }

    }

    return next;

}

class SettingsRepository {

    async get() {

        try {

            const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
            return normalise(JSON.parse(raw), DEFAULT_SETTINGS);

        } catch (error) {

            if (error.code === "ENOENT" || error instanceof SyntaxError) {
                return normalise({}, DEFAULT_SETTINGS);
            }

            throw error;

        }

    }

    async update(patch) {

        const current = await this.get();
        const next = normalise(patch, current);

        await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(next, null, 2), "utf-8");

        return next;

    }

    defaults() {
        return normalise({}, DEFAULT_SETTINGS);
    }

}

export default new SettingsRepository();
