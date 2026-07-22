import { useState } from "react";

import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

import GenerateKundaliService from "../../services/GenerateKundaliService";

import KundaliWorkspace from "../../components/kundali/KundaliWorkspace";

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

            console.log("Kundali Document");
            console.log(response.kundali);

            setRequestState({
                status: "success",
                document: response.kundali,
                error: null
            });

        }
        catch (error) {

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
                    kundaliDocument={requestState.document}
                />

            )}

        </div>

    );

}

export default NewHoroscope;