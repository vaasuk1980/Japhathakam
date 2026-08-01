import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

import GenerateKundaliService from "../../services/GenerateKundaliService";
import PersonService from "../../services/PersonService";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";

import HoroscopeReport from "../../components/kundali/HoroscopeReport";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import "./PersonDetails.css";

const PERSON_FORM_ID = "person-details-form";

// Auto-dismiss timing for the post-save confirmation banner.
const SAVE_MESSAGE_DURATION_MS = 10000;

function withDefaults(schema, person, forceDisabled) {

    if (!person) {
        return schema;
    }

    return {
        ...schema,
        sections: schema.sections.map((section) => ({
            ...section,
            fields: section.fields.map((field) => ({
                ...field,
                defaultValue: person[field.id] ?? field.defaultValue,
                // disabled (not readOnly) is what actually locks every
                // control type — a native <select> ignores readOnly
                // entirely, and PlaceAutocomplete's own input only
                // checks disabled (see PlaceAutocomplete.jsx). Widens
                // to every field while viewing a saved person outside
                // Edit mode, without touching a brand-new (unsaved)
                // person's form. Latitude/Longitude/Timezone's own
                // separate readOnly (auto-derived from the place
                // lookup) is untouched and still applies underneath.
                disabled: forceDisabled || field.disabled,
            })),
        })),
    };

}

