import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

import GenerateKundaliService from "../../services/GenerateKundaliService";
import PersonService from "../../services/PersonService";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";

import HoroscopeReport from "../../components/kundali/HoroscopeReport";
import Button from "../../components/common/Button";

import "./PersonDetails.css";

const PERSON_FORM_ID = "person-details-form";

function withDefaults(schema, person) {

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
        () => withDefaults(personSchema, loadedPerson),
        [loadedPerson]
    );

    const generateKundali = async (values) => {

        setSaveState({ status: "idle", error: null });

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
    const handleGenerate = (values) => {
        generateKundali(values);
    };

    const handleSave = async () => {

        if (!requestState.values) {
            return;
        }

        setSaveState({ status: "saving", error: null });

        try {

            const payload = { ...requestState.values };
            delete payload.age;

            const saved = personId
                ? await PersonService.update(personId, payload)
                : await PersonService.create(payload);

            if (!personId) {
                navigate(`/person-details?id=${saved.id}`, { replace: true });
            }

            setSaveState({ status: "saved", error: null });

        }
        catch (error) {

            console.error("Save Error", error);
            setSaveState({ status: "error", error: error.message });

        }

    };

    const handleDelete = async () => {

        if (!personId) {
            return;
        }

        const confirmed = window.confirm(
            "Delete this saved birth record? This cannot be undone."
        );

        if (!confirmed) {
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

    };

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

            <h1>{personId ? "Edit Person" : "Person Details"}</h1>

            <p>
                <Link to="/horoscope-library">&larr; Back to Horoscope Library</Link>
            </p>

            <DynamicForm
                key={personId ?? "new"}
                schema={schema}
                onSubmit={handleGenerate}
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

                            {requestState.status === "success" && (
                                <Button
                                    variant="secondary"
                                    onClick={handleSave}
                                    disabled={saveState.status === "saving"}
                                >
                                    {saveState.status === "saving"
                                        ? "Saving..."
                                        : personId ? "Save Changes" : "Save"}
                                </Button>
                            )}

                            {personId && (
                                <Button
                                    variant="danger"
                                    onClick={handleDelete}
                                    disabled={deleteState.status === "deleting"}
                                >
                                    {deleteState.status === "deleting" ? "Deleting..." : "Delete"}
                                </Button>
                            )}

                            {saveState.status === "saved" && (
                                <span className="person-actions__status">Saved.</span>
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

        </div>
    );
}

export default PersonDetails;
