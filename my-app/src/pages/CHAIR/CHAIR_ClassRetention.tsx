// src/pages/CHAIR/CHAIR_ClassRetention.tsx
import React, { useEffect, useRef, useState } from "react";
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
  Check,
  ChevronDown,
  Edit,
  FileSpreadsheet,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------- tiny utils (same pattern) ---------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

/* ---------- Re-usable SelectBox (same UX as OM_StudentPetition) ---------- */
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

/* ---------- Styled TextBox (for Remarks, same feel as OM_StudentPetition) ---------- */
function TextBox({
  value,
  onChange,
  placeholder = "Add remarks...",
  className = "",
  disabled = false,
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiline?: boolean;
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

/* ---------- Page ---------- */
export default function CHAIR_ClassRetention() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // edit states (like CHAIR_StudentPetition)
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<Record<string, any>>({});

  // selection (checkbox behavior now mirrors CHAIR_StudentPetition)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const tableRef = useRef<HTMLTableElement | null>(null);

  const statusOptions = ["All Status", "Approved", "Under Review", "Rejected"];

  const [data, setData] = useState([
    {
      course: "CCPROG3",
      title: "Object-Oriented Programming",
      section: "S16",
      stuUnits: 3,
      facUnits: 3,
      enrolled: 12,
      faculty: "BEREDO, JACKLYN L.",
      status: "Approved",
      remarks: "",
    },
    {
      course: "STCLOUD",
      title: "Cloud Computing",
      section: "S14",
      stuUnits: 3,
      facUnits: 3,
      enrolled: 10,
      faculty: "FLORES, FRITZ KEVIN",
      status: "Under Review",
      remarks: "",
    },
    {
      course: "CSMODEL",
      title: "Discrete Structures",
      section: "S11",
      stuUnits: 3,
      facUnits: 3,
      enrolled: 6,
      faculty: "CU, GREGORY",
      status: "Rejected",
      remarks: "",
    },
  ]);

  const filtered = data.filter(
    (r) =>
      (statusFilter === "All Status" || r.status === statusFilter) &&
      (r.course.toLowerCase().includes(search.toLowerCase()) ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.faculty.toLowerCase().includes(search.toLowerCase()))
  );

  const chairItems = [
    { to: "/chair/plantilla", label: "Plantilla", Icon: ListChecks },
    { to: "/chair/faculty-management", label: "Faculty Management", Icon: Users },
    { to: "/chair/course-management", label: "Course Management", Icon: BookOpen },
    { to: "/chair/reports-analytics", label: "Reports and Analytics", Icon: BarChart3 },
    { to: "/chair/faculty-service", label: "Faculty Service", Icon: FileText },
    { to: "/chair/student-petition", label: "Student Petition", Icon: FilePlus },
    { to: "/chair/class-retention", label: "Class Retention", Icon: BookMarked },
  ];

  /* ---------- edit handlers (match CHAIR_StudentPetition flow) ---------- */
  const handleEdit = (course: string) => {
    const row = data.find((r) => r.course === course);
    if (row) {
      setEditRow(course);
      setEditableData({ ...row });
    }
  };

  const handleSave = () => {
    setData((prev) =>
      prev.map((r) => (r.course === editRow ? ({ ...editableData } as typeof r) : r))
    );
    setEditRow(null);
  };

  /* ---------- Export to PDF ---------- */
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", format: "a4" });

    const dept = "Department of Software Technology (ST)";
    const generated = new Date().toLocaleString();
    const filename = "Class_Retention_CCS_ST_AY2025-2026_Term1.pdf";

    // Title & meta
    doc.setFontSize(14);
    doc.text(`Class Retention — ${dept}`, 14, 14);
    doc.setFontSize(10);
    doc.text(`Academic Year 2025–2026 • 1st Term`, 14, 22);
    doc.text(`Generated: ${generated}`, doc.internal.pageSize.getWidth() - 14, 22, { align: "right" });

    // ✅ Export only selected rows; if none specifically selected, export all (from the filtered view)
    const exportData =
      selectedRows.length > 0
        ? filtered.filter((r) => selectedRows.includes(r.course))
        : filtered;

    // Build rows from exportData
    const rows = exportData.map((r) => [
      r.course,
      r.title,
      r.section,
      String(r.stuUnits),
      String(r.facUnits),
      String(r.enrolled),
      r.faculty,
      r.status,
      r.remarks || "—",
    ]);

    const margin = 14;
    const pageW = doc.internal.pageSize.getWidth();
    const usableW = pageW - margin * 2;
    const P = (pct: number) => (usableW * pct) / 100;

    const widths = [
      P(8),  // Code
      P(18), // Title
      P(6),  // Section
      P(8),  // Stu Units
      P(8),  // Fac Units
      P(10), // Enrolled
      P(18), // Faculty
      P(9),  // Status
      P(15), // Remarks
    ];

    autoTable(doc, {
      head: [[
        "Course Code",
        "Course Title",
        "Section",
        "Student Unit(s)",
        "Faculty Unit(s)",
        "Enrolled",
        "Faculty",
        "Status",
        "Remarks",
      ]],
      body: rows,
      startY: 30,
      margin: { left: margin, right: margin, top: 30, bottom: 18 },
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: { top: 2, right: 3, bottom: 2, left: 3 },
        overflow: "linebreak",
        lineWidth: 0.2,
        lineColor: [217, 217, 217],
      },
      headStyles: {
        fillColor: [244, 246, 250],
        textColor: 31,
        halign: "center",
        valign: "middle",
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { cellWidth: widths[0], halign: "center", fontStyle: "bold", textColor: [13, 113, 74] },
        1: { cellWidth: widths[1], halign: "left" },
        2: { cellWidth: widths[2], halign: "center" },
        3: { cellWidth: widths[3], halign: "center" },
        4: { cellWidth: widths[4], halign: "center" },
        5: { cellWidth: widths[5], halign: "center" },
        6: { cellWidth: widths[6], halign: "left" },
        7: { cellWidth: widths[7], halign: "center" },
        8: { cellWidth: widths[8], halign: "left" },
      },
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.text(
          "Notes: This report lists low-enrollment classes and their retention status. Remarks reflect Chair actions or context.",
          margin,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save(filename);
  };

  // ---- Checkbox logic (EXACTLY like CHAIR_StudentPetition) ----
  const headerChecked =
    filtered.length > 0 && selectedRows.length === filtered.length;

  return (
    <AppShell
      topbarProfileName="Neil Patrick DelGallego"
      topbarProfileSubtitle="Department Chair | Department of Software Technology"
      sidebarItems={chairItems}
    >
      <main className="w-full px-8 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Class Retention</h1>
          <p className="text-sm text-gray-600">
            Manage class retention requests for low-enrollment courses for Term 1 AY 2025–2026
          </p>
        </header>

        {/* Filters + Export */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course, faculty, or title..."
              className="w-full rounded-lg border border-gray-300 px-9 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <SelectBox
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All Status", "Approved", "Under Review", "Rejected"]}
          />

          {/* Export button */}
          <button
            onClick={handleExportPDF}
            className="ml-auto inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:brightness-110"
            title="Export class retention as PDF"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export PDF
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm overflow-visible">
          <table ref={tableRef} className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-gray-700">
              <tr>
                {/* Checkbox header (same behavior as CHAIR_StudentPetition) */}
                <th className="w-10 px-4 py-2 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={headerChecked}
                    onChange={(e) =>
                      setSelectedRows(e.target.checked ? filtered.map((r) => r.course) : [])
                    }
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    aria-label="Select all"
                  />
                </th>

                <th className="text-left px-4 py-2">Course Code & Title</th>
                <th className="px-4 py-2 text-center">Section</th>
                <th className="px-4 py-2 text-center">Student Units</th>
                <th className="px-4 py-2 text-center">Faculty Units</th>
                <th className="px-4 py-2 text-center">Enrolled Students</th>
                <th className="text-left px-4 py-2">Faculty</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="text-left px-4 py-2 w-[34%]">Remarks</th>
                <th className="w-10 px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => {
                const isSelected = selectedRows.includes(r.course);
                return (
                  <tr key={r.course} className="hover:bg-gray-50 align-top">
                    {/* Row checkbox */}
                    <td className="px-4 py-3 text-center align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          setSelectedRows((prev) =>
                            prev.includes(r.course)
                              ? prev.filter((id) => id !== r.course)
                              : [...prev, r.course]
                          )
                        }
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        aria-label={`Select ${r.course}`}
                      />
                    </td>

                    {/* Course Code + Title */}
                    <td className="px-4 py-3 text-left font-semibold text-emerald-700">
                      {r.course}
                      <div className="text-xs text-gray-500">{r.title}</div>
                    </td>

                    <td className="px-4 py-3 text-center">{r.section}</td>
                    <td className="px-4 py-3 text-center">{r.stuUnits}</td>
                    <td className="px-4 py-3 text-center">{r.facUnits}</td>
                    <td className="px-4 py-3 text-center">{r.enrolled}</td>
                    <td className="px-4 py-3 text-left">{r.faculty}</td>

                    {/* Editable Status (dropdown on edit) */}
                    <td className="px-4 py-3 text-center">
                      {editRow === r.course ? (
                        <SelectBox
                          value={editableData.status}
                          onChange={(v) => setEditableData({ ...editableData, status: v })}
                          options={statusOptions.filter((o) => o !== "All Status")}
                        />
                      ) : (
                        <span
                          className={cls(
                            "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                            r.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : r.status === "Under Review"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {r.status}
                        </span>
                      )}
                    </td>

                    {/* Editable Remarks */}
                    <td className="px-4 py-3 text-left">
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
                        <button
                          onClick={handleSave}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50"
                          title="Save"
                        >
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(r.course)}
                          className="text-emerald-700 hover:brightness-110"
                          title="Edit status & remarks"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </AppShell>
  );
}
