import { Menu } from "lucide-react";

import { useTranslation } from "../../i18n/I18nContext";
import HeaderSearch from "./HeaderSearch";
import HeaderLocation from "./HeaderLocation";
import HeaderDateTime from "./HeaderDateTime";
import BrandLogo from "../BrandLogo/BrandLogo";

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
          Menu toggle + brand (brand shows here only on phones;
          on wide screens it sits at the top of the sidebar)
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

        <BrandLogo className="header-brand" />
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

        <HeaderDateTime />

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

        <HeaderLocation />
      </div>
    </header>
  );
}

export default Header;