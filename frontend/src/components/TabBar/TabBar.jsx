import { NavLink, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Library, CalendarDays, Menu, Plus } from "lucide-react";

import { useTranslation } from "../../i18n/I18nContext";

import "./TabBar.css";

const TABS = [
  { to: "/", labelKey: "sidebar.dashboard", icon: LayoutDashboard, end: true },
  { to: "/horoscope-library", labelKey: "sidebar.horoscopeLibrary", icon: Library },
  { to: "/panchangam", labelKey: "sidebar.panchangam", icon: CalendarDays },
];

// Sankalpa-style phone navigation: a bottom tab bar (the fourth tab
// opens the full menu drawer) plus a floating green "+" that starts a
// new horoscope. Both are hidden on desktop and in print.
function TabBar({ onMore, isMenuOpen }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // The form page IS the new-horoscope flow, so no second "+" there.
  const showFab = pathname !== "/person-details";

  return (
    <>
      <nav className="tabbar no-print" aria-label="Main">
        {TABS.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            <Icon size={24} strokeWidth={1.8} />
            {t(labelKey)}
          </NavLink>
        ))}

        <button
          type="button"
          className={isMenuOpen ? "tab active" : "tab"}
          onClick={onMore}
          aria-expanded={isMenuOpen}
        >
          <Menu size={24} strokeWidth={1.8} />
          {t("sidebar.more")}
        </button>
      </nav>

      {showFab && (
        <Link
          to="/person-details"
          className="fab no-print"
          aria-label={t("dashboard.quickActions.newHoroscope")}
        >
          <Plus size={26} strokeWidth={2.4} />
        </Link>
      )}
    </>
  );
}

export default TabBar;
