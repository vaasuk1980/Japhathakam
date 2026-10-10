import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { useTranslation } from "../../i18n/I18nContext";

function SidebarFooter({ isCollapsed, onToggleCollapse }) {
  const { t } = useTranslation();
  const label = isCollapsed ? t("sidebar.expand") : t("sidebar.collapse");
  const Icon = isCollapsed ? ChevronsRight : ChevronsLeft;

  return (
    <div className="sidebar-footer">
      <button
        type="button"
        className="sidebar-collapse-toggle"
        onClick={onToggleCollapse}
        aria-label={label}
        aria-pressed={isCollapsed}
        title={label}
      >
        <Icon size={18} />
        <span className="sidebar-item__label">{label}</span>
      </button>
    </div>
  );
}

export default SidebarFooter;
