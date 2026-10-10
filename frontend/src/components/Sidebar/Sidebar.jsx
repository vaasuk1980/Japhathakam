import "./Sidebar.css";

import SidebarMenu from "./SidebarMenu";
import BrandLogo from "../BrandLogo/BrandLogo";
import SidebarFooter from "./SidebarFooter";

function Sidebar({ isOpen, isCollapsed, onToggleCollapse }) {
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

      <SidebarMenu />

      <SidebarFooter
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </aside>
  );
}

export default Sidebar;
