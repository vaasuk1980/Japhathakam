import "./BrandLogo.css";

// Wordmark only (the medallion image was removed by request): the
// Telugu name stacked over the English tagline, left-aligned.
function BrandLogo({ className = "" }) {
  return (
    <div className={`app-logo ${className}`.trim()}>
      <span className="app-logo__title">జాఫతకం</span>
      <span className="app-logo__subtitle">Truth of Light</span>
    </div>
  );
}

export default BrandLogo;
