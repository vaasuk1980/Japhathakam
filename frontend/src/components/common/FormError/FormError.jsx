import "./FormError.css";

function FormError({ children }) {
    if (!children) return null;

    return (
        <p className="form-error">
            {children}
        </p>
    );
}

export default FormError;