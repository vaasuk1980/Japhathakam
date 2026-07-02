import "./FormRow.css";

function FormRow({ children, className = "" }) {
    return (
        <div className={`jp-form-row ${className}`}>
            {children}
        </div>
    );
}

export default FormRow;