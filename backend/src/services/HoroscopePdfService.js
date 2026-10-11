import puppeteer from "puppeteer";

import PersonRepository from "../repositories/PersonRepository.js";
import SettingsRepository from "../repositories/SettingsRepository.js";

// Configurable — Vite's dev port isn't stable (it falls back to the
// next free port whenever 5173 is already taken by another instance),
// and a hardcoded value here silently breaks Puppeteer's navigate as
// soon as the two drift apart. Override via FRONTEND_ORIGIN in .env.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5175";

// Printable content width for A4 with 12mm side margins: 210mm -
// 2*12mm = 186mm, at 96 CSS px/in.
const HEADER_CAPTURE_WIDTH = 703;

const GENDER_LABELS = {
    male: "Male",
    female: "Female",
    other: "Transgender",
};

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

}

class HoroscopePdfService {

    async generate(personId, language = "te") {

        const person = await PersonRepository.getById(personId);

        if (!person) {
            return null;
        }

        const { branding } = await SettingsRepository.get();

        const browser = await puppeteer.launch({ headless: true });

        try {

            const page = await browser.newPage();

            await page.emulateMediaType("print");

            // Read by I18nContext's LanguageProvider on init — this fresh
            // page has no localStorage of its own to carry a prior choice.
            await page.goto(
                `${FRONTEND_ORIGIN}/person-details?id=${encodeURIComponent(personId)}&lang=${encodeURIComponent(language)}`,
                { waitUntil: "networkidle0", timeout: 30000 }
            );

            // networkidle0 only guarantees the JIMS font file has
            // finished downloading, not that Chrome has finished
            // parsing it and building its Telugu shaping tables —
            // without this, conjunct clusters (e.g. "్మ", "ఖ్యా")
            // can silently drop glyphs instead of rendering the
            // ligature, intermittently (whichever happens to be
            // ready first in a given run). document.fonts.ready
            // resolves only once shaping is actually usable.
            await page.evaluate(() => document.fonts.ready);

            // Name/facts come straight from the already-rendered DOM
            // (.report-invocation__identity-*, always display:none —
            // see ReportInvocation.jsx) rather than being recomputed
            // here, so the header text (including the calendar-
            // accurate age) never drifts out of sync with what the
            // frontend itself would show.
            const identity = await page.evaluate(() => {

                const name = document.querySelector(".report-invocation__identity-name");
                const facts = document.querySelector(".report-invocation__identity-facts");

                return {
                    name: name ? name.textContent.trim() : "",
                    facts: facts ? facts.textContent.replace(/\s+/g, " ").trim() : "",
                };

            });

            const headerImageBase64 = await this.captureHeaderImage(page, identity, person, branding);
            const headerTemplate = this.buildHeaderTemplate(headerImageBase64);

            const footerImageBase64 = await this.captureFooterImage(page, branding);
            const footerTemplate = this.buildFooterTemplate(footerImageBase64);

            // Neither page.pdf()'s `margin` option NOR the raw CDP
            // marginTop/Bottom below actually control where the BODY
            // content starts — verified directly (values of
            // 12mm/34mm/80mm, as strings, plain numbers, and via the
            // raw CDP command, all produced byte-for-byte the same
            // content position). Body layout follows print.css's own
            // `@page { margin: ... }` rule regardless. marginTop/Bottom
            // here only size the header/footer's OWN rendering box —
            // they must stay in sync with print.css's @page margin
            // (currently 40mm/14mm both places — keep these two in
            // sync any time either the header content or this value
            // changes) or the header/footer either gets clipped or
            // overlaps the body content that starts at whatever @page
            // says. Using the raw CDP command (which page.pdf() wraps)
            // instead of page.pdf() directly for no other reason than
            // it was the tool already in hand while debugging this.
            const client = await page.createCDPSession();

            const { data } = await client.send("Page.printToPDF", {
                paperWidth: 8.2677,
                paperHeight: 11.6929,
                marginTop: 1.5748,
                marginBottom: 0.551,
                marginLeft: 0.472,
                marginRight: 0.472,
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate,
                footerTemplate,
                preferCSSPageSize: false,
            });

            return Buffer.from(data, "base64");

        } finally {
            await browser.close();
        }

    }

