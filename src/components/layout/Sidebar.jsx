import { NavLink } from "react-router-dom";
import { navigationLinks } from "./navigation";

export default function Sidebar() {
  return (
    <aside className="hidden border-b border-[var(--border)] bg-white p-3 sm:p-4 lg:block lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-4 lg:mb-8">
        <img
          src="/change180_logo.webp"
          alt="Change180 Life Coaching"
          className="mx-auto h-24 w-auto lg:mx-0"
        />
      </div>

      <nav className="grid grid-cols-1 gap-2 lg:space-y-2">
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
    </aside>
  );
}
