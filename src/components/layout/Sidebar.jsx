import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  CalendarDays,
  Settings2,
  NotebookPen,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/brand", label: "Brand Profile", icon: Settings2 },
  { to: "/create", label: "Create Content", icon: PenSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics Notes", icon: NotebookPen },
];

export default function Sidebar() {
  return (
    <aside className="border-b border-[var(--border)] bg-white p-4 lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-5 lg:mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Change180</h1>
        <p className="text-sm text-gray-500">Content Studio</p>
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--bg)]"
              }`
            }
          >
            <link.icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
