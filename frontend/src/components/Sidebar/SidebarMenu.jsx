import SidebarItem from "./SidebarItem";
import menuItems from "./menuConfig";

function SidebarMenu() {
  return (
    <nav className="sidebar-menu">
      <ul className="sidebar-list">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
          />
        ))}
      </ul>
    </nav>
  );
}

export default SidebarMenu;