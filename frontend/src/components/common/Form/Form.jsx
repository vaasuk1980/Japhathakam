import "./Form.css";

function Form({ children, className = "", ...props }) {
  return (
    <form
      className={`app-form ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

export default Form;