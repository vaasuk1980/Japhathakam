import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileJson, FileSpreadsheet, MapPin, Upload } from "lucide-react";

import PersonService from "../../services/PersonService";
import { DEFAULT_SETTINGS, useSettings } from "../../settings/SettingsContext";
import { useTheme } from "../../theme/ThemeContext";
import { useSavedLocation } from "../../location/LocationContext";
import { useTranslation } from "../../i18n/I18nContext";
import {
    downloadBackup,
    downloadCsv,
    importPersons,
    parseBackup,
} from "../../utils/data/exportImport";

import Button from "../../components/common/Button";

import "./Settings.css";

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
];

const WINDOWS = [30, 60, 90];

const BRANDING_FIELDS = [
    { key: "invocationLine", labelKey: "settings.report.invocationLine", max: 120 },
    { key: "blessingLine", labelKey: "settings.report.blessingLine", max: 160 },
    { key: "astrologerName", labelKey: "settings.report.astrologerName", max: 80 },
    { key: "organisation", labelKey: "settings.report.organisation", max: 100 },
    { key: "contact", labelKey: "settings.report.contact", max: 140 },
    { key: "footerNote", labelKey: "settings.report.footerNote", max: 200 },
];

function Segmented({ value, options, onChange, label }) {

    return (
        <div className="settings-segmented" role="radiogroup" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={value === option.value}
                    className={"settings-segmented__item" + (value === option.value ? " is-active" : "")}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );

}

function Switch({ checked, onChange, label }) {

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className="settings-switch"
            onClick={() => onChange(!checked)}
        />
    );

}

function Row({ title, hint, children }) {

    return (
        <div className="settings-row">
            <div className="settings-row__text">
                <span className="settings-row__title">{title}</span>
                {hint && <span className="settings-row__hint">{hint}</span>}
            </div>

            <div className="settings-row__control">{children}</div>
        </div>
    );

}

