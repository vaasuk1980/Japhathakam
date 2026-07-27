import { useState } from "react";

import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

import GenerateKundaliService from "../../services/GenerateKundaliService";

import KundaliWorkspace from "../../components/kundali/KundaliWorkspace";

import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";

function NewHoroscope() {

    const [requestState, setRequestState] = useState({
        status: "idle",
        document: null,
        values: null,
        error: null
    });

    const handleGenerateKundali = async (values) => {

        setRequestState({
            status: "loading",
            document: null,
            values: null,
            error: null
        });

        try {

            const response =
                await GenerateKundaliService.generate(values);

            const kundaliDocument = response.kundali;

            const renderLayout =
                KundaliRenderEngine.render(kundaliDocument.janmaChart);

            setRequestState({
                status: "success",
                document: renderLayout,
                values,
                error: null
            });

        }
        catch (error) {

            console.error("Kundali Generation Error");
            console.error(error);

            setRequestState({
                status: "error",
                document: null,
                values: null,
                error: error.message
            });

        }

    };

    return (

        <div className="new-horoscope-page">

            <h1>New Horoscope</h1>

            <DynamicForm
                schema={personSchema}
                onSubmit={handleGenerateKundali}
            />

            {requestState.status === "loading" && (

                <div>
                    Generating Kundali...
                </div>

            )}

            {requestState.status === "error" && (

                <div>
                    {requestState.error}
                </div>

            )}

            {requestState.status === "success" && (

                <KundaliWorkspace
                    renderLayout={requestState.document}
                    birthDetails={requestState.values}
                />

            )}

        </div>

    );

}

export default NewHoroscope;
