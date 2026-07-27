import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* ==========================================
          Application Branding
      ========================================== */}
      <div className="header-left">
        <div className="app-logo">
          <svg
            className="app-logo__mark"
            viewBox="0 0 40 40"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="18" />
            <rect x="11" y="11" width="18" height="18" transform="rotate(45 20 20)" />
            <circle className="app-logo__mark-bindu" cx="20" cy="20" r="2.5" />
          </svg>

          <div className="app-logo__text">
            <span className="app-logo__title">జాఫతకం</span>
            <span className="app-logo__subtitle">Japhathakam</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          User Section
      ========================================== */}
      <div className="header-right">
        <span className="user-name">
          Welcome, Sreenivasa Chari
        </span>
      </div>
    </header>
  );
}

export default Header;