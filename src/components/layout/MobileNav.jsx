import { NavLink } from "react-router-dom";
import { navigationLinks } from "./navigation";

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur [webkit-tap-highlight-color:transparent] lg:hidden">
      <div className="grid grid-cols-6 gap-1">
        {navigationLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex min-h-16 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl px-1 text-center text-[11px] font-medium transition ${
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text)] hover:bg-[var(--bg)]"
              }`
            }
          >
            <link.icon size={18} />
            <span className="leading-tight">{link.shortLabel}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
