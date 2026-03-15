import {
  CalendarDays,
  LayoutDashboard,
  Link2,
  NotebookPen,
  PenSquare,
  Settings2,
} from "lucide-react";

export const navigationLinks = [
  { to: "/", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard, end: true },
  { to: "/brand", label: "Brand Profile", shortLabel: "Brand", icon: Settings2 },
  { to: "/accounts", label: "Connected Accounts", shortLabel: "Accounts", icon: Link2 },
  { to: "/create", label: "Create Content", shortLabel: "Create", icon: PenSquare },
  { to: "/calendar", label: "Calendar", shortLabel: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics Notes", shortLabel: "Notes", icon: NotebookPen },
];
