import { Menu } from "lucide-react";

import { useTranslation } from "../../i18n/I18nContext";
import HeaderSearch from "./HeaderSearch";
import logoIcon from "../../assets/logo-icon.png";

import "./Header.css";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
];

function Header({ onMenuToggle }) {
  const { t, language, setLanguage } = useTranslation();

  return (
    <header className="header">
      {/* ==========================================
          Application Branding
      ========================================== */}
      <div className="header-left">
        <button
          type="button"
          className="header-menu-toggle"
          aria-label={t("header.toggleMenu")}
          onClick={onMenuToggle}
        >
          <Menu size={22} />
        </button>

        <div className="app-logo">
          <img
            className="app-logo__mark"
            src={logoIcon}
            alt=""
            aria-hidden="true"
          />

          <div className="app-logo__text">
            <span className="app-logo__title">జాఫతకం</span>
            <span className="app-logo__subtitle">TRUTH OF LIGHT</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          Global Search
      ========================================== */}
      <div className="header-center">
        <HeaderSearch />
      </div>

      {/* ==========================================
          User Section
      ========================================== */}
      <div className="header-right">
        <select
          className="language-switcher"
          aria-label={t("header.language")}
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {LANGUAGES.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="user-name">
          {t("header.welcome", { name: "Sreenivasa Chari" })}
        </span>
      </div>
    </header>
  );
}

export default Header;