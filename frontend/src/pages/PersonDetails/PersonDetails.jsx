import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

function PersonDetails() {

    const handleSubmit = (values) => {

        console.log("========== PERSON PAYLOAD ==========");
        console.log(values);

    };

    return (
        <div>

            <h1>Person Details</h1>

            <DynamicForm
                schema={personSchema}
                onSubmit={handleSubmit}
            />

        </div>
    );
}

export default PersonDetails;