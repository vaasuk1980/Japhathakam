import { Link } from "react-router-dom";

import "./EmptyState.css";

// Icon + message + optional action. `action` is either
// { label, to } (renders a link-styled button) or
// { label, onClick } (renders a button).
function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="jp-empty-state">
      {Icon && (
        <div className="jp-empty-state__icon" aria-hidden="true">
          <Icon size={28} />
        </div>
      )}

      {title && <h3 className="jp-empty-state__title">{title}</h3>}
      {message && <p className="jp-empty-state__message">{message}</p>}

      {action && action.to && (
        <Link to={action.to} className="jp-empty-state__action">
          {action.label}
        </Link>
      )}

      {action && !action.to && (
        <button
          type="button"
          className="jp-empty-state__action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
