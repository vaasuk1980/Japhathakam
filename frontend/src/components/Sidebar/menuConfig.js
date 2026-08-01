import {
  LayoutDashboard,
  UserRound,
  Library,
  CalendarDays,
  Clock,
  Settings,
} from "lucide-react";

const menuItems = Object.freeze([
  {
    id: 1,
    labelKey: "sidebar.dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    id: 2,
    labelKey: "sidebar.birthDetails",
    icon: UserRound,
    path: "/person-details",
  },
  {
    id: 9,
    labelKey: "sidebar.horoscopeLibrary",
    icon: Library,
    path: "/horoscope-library",
  },
  {
    id: 3,
    labelKey: "sidebar.panchangam",
    icon: CalendarDays,
    path: "/panchangam",
  },
  {
    id: 4,
    labelKey: "sidebar.muhurtham",
    icon: Clock,
    path: "/muhurtham",
  },
  {
    id: 8,
    labelKey: "sidebar.settings",
    icon: Settings,
    path: "/settings",
  },
]);

export default menuItems;