    // Puppeteer's headerTemplate renders in an isolated frame with no
    // access to the page's own stylesheets/@font-face rules. A
    // base64-embedded JIMS font there was verified — by inspecting
    // the actual embedded-font table of a generated PDF, not just
    // eyeballing it — to silently fall back to the OS's generic
    // Telugu font (Nirmala UI) instead, visibly different from the
    // body text's real JIMS rendering. Capturing the header as an
    // IMAGE from THIS page (where JIMS genuinely loads, via the
    // normal stylesheet) sidesteps that limitation entirely: it's
    // pixel-identical to the body because it IS the same rendering
    // pipeline, not a separate re-implementation of it.
    async captureHeaderImage(page, identity, person, branding) {

        const fallbackName = [person.firstName, person.lastName].filter(Boolean).join(" ");

        const name = escapeHtml(identity.name || fallbackName || "—");
        const facts = escapeHtml(identity.facts || GENDER_LABELS[person.gender] || "");

        // Higher deviceScaleFactor = more source pixels for the
        // screenshot, so the image stays crisp once the header
        // template scales it back down to the page's actual width.
        await page.setViewport({ width: HEADER_CAPTURE_WIDTH, height: 200, deviceScaleFactor: 3 });

        const invocation = escapeHtml(branding.invocationLine);
        const blessing = escapeHtml(branding.blessingLine);

        await page.evaluate(({ name, facts, width, invocation, blessing }) => {

            const container = document.createElement("div");
            container.id = "__pdf_header_capture__";
            container.style.cssText = `
                position: fixed; top: 0; left: 0; z-index: 999999;
                width: ${width}px; box-sizing: border-box;
                padding: 12px 24px; background: #fff; text-align: center;
                font-family: var(--font-family);
            `;

            container.innerHTML = `
                ${invocation ? `<div style="font-size:13px; font-weight:600; color:#2952cc;">${invocation}</div>` : ""}
                ${blessing ? `<div style="font-size:13px; font-weight:700; color:#2952cc; margin-top:1px;">${blessing}</div>` : ""}
                <div style="margin-top:2px; padding-bottom:4px; border-bottom:1.5px solid #2952cc;">
                    <div style="font-family: Georgia, 'Times New Roman', serif; font-size:19px; font-weight:700; letter-spacing:0.3px; color:#1a1a1a;">${name}</div>
                    <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size:11px; color:#555;">${facts}</div>
                </div>
            `;

            document.body.appendChild(container);

        }, { name, facts, width: HEADER_CAPTURE_WIDTH, invocation, blessing });

        const element = await page.$("#__pdf_header_capture__");
        const imageBuffer = await element.screenshot({ type: "png" });

        await page.evaluate(() => {
            document.getElementById("__pdf_header_capture__")?.remove();
        });

        await page.setViewport({ width: HEADER_CAPTURE_WIDTH, height: 200, deviceScaleFactor: 1 });

        return imageBuffer.toString("base64");

    }

    buildHeaderTemplate(headerImageBase64) {

        return `
            <div style="width:100%; margin:0; text-align:center;">
                <img src="data:image/png;base64,${headerImageBase64}" style="width:100%; height:auto; display:block;" />
            </div>
        `;

    }

    // Same approach as the header: the astrologer/organisation/contact
    // lines are rendered as an image from the real page, so Telugu text
    // uses the page's own fonts (the footer template frame has none).
    // Returns null when no branding text is configured.
    async captureFooterImage(page, branding) {

        const identityLine = [branding.astrologerName, branding.organisation]
            .filter(Boolean)
            .join(" · ");

        const lines = [identityLine, branding.contact, branding.footerNote].filter(Boolean);

        if (lines.length === 0) {
            return null;
        }

        await page.setViewport({ width: HEADER_CAPTURE_WIDTH, height: 120, deviceScaleFactor: 3 });

        await page.evaluate(({ lines, width }) => {

            const container = document.createElement("div");
            container.id = "__pdf_footer_capture__";
            container.style.cssText = `
                position: fixed; top: 0; left: 0; z-index: 999999;
                width: ${width}px; box-sizing: border-box;
                padding: 4px 24px; background: #fff; text-align: center;
                font-family: var(--font-family); color: #555;
                border-top: 1px solid #d0d0d0;
            `;

            const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

            container.innerHTML = lines.map((line, index) =>
                `<div style="font-size:${index === 0 ? 11 : 10}px; font-weight:${index === 0 ? 600 : 400}; line-height:1.35;">${esc(line)}</div>`
            ).join("");

            document.body.appendChild(container);

        }, { lines, width: HEADER_CAPTURE_WIDTH });

        const element = await page.$("#__pdf_footer_capture__");
        const imageBuffer = await element.screenshot({ type: "png" });

        await page.evaluate(() => {
            document.getElementById("__pdf_footer_capture__")?.remove();
        });

        await page.setViewport({ width: HEADER_CAPTURE_WIDTH, height: 200, deviceScaleFactor: 1 });

        return imageBuffer.toString("base64");

    }

    buildFooterTemplate(brandingImageBase64 = null) {

        return `
            <style>
                @font-face {
                    font-family: 'Segoe UI Numerals';
                    src: local('Segoe UI');
                    unicode-range: U+0030-0039;
                    size-adjust: 90%;
                }
                .jp-pdf-footer {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0 12mm;
                    text-align: center;
                    font-family: 'Segoe UI Numerals', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 8px;
                    color: #888;
                }
            </style>
            ${brandingImageBase64
                ? `<div class="jp-pdf-footer"><img src="data:image/png;base64,${brandingImageBase64}" style="width:100%; height:auto; display:block; margin-bottom:2px;" /></div>`
                : ""}
            <div class="jp-pdf-footer">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
        `;

    }

}

export default new HoroscopePdfService();
