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

// ====== TYPES ======
type LogAction =
  | "User Login"
  | "Role Update"
  | "Password Reset"
  | "Permission Grant"
  | "Data Export"
  | "System Backup"
  | "User Creation"
  | "User Deactivation";

type LogStatus = "Active" | "Failed" | "Warning";

type LogEntry = {
  id: number;
  user: string;        // placeholder (fill from backend later)
  action: LogAction;
  details: string;     // placeholder
  timestamp: string;   // placeholder
  status: LogStatus;
};

// ====== PLACEHOLDER DATA ======
const LOGS: LogEntry[] = [
  {
    id: 1,
    user: "Rafael A. Cabredo",
    action: "User Login",
    details: "Successful login from Chrome browser",
    timestamp: "2024-01-15 09:15:32",
    status: "Active",
  },
  {
    id: 2,
    user: "Ronald M. Pascual",
    action: "Password Reset",
    details: "Password reset attempted but failed - account locked",
    timestamp: "2024-01-15 09:15:32",
    status: "Failed",
  },
  {
    id: 3,
    user: "Raphael W. Gonda",
    action: "Data Export",
    details: "Exported user list – large dataset warning",
    timestamp: "2024-01-15 09:15:32",
    status: "Warning",
  },
];

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

function ActionPill({ action }: { action: LogAction }) {
  return (
    <span className="inline-flex h-8 min-w-[8.5rem] items-center justify-center rounded-full border border-gray-200 bg-white px-3 text-xs font-medium text-slate-900">
      {action}
    </span>
  );
}

function StatusPill({ status }: { status: LogStatus }) {
  const base =
    "inline-flex h-8 min-w-[5.5rem] items-center justify-center rounded-full border px-2 text-xs font-medium";
  const styles =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Failed"
      ? "bg-red-50 text-red-600 border-red-200"
      : "bg-amber-50 text-amber-600 border-amber-300";
  return <span className={`${base} ${styles}`}>{status}</span>;
}

function TimestampCell({ ts }: { ts: string }) {
  const [date, time] = ts.split(" ");
  return (
    <div className="leading-tight">
      <div className="text-[13px] text-slate-700">{date}</div>
      <div className="text-[11px] text-gray-500">{time}</div>
    </div>
  );
}



function ActionDropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number>(() =>
    Math.max(0, options.findIndex((o) => o === value))
  );

  // close on outside click
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        open &&
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // keyboard nav
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoverIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoverIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const choice = options[hoverIndex] ?? options[0];
      onChange(choice);
      setOpen(false);
      btnRef.current?.focus();
    }
  }

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      {/* trigger */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-sm shadow-sm outline-none
                   hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500/30"
      >
        {value}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
      </button>

      {/* popup list */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-2 w-[14rem] max-h-80 overflow-auto rounded-2xl border border-gray-300 bg-white shadow-lg"
        >
          {options.map((opt, idx) => {
            const active = idx === hoverIndex;
            return (
              <button
                key={opt}
                role="option"
                aria-selected={value === opt}
                onMouseEnter={() => setHoverIndex(idx)}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  btnRef.current?.focus();
                }}
                className={`block w-full text-left px-4 py-3 text-lg ${
                  active ? "bg-emerald-50" : "bg-transparent"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ====== MAIN COMPONENT ======
export default function ADMIN_AuditLogs() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // default: desktop open, mobile closed
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const setByMQ = () => setSidebarOpen(mq.matches);
    setByMQ();
    mq.addEventListener("change", setByMQ);
    return () => mq.removeEventListener("change", setByMQ);
  }, []);

  // filters
  const [q, setQ] = React.useState("");
  const [action, setAction] = React.useState<"All Actions" | LogAction>("All Actions");

  const ACTION_OPTIONS: Array<"All Actions" | LogAction> = [
    "All Actions",
    "Data Export",
    "Password Reset",
    "Permission Grant",
    "Role Update",
    "System Backup",
    "User Creation",
    "User Deactivation",
    "User Login",
  ];

  const filtered = LOGS.filter((row) => {
    const matchesAction = action === "All Actions" || row.action === action;
    const text = `${row.user} ${row.action} ${row.details}`.toLowerCase();
    const matchesQ = text.includes(q.toLowerCase().trim());
    return matchesAction && matchesQ;
  });

    const hasAnyForAction =
    action === "All Actions" ? true : LOGS.some((r) => r.action === action);

    const GRID = "grid grid-cols-[13%_22%_40%_15%_10%] items-center";


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
          ${sidebarOpen ? "md:ml-64" : "md:ml-0"} ml-0`}
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
                value={q}
                onChange={(e) => setQ(e.target.value)}
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
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track all system activities and user actions
          </p>

          {/* Search + Action Filter (inside a soft card like the mock) */}
          <div className="mt-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="Search by name, action, details..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div className="w-full sm:w-56">
                <ActionDropdown
                    value={action}
                    onChange={(v) => setAction(v as any)}
                    options={ACTION_OPTIONS}
                />
            </div>

            </div>
          </div>

          {/* Activity Log Card */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <h2 className="text-base font-semibold text-slate-800">
                Activity Log ({filtered.length} {filtered.length === 1 ? "entry" : "entries"})
              </h2>
            </div>

            {/* Table-ish list */}
            <div className="p-4">
            {/* header row */}
            <div className="grid grid-cols-[13%_22%_40%_15%_10%] items-center px-3 py-2 text-xs font-semibold text-gray-500">
            <div>User</div>

            {/* keep header centered and matching pill width */}
            <div className="flex justify-center">
                <span className="inline-block min-w-[8.5rem] text-center">Action</span>
            </div>

            <div>Details</div>
            <div>Timestamp</div>
            <div className="flex justify-center">
                <span className="inline-block min-w-[5.5rem] text-center">Status</span>
            </div>
            </div>
            <div className="mx-3 mb-2 h-[1px] bg-gray-300" />



            {filtered.map((row, i) => (
            <div
                key={row.id}
                className={`${GRID} px-3 py-3 text-sm ${
                i !== filtered.length - 1 ? "border-b border-gray-200" : ""
                }`}
            >
                {/* User */}
                <div>
                <button className="text-emerald-700 hover:underline">{row.user}</button>
                </div>

                {/* Action (centered to match header) */}
                <div className="flex justify-center">
                <ActionPill action={row.action} />
                </div>

                {/* Details (left-aligned to match header) */}
                <div className="text-gray-600">
                {row.details}
                </div>

                {/* Timestamp */}
                <div>
                <TimestampCell ts={row.timestamp} />
                </div>

                {/* Status (centered to match header) */}
                <div className="flex justify-center">
                <StatusPill status={row.status} />
                </div>
            </div>
            ))}

            {filtered.length === 0 && (
            <div className="px-3 py-10 text-center text-sm">
                {action !== "All Actions" ? (
                hasAnyForAction ? (
                    <p className="text-gray-600">
                    No <span className="font-semibold">“{action}”</span> logs
                    {q.trim() ? <> matching “{q.trim()}”</> : null}.
                    </p>
                ) : (
                    <p className="text-gray-600">
                    There are currently no <span className="font-semibold">“{action}”</span> logs.
                    </p>
                )
                ) : (
                <p className="text-gray-600">
                    No results{q.trim() ? <> for “{q.trim()}”</> : null}.
                </p>
                )}
            </div>
            )}



            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
