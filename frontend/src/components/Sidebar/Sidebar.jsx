import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { useTranslation } from "../../i18n/I18nContext";

import "./Sidebar.css";

import SidebarMenu from "./SidebarMenu";
import BrandLogo from "../BrandLogo/BrandLogo";
import SidebarFooter from "./SidebarFooter";

function Sidebar({ isOpen, isCollapsed, onToggleCollapse }) {
  const { t } = useTranslation();

  const className = [
    "sidebar",
    isOpen ? "sidebar--open" : "",
    isCollapsed ? "sidebar--collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={className}>
      <div className="sidebar-brand">
        <BrandLogo className="app-logo--on-dark" />
      </div>

      <Link
        to="/person-details"
        className="sidebar-add"
        title={t("dashboard.quickActions.newHoroscope")}
      >
        <Plus size={18} />
        <span className="sidebar-add__label">
          {t("dashboard.quickActions.newHoroscope")}
        </span>
      </Link>

      <SidebarMenu />

      <SidebarFooter
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </aside>
  );
}

export default Sidebar;
