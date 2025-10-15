import React, { useState, useEffect, useRef } from "react";
import AppShell from "../../base/AppShell";
import { ListChecks, Users, BookOpen, BarChart3, FileText, FilePlus, BookMarked, Search, ChevronDown, MoreVertical, FileText as FileTextIcon, BookOpen as BookOpenIcon } from "lucide-react";

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
  value, onChange, options, placeholder = "— Select —", className = "",
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; className?: string;
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
        <div ref={listRef} className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-300 bg-white shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); btnRef.current?.focus(); }}
              className={cls("block w-full px-4 py-2 text-left text-sm hover:bg-emerald-50", value === opt && "bg-emerald-100 text-emerald-800 font-medium")}
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
function ActionMenu({ onViewSyllabus, onViewDetails }: { onViewSyllabus: () => void; onViewDetails: () => void; }) {
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
          <button onClick={() => { setOpen(false); onViewSyllabus(); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <FileTextIcon className="h-4 w-4" /> <span>View Syllabus</span>
          </button>
          <button onClick={() => { setOpen(false); onViewDetails(); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <BookOpenIcon className="h-4 w-4" /> <span>Course Details</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Main (content ported from OM_CourseManagement) ---------------- */
export default function CHAIR_CourseManagement() {
  type Course = {
    cluster: string; code: string; title: string; units: number | string; coordinator: string; email: string; composition: string[]; syllabus: string;
  };

  const [cluster, setCluster] = useState("All Clusters");
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<null | "details" | "syllabus">(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const clusters = ["All Clusters", "Game Arts", "Programming"];

  // Sample data mirrored from OM
  const [data] = useState<Course[]>([
    { cluster: "Game Arts", code: "AD-FUND", title: "Game Art Fundamentals", units: "3.0", coordinator: "CABREDO, RAFAEL A.", email: "rafael.cabredo@dlsu.edu.ph", composition: ["SALDIVAR, ROLAND", "GOMEZ, PATRICK", "REYES, LARA"], syllabus: "https://drive.google.com/drive/u/4/folders/1SXZd3XolHYK6Kr-Z6kMLSqpauY8dRlgq" },
    { cluster: "Game Arts", code: "AD-MOVE", title: "Fundamentals of Human Movement", units: "3.0", coordinator: "CABREDO, RAFAEL A.", email: "rafael.cabredo@dlsu.edu.ph", composition: ["ESGUERRA, TERRENCE"], syllabus: "https://drive.google.com/drive/u/4/folders/1SXZd3XolHYK6Kr-Z6kMLSqpauY8dRlgq" },
    { cluster: "Programming", code: "CCDSALG", title: "Data Structures and Algorithms", units: "3.0", coordinator: "CHU, SHIRLEY B.", email: "shirley.chu@dlsu.edu.ph", composition: ["ANTIOQUIA, ARREN", "TAN, VICTOR"], syllabus: "https://drive.google.com/drive/u/4/folders/1SXZd3XolHYK6Kr-Z6kMLSqpauY8dRlgq" },
  ]);

  const filtered = data.filter(
    (r) =>
      (cluster === "All Clusters" || r.cluster === cluster) &&
      (r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.coordinator.toLowerCase().includes(search.toLowerCase()))
  );

  const openModal = (type: "details" | "syllabus", course: Course) => { setSelectedCourse(course); setActiveModal(type); };
  const closeModal = () => { setActiveModal(null); setSelectedCourse(null); };

  return (
    <AppShell
      topbarProfileName="Neil Patrick DelGallego"
      topbarProfileSubtitle="Department Chair | Department of Software Technology"
      sidebarItems={chairItems}
    >
      <main className="w-full px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-sm text-gray-600">Manage department course coordinators and teaching compositions.</p>
        </header>

        {/* Filters (same as OM) */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course code or faculty..."
              className="w-full rounded-lg border border-gray-300 px-9 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <SelectBox value={cluster} onChange={setCluster} options={clusters} />
        </div>

        {/* Table (same as OM) */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm overflow-visible">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Knowledge Area Cluster</th>
                <th className="text-left px-4 py-2">Course Code & Title</th>
                <th className="text-left px-4 py-2">Units</th>
                <th className="text-left px-4 py-2">Course Coordinator</th>
                <th className="text-left px-4 py-2">Teaching Composition</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{r.cluster}</td>
                  <td className="px-4 py-3 text-left font-semibold text-emerald-700">
                    {r.code}
                    <div className="text-xs text-gray-500">{r.title}</div>
                  </td>
                  <td className="px-4 py-3">{r.units}</td>
                  <td className="px-4 py-3">
                    {r.coordinator}
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {r.composition.map((name, i) => (
                      <div key={i} className="text-sm text-gray-800">{name}</div>
                    ))}
                  </td>
                  <td className="text-left">
                    <ActionMenu
                      onViewSyllabus={() => openModal("syllabus", r)}
                      onViewDetails={() => openModal("details", r)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals (same as OM) */}
        {activeModal && selectedCourse && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg font-semibold text-emerald-700 mb-4">
                {activeModal === "details" ? "Course Details" : "Syllabus"}
              </h2>

              {activeModal === "details" ? (
                <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-800">
                  <div><p className="font-semibold text-gray-900">Course Code</p><p>{selectedCourse.code}</p></div>
                  <div><p className="font-semibold text-gray-900">Title</p><p>{selectedCourse.title}</p></div>
                  <div><p className="font-semibold text-gray-900">Units</p><p>{selectedCourse.units}</p></div>
                  <div><p className="font-semibold text-gray-900">Cluster</p><p>{selectedCourse.cluster}</p></div>
                  <div><p className="font-semibold text-gray-900">Coordinator</p><p>{selectedCourse.coordinator}</p></div>
                  <div><p className="font-semibold text-gray-900">Email</p>
                    <p className="text-blue-700 underline"><a href={`mailto:${selectedCourse.email}`}>{selectedCourse.email}</a></p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900">Teaching Composition</p>
                    {selectedCourse.composition.map((f, i) => (<p key={i}>{f}</p>))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-700">
                  {selectedCourse.syllabus ? (
                    <>
                      <p className="mb-3">
                        Syllabus Link:
                        <a href={selectedCourse.syllabus} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline ml-2">Open in New Tab</a>
                      </p>
                      <iframe
                        src={selectedCourse.syllabus.replace("/view?usp=sharing", "/preview")}
                        title="Syllabus"
                        className="w-full h-[500px] border rounded-xl"
                      />
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No syllabus link provided.</p>
                  )}
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
