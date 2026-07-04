import DynamicForm from "../../components/FormEngine/DynamicForm";
import personSchema from "../../schemas/person.schema";

function PersonDetails() {
    return (
        <div>
            <h1>Person Details</h1>

            <DynamicForm
                schema={personSchema}
            />
        </div>
    );
}

export default PersonDetails;