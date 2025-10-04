import React, { useEffect, useRef, useState } from "react";  
import { useNavigate, NavLink } from "react-router-dom";
import Papa, { ParseResult } from "papaparse"; // typed import for CSV parsing
import {
  UserCircle,
  Bell,
  LogOut,
  Inbox,
  Pencil,
  Check,
  BookOpen,
  Users, 
  Building2,
  Upload
} from "lucide-react";

/* ----------------------- Utilities ----------------------- */
const cls = (...s: (string | false | undefined)[]) =>
  s.filter(Boolean).join(" ");

/* ----------------------- Top Bar ----------------------- */
function TopBar({
  fullName,
  role,
}: {
  fullName: string;
  role: string;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      )
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const setVar = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${el.offsetHeight}px`
      );
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-[80]" ref={headerRef}>
      <div className="w-full border-b border-emerald-900/30 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-4 text-white">
          <div ref={wrapperRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/10"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
                <UserCircle className="h-6 w-6" />
              </span>
              <span className="leading-tight text-left">
                <div className="text-[17px] font-semibold">{fullName}</div>
                <div className="text-[12px] opacity-90">{role}</div>
              </span>
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full z-[90] mt-2 w-56 rounded-2xl border border-neutral-200 bg-white text-slate-800 shadow-2xl">
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
              onClick={() => navigate("/apo/inbox")}
              className="rounded-md p-2 hover:bg-white/15"
              title="Inbox"
            >
              <Inbox className="h-5 w-5" />
            </button>
            <button
              className="rounded-md p-2 hover:bg-white/15"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-[2px] w-full bg-neutral-200/80" />
      </div>
    </header>
  );
}

/* ----------------------- Stick Top Tabs ----------------------- */
function ApoTabs() {
  const items = [
    { to: "/apo/preenlistment", label: "Pre-Enlistment", icon: Users },
    { to: "/apo/courseofferings", label: "Course Offerings", icon: BookOpen },
    { to: "/apo/roomallocation", label: "Room Allocation", icon: Building2 },
  ];

  return (
    <div className="sticky top-[var(--header-h,58px)] z-50 w-full bg-gray-100/80 backdrop-blur">
      <div className="mx-auto w-full px-4 py-3">
        <div className="rounded-xl bg-gray-200 px-3 py-2 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cls(
                    "mx-auto inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
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

/* ----------------------- Page ----------------------- */
export default function APO_PreEnlistment() {
  // enlisted courses
  const [enlistedCourses, setEnlistedCourses] = useState<string[][]>([]);
  // enrollment stats
  const [enrollmentStats, setEnrollmentStats] = useState<string[][]>([]);

  const [editIndexCourses, setEditIndexCourses] = useState<number | null>(null);
  const [editRowCourses, setEditRowCourses] = useState<string[] | null>(null);

  const [editIndexStats, setEditIndexStats] = useState<number | null>(null);
  const [editRowStats, setEditRowStats] = useState<string[] | null>(null);

  const startEditCourses = (i: number) => {
    setEditIndexCourses(i);
    setEditRowCourses([...enlistedCourses[i]]);
  };
  const saveEditCourses = () => {
    if (editIndexCourses !== null && editRowCourses) {
      const updated = [...enlistedCourses];
      updated[editIndexCourses] = editRowCourses;
      setEnlistedCourses(updated);
      setEditIndexCourses(null);
      setEditRowCourses(null);
    }
  };

  const startEditStats = (i: number) => {
    setEditIndexStats(i);
    setEditRowStats([...enrollmentStats[i]]);
  };
  const saveEditStats = () => {
    if (editIndexStats !== null && editRowStats) {
      const updated = [...enrollmentStats];
      updated[editIndexStats] = editRowStats;
      setEnrollmentStats(updated);
      setEditIndexStats(null);
      setEditRowStats(null);
    }
  };

  // CSV Import Handlers
  const handleImportCourses = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse<string[]>(file, {
      complete: (results: ParseResult<string[]>) => {
        setEnlistedCourses(results.data.slice(1)); // remove header row
      },
    });
  };

  const handleImportStats = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse<string[]>(file, {
      complete: (results: ParseResult<string[]>) => {
        setEnrollmentStats(results.data.slice(1)); // remove header row
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <TopBar
        fullName="Hazel Ventura"
        role="Academic Programming Officer"
      />
      <ApoTabs />

      {/* maximize screen */}
      <main className="p-6 w-full">
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 w-full">
          {/* Horizontal layout */}
          <div className="flex flex-col md:flex-row">
            {/* Left Panel - Enlisted Courses */}
            <section className="flex-1 max-h-[400px] overflow-y-auto pr-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">List of Enlisted Courses</h2>
                <label className="ml-auto inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-110">
                  <Upload className="h-4 w-4" />
                  Import CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCourses}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Term 1 AY 2025-2026
              </p>

              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500 border-b">
                  <tr>
                    <th className="py-2">No.</th>
                    <th className="py-2">Career</th>
                    <th className="py-2">Acad Group</th>
                    <th className="py-2">Campus</th>
                    <th className="py-2">Course Code</th>
                    <th className="py-2">Count</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {enlistedCourses.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 px-2 whitespace-nowrap">
                          {editIndexCourses === i && j === row.length - 1 ? (
                            <input
                              value={editRowCourses?.[j] || ""}
                              onChange={(e) => {
                                const copy = [...(editRowCourses || [])];
                                copy[j] = e.target.value;
                                setEditRowCourses(copy);
                              }}
                              type="number"
                              className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                            />
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-center">
                        {editIndexCourses === i ? (
                          <button
                            onClick={saveEditCourses}
                            className="h-7 w-7 flex items-center justify-center rounded-full border border-green-600 text-green-600 hover:bg-green-50"
                            title="Save"
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditCourses(i)}
                            className="text-gray-500 hover:text-black"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Divider */}
            <div className="my-6 md:my-0 md:mx-6 border-t md:border-t-0 md:border-l border-gray-300"></div>

            {/* Right Panel - Enrollment Stats */}
            <section className="flex-1 max-h-[400px] overflow-y-auto pl-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Enrollment Statistics</h2>
                <label className="ml-auto inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-110">
                  <Upload className="h-4 w-4" />
                  Import CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportStats}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Term 1 AY 2025-2026
              </p>

              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500 border-b">
                  <tr>
                    <th className="py-2">Program</th>
                    <th className="py-2">Freshman</th>
                    <th className="py-2">Sophomore</th>
                    <th className="py-2">Junior</th>
                    <th className="py-2">Senior</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {enrollmentStats.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 px-2 whitespace-nowrap">
                          {editIndexStats === i && j > 0 ? (
                            <input
                              value={editRowStats?.[j] || ""}
                              onChange={(e) => {
                                const copy = [...(editRowStats || [])];
                                copy[j] = e.target.value;
                                setEditRowStats(copy);
                              }}
                              type="number"
                              className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                            />
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-center">
                        {editIndexStats === i ? (
                          <button
                            onClick={saveEditStats}
                            className="h-7 w-7 flex items-center justify-center rounded-full border border-green-600 text-green-600 hover:bg-green-50"
                            title="Save"
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditStats(i)}
                            className="text-gray-500 hover:text-black"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
