import { NavLink } from "react-router-dom";

import { useTranslation } from "../../i18n/I18nContext";

function SidebarItem({ item }) {
  const Icon = item.icon;
  const { t } = useTranslation();

  return (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          isActive
            ? "sidebar-item active"
            : "sidebar-item"
        }
      >
        <Icon size={18} />

        <span>{t(item.labelKey)}</span>
      </NavLink>
    </li>
  );
}

export default SidebarItem;