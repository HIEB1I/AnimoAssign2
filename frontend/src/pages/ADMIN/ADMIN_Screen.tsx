import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  UserCircle,
  Inbox,
  LogOut,
  Plus,
  MoreHorizontal,
  PencilLine,
  Trash2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

/* ===================== small utils ===================== */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "");
const formatName = (last: string, first: string, mi?: string) =>
  `${cap(last)}, ${cap(first)}${mi?.trim() ? ` ${mi[0].toUpperCase()}.` : ""}`.trim();
const normalizeFullName = (raw: string) => {
  if (!raw) return raw;
  if (raw.includes(",")) {
    const [last, rest] = raw.split(",", 2);
    const [first = "", mi = ""] = (rest || "").trim().split(/\s+/);
    return formatName(last.trim(), first, mi.replace(".", ""));
  }
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const last = parts.pop() || "";
  const first = parts.shift() || "";
  const mi = (parts.shift() || "").replace(".", "");
  return formatName(last, first, mi);
};

/* ===================== primitives ===================== */
const Pill = ({ children, tone = "neutral", minW = "" }: { children: React.ReactNode; tone?: "neutral" | "emerald" | "blue" | "amber" | "red"; minW?: string }) => {
  const map = {
    neutral: "border border-neutral-200 bg-white text-neutral-700",
    emerald: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border border-blue-200 bg-blue-50 text-blue-700",
    amber: "border border-amber-200 bg-amber-50 text-amber-700",
    red: "border border-red-200 bg-red-50 text-red-600",
  } as const;
  return <span className={cls("inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-medium", minW, map[tone])}>{children}</span>;
};
const DeptTag = ({ code }: { code: string }) => (
  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">{code}</span>
);
const TimestampCell = ({ ts }: { ts: string }) => {
  const [d, t] = ts.split(" ");
  return (
    <div className="leading-tight">
      <div className="text-[13px] text-slate-700">{d}</div>
      <div className="text-[11px] text-gray-500">{t}</div>
    </div>
  );
};

