import React, { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  Inbox,
  Bell,
  CheckCheck,
  Send,
  Check,
  X,
  FileSpreadsheet,
  ClipboardList
} from "lucide-react";


/* ----------------------- Utilities ----------------------- */
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

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  // Notifications time-ago formatter
  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const hasUnseen = notifications.some((n) => !n.seen);
  const sortedNotifs = [...notifications].sort((a, b) => b.time.getTime() - a.time.getTime());

  // Handle opening notifications (mark as seen)
  const handleToggleNotif = () => {
    setNotifOpen((o) => !o);
    if (!notifOpen) {
      // Mark all as seen when opened
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    }
  };

  return (
    <header className="sticky top-0 z-[80]" ref={headerRef}>
      <div className="w-full border-b border-emerald-900/30 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600 text-white">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-4">
          {/* Profile Button */}
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
                <div className="text-[12px] opacity-90">
                  Provost
                </div>
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

          {/* Inbox + Notifications */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/provost/inbox")}
              className="rounded-md p-2 hover:bg-white/15"
              title="Inbox"
            >
              <Inbox className="h-5 w-5" />
            </button>

            {/* Notifications */}
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
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No notifications
                      </div>
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

/* ----------------------- Workflow Chips ----------------------- */
const WorkflowChips = () => {
  const steps = [
    "APO",
    "Office Manager",
    "APO",
    "Office Assistant",
    "Department Chair",
    "Dean",
    "Office Assistant",
    "Provost",
  ];
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

/* ----------------------- Department Plantilla (ST / CT) ----------------------- */
function DepartmentPlantilla({
  deptLabel,
  plantillaFile,
}: {
  deptLabel: string;
  plantillaFile: string;
}) {
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);
  const [showMessagePrompt, setShowMessagePrompt] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const tableRef = useRef<HTMLTableElement | null>(null);

  const handleApprove = () => {
    setShowApprovePrompt(false);
    alert(`✅ Faculty Plantilla for ${deptLabel} successfully approved and forwarded!`);
  };

  const handleViewPlantilla = () => {
    const tbl = tableRef.current;
    if (!tbl) return alert("No plantilla table found!");

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Faculty Plantilla - ${deptLabel} AY2025-2026 1st Term</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: center; }
              th { background-color: #f7f7f7; }
            </style>
          </head>
          <body>
            <h2>Department Faculty Plantilla of CCS – ${deptLabel}</h2>
            <h4>Academic Year 2025–2026, 1st Term</h4>
            ${tbl.outerHTML}
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <section className="mt-10">
      {/* Header */}
      <header className="mb-4">
        <h2 className="text-xl font-semibold">
          Department Faculty Plantilla of CCS – {deptLabel} for Academic Year 2025–2026, 1st Term
        </h2>
        <p className="text-sm text-gray-600">Full-time Faculty</p>
      </header>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <button
          onClick={() => setShowApprovePrompt(true)}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          <CheckCheck className="h-4 w-4" />
          Approve
        </button>
        <button
          onClick={() => setShowMessagePrompt(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          <Send className="h-4 w-4" />
          Send Message
        </button>
      </div>

      {/* Approval Modal */}
      {showApprovePrompt && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-emerald-600 text-emerald-700">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h3 className="mb-2 text-center text-2xl font-semibold">Are you sure?</h3>
            <p className="mx-auto mb-6 max-w-md text-center text-sm text-neutral-600">
              Please confirm that this is the final <span className="font-semibold">Faculty Plantilla</span> for{" "}
              <span className="font-semibold">{deptLabel}</span> to be submitted to the{" "}
              <span className="font-semibold">Provost</span> for faculty loading. Once submitted, this action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApprovePrompt(false)}
                className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
              >
                Yes, I Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Message Prompt */}
      {showMessagePrompt && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-emerald-700">Quick Message — {deptLabel}</h3>
              <button
                onClick={() => setShowMessagePrompt(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm flex items-center justify-between">
                <span>
                  📎 Attached file: <strong>{plantillaFile}</strong>
                </span>
                <button
                  onClick={handleViewPlantilla}
                  className="text-emerald-700 hover:underline text-sm"
                >
                  View
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium">To:</label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Recipient email or name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Subject:</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message:</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message..."
                  className="h-40 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowMessagePrompt(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(
                    `📧 Message sent for ${deptLabel}:\n\nSubject: ${subject}\n\n${body}\n\n📎 Attached: ${plantillaFile}`
                  );
                  setShowMessagePrompt(false);
                  setTo("");
                  setSubject("");
                  setBody("");
                }}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXACT ORIGINAL TABLE (unchanged) */}
      <div className="mt-8 w-full overflow-x-auto border border-gray-300 bg-white shadow-sm rounded-lg">
        <table ref={tableRef} className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-center border-b">
              <th rowSpan={2} className="px-3 py-2 font-semibold text-left">
                Faculty
              </th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">
                Rank
              </th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">
                Course
              </th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">
                Section
              </th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">
                Day
              </th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">
                Time
              </th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">
                Room
              </th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">
                No. of Students
              </th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">
                Lecture Hours
              </th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">
                Lab Hours
              </th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">
                Student Unit(s)
              </th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">
                On Leave
              </th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">
                Type of Course
              </th>
              <th colSpan={4} className="px-3 py-2 font-semibold border-l border-gray-300">
                NATURE OF LOAD
              </th>
              <th colSpan={3} className="px-3 py-2 font-semibold border-l border-gray-300">
                PREMIUMS
              </th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">
                Remarks
              </th>
            </tr>
            <tr className="bg-gray-50 text-gray-700 text-center border-b text-m">
              <th className="px-2 py-2 font-semibold rotate-header">Teaching</th>
              <th className="px-2 py-2 font-semibold rotate-header">Admin</th>
              <th className="px-2 py-2 font-semibold rotate-header">Research</th>
              <th className="px-2 py-2 font-semibold rotate-header">Faculty Unit(s)</th>
              <th className="px-2 py-2 font-semibold rotate-header">Grad Load</th>
              <th className="px-2 py-2 font-semibold rotate-header">Premium 4th Prep</th>
              <th className="px-2 py-2 font-semibold rotate-header">Overload (NCA)</th>
            </tr>
          </thead>

          <tbody className="divide-y text-center">
            <tr>
              <td className="p-3 text-left font-medium text-emerald-700">
                CABREDO, RAFAEL ANGSICO
              </td>
              <td>1</td>
              <td>CCPROG3</td>
              <td>S12</td>
              <td>M / H</td>
              <td>9:15–10:45</td>
              <td>ONLINE / GK306A</td>
              <td>20</td>
              <td>1.5</td>
              <td>1.5</td>
              <td>3.0</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>9.0</td>
              <td>3.0</td>
              <td>0.0</td>
              <td>12.0</td>
              <td>0.0</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>—</td>
            </tr>

            <tr>
              <td className="p-3 text-left font-medium text-emerald-700">
                NICDAO, DIOSDADO R. III
              </td>
              <td>2</td>
              <td>CCINOV8</td>
              <td>S12</td>
              <td>M / H</td>
              <td>9:15–10:45</td>
              <td>ONLINE / AG1904</td>
              <td>40</td>
              <td>1.5</td>
              <td>1.5</td>
              <td>3.0</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>9.0</td>
              <td>3.0</td>
              <td>0.0</td>
              <td>12.0</td>
              <td>0.0</td>
              <td>N/A</td>
              <td>N/A</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
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
                    isActive
                      ? "bg-white text-emerald-700 shadow"
                      : "text-gray-800 hover:bg-white/60"
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

/* ----------------------- Main Screen (duplicates for ST & CT) ----------------------- */
export default function Provost_Plantilla() {
  return (
    <div className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden">
      <TopBar />
      <ProvostTabs />

      <main className="w-full px-8 py-8">
        {/* Title (generic page header for multiple departments) */}
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Plantilla</h1>
          <p className="text-sm text-gray-600">Manage and review faculty plantilla submissions</p>
        </header>

        {/* Workflow chips */}
        <WorkflowChips />

        {/* ST Department Plantilla (original table content preserved) */}
        <DepartmentPlantilla
          deptLabel="Department of Software Technology (ST)"
          plantillaFile="Faculty_Plantilla_CCS_ST_AY2025-2026_1stTerm.pdf"
        />

        {/* CT Department Plantilla (original table content preserved) */}
        <DepartmentPlantilla
          deptLabel="Department of Computer Technology (CT)"
          plantillaFile="Faculty_Plantilla_CCS_CT_AY2025-2026_1stTerm.pdf"
        />
      </main>
    </div>
  );
}
