import { NavLink } from "react-router-dom";
import { LayoutDashboard, PenSquare, CalendarDays, Settings2 } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/brand", label: "Brand Profile", icon: Settings2 },
  { to: "/create", label: "Create Content", icon: PenSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
];

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-[var(--border)] bg-white p-5">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Change180</h1>
        <p className="text-sm text-gray-500">Content Studio</p>
      </div>

      <nav className="space-y-2">
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
