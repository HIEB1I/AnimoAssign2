// src/pages/CHAIR/CHAIR_FacultyManagement.tsx
import React, { useState, useEffect, useRef } from "react";
import AppShell from "../../base/AppShell";
import {
  ListChecks,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  FilePlus,
  BookMarked,
  Search,
  ChevronDown,
  MoreVertical,
  User as UserIcon,
  Calendar,
  BookOpen as BookOpenIcon,
  GraduationCap,
} from "lucide-react";

/* ---------- tiny util ---------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

/* ---------- Chair sidebar ---------- */
const chairItems = [
  { to: "/chair/plantilla", label: "Plantilla", Icon: ListChecks },
  { to: "/chair/faculty-management", label: "Faculty Management", Icon: Users },
  { to: "/chair/course-management", label: "Course Management", Icon: BookOpen },
  { to: "/chair/reports-analytics", label: "Reports and Analytics", Icon: BarChart3 },
  { to: "/chair/faculty-service", label: "Faculty Service", Icon: FileText },
  { to: "/chair/student-petition", label: "Student Petition", Icon: FilePlus },
  { to: "/chair/class-retention", label: "Class Retention", Icon: BookMarked },
];

/* ---------------- SelectBox (mirrors OM) ---------------- */
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
    <div className={cls("relative min-w-[160px]", className)}>
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
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                btnRef.current?.focus();
              }}
              className={cls(
                "block w-full px-4 py-2 text-left text-sm hover:bg-emerald-50",
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

/* ---------------- Action Menu (mirrors OM) ---------------- */
function ActionMenu({
  onViewProfile,
  onViewSchedule,
  onViewHistory,
}: {
  onViewProfile: () => void;
  onViewSchedule: () => void;
  onViewHistory: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => open && !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="rounded-full p-2 hover:bg-gray-100 text-gray-700">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl py-1 text-left z-50">
          <button
            onClick={() => {
              setOpen(false);
              onViewProfile();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <UserIcon className="h-4 w-4" /> <span>Faculty Profile</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onViewSchedule();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4" /> <span>Schedule</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onViewHistory();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <BookOpenIcon className="h-4 w-4" /> <span>Teaching History</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Main (mirrors OM profile & schedule formatting) ---------------- */
export default function CHAIR_FacultyManagement() {
  type Faculty = {
    name: string;
    email: string;
    department: string;
    position: string;
    teachingUnits: string;
    facultyType: string;
    status: string;

    // Added to match OM profile details
    adminPosition: string;
    courseCoordinator: string;
    loadTeaching: number;
    loadAdmin: number;
    loadResearch: number;
    loadFacultyUnits: number;
  };

  const [department, setDepartment] = useState("All Departments");
  const [facultyType, setFacultyType] = useState("All Type");
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<null | "profile" | "schedule" | "history">(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const YEARS = ["AY 2024–2025", "AY 2023–2024", "AY 2022–2023"];
  const [historyYearIndex, setHistoryYearIndex] = useState(0);
  const historyYear = YEARS[historyYearIndex];

  const departmentOptions = ["All Departments", "Software Technology", "Computer Technology", "Information Technology"];
  const facultyTypeOptions = ["All Type", "Full-Time", "Part-Time"];

  // Sample data now includes the missing profile fields
  const [data] = useState<Faculty[]>([
    {
      name: "CABREDO, RAFAEL ANGISCO",
      email: "rafael.cabredo@dlsu.edu.ph",
      department: "Software Technology",
      position: "Associate Professor",
      teachingUnits: "15 units",
      facultyType: "Full-Time",
      status: "Active",
      adminPosition: "Department Chair",
      courseCoordinator: "CCPROG3, ADFUND",
      loadTeaching: 12.0,
      loadAdmin: 6.0,
      loadResearch: 0.0,
      loadFacultyUnits: 18.0,
    },
    {
      name: "NICDAO, DIOSDADO R. III",
      email: "diosdado.nicdao@dlsu.edu.ph",
      department: "Computer Technology",
      position: "Professor",
      teachingUnits: "12 units",
      facultyType: "Part-Time",
      status: "Inactive",
      adminPosition: "—",
      courseCoordinator: "—",
      loadTeaching: 9.0,
      loadAdmin: 0.0,
      loadResearch: 0.0,
      loadFacultyUnits: 9.0,
    },
    {
      name: "GONDA, RAPHAEL WILWAYCO",
      email: "raphael.gonda@dlsu.edu.ph",
      department: "Information Technology",
      position: "Assistant Professor",
      teachingUnits: "18 units",
      facultyType: "Full-Time",
      status: "On Leave",
      adminPosition: "—",
      courseCoordinator: "STCLOUD",
      loadTeaching: 12.0,
      loadAdmin: 3.0,
      loadResearch: 3.0,
      loadFacultyUnits: 18.0,
    },
  ]);

  const filtered = data.filter(
    (r) =>
      (department === "All Departments" || r.department === department) &&
      (facultyType === "All Type" || r.facultyType === facultyType) &&
      r.name.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (type: "profile" | "schedule" | "history", faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setActiveModal(type);
  };
  const closeModal = () => {
    setActiveModal(null);
    setSelectedFaculty(null);
  };

  // Day-grouped schedule, same formatting as OM
  const daySchedules = [
    {
      day: "Monday",
      entries: [
        { code: "CSMODEL", section: "S12", campus: "Manila", room: "Online", time: "7:30–9:00" },
        { code: "CSMODEL", section: "S13", campus: "Manila", room: "Online", time: "9:15–10:45" },
      ],
    },
    {
      day: "Tuesday",
      entries: [
        { code: "CCPROG3", section: "S15", campus: "Manila", room: "Online", time: "7:30–9:00" },
        { code: "CCPROG3", section: "S16", campus: "Manila", room: "Online", time: "9:15–10:45" },
      ],
    },
    {
      day: "Thursday",
      entries: [
        { code: "CSMODEL", section: "S12", campus: "Manila", room: "GK210", time: "7:30–9:00" },
        { code: "CSMODEL", section: "S13", campus: "Manila", room: "GK211", time: "9:15–10:45" },
      ],
    },
    {
      day: "Friday",
      entries: [
        { code: "CCPROG3", section: "S15", campus: "Manila", room: "GK306A", time: "7:30–9:00" },
        { code: "CCPROG3", section: "S16", campus: "Manila", room: "GK306B", time: "9:15–10:45" },
      ],
    },
  ].sort(
    (a, b) =>
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(a.day) -
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(b.day)
  );

  return (
    <AppShell
      topbarProfileName="Neil Patrick DelGallego"
      topbarProfileSubtitle="Department Chair | Department of Software Technology"
      sidebarItems={chairItems}
    >
      <main className="w-full px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Faculty Management</h1>
          <p className="text-sm text-gray-600">Manage faculty profiles, schedules, and teaching history.</p>
        </header>

        {/* Filters (same as OM) */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-gray-300 px-9 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <SelectBox value={department} onChange={setDepartment} options={departmentOptions} />
          <SelectBox value={facultyType} onChange={setFacultyType} options={facultyTypeOptions} />
        </div>

        {/* Table (same as OM) */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm overflow-visible">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Faculty</th>
                <th className="text-left px-4 py-2">Department</th>
                <th className="text-left px-4 py-2">Position</th>
                <th className="text-center px-4 py-2">Teaching Units</th>
                <th className="text-center px-4 py-2">Faculty Type</th>
                <th className="text-center px-4 py-2">Status</th>
                <th className="text-center px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-emerald-700 font-semibold">
                    {r.name}
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">{r.department}</td>
                  <td className="px-4 py-3">{r.position}</td>
                  <td className="text-center">{r.teachingUnits}</td>
                  <td className="text-center">{r.facultyType}</td>
                  <td className="text-center text-gray-800">{r.status}</td>
                  <td className="text-center">
                    <ActionMenu
                      onViewProfile={() => openModal("profile", r)}
                      onViewSchedule={() => openModal("schedule", r)}
                      onViewHistory={() => openModal("history", r)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals (profile & schedule mirror OM formatting) */}
        {activeModal && selectedFaculty && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              {activeModal === "profile" && (
                <>
                  <h2 className="text-lg font-semibold text-emerald-700 mb-6">Faculty Profile</h2>

                  {/* Details grid (like OM) */}
                  <div className="grid grid-cols-3 gap-y-5 text-sm mb-8">
                    <div>
                      <p className="font-semibold text-gray-900">Name</p>
                      <p className="text-gray-600">{selectedFaculty.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">{selectedFaculty.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Department</p>
                      <p className="text-gray-600">{selectedFaculty.department}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Faculty Type</p>
                      <p className="text-gray-600">{selectedFaculty.facultyType}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Status</p>
                      <p className="text-gray-600">{selectedFaculty.status}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Position</p>
                      <p className="text-gray-600">{selectedFaculty.position}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Admin Position</p>
                      <p className="text-gray-600">{selectedFaculty.adminPosition}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Course Coordinator</p>
                      <p className="text-gray-600">{selectedFaculty.courseCoordinator}</p>
                    </div>
                  </div>

                  <h3 className="text-md font-semibold flex items-center gap-2 mb-2 text-gray-900">
                    <GraduationCap className="h-5 w-5 text-emerald-700" />
                    Nature of Load
                  </h3>
                  <div className="grid grid-cols-4 text-left text-sm mb-4">
                    <div>
                      <p className="font-semibold">Teaching</p>
                      <p>{selectedFaculty.loadTeaching.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Admin</p>
                      <p>{selectedFaculty.loadAdmin.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Research</p>
                      <p>{selectedFaculty.loadResearch.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Faculty Units</p>
                      <p>{selectedFaculty.loadFacultyUnits.toFixed(1)}</p>
                    </div>
                  </div>
                </>
              )}

              {activeModal === "schedule" && (
                <>
                  <h2 className="text-lg font-semibold text-emerald-700 mb-6">Faculty Schedule</h2>

                  {/* Day-grouped tables (identical style/format to OM) */}
                  <div className="space-y-6">
                    {daySchedules.map(({ day, entries }) => (
                      <div key={day} className="rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-gray-50 border-b">
                          {day}
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide border-b">
                              <tr>
                                {["Course Code", "Section", "Campus", "Room", "Time"].map((h) => (
                                  <th key={h} className="px-3 py-2 text-center font-medium whitespace-nowrap">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {entries.map((row, i) => (
                                <tr
                                  key={`${day}-${row.section}-${i}`}
                                  className={cls(i % 2 === 0 ? "bg-white" : "bg-gray-50", "text-gray-800")}
                                >
                                  <td className="px-3 py-2 text-center">{row.code}</td>
                                  <td className="px-3 py-2 text-center">{row.section}</td>
                                  <td className="px-3 py-2 text-center">{row.campus}</td>
                                  <td className="px-3 py-2 text-center">{row.room}</td>
                                  <td className="px-3 py-2 text-center">{row.time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeModal === "history" && (
                <>
                  <h2 className="text-lg font-semibold text-emerald-700 mb-6">Teaching History</h2>
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => setHistoryYearIndex((i) => Math.max(0, i - 1))}
                        disabled={historyYearIndex === 0}
                        className={cls(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border shadow-sm",
                          historyYearIndex === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        ← Previous
                      </button>
                      <span className="text-base font-semibold text-gray-800">{historyYear}</span>
                      <button
                        onClick={() => setHistoryYearIndex((i) => Math.min(YEARS.length - 1, i + 1))}
                        disabled={historyYearIndex === YEARS.length - 1}
                        className={cls(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border shadow-sm",
                          historyYearIndex === YEARS.length - 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        Next →
                      </button>
                    </div>

                    {Object.entries({
                      "Term 1": [
                        { code: "CCPROG3", section: "S11", units: 3, mode: "Hybrid", schedule: "MTH 7:30–9:00 AM" },
                        { code: "CSMODEL", section: "S12", units: 3, mode: "Online", schedule: "TF 10:00–11:30 AM" },
                      ],
                      "Term 2": [{ code: "CBINTSY", section: "S14", units: 3, mode: "Hybrid", schedule: "MW 1:00–2:30 PM" }],
                      "Term 3": [{ code: "STCLOUD", section: "S16", units: 3, mode: "Hybrid", schedule: "TH 9:15–10:45 AM" }],
                    }).map(([term, rows]) => (
                      <div key={term} className="rounded-xl border border-gray-200 mb-6 overflow-hidden">
                        <div className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-gray-50 border-b">
                          {term}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide border-b">
                              <tr>
                                {["Course Code", "Section", "Units", "Mode", "Schedule"].map((h) => (
                                  <th key={h} className="px-3 py-2 text-center font-medium whitespace-nowrap">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((r, i) => (
                                <tr
                                  key={`${term}-${i}`}
                                  className={cls("text-gray-700", i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                                >
                                  <td className="px-3 py-2 text-center">{r.code}</td>
                                  <td className="px-3 py-2 text-center">{r.section}</td>
                                  <td className="px-3 py-2 text-center">{r.units}</td>
                                  <td className="px-3 py-2 text-center">{r.mode}</td>
                                  <td className="px-3 py-2 text-center">{r.schedule}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex justify-end mt-8">
                <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
