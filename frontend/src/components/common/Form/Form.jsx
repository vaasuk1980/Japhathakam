import { forwardRef } from "react";
import "./Form.css";

const Form = forwardRef(function Form(
    {
        children,
        className = "",
        ...props
    },
    ref
) {
    const formClassName = [
        "jp-form",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <form
            ref={ref}
            className={formClassName}
            {...props}
        >
            {children}
        </form>
    );
});

Form.displayName = "Form";

export default Form;