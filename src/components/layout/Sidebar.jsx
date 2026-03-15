import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { navigationLinks } from "./navigation";
import { useAuth } from "../../lib/authContext";

export default function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden border-b border-[var(--border)] bg-white p-3 sm:p-4 lg:flex lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-4 lg:mb-8">
        <img
          src="/change180_logo.webp"
          alt="Change180 Life Coaching"
          className="mx-auto h-24 w-auto lg:mx-0"
        />
      </div>

      <nav className="grid grid-cols-1 gap-1 lg:gap-0 lg:space-y-1">
        {navigationLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
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

      <div className="flex-1" />
      {user && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="mb-2 truncate text-xs text-[var(--muted)]">{user.email}</p>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg)]"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
