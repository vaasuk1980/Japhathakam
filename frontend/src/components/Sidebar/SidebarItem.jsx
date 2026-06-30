import { NavLink } from "react-router-dom";

function SidebarItem({ item }) {
  const Icon = item.icon;

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

        <span>{item.label}</span>
      </NavLink>
    </li>
  );
}

export default SidebarItem;