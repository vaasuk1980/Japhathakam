import "./Skeleton.css";

// Placeholder shown while data loads. Purely decorative, so it is
// hidden from assistive tech; the container that renders it should
// carry aria-busy.
function Skeleton({ width = "100%", height = "1em", className = "" }) {
  return (
    <span
      className={`jp-skeleton ${className}`.trim()}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// A stack of full-width lines, e.g. while a card's body loads.
export function SkeletonLines({ count = 4 }) {
  return (
    <div className="jp-skeleton-lines" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          width={index === count - 1 ? "60%" : "100%"}
          height="14px"
        />
      ))}
    </div>
  );
}

// Table-shaped placeholder: `rows` rows of `columns` cells.
export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="jp-skeleton-table" aria-busy="true">
      {Array.from({ length: rows }, (_, row) => (
        <div className="jp-skeleton-table__row" key={row}>
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton key={column} height="14px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
