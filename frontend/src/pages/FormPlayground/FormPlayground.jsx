import "./FormPlayground.css";

import Form, {
    FormSection,
    FormRow,
} from "../../components/common/Form";

import Input from "../../components/common/Input";

function FormPlayground() {
    return (
        <div className="form-playground">

            <h1>Form Playground</h1>

            <Form>

                <FormSection title="Personal Information">

                    <FormRow>

                        <Input
                        label="Full Name"
                        name="fullName"
                        placeholder="Enter Full Name" 
                        required value=""onChange={() => {}}
                        
                        />

                        <Input
                            label="Gender"
                            name="gender"
                            placeholder="Male / Female"
                            value=""
                            onChange={() => {}}
                        />

                    </FormRow>

                </FormSection>

            </Form>

        </div>
    );
}

export default FormPlayground;