import "./Sidebar.css";

import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <SidebarMenu />
      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;