/* ---------- Dropdown (keyboard + click) ---------- */
function Dropdown({ value, onChange, options, className = "w-full" }: { value: string; onChange: (v: string) => void; options: string[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(() => Math.max(0, options.findIndex((o) => o === value)));
  const btnRef = useRef<HTMLButtonElement>(null), listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => open && !btnRef.current?.contains(e.target as Node) && !listRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const onKey = (e: React.KeyboardEvent) => {
    if (!open && ["ArrowDown", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHover((i) => (i + 1) % options.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHover((i) => (i - 1 + options.length) % options.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      onChange(options[hover] ?? options[0]);
      setOpen(false);
      btnRef.current?.focus();
    }
  };
  return (
    <div className={cls("relative", className)} onKeyDown={onKey}>
      <button ref={btnRef} onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-left text-sm shadow-sm outline-none hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500/30">
        {value} <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
      </button>
      {open && (
        <div ref={listRef} role="listbox" className="absolute z-20 mt-2 w-[14rem] max-h-80 overflow-auto rounded-2xl border border-gray-300 bg-white shadow-lg">
          {options.map((opt, i) => (
            <button key={opt} role="option" aria-selected={value === opt} onMouseEnter={() => setHover(i)} onClick={() => { onChange(opt); setOpen(false); btnRef.current?.focus(); }} className={cls("block w-full text-left px-4 py-3 text-sm", i === hover && "bg-emerald-50")}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== data & options ===================== */
type UserStatus = "Active" | "Leave" | "Sabbatical" | "Inactive";
type UserRole = "APO" | "Department Chair" | "Faculty-FT" | "Faculty-PT" | "Office Assistant" | "Office Manager" | "Provost’s Office" | "Student";
type User = { id: number; fullName: string; email: string; status: UserStatus; role: UserRole; department: string; joinedDate: string; passwordMasked: string };

const initialUsers: User[] = [
  { id: 1, fullName: "Rafael A. Cabredo", email: "rafael.cabredo@dlsu.edu.ph", status: "Active", role: "Faculty-FT", department: "DST", joinedDate: "1/15/2024", passwordMasked: "********" },
  { id: 2, fullName: "Ronald M. Pascual", email: "ronald.pascual@dlsu.edu.ph", status: "Active", role: "Department Chair", department: "DCT", joinedDate: "8/20/2023", passwordMasked: "********" },
  { id: 3, fullName: "Raphael W. Gonda", email: "raphael.gonda@dlsu.edu.ph", status: "Active", role: "APO", department: "DIT", joinedDate: "3/1/2023", passwordMasked: "********" },
  { id: 4, fullName: "Lissa Magpantay", email: "lissa.magpantay@dlsu.edu.ph", status: "Sabbatical", role: "Department Chair", department: "DIT", joinedDate: "3/1/2023", passwordMasked: "********" },
  { id: 5, fullName: "Jameelch Dacanay", email: "jameelch.dacanay@dlsu.edu.ph", status: "Leave", role: "Office Manager", department: "DST", joinedDate: "3/1/2023", passwordMasked: "********" },
  { id: 6, fullName: "Alyssa T. Cruz", email: "alyssa.cruz@dlsu.edu.ph", status: "Inactive", role: "Office Assistant", department: "DST", joinedDate: "2/12/2022", passwordMasked: "********" },
];

const ROLE_OPTIONS: ("All Roles" | UserRole)[] = ["All Roles", "APO", "Department Chair", "Faculty-FT", "Faculty-PT", "Office Assistant", "Office Manager", "Provost’s Office", "Student"];
const STATUS_OPTIONS: UserStatus[] = ["Active", "Leave", "Sabbatical", "Inactive"];
const DEPT_OPTIONS = ["DST", "DCT", "DIT", "DCS", "None"];
const withPlaceholder = (ph: string, opts: string[]) => [ph, ...opts];
const STATUS_OPTS_FORM = withPlaceholder("-- Select an option --", STATUS_OPTIONS);
const ROLE_OPTS_FORM = withPlaceholder("-- Select an option --", ROLE_OPTIONS.filter((r) => r !== "All Roles") as string[]);
const DEPT_OPTS_FORM = withPlaceholder("-- Select an option --", DEPT_OPTIONS);

/* ===================== notifications ===================== */
type Notification = { id: number; title: string; details: string; time: Date };
const NOTIFS: Notification[] = [
  { id: 101, title: "Office Manager (Jamaecha Dacanay) — Schedule Conflict Detected", details: "CCPROG3 S11A overlaps with CSMATH2 S12.", time: new Date(Date.now() - 2 * 60 * 1000) },
  { id: 102, title: "New Request — Faculty Overload Review", details: "Prof. Rafael Cabredo submitted an overload justification.", time: new Date(Date.now() - 15 * 60 * 1000) },
  { id: 103, title: "System Backup Completed", details: "Nightly backup finished successfully (duration: 7m 42s).", time: new Date(Date.now() - 60 * 60 * 1000) },
];

/* ===================== TopBar ===================== */
function TopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };
  const sortedNotifs = [...NOTIFS].sort((a, b) => b.time.getTime() - a.time.getTime());
  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };
  return (
    <header className="sticky top-0 z-20">
      <div className="w-full border-b border-emerald-900/30 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600 text-white">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-3">
          <button onClick={() => setMenuOpen((o) => !o)} className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/10">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
              <UserCircle className="h-6 w-6" />
            </span>
            <span className="leading-tight text-left">
              <div className="text-sm font-semibold">Gregory Cu</div>
              <div className="text-[11px] opacity-90">Administrator</div>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/admin/inbox")} className="rounded-md p-2 hover:bg-white/10" title="Inbox">
              <Inbox className="h-5 w-5" />
            </button>
            <button onClick={() => setNotifOpen((o) => !o)} className="rounded-md p-2 hover:bg-white/10" title="Notifications">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div ref={menuRef} className="absolute left-5 top-14 z-30 w-40 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          <button onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
      {notifOpen && (
        <div ref={notifRef} className="absolute right-5 top-14 z-30 w-96 rounded-xl border border-neutral-200 bg-white shadow-lg">
          <div className="border-b border-neutral-200 px-4 py-3 font-semibold text-emerald-700">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {sortedNotifs.length ? (
              sortedNotifs.map((n) => (
                <div key={n.id} className="border-b border-neutral-100 px-4 py-3 last:border-0">
                  <div className="font-semibold text-slate-900">{n.title}</div>
                  <div className="text-sm text-gray-600">{n.details}</div>
                  <div className="mt-1 text-xs text-gray-400">{timeAgo(n.time)}</div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ===================== Modal ===================== */
function Modal({ open, onClose, children, width = "max-w-4xl" }: { open: boolean; onClose: () => void; children: React.ReactNode; width?: string }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className={cls("w-full rounded-2xl bg-white shadow-2xl", width)}>{children}</div>
      </div>
    </div>
  );
}

/* ===================== Shared form bits ===================== */
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1 block text-sm font-semibold">{children}</label>
);
const TextInput = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className={cls("w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30", p.className)} />
);
function PasswordInput({ value, onChange, visible, toggle }: { value: string; onChange: (v: string) => void; visible: boolean; toggle: () => void }) {
  return (
    <div className="relative">
      <TextInput type={visible ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} className="pr-9" />
      <button type="button" onClick={toggle} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">{visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
    </div>
  );
}

/* ===================== Add/Edit forms (unified) ===================== */
type AddUserForm = { lastName: string; firstName: string; middleInitial: string; email: string; status: UserStatus | ""; role: UserRole | ""; department: string | ""; password: string; confirmPassword: string };
type EditUserForm = { lastName: string; firstName: string; middleInitial: string; email: string; status: UserStatus | ""; role: UserRole | ""; department: string | ""; oldPassword: string; newPassword: string };
const emptyAdd: AddUserForm = { lastName: "", firstName: "", middleInitial: "", email: "", status: "", role: "", department: "", password: "", confirmPassword: "" };

/* ===================== Page ===================== */
export default function ADMIN_UserAndLogs() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [qUsers, setQUsers] = useState("");
  const [role, setRole] = useState<"All Roles" | UserRole>("All Roles");
  const [activeOnly, setActiveOnly] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<null | User>(null);
  const [deleteOpen, setDeleteOpen] = useState<null | User>(null);

  // Forms
  const [addForm, setAddForm] = useState<AddUserForm>(emptyAdd);
  const [editForm, setEditForm] = useState<EditUserForm | null>(null);
  const [pwVis, setPwVis] = useState<{ [k: string]: boolean }>({ add1: false, add2: false, editOld: false, editNew: false });

  useEffect(() => {
    const close = (e: MouseEvent) => actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node) && setMenuOpenId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // Filtered users
  const usersFiltered = useMemo(() => {
    const t = qUsers.trim().toLowerCase();
    return users.filter((u) => (!t || normalizeFullName(u.fullName).toLowerCase().includes(t) || u.email.toLowerCase().includes(t)) && (role === "All Roles" || u.role === role) && (!activeOnly || u.status === "Active"));
  }, [qUsers, role, activeOnly, users]);

  // Logs
  const [qLogs, setQLogs] = useState("");
  const [action, setAction] = useState<"All Actions" | "User Login" | "Role Update" | "Password Reset" | "Permission Grant" | "Data Export" | "System Backup" | "User Creation" | "User Deactivation">("All Actions");
  const LOGS = [
    { id: 1, user: "Rafael A. Cabredo", action: "User Login", details: "Successful login from Chrome browser", timestamp: "2024-01-15 09:15:32", status: "Active" },
    { id: 2, user: "Ronald M. Pascual", action: "Password Reset", details: "Password reset attempted but failed - account locked", timestamp: "2024-01-15 09:15:32", status: "Failed" },
    { id: 3, user: "Raphael W. Gonda", action: "Data Export", details: "Exported user list – large dataset warning", timestamp: "2024-01-15 09:15:32", status: "Warning" },
  ] as const;
  const logs = LOGS.filter((r) => (action === "All Actions" || r.action === action) && `${r.user} ${r.action} ${r.details}`.toLowerCase().includes(qLogs.toLowerCase().trim()));
  const hasAnyForAction = action === "All Actions" ? true : LOGS.some((r) => r.action === action);
  const GRID = "grid grid-cols-[13%_22%_40%_15%_10%] items-center";

  /* ---------- Add flow ---------- */
  const openAdd = () => {
    setAddForm(emptyAdd);
    setPwVis((v) => ({ ...v, add1: false, add2: false }));
    setAddOpen(true);
  };
  const submitAdd = () => {
    const fullName = formatName(addForm.lastName, addForm.firstName, addForm.middleInitial);
    const next: User = { id: Math.max(0, ...users.map((u) => u.id)) + 1, fullName, email: addForm.email || "unknown@example.com", status: (addForm.status || "Active") as UserStatus, role: (addForm.role || "Student") as UserRole, department: addForm.department || "None", joinedDate: new Date().toLocaleDateString(), passwordMasked: "********" };
    setUsers((u) => [next, ...u]);
    setAddOpen(false);
  };

  /* ---------- Edit flow ---------- */
  const openEdit = (u: User) => {
    const formatted = normalizeFullName(u.fullName);
    const [last, rest] = formatted.split(",", 2);
    const [first = "", mi = ""] = (rest || "").trim().split(/\s+/);
    setEditForm({ lastName: (last || "").trim(), firstName: first.trim(), middleInitial: mi.replace(".", ""), email: u.email, status: u.status, role: u.role, department: u.department, oldPassword: "", newPassword: "" });
    setPwVis((v) => ({ ...v, editOld: false, editNew: false }));
    setEditOpen({ ...u, fullName: formatted });
    setMenuOpenId(null);
  };
  const submitEdit = () => {
    if (!editOpen || !editForm) return;
    const fullName = formatName(editForm.lastName, editForm.firstName, editForm.middleInitial);
    setUsers((prev) => prev.map((u) => (u.id === editOpen.id ? { ...u, fullName, email: editForm.email, status: (editForm.status || u.status) as UserStatus, role: (editForm.role || u.role) as UserRole, department: editForm.department || u.department } : u)));
    setEditOpen(null);
  };

  /* ---------- Delete flow ---------- */
  const openDelete = (u: User) => {
    setDeleteOpen({ ...u, fullName: normalizeFullName(u.fullName) });
    setMenuOpenId(null);
  };
  const confirmDelete = () => {
    if (!deleteOpen) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteOpen.id));
    setDeleteOpen(null);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900" style={{ scrollbarGutter: "stable both-edges" }}>
      <TopBar />
      <main className="mx-auto w-full max-w-none space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* ================= Users ================= */}
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">User Management</h2>
              <p className="mt-1 text-sm text-neutral-600">Manage user accounts, roles, permission</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 px-6 py-4">
            <div className="relative min-w-[360px] flex-1 max-w-[920px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input value={qUsers} onChange={(e) => setQUsers(e.target.value)} placeholder="Search by name..." className="h-10 w-full rounded-lg border border-neutral-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <Dropdown value={role} onChange={(v) => setRole(v as any)} options={ROLE_OPTIONS} className="w-56 text-left" />
            <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
              {[{ k: false, label: "Show All Status" }, { k: true, label: "Show Active" }].map(({ k, label }) => (
                <button key={String(k)} onClick={() => setActiveOnly(k)} aria-pressed={activeOnly === k} className={cls("h-10 rounded-md px-4 text-sm font-medium transition", activeOnly === k ? "bg-green-600 text-white" : "text-neutral-800 hover:bg-neutral-50")}>{label}</button>
              ))}
            </div>
            <button onClick={openAdd} className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700">
              <Plus className="h-4 w-4" /> Add User
            </button>
          </div>
          <div className="border-t border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700">
            User <span className="text-neutral-500">({usersFiltered.length})</span>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[330px] overflow-y-auto">
              <table className="min-w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[260px]" />
                  <col />
                  <col className="w-[9.5rem]" />
                  <col className="w-[9.5rem]" />
                  <col className="w-[9.5rem]" />
                  <col />
                  <col />
                  <col className="w-[92px]" />
                </colgroup>
                <thead>
                  <tr className="text-left text-xs text-neutral-500">
                    <th className="px-6 py-3 font-medium">Full Name</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    {["Status", "Role", "Department"].map((h) => (
                      <th key={h} className="px-3 py-3 font-medium">
                        <div className="flex justify-center">
                          <span className="inline-block min-w-[7.5rem] text-center">{h}</span>
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-3 font-medium">Joined Date</th>
                    <th className="px-3 py-3 font-medium">Password</th>
                    <th className="px-3 py-3 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersFiltered.map((u) => (
                    <tr key={u.id} className="border-t border-neutral-200 align-middle">
                      <td className="px-6 py-4">
                        <button className="text-[13px] font-semibold text-emerald-700 hover:underline">{normalizeFullName(u.fullName)}</button>
                      </td>
                      <td className="px-3 py-4 text-neutral-600">{u.email}</td>
                      <td className="px-3 py-4">
                        <div className="flex justify-center">
                          <Pill minW="min-w-[7.5rem]" tone={u.status === "Active" ? "emerald" : u.status === "Leave" ? "blue" : u.status === "Sabbatical" ? "amber" : "neutral"}>{u.status}</Pill>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-center">
                          <Pill minW="min-w-[7.5rem]">{u.role}</Pill>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-center">
                          <DeptTag code={u.department} />
                        </div>
                      </td>
                      <td className="px-3 py-4 text-neutral-700">{u.joinedDate}</td>
                      <td className="px-3 py-4 text-neutral-700">{u.passwordMasked}</td>
                      <td className="px-3 py-4">
                        <div className="relative mx-auto flex w-[70px] items-center justify-center" ref={actionMenuRef}>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100" onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === u.id ? null : u.id); }}>
                            <MoreHorizontal className="h-5 w-5 text-neutral-700" />
                          </button>
                          {menuOpenId === u.id && (
                            <div className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
                              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50" onClick={() => openEdit(u)}>
                                <PencilLine className="h-4 w-4" /> Edit
                              </button>
                              <div className="h-px bg-neutral-200" />
                              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50" onClick={() => openDelete(u)}>
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!usersFiltered.length && (
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
        </section>

        {/* ================= Logs ================= */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Audit Logs</h2>
              <p className="mt-1 text-sm text-gray-500">Track all system activities and user actions</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/30" placeholder="Search by name, action, details..." value={qLogs} onChange={(e) => setQLogs(e.target.value)} />
            </div>
            <Dropdown value={action} onChange={(v) => setAction(v as any)} options={["All Actions", "Data Export", "Password Reset", "Permission Grant", "Role Update", "System Backup", "User Creation", "User Deactivation", "User Login"]} className="w-56 text-left" />
          </div>
          <div className="flex items-center justify-between px-5">
            <h3 className="text-sm font-semibold text-slate-800">Activity Log ({logs.length} {logs.length === 1 ? "entry" : "entries"})</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-[13%_22%_40%_15%_10%] items-center px-3 py-2 text-xs font-semibold text-gray-500">
              <div>User</div>
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
            <div className="max-h-[300px] overflow-y-auto">
              {logs.map((r, i) => (
                <div key={r.id} className={cls(GRID, "px-3 py-3 text-sm", i !== logs.length - 1 && "border-b border-gray-200")}> 
                  <div>
                    <button className="text-emerald-700 hover:underline">{normalizeFullName(r.user)}</button>
                  </div>
                  <div className="flex justify-center">
                    <Pill minW="min-w-[8.5rem]">{r.action}</Pill>
                  </div>
                  <div className="text-gray-600">{r.details}</div>
                  <div>
                    <TimestampCell ts={r.timestamp} />
                  </div>
                  <div className="flex justify-center">
                    <Pill minW="min-w-[5.5rem]" tone={r.action === "User Login" ? "emerald" : r.action === "Password Reset" ? "red" : "amber"}>{r.action === "User Login" ? "Active" : r.action === "Password Reset" ? "Failed" : "Warning"}</Pill>
                  </div>
                </div>
              ))}
              {!logs.length && (
                <div className="px-3 py-10 text-center text-sm">
                  {action !== "All Actions" ? (hasAnyForAction ? (
                    <>No <span className="font-semibold">“{action}”</span> logs{qLogs.trim() && <> matching “{qLogs.trim()}”</>}.</>
                  ) : (
                    <>There are currently no <span className="font-semibold">“{action}”</span> logs.</>
                  )) : (
                    <>No results{qLogs.trim() && <> for “{qLogs.trim()}”</>}.</>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ================= Modals ================= */}
      {/* Add User */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="text-xl font-semibold text-emerald-700">Add User Details</h3>
            <button onClick={() => setAddOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Full Name</Label>
                <TextInput value={addForm.lastName} onChange={(e) => setAddForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Last Name" />
              </div>
              <div className="md:mt-[26px]">
                <TextInput value={addForm.firstName} onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="First Name" />
              </div>
              <div className="md:mt-[26px]">
                <TextInput value={addForm.middleInitial} onChange={(e) => setAddForm((f) => ({ ...f, middleInitial: e.target.value }))} placeholder="Middle Initial" />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <TextInput value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} placeholder="rafael.cabredo@dlsu.edu.ph" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Status</Label>
                <Dropdown value={addForm.status || "-- Select an option --"} onChange={(v) => setAddForm((f) => ({ ...f, status: v === "-- Select an option --" ? "" : (v as UserStatus) }))} options={STATUS_OPTS_FORM} />
              </div>
              <div>
                <Label>Role</Label>
                <Dropdown value={addForm.role || "-- Select an option --"} onChange={(v) => setAddForm((f) => ({ ...f, role: v === "-- Select an option --" ? "" : (v as UserRole) }))} options={ROLE_OPTS_FORM} />
              </div>
              <div>
                <Label>Department</Label>
                <Dropdown value={addForm.department || "-- Select an option --"} onChange={(v) => setAddForm((f) => ({ ...f, department: v === "-- Select an option --" ? "" : v }))} options={DEPT_OPTS_FORM} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Password</Label>
                <PasswordInput value={addForm.password} onChange={(v) => setAddForm((f) => ({ ...f, password: v }))} visible={pwVis.add1} toggle={() => setPwVis((v) => ({ ...v, add1: !v.add1 }))} />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <PasswordInput value={addForm.confirmPassword} onChange={(v) => setAddForm((f) => ({ ...f, confirmPassword: v }))} visible={pwVis.add2} toggle={() => setPwVis((v) => ({ ...v, add2: !v.add2 }))} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={submitAdd} className="rounded-lg bg-emerald-700 px-6 py-2 text-white hover:bg-emerald-800">Add User</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit User */}
      <Modal open={!!editOpen} onClose={() => setEditOpen(null)}>
        {editOpen && editForm && (
          <div className="p-6 sm:p-8">
            <div className="mb-1 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-emerald-700">Edit User Details</h3>
                <div className="mt-1 text-sm text-gray-700">
                  Instructor: <span className="font-medium">{normalizeFullName(editOpen.fullName)}</span>
                </div>
              </div>
              <button onClick={() => setEditOpen(null)} className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label>Full Name</Label>
                  <TextInput value={editForm.lastName} onChange={(e) => setEditForm((f) => f && { ...f, lastName: e.target.value })} placeholder="Last Name" />
                </div>
                <div className="md:mt-[26px]">
                  <TextInput value={editForm.firstName} onChange={(e) => setEditForm((f) => f && { ...f, firstName: e.target.value })} placeholder="First Name" />
                </div>
                <div className="md:mt-[26px]">
                  <TextInput value={editForm.middleInitial} onChange={(e) => setEditForm((f) => f && { ...f, middleInitial: e.target.value })} placeholder="Middle Initial" />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <TextInput value={editForm.email} onChange={(e) => setEditForm((f) => f && { ...f, email: e.target.value })} placeholder="rafael.cabredo@dlsu.edu.ph" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label>Status</Label>
                  <Dropdown value={editForm.status || "-- Select an option --"} onChange={(v) => setEditForm((f) => f && { ...f, status: v === "-- Select an option --" ? "" : (v as UserStatus) })} options={STATUS_OPTS_FORM} />
                </div>
                <div>
                  <Label>Role</Label>
                  <Dropdown value={editForm.role || "-- Select an option --"} onChange={(v) => setEditForm((f) => f && { ...f, role: v === "-- Select an option --" ? "" : (v as UserRole) })} options={ROLE_OPTS_FORM} />
                </div>
                <div>
                  <Label>Department</Label>
                  <Dropdown value={editForm.department || "-- Select an option --"} onChange={(v) => setEditForm((f) => f && { ...f, department: v === "-- Select an option --" ? "" : v })} options={DEPT_OPTS_FORM} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>OLD Password</Label>
                  <PasswordInput value={editForm.oldPassword} onChange={(v) => setEditForm((f) => f && { ...f, oldPassword: v })} visible={pwVis.editOld} toggle={() => setPwVis((v) => ({ ...v, editOld: !v.editOld }))} />
                </div>
                <div>
                  <Label>NEW Password</Label>
                  <PasswordInput value={editForm.newPassword} onChange={(v) => setEditForm((f) => f && { ...f, newPassword: v })} visible={pwVis.editNew} toggle={() => setPwVis((v) => ({ ...v, editNew: !v.editNew }))} />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={submitEdit} className="rounded-lg bg-emerald-700 px-6 py-2 text-white hover:bg-emerald-800">Save Edit</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteOpen} onClose={() => setDeleteOpen(null)} width="max-w-xl">
        {deleteOpen && (
          <div className="p-6 sm:p-8">
            <div className="relative">
              <button onClick={() => setDeleteOpen(null)} className="absolute right-0 top-0 rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex justify-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-red-400 text-2xl font-bold text-red-500">X</div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-semibold">Are you sure?</h3>
              <p className="mt-2 text-gray-400">
                Do you really want to delete <span className="font-medium text-gray-600">{normalizeFullName(deleteOpen.fullName)}</span>? This process cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteOpen(null)} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
