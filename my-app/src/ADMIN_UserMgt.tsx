import React, { useMemo, useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  PanelLeft,
  Search,
  Bell,
  UserCircle,
  LayoutDashboard,
  Users as UsersIcon,
  ShieldCheck,
  BellRing,
  Inbox,
  LogOut,
  Plus,
  MoreHorizontal,
  PencilLine,
  Trash2,
} from "lucide-react";
import Login_BG from "./assets/Images/login_bg.png";

/* =================== DROPDOWN (matches screenshot) =================== */
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
    <div className="relative w-56" onKeyDown={onKeyDown}>
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
/* ===================================================================== */

/** ====== TYPES ====== */
type UserStatus = "Active" | "Leave" | "Sabbatical" | "Inactive";
type UserRole =
  | "All Roles"
  | "APO"
  | "Department Chair"
  | "Department Secretary"
  | "Faculty-FT"
  | "Faculty-PT"
  | "Office Assistant"
  | "Office Manager"
  | "Provost’s Office"
  | "Student";

type UserRow = {
  id: number;
  fullName: string;
  email: string;
  status: UserStatus;
  role: Exclude<UserRole, "All Roles">;
  department: string;
  joinedDate: string;
  passwordMasked: string;
};

/** ====== PLACEHOLDER DATA ====== */
const USERS: UserRow[] = [
  {
    id: 1,
    fullName: "Rafael A. Cabredo",
    email: "rafael.cabredo@dlsu.edu.ph",
    status: "Active",
    role: "Faculty-FT",
    department: "DST",
    joinedDate: "1/15/2024",
    passwordMasked: "********",
  },
  {
    id: 2,
    fullName: "Ronald M. Pascual",
    email: "ronald.pascual@dlsu.edu.ph",
    status: "Active",
    role: "Department Chair",
    department: "DCT",
    joinedDate: "8/20/2023",
    passwordMasked: "********",
  },
  {
    id: 3,
    fullName: "Raphael W. Gonda",
    email: "raphael.gonda@dlsu.edu.ph",
    status: "Active",
    role: "APO",
    department: "DIT",
    joinedDate: "3/1/2023",
    passwordMasked: "********",
  },
  {
    id: 4,
    fullName: "Lissa Magpantay",
    email: "lissa.magpantay@dlsu.edu.ph",
    status: "Sabbatical",
    role: "Department Chair",
    department: "DIT",
    joinedDate: "3/1/2023",
    passwordMasked: "********",
  },
  {
    id: 5,
    fullName: "Jameelch Dacanay",
    email: "jameelch.dacanay@dlsu.edu.ph",
    status: "Leave",
    role: "Office Manager",
    department: "DST",
    joinedDate: "3/1/2023",
    passwordMasked: "********",
  },
  {
    id: 6,
    fullName: "Alyssa T. Cruz",
    email: "alyssa.cruz@dlsu.edu.ph",
    status: "Inactive",
    role: "Office Assistant",
    department: "DST",
    joinedDate: "2/12/2022",
    passwordMasked: "********",
  },
];


/** ====== CONSTANTS (alphabetized after 'All Roles') ====== */
const ROLE_OPTIONS: UserRole[] = [
  "All Roles",
  "APO",
  "Department Chair",
  "Faculty-FT",
  "Faculty-PT",
  "Office Assistant",
  "Office Manager",
  "Provost’s Office",
  "Student",
];

/** ====== NAV ITEM ====== */
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

/* === Unified pill sizing === */
const PILL_BASE =
  "inline-flex h-8 min-w-[7.5rem] items-center justify-center rounded-full px-3 text-xs font-medium";

