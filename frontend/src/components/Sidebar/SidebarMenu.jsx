import { useTranslation } from "../../i18n/I18nContext";

import SidebarItem from "./SidebarItem";
import menuItems, { menuGroups } from "./menuConfig";

function SidebarMenu() {
  const { t } = useTranslation();

  return (
    <nav className="sidebar-menu">
      {menuGroups.map((group) => {
        const items = menuItems.filter((item) => item.group === group.id);

        if (items.length === 0) {
          return null;
        }

        return (
          <section className="sidebar-group" key={group.id}>
            <h2 className="sidebar-group__title">{t(group.labelKey)}</h2>

            <ul className="sidebar-list">
              {items.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}

export default SidebarMenu;
