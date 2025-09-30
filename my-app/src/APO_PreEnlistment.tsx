import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  Bell,
  LogOut,
  Inbox,
  Pencil,
  Check,
} from "lucide-react";
import Login_BG from "./assets/Images/login_bg.png";

/* ----------------------- Top Bar ----------------------- */
function TopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20">
      {/* Green gradient header */}
      <div
        className="text-white"
        style={{
          backgroundImage: `url(${Login_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex w-full items-center justify-between px-5 py-3">
          {/* Profile button (opens dropdown) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/10"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
              <UserCircle className="h-6 w-6" />
            </span>
            <span className="leading-tight text-left">
              <div className="text-sm font-semibold">Hazel Ventura</div>
              <div className="text-[11px] opacity-90">
                Academic Programming Officer
              </div>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              className="rounded-md p-2 hover:bg-white/10"
              title="Inbox"
              onClick={() => navigate("/inbox")}
            >
              <Inbox className="h-5 w-5" />
            </button>
            <button
              className="rounded-md p-2 hover:bg-white/10"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="h-[1px] bg-gray-200 w-full"></div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute left-5 top-14 z-30 w-40 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}

      {/* Tabs - centered */}
      <div className="bg-gray-100 px-6 py-2 flex justify-center gap-6 text-sm font-medium text-gray-700">
        <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 shadow-sm">
          <UserCircle className="h-4 w-4" />
          Pre-Enlistment
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:text-black">
          <Inbox className="h-4 w-4" />
          Course Offerings
        </button>
        <button className="flex items-center gap-2 px-4 py-2 hover:text-black">
          <Bell className="h-4 w-4" />
          Room Allocation
        </button>
      </div>
    </header>
  );
}

/* ----------------------- Page ----------------------- */
export default function PreEnlistmentScreen() {
  // enlisted courses
  const [enlistedCourses, setEnlistedCourses] = useState<string[][]>([
    ["1", "GSD", "CCS", "Manila", "DIT661D", "5"],
    ["2", "GSD", "CCS", "Manila", "DIT709D", "5"],
    ["73", "GSM", "CCS", "Manila", "CSC404M", "1"],
    ["74", "GSM", "CCS", "Manila", "CSC701M", "1"],
    ["75", "GSM", "CCS", "Manila", "CSC755M", "3"],
    ["76", "GSM", "CCS", "Manila", "DAT702M", "1"],
    ["77", "GSM", "CCS", "Manila", "DAT203M", "1"],
    ["78", "GSM", "CCS", "Manila", "DAT290M", "1"],
    ["1421", "UGB", "CCS", "Manila", "2DGRAFX", "1"],
    ["1422", "UGB", "CCS", "Manila", "3DMODEL", "1"],
    ["1430", "UGB", "CCS", "Manila", "ADPRINT", "1"],
    ["1431", "UGB", "CCS", "Manila", "ADRULES", "1"],
    ["1432", "UGB", "CCS", "Manila", "ADVAFIN", "1"],
    ["1433", "UGB", "CCS", "Manila", "ARVR100", "1"],
    ["1443", "UGB", "CCS", "Manila", "CAP-IS0", "16"],
    ["1444", "UGB", "CCS", "Manila", "CAP-IS1", "8"],
    ["1445", "UGB", "CCS", "Manila", "CAP-IS2", "2"],
    ["1446", "UGB", "CCS", "Manila", "CAP-IT0", "24"],
    ["1447", "UGB", "CCS", "Manila", "CAP-IT1", "5"],
    ["1448", "UGB", "CCS", "Manila", "CAP-IT2", "21"],
  ]);

  // enrollment stats
  const [enrollmentStats, setEnrollmentStats] = useState<string[][]>([
    ["BSINSYS", "62", "47", "40", "33"],
    ["BSIT", "138", "94", "149", "108"],
    ["BSMS-CS", "11", "12", "28", "36"],
    ["BSCS-CSE", "84", "29", "27", "26"],
    ["BSCS-NIS", "126", "52", "62", "56"],
    ["BSCS-ST", "227", "250", "261", "270"],
  ]);

  // editing state
  const [editIndexCourses, setEditIndexCourses] = useState<number | null>(null);
  const [editRowCourses, setEditRowCourses] = useState<string[] | null>(null);

  const [editIndexStats, setEditIndexStats] = useState<number | null>(null);
  const [editRowStats, setEditRowStats] = useState<string[] | null>(null);

  // enlisted courses edit
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

  // enrollment stats edit
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

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <TopBar />

      <main className="p-6 max-w-7xl mx-auto">
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6">
          {/* Horizontal layout */}
          <div className="flex flex-col md:flex-row">
            {/* Left Panel - Enlisted Courses */}
            <section className="flex-1 max-h-[400px] overflow-y-auto pr-4">
              <h2 className="text-lg font-bold">List of Enlisted Courses</h2>
              <p className="text-sm text-gray-500 mb-4">Term 1 AY 2025-2026</p>

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
                      {editIndexCourses === i ? (
                        <>
                          {row.map((cell, j) => (
                            <td key={j} className="py-2 pr-4">
                              <input
                                value={editRowCourses?.[j] || ""}
                                onChange={(e) => {
                                  const copy = [...(editRowCourses || [])];
                                  copy[j] = e.target.value;
                                  setEditRowCourses(copy);
                                }}
                                className="px-2 py-1 rounded-md shadow-sm border border-gray-300"
                              />
                            </td>
                          ))}
                          <td className="py-2 pr-2 text-right">
                            <button
                              onClick={saveEditCourses}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          {row.map((cell, j) => (
                            <td key={j} className="py-2 pr-4">
                              {cell}
                            </td>
                          ))}
                          <td className="py-2 pr-2 text-right">
                            <button
                              onClick={() => startEditCourses(i)}
                              className="text-gray-500 hover:text-black"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Divider */}
            <div className="my-6 md:my-0 md:mx-6 border-t md:border-t-0 md:border-l border-gray-300"></div>

            {/* Right Panel - Enrollment Stats */}
            <section className="flex-1 max-h-[400px] overflow-y-auto pl-4">
              <h2 className="text-lg font-bold">Enrollment Statistics</h2>
              <p className="text-sm text-gray-500 mb-4">Term 1 AY 2025-2026</p>

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
                      {editIndexStats === i ? (
                        <>
                          {row.map((cell, j) => (
                            <td key={j} className="py-2 pr-4">
                              <input
                                value={editRowStats?.[j] || ""}
                                onChange={(e) => {
                                  const copy = [...(editRowStats || [])];
                                  copy[j] = e.target.value;
                                  setEditRowStats(copy);
                                }}
                                className="px-2 py-1 rounded-md shadow-sm border border-gray-300"
                              />
                            </td>
                          ))}
                          <td className="py-2 pr-2 text-right">
                            <button
                              onClick={saveEditStats}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          {row.map((cell, j) => (
                            <td key={j} className="py-2 pr-4">
                              {cell}
                            </td>
                          ))}
                          <td className="py-2 pr-2 text-right">
                            <button
                              onClick={() => startEditStats(i)}
                              className="text-gray-500 hover:text-black"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
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
