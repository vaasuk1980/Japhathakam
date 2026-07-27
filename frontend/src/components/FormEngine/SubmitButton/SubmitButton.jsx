import "./SubmitButton.css";

function SubmitButton({ label = "Submit" }) {
    return (
        <button
            type="submit"
            className="jp-submit-button"
        >
            {label}
        </button>
    );
}

export default SubmitButton;