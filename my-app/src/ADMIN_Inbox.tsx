import React from "react";
import { NavLink } from "react-router-dom";
import {
  PanelLeft,
  Search,
  Bell,
  UserCircle,
  LayoutDashboard,
  Users,
  ShieldCheck,
  BellRing,
  Inbox,
  LogOut,
} from "lucide-react";
import Login_BG from "./assets/Images/login_bg.png";

// ====== SMALL UI PRIMITIVES ======
type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  onNavigate?: () => void;
};
function NavItem({ icon, label, to, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm transition
         hover:bg-white/10 hover:text-white/90
         ${isActive ? "bg-white/10 text-white" : "text-white/80"}`
      }
    >
      <span className="shrink-0 opacity-95">{icon}</span>
      <span className="tracking-wide">{label}</span>
    </NavLink>
  );
}

// ====== MAIN SHELL (blank content) ======
export default function ADMIN_ShellBlank() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  // default: desktop open, mobile closed
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const setByMQ = () => setSidebarOpen(mq.matches);
    setByMQ();
    mq.addEventListener("change", setByMQ);
    return () => mq.removeEventListener("change", setByMQ);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-hidden transform transition-transform duration-300 will-change-transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
        style={{
          backgroundImage: `url(${Login_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/95 via-emerald-800/95 to-emerald-900/95" />

        <div className="relative flex h-full flex-col justify-between p-5">
          <div>
            {/* Header */}
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-white/5 p-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <UserCircle className="h-6 w-6" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Admin Panel</p>
                <p className="text-[11px] opacity-80">Navigation</p>
              </div>
            </div>

            {/* Main Navigation */}
            <p className="mb-2 pl-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-100/80">
              Main Navigation
            </p>
            <nav className="space-y-1">
              <NavItem
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                to="/admin/dashboard"
                onNavigate={() =>
                  window.innerWidth < 768 && setSidebarOpen(false)
                }
              />
              <NavItem
                icon={<Users size={18} />}
                label="User Management"
                to="/admin/users"
                onNavigate={() =>
                  window.innerWidth < 768 && setSidebarOpen(false)
                }
              />
              <NavItem
                icon={<ShieldCheck size={18} />}
                label="Audit Logs"
                to="/admin/audit-logs"
                onNavigate={() =>
                  window.innerWidth < 768 && setSidebarOpen(false)
                }
              />
              <NavItem
                icon={<BellRing size={18} />}
                label="Notifications"
                to="/admin/notifications"
                onNavigate={() =>
                  window.innerWidth < 768 && setSidebarOpen(false)
                }
              />
              <NavItem
                icon={<Inbox size={18} />}
                label="Inbox"
                to="/admin/inbox"
                onNavigate={() =>
                  window.innerWidth < 768 && setSidebarOpen(false)
                }
              />
            </nav>
          </div>

          {/* Logout */}
          <NavLink
            to="/login"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => {
              localStorage.removeItem("authToken");
              sessionStorage.clear();
            }}
          >
            <LogOut size={18} />
            Logout
          </NavLink>
        </div>
      </aside>

      {/* Main Content (blank canvas) */}
      <main
        className={`min-h-screen transition-[margin] duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        } ml-0`}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
            <button
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-50"
              aria-label="Toggle sidebar"
              aria-controls="app-sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <PanelLeft className="h-5 w-5" />
            </button>

            <div className="relative ml-1 flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Search…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-50">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Blank canvas area */}
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* Add page content here */}
        </div>
      </main>
    </div>
  );
}