/* Status pill — same size & border as role chip */
const StatusPill: React.FC<{ status: UserStatus }> = ({ status }) => {
  const styles: Record<
    UserStatus,
    { wrap: string }
  > = {
    Active:     { wrap: "border border-emerald-200 bg-emerald-50 text-emerald-700" },
    Leave:      { wrap: "border border-blue-200 bg-blue-50 text-blue-700" },
    Sabbatical: { wrap: "border border-amber-200 bg-amber-50 text-amber-700" },
    Inactive:   { wrap: "border border-neutral-200 bg-neutral-100 text-neutral-600" },
  };
  return <span className={`${PILL_BASE} ${styles[status].wrap}`}>{status}</span>;
};

/* Role chip — same base size/shape */
const RoleChip: React.FC<{ label: string }> = ({ label }) => (
  <span className={`${PILL_BASE} border border-neutral-200 bg-white text-neutral-700`}>
    {label}
  </span>
);


const DeptTag: React.FC<{ code: string }> = ({ code }) => (
  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
    {code}
  </span>
);

/** ====== SHELL + PAGE ====== */
export default function ADMIN_UserMgt() {
  // shell state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalQ, setGlobalQ] = useState("");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const setByMQ = () => setSidebarOpen(mq.matches);
    setByMQ();
    mq.addEventListener("change", setByMQ);
    return () => mq.removeEventListener("change", setByMQ);
  }, []);

  // page state
  const [q, setQ] = useState("");
  const [role, setRole] = useState<UserRole>("All Roles");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // close row menus on outside click
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return USERS.filter((u) => {
      const matchesSearch =
        !term ||
        u.fullName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      const matchesRole = role === "All Roles" ? true : u.role === role;
      const matchesStatus = showActiveOnly ? u.status === "Active" : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [q, role, showActiveOnly]);

  const handleEdit = (row: UserRow) => {
    console.log("Edit user:", row);
    setMenuOpenId(null);
  };

  const handleDelete = (row: UserRow) => {
    console.log("Delete user:", row);
    setMenuOpenId(null);
  };

  return (
     <div
        className="min-h-screen w-full bg-gray-50 text-slate-900"
        style={{ scrollbarGutter: "stable both-edges" }}>
            
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
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-hidden transform transition-transform duration-300 will-change-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
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
                <p className="text-[11px] opacity-80">User &amp; Role Management</p>
              </div>
            </div>

            {/* Main Navigation */}
            <p className="mb-2 pl-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-100/80">
              Main Navigation
            </p>
            <nav className="space-y-1">
              <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/admin/dashboard" />
              <NavItem icon={<UsersIcon size={18} />} label="User Management" to="/admin/users" />
              <NavItem icon={<ShieldCheck size={18} />} label="Audit Logs" to="/admin/audit-logs" />
              <NavItem icon={<BellRing size={18} />} label="Notifications" to="/admin/notifications" />
              <NavItem icon={<Inbox size={18} />} label="Inbox" to="/admin/inbox" />
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
                placeholder="Search users, logs, activities.."
                value={globalQ}
                onChange={(e) => setGlobalQ(e.target.value)}
              />
            </div>

            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-50">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ======== USER MANAGEMENT CONTENT ======== */}
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
          <p className="mt-1 text-sm text-neutral-600">Manage user accounts, roles, permission</p>

          {/* Top controls */}
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4">
            {/* Search by name */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name..."
                className="h-10 w-143 rounded-lg border border-neutral-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Role filter — uses the custom dropdown */}
            <ActionDropdown
              value={role}
              onChange={(v) => setRole(v as UserRole)}
              options={ROLE_OPTIONS}
            />

            {/* Status filter */}
            <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
            <button
                onClick={() => setShowActiveOnly(false)}
                aria-pressed={!showActiveOnly}
                className={`h-10 rounded-md px-4 text-sm font-medium transition ${
                !showActiveOnly ? "bg-green-600 text-white" : "text-neutral-800 hover:bg-neutral-50"
                }`}
            >
                Show All Status
            </button>
            <button
                onClick={() => setShowActiveOnly(true)}
                aria-pressed={showActiveOnly}
                className={`h-10 rounded-md px-4 text-sm font-medium transition ${
                showActiveOnly ? "bg-green-600 text-white" : "text-neutral-800 hover:bg-neutral-50"
                }`}
            >
                Show Active
            </button>
            </div>


            {/* Add User */}
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700"
              onClick={() => console.log("Add User")}
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>

          {/* Table card */}
          <div className="mt-5 rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div className="text-sm font-medium text-neutral-700">
                User <span className="text-neutral-500">({filtered.length})</span>
              </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm table-fixed">
                <colgroup>
                <col className="w-[260px]" />   {/* Full Name */}
                <col />                         {/* Email */}
                <col className="w-[9.5rem]" />  {/* Status */}
                <col className="w-[9.5rem]" />  {/* Role */}
                <col className="w-[9.5rem]" />  {/* Department */}
                <col />                         {/* Joined Date */}
                <col />                         {/* Password */}
                <col className="w-[92px]" />    {/* Action */}
                </colgroup>
                <thead>
                <tr className="text-left text-xs text-neutral-500">
                    <th className="px-6 py-3 font-medium">Full Name</th>
                    <th className="px-3 py-3 font-medium">Email</th>

                    {/* Status header */}
                    <th className="px-3 py-3 font-medium">
                    <div className="flex justify-center">
                        <span className="inline-block min-w-[7.5rem] text-center">Status</span>
                    </div>
                    </th>

                    {/* Role header */}
                    <th className="px-3 py-3 font-medium">
                    <div className="flex justify-center">
                        <span className="inline-block min-w-[7.5rem] text-center">Role</span>
                    </div>
                    </th>

                    {/* Department header */}
                    <th className="px-3 py-3 font-medium">
                    <div className="flex justify-center">
                        <span className="inline-block min-w-[7.5rem] text-center">Department</span>
                    </div>
                    </th>

                    <th className="px-3 py-3 font-medium">Joined Date</th>
                    <th className="px-3 py-3 font-medium">Password</th>
                    <th className="px-3 py-3 text-center font-medium">Action</th>
                </tr>
                </thead>

                <tbody>
                   {filtered.map((u) => (
                    <tr key={u.id} className="border-t border-neutral-200 align-middle">
                    <td className="px-6 py-4">
                        <button className="text-[13px] font-semibold text-emerald-700 hover:underline">
                        {u.fullName}
                        </button>
                    </td>
                    <td className="px-3 py-4 text-neutral-600">{u.email}</td>

                    {/* Status pill centered */}
                    <td className="px-3 py-4">
                        <div className="flex justify-center">
                        <StatusPill status={u.status} />
                        </div>
                    </td>

                    {/* Role pill centered */}
                    <td className="px-3 py-4">
                        <div className="flex justify-center">
                        <RoleChip label={u.role} />
                        </div>
                    </td>

                    {/* Department cell centered */}
                    <td className="px-3 py-4">
                    <div className="flex justify-center">
                        <DeptTag code={u.department} />
                    </div>
                    </td>

                    <td className="px-3 py-4 text-neutral-700">{u.joinedDate}</td>
                    <td className="px-3 py-4 text-neutral-700">{u.passwordMasked}</td>
                      <td className="px-3 py-4">
                        <div className="relative mx-auto flex w-[70px] items-center justify-center">
                          <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100"
                            aria-label="Actions"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(menuOpenId === u.id ? null : u.id);
                            }}
                          >
                            <MoreHorizontal className="h-5 w-5 text-neutral-700" />
                          </button>
                          {menuOpenId === u.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
                            >
                              <button
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                                onClick={() => handleEdit(u)}
                              >
                                <PencilLine className="h-4 w-4" />
                                Edit
                              </button>
                              <div className="h-px bg-neutral-200" />
                              <button
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(u)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-sm text-neutral-500">
                        No users found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* ======== END USER MANAGEMENT CONTENT ======== */}
      </main>
    </div>
  );
}
