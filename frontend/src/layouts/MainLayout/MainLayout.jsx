import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import TabBar from "../../components/TabBar/TabBar";

import "./MainLayout.css";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Desktop-only collapsed (icons-only) sidebar; remembered per browser.
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem("jp_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((previous) => {
      const next = !previous;

      try {
        window.localStorage.setItem("jp_sidebar_collapsed", next ? "1" : "0");
      } catch {
        // storage unavailable — the choice just won't persist
      }

      return next;
    });
  };

  // Close the mobile drawer on every navigation, not just outside clicks.
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={isCollapsed ? "layout layout--sidebar-collapsed" : "layout"}>
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
      />

      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="main-content">
        <Header onMenuToggle={() => setIsSidebarOpen((open) => !open)} />

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <TabBar
        isMenuOpen={isSidebarOpen}
        onMore={() => setIsSidebarOpen((open) => !open)}
      />
    </div>
  );
}

export default MainLayout;