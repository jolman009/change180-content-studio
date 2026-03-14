import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 touch-pan-y overscroll-y-contain p-3 pb-28 [webkit-overflow-scrolling:touch] sm:p-6 sm:pb-32 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