function Settings() {

    const { t, language, setLanguage } = useTranslation();
    const { settings, status, save } = useSettings();
    const { choice: themeChoice, setChoice: setTheme } = useTheme();
    const { location } = useSavedLocation();

    // ---- report branding (explicit Save, so it isn't written per keystroke)
    const [draft, setDraft] = useState(settings.branding);
    const [brandingState, setBrandingState] = useState({ status: "idle", error: null });

    useEffect(() => {
        setDraft(settings.branding);
    }, [settings.branding]);

    const dirty = useMemo(
        () => BRANDING_FIELDS.some(({ key }) => (draft[key] ?? "") !== (settings.branding[key] ?? "")),
        [draft, settings.branding]
    );

    const saveBranding = async () => {

        setBrandingState({ status: "saving", error: null });

        try {
            await save({ branding: draft });
            setBrandingState({ status: "saved", error: null });
        }
        catch (error) {
            setBrandingState({ status: "error", error: error.message });
        }

    };

    // Restores only the report text to the shipped defaults.
    const resetBranding = async () => {

        setBrandingState({ status: "saving", error: null });

        try {
            const saved = await save({ branding: DEFAULT_SETTINGS.branding });
            setDraft(saved.branding);
            setBrandingState({ status: "saved", error: null });
        }
        catch (error) {
            setBrandingState({ status: "error", error: error.message });
        }

    };

    // ---- Dasha alert preferences save immediately (single-click controls)
    const setDasha = (patch) => {
        save({ dasha: patch }).catch(() => {});
    };

    // ---- data export / import
    const [dataState, setDataState] = useState({ status: "idle", message: null });
    const [restoreSettings, setRestoreSettings] = useState(true);
    const fileRef = useRef(null);

    const withPersons = async (action) => {

        setDataState({ status: "working", message: null });

        try {

            const persons = await PersonService.list();
            const message = action(persons);

            setDataState({ status: "done", message });

        }
        catch (error) {
            setDataState({ status: "error", message: error.message });
        }

    };

    const exportCsv = () => withPersons((persons) => {
        downloadCsv(persons);
        return t("settings.data.exported", { count: persons.length });
    });

    const exportBackup = () => withPersons((persons) => {
        downloadBackup({ persons, settings });
        return t("settings.data.exported", { count: persons.length });
    });

    const handleFile = async (event) => {

        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            return;
        }

        setDataState({ status: "working", message: null });

        try {

            const backup = parseBackup(await file.text());
            const result = await importPersons(backup.persons);

            if (restoreSettings && backup.settings) {
                await save({ branding: backup.settings.branding, dasha: backup.settings.dasha });
            }

            setDataState({
                status: "done",
                message: t("settings.data.imported", result),
            });

        }
        catch (error) {
            setDataState({ status: "error", message: error.message });
        }

    };

    const themeOptions = [
        { value: "light", label: t("settings.appearance.light") },
        { value: "dark", label: t("settings.appearance.dark") },
        { value: "system", label: t("settings.appearance.system") },
    ];

    const hasIdentity = draft.astrologerName || draft.organisation || draft.contact || draft.footerNote;

    return (
        <main className="page settings-page">

            <header>
                <h1 className="page-title">{t("settings.title")}</h1>
                <p className="settings-subtitle">{t("settings.subtitle")}</p>
            </header>

            {/* ---------- General ---------- */}
            <section>
                <h2 className="settings-section-head">{t("settings.general.title")}</h2>

                <div className="settings-card">
                    <Row title={t("settings.general.language")} hint={t("settings.general.languageHint")}>
                        <Segmented
                            label={t("settings.general.language")}
                            value={language}
                            options={LANGUAGES.map((item) => ({ value: item.code, label: item.label }))}
                            onChange={setLanguage}
                        />
                    </Row>

                    <Row title={t("settings.general.location")} hint={t("settings.general.locationHint")}>
                        <span className="settings-value">
                            <MapPin size={16} aria-hidden="true" />
                            {location?.label ?? "—"}
                        </span>
                    </Row>
                </div>
            </section>

            {/* ---------- Appearance ---------- */}
            <section>
                <h2 className="settings-section-head">{t("settings.appearance.title")}</h2>

                <div className="settings-card">
                    <Row title={t("settings.appearance.theme")} hint={t("settings.appearance.themeHint")}>
                        <Segmented
                            label={t("settings.appearance.theme")}
                            value={themeChoice}
                            options={themeOptions}
                            onChange={setTheme}
                        />
                    </Row>
                </div>
            </section>

            {/* ---------- Report & PDF ---------- */}
            <section>
                <h2 className="settings-section-head">{t("settings.report.title")}</h2>

                <div className="settings-card settings-card--padded">
                    <p className="settings-help">{t("settings.report.hint")}</p>

                    <div className="settings-fields">
                        {BRANDING_FIELDS.map(({ key, labelKey, max }) => (
                            <label className="settings-field" key={key}>
                                <span>{t(labelKey)}</span>
                                <input
                                    type="text"
                                    value={draft[key] ?? ""}
                                    maxLength={max}
                                    onChange={(event) => setDraft((previous) => ({ ...previous, [key]: event.target.value }))}
                                />
                            </label>
                        ))}
                    </div>

                    <div className="settings-preview" aria-label={t("settings.report.preview")}>
                        <span className="settings-preview__label">{t("settings.report.preview")}</span>

                        <div className="settings-preview__page">
                            {draft.invocationLine && <div className="settings-preview__invocation">{draft.invocationLine}</div>}
                            {draft.blessingLine && <div className="settings-preview__blessing">{draft.blessingLine}</div>}

                            <div className="settings-preview__name">{t("settings.report.sampleName")}</div>
                            <div className="settings-preview__facts">09-12-1988 • 21:06 • Nellore • Male</div>

                            <div className="settings-preview__footer">
                                {hasIdentity ? (
                                    <>
                                        <strong>
                                            {[draft.astrologerName, draft.organisation].filter(Boolean).join(" · ")}
                                        </strong>
                                        {draft.contact && <div>{draft.contact}</div>}
                                        {draft.footerNote && <div>{draft.footerNote}</div>}
                                    </>
                                ) : (
                                    <em>{t("settings.report.previewFooterEmpty")}</em>
                                )}
                                <div className="settings-preview__pagenum">Page 1 of 5</div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-actions">
                        <Button
                            variant="primary"
                            onClick={saveBranding}
                            disabled={!dirty || brandingState.status === "saving" || status === "error"}
                        >
                            {brandingState.status === "saving" ? t("settings.report.saving") : t("settings.report.save")}
                        </Button>

                        <Button variant="secondary" onClick={resetBranding} disabled={brandingState.status === "saving"}>
                            {t("settings.report.reset")}
                        </Button>

                        {brandingState.status === "saved" && !dirty && (
                            <span className="settings-status settings-status--ok">{t("settings.report.saved")}</span>
                        )}

                        {brandingState.status === "error" && (
                            <span className="settings-status settings-status--error">{brandingState.error}</span>
                        )}
                    </div>
                </div>
            </section>

            {/* ---------- Dasha alerts ---------- */}
            <section>
                <h2 className="settings-section-head">{t("settings.dasha.title")}</h2>

                <div className="settings-card">
                    <Row title={t("settings.dasha.showChip")} hint={t("settings.dasha.showChipHint")}>
                        <Switch
                            checked={settings.dasha.showChip}
                            label={t("settings.dasha.showChip")}
                            onChange={(value) => setDasha({ showChip: value })}
                        />
                    </Row>

                    <Row title={t("settings.dasha.window")} hint={t("settings.dasha.windowHint")}>
                        <Segmented
                            label={t("settings.dasha.window")}
                            value={settings.dasha.windowDays}
                            options={WINDOWS.map((days) => ({ value: days, label: t("settings.dasha.days", { days }) }))}
                            onChange={(value) => setDasha({ windowDays: value })}
                        />
                    </Row>
                </div>
            </section>

            {/* ---------- Calculation (read-only) ---------- */}
            <section>
                <h2 className="settings-section-head">{t("settings.calculation.title")}</h2>

                <div className="settings-card">
                    <Row title={t("settings.calculation.system")}>
                        <span className="settings-value">Trāitha Siddhānta · v1.0</span>
                    </Row>
                    <Row title={t("settings.calculation.ayanamsa")}>
                        <span className="settings-value">Lahiri</span>
                    </Row>
                    <Row title={t("settings.calculation.node")}>
                        <span className="settings-value">{t("settings.calculation.nodeMean")}</span>
                    </Row>
                    <Row title={t("settings.calculation.ephemeris")}>
                        <span className="settings-value">Swiss Ephemeris</span>
                    </Row>
                </div>

                <p className="settings-footnote">{t("settings.calculation.note")}</p>
            </section>

            {/* ---------- Data ---------- */}
            <section>
                <h2 className="settings-section-head">{t("settings.data.title")}</h2>

                <div className="settings-card">
                    <Row title={t("settings.data.exportCsv")} hint={t("settings.data.exportCsvHint")}>
                        <Button variant="secondary" onClick={exportCsv} disabled={dataState.status === "working"}>
                            <FileSpreadsheet size={16} aria-hidden="true" /> CSV
                        </Button>
                    </Row>

                    <Row title={t("settings.data.exportBackup")} hint={t("settings.data.exportBackupHint")}>
                        <Button variant="secondary" onClick={exportBackup} disabled={dataState.status === "working"}>
                            <FileJson size={16} aria-hidden="true" /> JSON
                        </Button>
                    </Row>

                    <Row title={t("settings.data.import")} hint={t("settings.data.importHint")}>
                        <Button
                            variant="secondary"
                            onClick={() => fileRef.current?.click()}
                            disabled={dataState.status === "working"}
                        >
                            <Upload size={16} aria-hidden="true" /> {t("settings.data.chooseFile")}
                        </Button>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="application/json,.json"
                            className="settings-file"
                            onChange={handleFile}
                        />
                    </Row>

                    <Row title={t("settings.data.restoreSettings")}>
                        <Switch
                            checked={restoreSettings}
                            label={t("settings.data.restoreSettings")}
                            onChange={setRestoreSettings}
                        />
                    </Row>
                </div>

                {dataState.status === "working" && (
                    <p className="settings-status">{t("settings.data.working")}</p>
                )}

                {dataState.message && dataState.status !== "working" && (
                    <p className={"settings-status " + (dataState.status === "error" ? "settings-status--error" : "settings-status--ok")}>
                        {dataState.status === "done" && <Download size={14} aria-hidden="true" />}
                        {dataState.message}
                    </p>
                )}
            </section>

            {/* ---------- About ---------- */}
            <section>
                <h2 className="settings-section-head">{t("settings.about.title")}</h2>

                <div className="settings-card">
                    <Row title="జాఫతకం · Truth of Light">
                        <span className="settings-value">{t("settings.about.tagline")}</span>
                    </Row>

                    <Row title={t("settings.about.shortcuts")}>
                        <Link to="/horoscope-library" className="settings-link">{t("settings.about.library")}</Link>
                    </Row>
                </div>
            </section>

        </main>
    );

}

export default Settings;
