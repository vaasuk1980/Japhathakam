import "./ErrorMessage.css";

function ErrorMessage({ message }) {
    if (!message) {
        return null;
    }

    return (
        <div className="form-error">
            {message}
        </div>
    );
}

export default ErrorMessage;