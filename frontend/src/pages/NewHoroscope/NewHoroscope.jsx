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
        error: null
    });

    const handleGenerateKundali = async (values) => {

        console.log("========== GENERATE KUNDALI ==========");
        console.log(values);

        setRequestState({
            status: "loading",
            document: null,
            error: null
        });

        try {

            const response =
                await GenerateKundaliService.generate(values);

            const kundaliDocument = response.kundali;

            console.log("================================");
            console.log("KUNDALI DOCUMENT");
            console.log(kundaliDocument);

            console.log("================================");
            console.log("FIRST CELL");
            console.log(kundaliDocument.janmaChart.cells[0]);

            console.log("================================");
            console.log("FIRST GRAHA");
            console.log(kundaliDocument.janmaChart.cells[0].grahas[0]);

            const renderLayout =
                KundaliRenderEngine.render(kundaliDocument);

            console.log("================================");
            console.log("RENDER LAYOUT");
            console.log(renderLayout);

            setRequestState({
                status: "success",
                document: renderLayout,
                error: null
            });

        }
        catch (error) {

            console.error("Kundali Generation Error");
            console.error(error);

            setRequestState({
                status: "error",
                document: null,
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
                />

            )}

        </div>

    );

}

export default NewHoroscope;