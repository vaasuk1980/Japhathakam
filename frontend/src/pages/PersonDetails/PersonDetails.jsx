import { useState } from "react";

import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

import GenerateKundaliService from "../../services/GenerateKundaliService";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";

import PlanetaryPositionsTable from "../../components/kundali/PlanetaryPositionsTable";
import JanmaKundaliPanel from "../../components/kundali/JanmaKundaliPanel";

function PersonDetails() {

    const [requestState, setRequestState] = useState({
        status: "idle",
        kundaliDocument: null,
        renderLayout: null,
        error: null,
    });

    const handleSubmit = async (values) => {

        console.log("========== PERSON PAYLOAD ==========");
        console.log(values);

        setRequestState({
            status: "loading",
            kundaliDocument: null,
            renderLayout: null,
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
                error: error.message,
            });

        }

    };

    return (
        <div>

            <h1>Person Details</h1>

            <DynamicForm
                schema={personSchema}
                onSubmit={handleSubmit}
            />

            {requestState.status === "loading" && (
                <div>Generating Kundali...</div>
            )}

            {requestState.status === "error" && (
                <div>{requestState.error}</div>
            )}

            {requestState.status === "success" && (
                <>
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