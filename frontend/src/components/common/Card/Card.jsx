import "./Card.css";

function Card({
  children,
  title,
  padding = "medium",
  shadow = "medium",
  fullWidth = false,
  className = "",
  ...props
}) {
  const cardClass = [
    "card",
    `card-padding-${padding}`,
    `card-shadow-${shadow}`,
    fullWidth ? "card-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass} {...props}>
      {title && <h3 className="card-title">{title}</h3>}

      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default Card;