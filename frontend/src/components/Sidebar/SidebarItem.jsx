import { NavLink } from "react-router-dom";

import { useTranslation } from "../../i18n/I18nContext";

function SidebarItem({ item }) {
  const Icon = item.icon;
  const { t } = useTranslation();

  return (
    <li>
      <NavLink
        to={item.path}
        title={t(item.labelKey)}
        end={item.path === "/"}
        className={({ isActive }) =>
          isActive
            ? "sidebar-item active"
            : "sidebar-item"
        }
      >
        <Icon size={18} />

        <span className="sidebar-item__label">{t(item.labelKey)}</span>

        {item.comingSoon && (
          <span className="sidebar-item__badge">
            {t("sidebar.comingSoon")}
          </span>
        )}
      </NavLink>
    </li>
  );
}

export default SidebarItem;