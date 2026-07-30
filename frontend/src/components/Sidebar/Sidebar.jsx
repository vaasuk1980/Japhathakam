import "./Sidebar.css";

import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

function Sidebar({ isOpen }) {
  return (
    <aside className={isOpen ? "sidebar sidebar--open" : "sidebar"}>
      <SidebarMenu />
      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;