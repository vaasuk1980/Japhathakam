import {
  LayoutDashboard,
  UserRound,
  Library,
  GitCompare,
  CalendarDays,
  Clock,
  Compass,
  Settings,
} from "lucide-react";

const menuItems = Object.freeze([
  {
    id: 1,
    labelKey: "sidebar.dashboard",
    icon: LayoutDashboard,
    path: "/",
    tone: "primary",
    group: "workspace",
  },
  {
    id: 2,
    labelKey: "sidebar.birthDetails",
    icon: UserRound,
    path: "/person-details",
    tone: "blue",
    group: "workspace",
  },
  {
    id: 9,
    labelKey: "sidebar.horoscopeLibrary",
    icon: Library,
    path: "/horoscope-library",
    tone: "blue",
    group: "workspace",
  },
  {
    id: 10,
    labelKey: "sidebar.compareKundalis",
    icon: GitCompare,
    path: "/compare-kundalis",
    tone: "orange",
    group: "workspace",
  },
  {
    id: 3,
    labelKey: "sidebar.panchangam",
    icon: CalendarDays,
    path: "/panchangam",
    tone: "green",
    group: "almanac",
  },
  {
    id: 4,
    labelKey: "sidebar.muhurtham",
    icon: Clock,
    path: "/muhurtham",
    tone: "blue",
    group: "almanac",
    comingSoon: true,
  },
  {
    id: 11,
    labelKey: "sidebar.prashna",
    icon: Compass,
    path: "/prashna",
    tone: "orange",
    group: "almanac",
  },
  {
    id: 8,
    labelKey: "sidebar.settings",
    icon: Settings,
    path: "/settings",
    tone: "black",
    group: "system",
  },
]);

// Section order + translation keys for the grouped sidebar.
export const menuGroups = Object.freeze([
  { id: "workspace", labelKey: "sidebar.groups.workspace" },
  { id: "almanac", labelKey: "sidebar.groups.almanac" },
  { id: "system", labelKey: "sidebar.groups.system" },
]);

export default menuItems;