import {
  LayoutDashboard,
  UserRound,
  Search,
  BookOpen,
  Clock3,
  FileText,
  ScrollText,
  Settings,
} from "lucide-react";

const menuItems = Object.freeze([
  {
    id: 1,
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    id: 2,
    label: "Birth Details",
    icon: UserRound,
    path: "/person-details",
  },
  {
    id: 3,
    label: "Analysis",
    icon: Search,
    path: "/analysis",
  },
  {
    id: 4,
    label: "Knowledge",
    icon: BookOpen,
    path: "/knowledge",
  },
  {
    id: 5,
    label: "Timeline",
    icon: Clock3,
    path: "/timeline",
  },
  {
    id: 6,
    label: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    id: 7,
    label: "Sitara Jatakam",
    icon: ScrollText,
    path: "/sitara-jatakam",
  },
  {
    id: 8,
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
]);

export default menuItems;