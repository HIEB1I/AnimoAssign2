import React, { useState, useRef, useEffect } from "react"; 
import { useNavigate, NavLink } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  Inbox,
  Bell,
  ClipboardList,
  FileSpreadsheet,
  Search,
  CheckCheck,
  Check,
  ChevronDown,
} from "lucide-react";

/* ---------------- Utility ---------------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

/* ----------------------- Notifications Data ----------------------- */
type Notification = { id: number; title: string; details: string; time: Date; seen?: boolean };

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 1,
    title: "Department Chair approved the Faculty Plantilla",
    details: "The Dean has been notified for final review.",
    time: new Date(Date.now() - 2 * 60 * 1000),
    seen: false,
  },
  {
    id: 2,
    title: "Provost feedback received",
    details: "A note was added to the 2025-2026 1st Term plantilla.",
    time: new Date(Date.now() - 15 * 60 * 1000),
    seen: false,
  },
  {
    id: 3,
    title: "New schedule update available",
    details: "Please check the final IT course timetable revision.",
    time: new Date(Date.now() - 60 * 60 * 1000),
    seen: false,
  },
];

/* ----------------------- Top Bar ----------------------- */
function TopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFS);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Header height CSS variable
  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const setHeightVar = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    setHeightVar();
    const ro = new ResizeObserver(setHeightVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const hasUnseen = notifications.some((n) => !n.seen);
  const sortedNotifs = [...notifications].sort((a, b) => b.time.getTime() - a.time.getTime());

  const handleToggleNotif = () => {
    setNotifOpen((o) => !o);
    if (!notifOpen) {
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    }
  };

  return (
    <header className="sticky top-0 z-[80]" ref={headerRef}>
      <div className="w-full border-b border-emerald-900/30 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600 text-white">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-4">
          <div ref={wrapperRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/10"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
                <UserCircle className="h-6 w-6" />
              </span>
              <span className="leading-tight text-left">
                <div className="text-[17px] font-semibold">Robert Roleda</div>
                <div className="text-[12px] opacity-90">Provost</div>
              </span>
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full z-[90] mt-2 w-48 rounded-2xl border border-neutral-200 bg-white text-slate-800 shadow-2xl">
                <div className="px-4 pb-2 pt-3 text-[15px] font-semibold text-emerald-700">
                  My Account
                </div>
                <div className="mx-4 h-px bg-neutral-200" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-[15px] hover:bg-neutral-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/provost/inbox")}
              className="rounded-md p-2 hover:bg-white/15"
              title="Inbox"
            >
              <Inbox className="h-5 w-5" />
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={handleToggleNotif}
                className="relative rounded-md p-2 hover:bg-white/15"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {hasUnseen && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-emerald-800" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-neutral-200 bg-white text-slate-800 shadow-2xl">
                  <div className="border-b border-neutral-200 px-4 py-3 font-semibold text-emerald-700">
                    Notifications
                  </div>
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
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full bg-neutral-200/80" />
      </div>
    </header>
  );
}

/* ----------------------- Sticky Tabs ----------------------- */
function ProvostTabs() {
  const items = [
    { to: "/provost/plantilla", label: "Plantilla", icon: FileSpreadsheet },
    { to: "/provost/classretention", label: "Class Retention", icon: ClipboardList },
  ];

  return (
    <div className="sticky top-[var(--header-h,58px)] z-50 w-full bg-gray-100/80 backdrop-blur">
      <div className="mx-auto w-full px-4 py-3">
        <div className="rounded-xl bg-gray-200 px-3 py-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cls(
                    "mx-auto inline-flex w-full max-w-[240px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    isActive ? "bg-white text-emerald-700 shadow" : "text-gray-800 hover:bg-white/60"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SelectBox ---------------- */
function SelectBox({
  value,
  onChange,
  options,
  placeholder = "— Select —",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number>(() => Math.max(0, options.findIndex((o) => o === value)));
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) =>
      open &&
      !btnRef.current?.contains(e.target as Node) &&
      !listRef.current?.contains(e.target as Node) &&
      setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className={cls("relative min-w-[180px]", className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-left text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
      </button>
      {open && (
        <div
          ref={listRef}
          className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-300 bg-white shadow-xl"
        >
          {options.map((opt, i) => (
            <button
              key={opt}
              onMouseEnter={() => setHover(i)}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                btnRef.current?.focus();
              }}
              className={cls(
                "block w-full px-4 py-2 text-left text-sm",
                i === hover && "bg-emerald-50",
                value === opt && "bg-emerald-100 text-emerald-800 font-medium"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------- Workflow Chips ----------------------- */
const WorkflowChips = () => {
  const steps = ["APO", "Office Manager", "Department Chair", "Dean", "Provost"];
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <span
            className={cls(
              "rounded-full px-3 py-1 text-[13px] font-medium border",
              step === "Provost"
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-gray-300 bg-white text-gray-800"
            )}
          >
            {step}
          </span>
          {i < steps.length - 1 && <span className="text-gray-400">—</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ---------------- Main ---------------- */
export default function Provost_ClassRetention() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);

  const data = [
    { course: "CCPROG3", title: "Object-Oriented Programming", section: "S16", stuUnits: 3, facUnits: 3, enrolled: 12, faculty: "BEREDO, JACKLYN L.", status: "Approved" },
    { course: "STCLOUD", title: "Cloud Computing", section: "S14", stuUnits: 3, facUnits: 3, enrolled: 10, faculty: "FLORES, FRITZ KEVIN", status: "Under Review" },
    { course: "CSMODEL", title: "Discrete Structures", section: "S11", stuUnits: 3, facUnits: 3, enrolled: 6, faculty: "CU, GREGORY", status: "Dissolved" },
  ];

  const filtered = data.filter(
    (r) =>
      (status === "All Status" || r.status === status) &&
      r.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <TopBar />
      <ProvostTabs />

      <main className="w-full px-8 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Class Retention</h1>
          <p className="text-sm text-gray-600">
            Manage class retention requests for low-enrollment courses for Term 1 AY 2025–2026
          </p>
          <WorkflowChips />
        </header>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course..."
              className="w-full rounded-lg border border-gray-300 px-9 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <SelectBox
            value={status}
            onChange={setStatus}
            options={["All Status", "Approved", "Under Review", "Special Class", "Dissolved"]}
          />

          <button
            onClick={() => {
              if (selectedRows.length === 0) {
                alert("Please select at least one course to approve.");
                return;
              }
              setShowApprovePrompt(true);
            }}
            disabled={selectedRows.length === 0}
            className={cls(
              "ml-auto inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm",
              selectedRows.length > 0
                ? "bg-emerald-700 hover:brightness-110"
                : "bg-gray-300 cursor-not-allowed"
            )}
          >
            <CheckCheck className="h-4 w-4" />
            Approve
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-gray-700">
              <tr>
                <th className="w-10 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedRows.length === filtered.length}
                    onChange={(e) =>
                      setSelectedRows(e.target.checked ? filtered.map((r) => r.course) : [])
                    }
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="text-left px-4 py-2">Course Code & Title</th>
                <th className="px-4 py-2 text-center">Section</th>
                <th className="px-4 py-2 text-center">Student Units</th>
                <th className="px-4 py-2 text-center">Faculty Units</th>
                <th className="px-4 py-2 text-center">Enrolled Students</th>
                <th className="text-left px-4 py-2">Faculty</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.course} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(r.course)}
                      onChange={() =>
                        setSelectedRows((prev) =>
                          prev.includes(r.course)
                            ? prev.filter((id) => id !== r.course)
                            : [...prev, r.course]
                        )
                      }
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-left font-semibold text-emerald-700">
                    {r.course}
                    <div className="text-xs text-gray-500">{r.title}</div>
                  </td>
                  <td className="text-center">{r.section}</td>
                  <td className="text-center">{r.stuUnits}</td>
                  <td className="text-center">{r.facUnits}</td>
                  <td className="text-center">{r.enrolled}</td>
                  <td className="text-left">{r.faculty}</td>
                  <td className="text-center">
                    <span
                      className={cls(
                        "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                        r.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : r.status === "Under Review"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.status === "Special Class"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700" 
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Approval Confirmation Modal */}
        {showApprovePrompt && (
          <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-emerald-600 text-emerald-700">
                <Check className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-center text-2xl font-semibold">Approve Selected Courses?</h3>
              <p className="mx-auto mb-6 max-w-md text-center text-sm text-neutral-600">
                You are about to approve{" "}
                <span className="font-semibold">{selectedRows.length}</span>{" "}
                {selectedRows.length === 1 ? "class retention request" : "class retention requests"}.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowApprovePrompt(false)}
                  className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowApprovePrompt(false);
                    alert(`✅ ${selectedRows.length} course(s) approved successfully!`);
                    setSelectedRows([]);
                  }}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                >
                  Yes, I Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
