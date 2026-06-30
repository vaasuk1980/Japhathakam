import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* ==========================================
          Application Branding
      ========================================== */}
      <div className="header-left">
        <h1 className="app-title">జాఫతకం</h1>
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