function PersonDetails() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const personId = searchParams.get("id");

    const [loadedPerson, setLoadedPerson] = useState(null);
    const [loadingPerson, setLoadingPerson] = useState(Boolean(personId));

    // Live mirror of the form's own current values (see
    // DynamicForm's onValuesChange) — distinct from
    // requestState.values, which only updates when "Generate
    // Kundali" is explicitly clicked. Save Changes needs whatever is
    // actually typed right now, not a possibly-stale generated
    // snapshot from before the user's latest edit.
    const [liveValues, setLiveValues] = useState(null);

    const [requestState, setRequestState] = useState({
        status: "idle",
        kundaliDocument: null,
        renderLayout: null,
        values: null,
        error: null,
    });

    const [saveState, setSaveState] = useState({
        status: "idle",
        error: null,
    });

    const [deleteState, setDeleteState] = useState({
        status: "idle",
        error: null,
    });

    // Which confirmation dialog (if any) is currently open — Save,
    // Delete, and Reset all go through this rather than the browser's
    // own window.confirm(), which reads as unfinished in an
    // enterprise product.
    const [confirmAction, setConfirmAction] = useState(null);

    // A saved person's fields open read-only — Edit unlocks them, and
    // saving locks them again. A brand-new (unsaved) person has
    // nothing to "lock" yet, so this only ever gates existing records
    // (see fieldsAreReadOnly below, which also checks personId).
    const [isEditMode, setIsEditMode] = useState(false);

    const fieldsAreReadOnly = Boolean(personId) && !isEditMode;

    // Auto-dismiss the "Successfully saved changes" banner after
    // SAVE_MESSAGE_DURATION_MS rather than leaving it up until the
    // next unrelated state change.
    useEffect(() => {

        if (saveState.status !== "saved") {
            return undefined;
        }

        const timer = setTimeout(() => {
            setSaveState({ status: "idle", error: null });
        }, SAVE_MESSAGE_DURATION_MS);

        return () => clearTimeout(timer);

    }, [saveState.status]);

    useEffect(() => {

        if (!personId) {
            setLoadedPerson(null);
            setLoadingPerson(false);
            return;
        }

        let cancelled = false;

        setLoadingPerson(true);

        PersonService.get(personId)
            .then((person) => {
                if (!cancelled) {
                    setLoadedPerson(person);
                }

                // Best-effort — the Dashboard's "Last Opened" column is a
                // convenience, not something a failed PATCH should block
                // viewing the person over.
                PersonService.markOpened(personId).catch(() => {});
            })
            .catch((error) => {
                console.error("Failed to load saved person", error);
                if (!cancelled) {
                    setLoadedPerson(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingPerson(false);
                }
            });

        return () => {
            cancelled = true;
        };

    }, [personId]);

    const schema = useMemo(
        () => withDefaults(personSchema, loadedPerson, fieldsAreReadOnly),
        [loadedPerson, fieldsAreReadOnly]
    );

    const generateKundali = async (values) => {

        setRequestState({
            status: "loading",
            kundaliDocument: null,
            renderLayout: null,
            values: null,
            error: null,
        });

        try {

            const response = await GenerateKundaliService.generate(values);
            const kundaliDocument = response.kundali;
            const renderLayout = KundaliRenderEngine.render(kundaliDocument.janmaChart);

            setRequestState({
                status: "success",
                kundaliDocument,
                renderLayout,
                values,
                error: null,
            });

        }
        catch (error) {

            console.error("Kundali Generation Error");
            console.error(error);

            setRequestState({
                status: "error",
                kundaliDocument: null,
                renderLayout: null,
                values: null,
                error: error.message,
            });

        }

    };

    // Editing a saved person: show their Kundali/Panchangam
    // immediately, without requiring a fresh Submit click.
    useEffect(() => {

        if (loadedPerson) {
            generateKundali(loadedPerson);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedPerson]);

    // "Generate Kundali" only ever previews — it never saves
    // anything on its own. Saving is a separate, explicit action.
    // Clearing any previous save confirmation belongs here (an
    // explicit, user-initiated preview), not inside generateKundali
    // itself — that's also called automatically after a successful
    // save (to refresh the report with the saved values), and
    // resetting saveState there would wipe out the very "saved"
    // confirmation it's supposed to be showing.
    const handleGenerate = (values) => {
        setSaveState({ status: "idle", error: null });
        generateKundali(values);
    };

    const performSave = async () => {

        const currentValues = liveValues ?? requestState.values;

        if (!currentValues) {
            return;
        }

        setSaveState({ status: "saving", error: null });

        try {

            const payload = { ...currentValues };
            delete payload.age;

            const saved = personId
                ? await PersonService.update(personId, payload)
                : await PersonService.create(payload);

            if (!personId) {
                navigate(`/person-details?id=${saved.id}`, { replace: true });
            }

            // Refresh with the saved record (not just the id) and
            // drop back to read-only — loadedPerson was still the
            // pre-edit snapshot, so without this the form would
            // remount back to the OLD values once isEditMode flips.
            setLoadedPerson(saved);
            setIsEditMode(false);

            setSaveState({ status: "saved", error: null });

        }
        catch (error) {

            console.error("Save Error", error);
            setSaveState({ status: "error", error: error.message });

        }
        finally {
            setConfirmAction(null);
        }

    };

    const performDelete = async () => {

        if (!personId) {
            return;
        }

        setDeleteState({ status: "deleting", error: null });

        try {
            await PersonService.remove(personId);
            navigate("/horoscope-library");
        }
        catch (error) {
            console.error("Delete Error", error);
            setDeleteState({ status: "error", error: error.message });
        }
        finally {
            setConfirmAction(null);
        }

    };

    // Unlike Save/Delete, Reset never leaves the page and has nothing
    // to await — it just clears every piece of local state back to
    // its "nothing loaded yet" shape and drops ?id= from the URL, so
    // the form and report both come back blank for a new entry.
    //
    // loadedPerson is reset HERE, synchronously, rather than left to
    // the personId-driven useEffect below — that effect only fires a
    // render AFTER the URL/personId actually changes, but the
    // DynamicForm's remount key already changes on the personId-
    // change render itself. Without this, the form remounts one
    // render too early, still building its blank-vs-not schema from
    // the OLD loadedPerson — so it "remounts" but shows the same old
    // values, and nothing remounts it again once loadedPerson
    // actually clears (the key stays the same on that later render).
    const performReset = () => {

        setConfirmAction(null);

        setSaveState({ status: "idle", error: null });
        setDeleteState({ status: "idle", error: null });

        setLoadedPerson(null);
        setIsEditMode(false);

        setRequestState({
            status: "idle",
            kundaliDocument: null,
            renderLayout: null,
            values: null,
            error: null,
        });

        setLiveValues(null);

        navigate("/person-details");

    };

    const requestSave = () => setConfirmAction("save");
    const requestDelete = () => setConfirmAction("delete");
    const requestReset = () => setConfirmAction("reset");

    // No confirmation needed — unlocking fields to edit isn't
    // destructive on its own, only Save/Delete/Reset are.
    const requestEdit = () => setIsEditMode(true);

    const cancelConfirm = () => setConfirmAction(null);

    const personForDisplayName = liveValues ?? requestState.values ?? loadedPerson;

    const personDisplayName = personForDisplayName
        ? `${personForDisplayName.firstName ?? ""} ${personForDisplayName.lastName ?? ""}`.trim()
        : "";

    const CONFIRM_DIALOG_CONTENT = {
        save: {
            title: "Save Changes?",
            message: personId
                ? `Save changes to ${personDisplayName || "this person"}'s birth details?`
                : `Save ${personDisplayName || "this"} horoscope as a new record?`,
            confirmLabel: personId ? "Save Changes" : "Save",
            variant: "primary",
            onConfirm: performSave,
            isProcessing: saveState.status === "saving",
        },
        delete: {
            title: "Delete Horoscope?",
            message: `Delete ${personDisplayName || "this person"}'s saved birth record? This cannot be undone.`,
            confirmLabel: "Delete",
            variant: "danger",
            onConfirm: performDelete,
            isProcessing: deleteState.status === "deleting",
        },
        reset: {
            title: "Reset Form?",
            message: `Clear ${personDisplayName || "the current person"}'s details from view and start a new entry? Any unsaved changes will be lost — this does not delete the saved record.`,
            confirmLabel: "Reset",
            variant: "primary",
            onConfirm: performReset,
            isProcessing: false,
        },
    };

    const activeConfirm = confirmAction ? CONFIRM_DIALOG_CONTENT[confirmAction] : null;

    if (loadingPerson) {
        return (
            <div>
                <h1>Person Details</h1>
                <div>Loading saved person...</div>
            </div>
        );
    }

    return (
        <div>

            <h1 className="no-print">Person Details</h1>

            <DynamicForm
                key={`${personId ?? "new"}-${isEditMode}`}
                schema={schema}
                onSubmit={handleGenerate}
                onValuesChange={setLiveValues}
                formId={PERSON_FORM_ID}
                hideSubmitButton
                footer={(
                    <>
                        <div className="person-actions">
                            <Button
                                type="submit"
                                form={PERSON_FORM_ID}
                                variant="primary"
                                disabled={requestState.status === "loading"}
                            >
                                {requestState.status === "loading"
                                    ? "Generating..."
                                    : "Generate Kundali"}
                            </Button>

                            {/* Edit and Save Changes occupy the same slot — a
                                saved person opens read-only (see fieldsAreReadOnly)
                                showing Edit; clicking it unlocks the fields and
                                swaps this in for Save Changes. */}
                            {personId && !isEditMode && (
                                <Button
                                    variant="secondary"
                                    onClick={requestEdit}
                                >
                                    Edit
                                </Button>
                            )}

                            {requestState.status === "success" && (!personId || isEditMode) && (
                                <Button
                                    variant="secondary"
                                    onClick={requestSave}
                                    disabled={saveState.status === "saving"}
                                >
                                    {saveState.status === "saving"
                                        ? "Saving..."
                                        : personId ? "Save Changes" : "Save"}
                                </Button>
                            )}

                            {requestState.status === "success" && (
                                <Button
                                    variant="secondary"
                                    onClick={() => window.print()}
                                >
                                    Save PDF
                                </Button>
                            )}

                            {personId && (
                                <Button
                                    variant="secondary"
                                    onClick={requestReset}
                                >
                                    Reset
                                </Button>
                            )}

                            {personId && (
                                <Button
                                    variant="danger"
                                    onClick={requestDelete}
                                    disabled={deleteState.status === "deleting"}
                                >
                                    {deleteState.status === "deleting" ? "Deleting..." : "Delete"}
                                </Button>
                            )}

                            {saveState.status === "saved" && (
                                <span className="person-actions__status">Successfully saved changes</span>
                            )}
                        </div>

                        {requestState.status === "error" && (
                            <div className="person-actions__error">{requestState.error}</div>
                        )}

                        {saveState.status === "error" && (
                            <div className="person-actions__error">{saveState.error}</div>
                        )}

                        {deleteState.status === "error" && (
                            <div className="person-actions__error">{deleteState.error}</div>
                        )}
                    </>
                )}
            />

            {requestState.status === "success" && (
                <HoroscopeReport
                    values={requestState.values}
                    kundaliDocument={requestState.kundaliDocument}
                    renderLayout={requestState.renderLayout}
                />
            )}

            <ConfirmDialog
                isOpen={Boolean(activeConfirm)}
                title={activeConfirm?.title}
                message={activeConfirm?.message}
                confirmLabel={activeConfirm?.confirmLabel}
                variant={activeConfirm?.variant}
                isProcessing={activeConfirm?.isProcessing}
                onConfirm={activeConfirm?.onConfirm}
                onCancel={cancelConfirm}
            />

        </div>
    );
}

export default PersonDetails;
