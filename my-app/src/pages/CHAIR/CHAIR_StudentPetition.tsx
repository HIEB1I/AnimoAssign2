import React, { useEffect, useRef, useState } from "react";
import AppShell from "../../base/AppShell";
import {
  ListChecks, Users, BookOpen, BarChart3, FileText, FilePlus, BookMarked,
  CheckCheck, Check, ChevronDown, Search, Edit
} from "lucide-react";

/* tiny util (keeps look/feel consistent) */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

/* Chair sidebar */
const chairItems = [
  { to: "/chair/plantilla", label: "Plantilla", Icon: ListChecks },
  { to: "/chair/faculty-management", label: "Faculty Management", Icon: Users },
  { to: "/chair/course-management", label: "Course Management", Icon: BookOpen },
  { to: "/chair/reports-analytics", label: "Reports and Analytics", Icon: BarChart3 },
  { to: "/chair/faculty-service", label: "Faculty Service", Icon: FileText },
  { to: "/chair/student-petition", label: "Student Petition", Icon: FilePlus },
  { to: "/chair/class-retention", label: "Class Retention", Icon: BookMarked },
];

/* SelectBox (mirrors OM) */
function SelectBox({
  value, onChange, options, placeholder = "— Select —", className = "",
}: {
  value: string; onChange: (v: string) => void; options: string[];
  placeholder?: string; className?: string;
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
        <div ref={listRef} className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-300 bg-white shadow-xl">
          {options.map((opt, i) => (
            <button
              key={opt}
              onMouseEnter={() => setHover(i)}
              onClick={() => { onChange(opt); setOpen(false); btnRef.current?.focus(); }}
              className={cls("block w-full px-4 py-2 text-left text-sm", i === hover && "bg-emerald-50", value === opt && "bg-emerald-100 text-emerald-800 font-medium")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Styled TextBox (extended to support multiline, mirrors OM) */
function TextBox({
  value, onChange, placeholder = "Enter text...", className = "", disabled = false, multiline = false,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string; disabled?: boolean; multiline?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className={cls(
            "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none",
            "focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition",
            "placeholder-gray-400",
            disabled && "cursor-not-allowed bg-gray-100 text-gray-400 opacity-70"
          )}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cls(
            "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm",
            "focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition",
            "placeholder-gray-400",
            disabled && "cursor-not-allowed bg-gray-100 text-gray-400 opacity-70"
          )}
        />
      )}
    </div>
  );
}



export default function CHAIR_StudentPetition() {
  const [status, setStatus] = useState("All Status");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<Record<string, any>>({});

  const statusOptions = [
    "All Status", "Less Than Minimum", "Forwarded To Department", "Rejected",
    "Wait For Frosh Block", "Wait For College Enlistment", "Open Slots Available",
    "New Class Opened", "Advised For Special Class", "Slots Increased",
  ];

  const [data, setData] = useState([
    { course: "CCPROG3", title: "Object-Oriented Programming", count: 38, section: "S20", faculty: "BEREDO, JACKYLYN", status: "New Class Opened", day1: "T", begin1: "0730", end1: "0900", day2: "H", begin2: "0730", end2: "0900", capacity: 20, remarks: "" },
    { course: "STCLOUD", title: "Cloud Computing",             count: 14, section: "S18", faculty: "CU, GREGORY",      status: "Advised For Special Class", day1: "S", begin1: "0900", end1: "1030", day2: "S", begin2: "1045", end2: "1200", capacity: 20, remarks: "" },
  ]);

  const filtered = data.filter(
    (r) => (status === "All Status" || r.status === status) && r.course.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (course: string) => {
    const row = data.find((r) => r.course === course);
    if (row) { setEditRow(course); setEditableData({ ...row }); }
  };

  const handleSave = () => {
    setData((prev) => prev.map((row) => row.course === editRow ? ({ ...editableData } as typeof row) : row));
    setEditRow(null);
  };

  return (
    <AppShell
      topbarProfileName="Neil Patrick DelGallego"
      topbarProfileSubtitle="Department Chair | Department of Software Technology"
      sidebarItems={chairItems}
    >
      <main className="w-full px-8 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Student Petition</h1>
          <p className="text-sm text-gray-600">Manage course section requests and approvals for Term 1 AY 2025–2026</p>
        </header>

        {/* Filters */}
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
          <SelectBox value={status} onChange={setStatus} options={statusOptions} />
          <button
            onClick={() => {
              if (selectedRows.length === 0) { alert("Please select at least one petition to approve."); return; }
              setShowApprovePrompt(true);
            }}
            disabled={selectedRows.length === 0}
            className={cls(
              "ml-auto inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm",
              selectedRows.length > 0 ? "bg-emerald-700 hover:brightness-110" : "bg-gray-300 cursor-not-allowed"
            )}
          >
            <CheckCheck className="h-4 w-4" />
            Approve
          </button>
        </div>

        {/* Table (styled to match CHAIR_FacultyManagement) */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm overflow-visible">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-gray-700">
              <tr>
                <th className="w-10 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedRows.length === filtered.length}
                    onChange={(e) => setSelectedRows(e.target.checked ? filtered.map((r) => r.course) : [])}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="text-left px-4 py-2">Course Code & Title</th>
                <th className="text-center px-4 py-2">Petition Count</th>
                <th className="text-center px-4 py-2">Section</th>
                <th className="text-left px-4 py-2">Faculty</th>
                <th className="text-center px-4 py-2">Day 1</th>
                <th className="text-center px-4 py-2">Begin 1</th>
                <th className="text-center px-4 py-2">End 1</th>
                <th className="text-center px-4 py-2">Day 2</th>
                <th className="text-center px-4 py-2">Begin 2</th>
                <th className="text-center px-4 py-2">End 2</th>
                <th className="text-center px-4 py-2">Capacity</th>
                <th className="text-center px-4 py-2">Status</th>
                <th className="text-left px-4 py-2 w-[28%]">Remarks</th>
                <th className="w-10 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.course} className="hover:bg-gray-50 align-top">
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(r.course)}
                      onChange={() =>
                        setSelectedRows((prev) =>
                          prev.includes(r.course) ? prev.filter((id) => id !== r.course) : [...prev, r.course]
                        )
                      }
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>

                  <td className="px-4 py-3 text-left font-semibold text-emerald-700">
                    {r.course}
                    <div className="text-xs text-gray-500">{r.title}</div>
                  </td>

                  <td className="px-4 py-3 text-center">{r.count}</td>
                  <td className="px-4 py-3 text-center">{r.section}</td>

                  {/* Editable cells */}
                  <td className="px-4 py-3 text-left">
                    {editRow === r.course ? (
                      <TextBox value={editableData.faculty} onChange={(v) => setEditableData({ ...editableData, faculty: v })} />
                    ) : (
                      r.faculty
                    )}
                  </td>

                  {["day1", "begin1", "end1", "day2", "begin2", "end2"].map((field) => (
                    <td key={field} className="px-4 py-3 text-center">
                      {editRow === r.course ? (
                        <TextBox
                          value={editableData[field]}
                          onChange={(v) => setEditableData({ ...editableData, [field]: v })}
                          className="w-[70px] text-center"
                        />
                      ) : (
                        (r as any)[field]
                      )}
                    </td>
                  ))}

                  <td className="px-4 py-3 text-center">{r.capacity}</td>

                  {/* Editable Status (mirrors OM) */}
                  <td className="px-4 py-3 text-center">
                    {editRow === r.course ? (
                      <SelectBox
                        value={editableData.status}
                        onChange={(v) => setEditableData({ ...editableData, status: v })}
                        options={statusOptions.filter((opt) => opt !== "All Status")}
                      />
                    ) : (
                      <span
                        className={cls(
                          "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                          r.status === "Rejected" ? "bg-red-100 text-red-700"
                            : r.status === "New Class Opened" ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {r.status}
                      </span>
                    )}
                  </td>

                  {/* Editable Remarks (mirrors OM) */}
                  <td className="px-4 py-2 text-left">
                    {editRow === r.course ? (
                      <TextBox
                        value={editableData.remarks || ""}
                        onChange={(v) => setEditableData({ ...editableData, remarks: v })}
                        placeholder="Add remarks..."
                        multiline
                        className="w-full"
                      />
                    ) : (
                      <span className="text-gray-700 block whitespace-pre-wrap">
                        {r.remarks || <span className="text-gray-400">—</span>}
                      </span>
                    )}
                  </td>

                  {/* Edit / Save */}
                  <td className="px-4 py-3 text-center">
                    {editRow === r.course ? (
                      <div className="flex justify-center">
                        <button
                          onClick={handleSave}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(r.course)} className="text-emerald-700 hover:brightness-110">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Approval Modal */}
        {showApprovePrompt && (
          <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-emerald-600 text-emerald-700">
                <Check className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="mb-2 text-center text-2xl font-semibold">Approve Selected Petitions?</h3>
              <p className="mx-auto mb-6 max-w-md text-center text-sm text-neutral-600">
                You are about to approve <span className="font-semibold">{selectedRows.length}</span>{" "}
                {selectedRows.length === 1 ? "petition" : "petitions"}.<br />
                Once confirmed, these will be forwarded to the <span className="font-semibold">Department Chair</span>.
              </p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowApprovePrompt(false)} className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200">Cancel</button>
                <button
                  onClick={() => { setShowApprovePrompt(false); alert(`✅ ${selectedRows.length} petition(s) approved successfully!`); setSelectedRows([]); }}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                >
                  Yes, I Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
