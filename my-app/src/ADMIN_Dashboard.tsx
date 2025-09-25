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
  UserPlus,
  Eye,
  AlertTriangle,
  PieChart,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import Login_BG from "./assets/Images/login_bg.png";

// ====== TYPES ======
type Activity = {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  icon: React.ReactNode;
  badge?: string;
};

type Placeholders = {
  term: string;
  stats: {
    totalUsers: string | number;
    activeFaculty: string | number;
    pendingAction: string | number;
  };
  activities: Activity[];
};

// ====== PLACEHOLDER DATA ======
const PLACEHOLDERS: Placeholders = {
  term: "Term 1 AY 2025-2026",
  stats: { totalUsers: "--", activeFaculty: "--", pendingAction: "--" },
  activities: [
    { id: 1, title: "User Created", subtitle: "New faculty member added to DIT department", time: "2 minutes ago", icon: <CheckCircle2 size={18} />, badge: "new" },
    { id: 2, title: "Role Updated", subtitle: "Changed from Faculty-PT to Faculty-FT", time: "15 minutes ago", icon: <ShieldCheck size={18} /> },
    { id: 3, title: "User Deactivated", subtitle: "Account set to inactive status", time: "1 hour ago", icon: <AlertTriangle size={18} /> },
    { id: 4, title: "Permission Granted", subtitle: "Admin access granted for audit logs", time: "2 hours ago", icon: <CheckCircle2 size={18} /> },
  ],
};

// ====== SMALL UI PRIMITIVES ======
type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  onNavigate?: () => void; // close sidebar on mobile after click
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

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  helper?: string;
};
function StatCard({ icon, label, value, helper }: StatCardProps) {
  return (
    <div className="flex-1 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold leading-none text-slate-900">{value}</span>
          </div>
          {helper && <p className="mt-1 text-[11px] text-gray-400">{helper}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
          {icon}
        </div>
      </div>
    </div>
  );
}

type ActivityItemProps = Omit<Activity, "id">;
function ActivityItem({ icon, title, subtitle, time, badge }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-800">{title}</p>
          {badge && (
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
        <p className="mt-1 text-[11px] text-gray-400">{time}</p>
      </div>
    </div>
  );
}

type QuickActionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
};

function QuickAction({ icon, title, subtitle, onClick }: QuickActionProps) {
  // Square via padding-top trick; content is absolutely positioned.
  return (
    <div className="relative w-full">
      <div className="pt-[100%]" /> {/* makes the card perfectly square */}
      <button
        onClick={onClick}
        className="absolute inset-0 rounded-2xl border border-gray-100 bg-white p-4 text-left
                   shadow-md hover:shadow-lg transition hover:-translate-y-0.5"
      >
        <div className="flex h-full w-full flex-col">
          {/* Icon row */}
          <div className="mb-3 text-emerald-700">{icon}</div>

          {/* Texts sit at the bottom */}
          <div className="mt-auto">
            <p className="text-base font-extrabold text-slate-900 leading-tight">
              {title}
            </p>
            <p className="text-sm text-gray-500 leading-snug">
              {subtitle}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

// ====== MAIN COMPONENT ======
export default function ADMIN_Dashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Make desktop default to open; mobile default to closed
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const setByMQ = () => setSidebarOpen(mq.matches); // open on desktop, close on mobile
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
            ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
        `}
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
                <p className="text-[11px] opacity-80">User & Role Management</p>
              </div>
            </div>

            {/* Main Navigation */}
            <p className="mb-2 pl-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-100/80">
              Main Navigation
            </p>
            <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/admin/dashboard" onNavigate={() => window.innerWidth < 768 && setSidebarOpen(false)} />
            <NavItem icon={<Users size={18} />} label="User Management" to="/admin/users" onNavigate={() => window.innerWidth < 768 && setSidebarOpen(false)} />
            <NavItem icon={<ShieldCheck size={18} />} label="Audit Logs" to="/admin/audit-logs" onNavigate={() => window.innerWidth < 768 && setSidebarOpen(false)} />
            <NavItem icon={<BellRing size={18} />} label="Notifications" to="/admin/notifications" onNavigate={() => window.innerWidth < 768 && setSidebarOpen(false)} />
            <NavItem icon={<Inbox size={18} />} label="Inbox" to="/admin/inbox" onNavigate={() => window.innerWidth < 768 && setSidebarOpen(false)} />
            </nav>

          </div>

          {/* Logout */}
          <NavLink
            to="/login"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => {
                // Optional: clear any auth tokens/localStorage here
                localStorage.removeItem("authToken");
                sessionStorage.clear();
            }}
            >
            <LogOut size={18} />
            Logout
            </NavLink> 

        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-[margin] duration-300 ease-in-out
            ${sidebarOpen ? "md:ml-64" : "md:ml-0"}
            ml-0
        `}
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
                placeholder="Search users, logs, activities.."
              />
            </div>
            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-50">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {PLACEHOLDERS.term} | College of Computer Studies | User & Role Management
          </p>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard icon={<Users className="h-6 w-6" />} label="Total Users" value={PLACEHOLDERS.stats.totalUsers} helper="Active users in system" />
            <StatCard icon={<UserCircle className="h-6 w-6" />} label="Active Faculty" value={PLACEHOLDERS.stats.activeFaculty} helper="Faculty members" />
            <StatCard icon={<AlertTriangle className="h-6 w-6" />} label="Pending Action" value={PLACEHOLDERS.stats.pendingAction} helper="Require attention" />
          </div>

          {/* Two-column area */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Recent Activity */}
            <section className="lg:col-span-2">
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
                </div>
                <div className="space-y-3 p-5">
                  {PLACEHOLDERS.activities.map((a) => (
                    <ActivityItem key={a.id} icon={a.icon} title={a.title} subtitle={a.subtitle} time={a.time} badge={a.badge} />
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-3">
                <h2 className="text-lg font-extrabold text-slate-900">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                <QuickAction
                    icon={<UserPlus className="h-7 w-7" />}
                    title="Add User"
                    subtitle="Create new account"
                />
                <QuickAction
                    icon={<Eye className="h-7 w-7" />}
                    title="View Logs"
                    subtitle="Check audit trail"
                />
                <QuickAction
                    icon={<AlertTriangle className="h-7 w-7" />}
                    title="Alerts"
                    subtitle="Review notifications"
                />
                {/*
                <QuickAction
                icon={<CheckCircle2 className="h-7 w-7" />}
                title="Reports"
                subtitle="Generate reports"
                />
                */}

                </div>
            </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
