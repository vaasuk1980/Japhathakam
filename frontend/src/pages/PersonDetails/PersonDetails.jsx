import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

import GenerateKundaliService from "../../services/GenerateKundaliService";
import PersonService from "../../services/PersonService";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";

import PlanetaryPositionsTable from "../../components/kundali/PlanetaryPositionsTable";
import JanmaKundaliPanel from "../../components/kundali/JanmaKundaliPanel";
import PanchangamDetails from "../../components/kundali/PanchangamDetails";

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
            const renderLayout = KundaliRenderEngine.render(kundaliDocument);

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

    const handleSubmit = async (values) => {

        try {

            const payload = { ...values };
            delete payload.age;

            const saved = personId
                ? await PersonService.update(personId, payload)
                : await PersonService.create(payload);

            if (!personId) {
                navigate(`/person-details?id=${saved.id}`, { replace: true });
            }

            await generateKundali(values);

        }
        catch (error) {

            console.error("Save Error", error);

            setRequestState({
                status: "error",
                kundaliDocument: null,
                renderLayout: null,
                values: null,
                error: error.message,
            });

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
                onSubmit={handleSubmit}
            />

            {personId && (
                <div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteState.status === "deleting"}
                    >
                        {deleteState.status === "deleting" ? "Deleting..." : "Delete"}
                    </button>

                    {deleteState.status === "error" && (
                        <div>{deleteState.error}</div>
                    )}
                </div>
            )}

            {requestState.status === "loading" && (
                <div>Generating Kundali...</div>
            )}

            {requestState.status === "error" && (
                <div>{requestState.error}</div>
            )}

            {requestState.status === "success" && (
                <>
                    <PanchangamDetails
                        kundaliDocument={requestState.kundaliDocument}
                        dateOfBirth={requestState.values?.dateOfBirth}
                        timeOfBirth={requestState.values?.timeOfBirth}
                        gender={requestState.values?.gender}
                    />

                    <PlanetaryPositionsTable
                        kundaliDocument={requestState.kundaliDocument}
                    />

                    <JanmaKundaliPanel
                        chart={requestState.renderLayout}
                    />
                </>
            )}

        </div>
    );
}

export default PersonDetails;
