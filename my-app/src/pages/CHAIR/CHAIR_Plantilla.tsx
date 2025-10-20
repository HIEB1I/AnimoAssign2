// src/pages/CHAIR/CHAIR_Plantilla.tsx
import React, { useRef, useState } from "react";
import AppShell from "../../base/AppShell";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ListChecks,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  FilePlus,
  BookMarked,
  CheckCheck,
  Check,
  FileSpreadsheet,
} from "lucide-react";

/* ------------------ Notifications (unchanged) ------------------ */
type Notification = { id: number; title: string; details: string; time: Date; seen?: boolean };
const INITIAL_NOTIFS: Notification[] = [
  { id: 1, title: "Department Chair approved the Faculty Plantilla", details: "The Dean has been notified for final review.", time: new Date(Date.now() - 2 * 60 * 1000), seen: false },
  { id: 2, title: "Provost feedback received", details: "A note was added to the 2025-2026 1st Term plantilla.", time: new Date(Date.now() - 15 * 60 * 1000), seen: false },
  { id: 3, title: "New schedule update available", details: "Please check the final IT course timetable revision.", time: new Date(Date.now() - 60 * 60 * 1000), seen: false },
];

const timeAgo = (d: Date) => {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  return `${dd}d ago`;
};

// tiny utility
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

/* ------------------ Display-only Day normalizer ------------------ */
// Normalize Day column visually while preserving the original raw text for export.
const normalizeDay = (s: string) => {
  const toks = (s || "")
    .toUpperCase()
    .split(/[^A-Z]/g)
    .filter(Boolean);

  const map: Record<string, string> = {
    M: "M",
    T: "T",
    W: "W",
    H: "H",   // DLSU-style Thursday
    TH: "H",  // Normalize "Th" → "H"
    F: "F",
    S: "S",   // Saturday
    SU: "Su",
    SUN: "Su",
    SAT: "S",
  };

  const parts = toks.map((t) => map[t] ?? t.charAt(0));
  return parts.join(" / ");
};

const DayCell: React.FC<{ raw: string }> = ({ raw }) => (
  // Ensure the separator never breaks across lines on screen
  <span data-raw-day={raw}>{normalizeDay(raw).replace(/ \/ /g, " / ")}</span>
);

/* ------------------ Department Plantilla ------------------ */
function DepartmentPlantilla({
  deptLabel,
  plantillaFile,
}: {
  deptLabel: string;
  plantillaFile: string;
}) {
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const handleApprove = () => {
    setShowApprovePrompt(false);
    setIsApproving(true);
    setApproved(true);
    requestAnimationFrame(() => {
      handleExportPDF();
      setIsApproving(false);
    });
  };

  const handleExportPDF = () => {
    const tbl = tableRef.current;
    if (!tbl) return alert("No plantilla table found!");

    const doc = new jsPDF({ orientation: "landscape", format: "a3" });
    const dept = deptLabel;
    const file = plantillaFile;
    const generated = new Date().toLocaleString();

    // Title + meta
    doc.setFontSize(14);
    doc.text(`Department Faculty Plantilla of CCS – ${dept}`, 14, 14);
    doc.setFontSize(10);
    doc.text(`Academic Year 2025–2026 • 1st Term • Full-time Faculty`, 14, 22);
    doc.text(`File: ${file}`, 14, 28);
    doc.text(`Generated: ${generated}`, doc.internal.pageSize.getWidth() - 14, 28, { align: "right" });

    // Body rows from DOM — use raw value for Day if present
    const rows = Array.from(tbl.querySelectorAll("tbody tr")).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td, i) => {
        if (i === 3) {
          const raw = td.querySelector<HTMLElement>("[data-raw-day]")?.getAttribute("data-raw-day");
          return (raw ?? (td.textContent || "")).trim();
        }
        return (td.textContent || "").trim();
      })
    );

    // Two-row header WITHOUT Rank
    const headRow1 = [
      { content: "Faculty", rowSpan: 2 },
      { content: "Course", rowSpan: 2 },
      { content: "Section", rowSpan: 2 },
      { content: "Day", rowSpan: 2 },
      { content: "Time", rowSpan: 2 },
      { content: "Room", rowSpan: 2 },
      { content: "No. of Students", rowSpan: 2 },
      { content: "Lecture Hours", rowSpan: 2 },
      { content: "Lab Hours", rowSpan: 2 },
      { content: "Student Unit(s)", rowSpan: 2 },
      { content: "On Leave", rowSpan: 2 },
      { content: "Type of Course", rowSpan: 2 },
      { content: "NATURE OF LOAD", colSpan: 4 },
      { content: "PREMIUMS", colSpan: 3 },
      { content: "Remarks", rowSpan: 2 },
    ] as const;

    const headRow2 = [
      "Teaching",
      "Admin",
      "Research",
      "Faculty Unit(s)",
      "Grad Load",
      "Premium 4th Prep",
      "Overload (NCA)",
    ];

    // Column widths (Rank removed; adjusted to fit page nicely)
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    const usableW = pageW - margin * 2;
    const P = (pct: number) => (usableW * pct) / 100;

    // 20 columns, total ≈ 100%
    const widths = [
      P(9),  // Faculty
      P(6),  // Course
      P(4.5),// Section
      P(4),  // Day
      P(6),  // Time
      P(4.5),// Room
      P(4.5),// No. of Students
      P(4.5),// Lecture Hrs
      P(4),  // Lab Hrs
      P(4.5),// Student Units
      P(4),  // On Leave
      P(4.5),// Type of Course
      P(4.5),// Teaching
      P(4.5),// Admin
      P(4.5),// Research
      P(4),  // Faculty Units
      P(4.5),// Grad Load
      P(4.5),// Premium 4th Prep
      P(4.5),// Overload
      P(9.5),// Remarks (still wide)
    ];

    autoTable(doc, {
      head: [headRow1 as any, headRow2],
      body: rows,
      startY: 34,
      margin: { left: margin, right: margin, top: 34, bottom: 18 },
      theme: "grid",
      styles: {
        fontSize: 5,
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
        0:  { cellWidth: widths[0],  halign: "left",  fontStyle: "bold", textColor: [13, 113, 74] },
        1:  { cellWidth: widths[1],  halign: "center" },
        2:  { cellWidth: widths[2],  halign: "center" },
        3:  { cellWidth: widths[3],  halign: "center" },
        4:  { cellWidth: widths[4],  halign: "center" },
        5:  { cellWidth: widths[5],  halign: "center" },
        6:  { cellWidth: widths[6],  halign: "center" },
        7:  { cellWidth: widths[7],  halign: "center" },
        8:  { cellWidth: widths[8],  halign: "center" },
        9:  { cellWidth: widths[9],  halign: "center" },
        10: { cellWidth: widths[10], halign: "center" },
        11: { cellWidth: widths[11], halign: "center" },
        12: { cellWidth: widths[12], halign: "center" },
        13: { cellWidth: widths[13], halign: "center" },
        14: { cellWidth: widths[14], halign: "center" },
        15: { cellWidth: widths[15], halign: "center" },
        16: { cellWidth: widths[16], halign: "center" },
        17: { cellWidth: widths[17], halign: "center" },
        18: { cellWidth: widths[18], halign: "center" },
        19: { cellWidth: widths[19], halign: "left" }, // Remarks
      },
      didParseCell: (data: any) => {
        if (data.section === "body") {
          if (data.column.index === 0) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.textColor = [13, 113, 74];
            data.cell.styles.halign = "left";
          }
          if (data.column.index === 19) data.cell.styles.halign = "left";
        }
      },
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.text(
          "Notes: Hours and units are computed based on official loading policies. Premiums apply per college guidelines.",
          margin,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save(file);
  };

  function sanitizeNodeClasses(_root: Element, _opts?: { keepDataAttrs?: boolean }) {
    // no-op: preserve classes for accurate print styling
    return;
  }

  // ✅ the function continues and returns JSX
  return (
    <section className="mt-10">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">
          Department Faculty Plantilla of CCS – {deptLabel} for Academic Year 2025–2026, 1st Term
        </h2>
        <p className="text-sm text-gray-600">Full-time Faculty</p>
      </header>

      <div className="flex items-center justify-end gap-3 mt-4">
        <button
          onClick={() => setShowApprovePrompt(true)}
          disabled={approved || isApproving}
          aria-disabled={approved || isApproving}
          className={`inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-medium text-white
            ${approved || isApproving ? "bg-emerald-400 cursor-not-allowed opacity-70" : "bg-emerald-700 hover:brightness-110"}`}
          title={approved ? "Already approved" : "Approve and export PDF"}
        >
          <CheckCheck className="h-4 w-4" />
          {approved ? "Approved" : isApproving ? "Approving…" : "Approve"}
        </button>

        <button
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:brightness-110"
          title="Export plantilla as PDF"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      {showApprovePrompt && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-emerald-600 text-emerald-700">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h3 className="mb-2 text-center text-2xl font-semibold">Are you sure?</h3>
            <p className="mx-auto mb-6 max-w-md text-center text-sm text-neutral-600">
              Confirm this as the final <span className="font-semibold">Faculty Plantilla</span> for{" "}
              <span className="font-semibold">{deptLabel}</span>. On confirm, the Approve button will be disabled and the PDF will open for printing.
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
                Yes, Approve & Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: ensure it always fits the viewport width without ugly overflow */}
      <div className="mt-8 w-full max-w-[100vw] overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md p-2 md:p-3">
        <table
          ref={tableRef}
          className="w-full table-fixed text-[0.88rem] border-collapse border border-gray-200 leading-snug
                     [&_th]:px-3 [&_th]:py-2 [&_th]:align-middle
                     [&_td]:px-3 [&_td]:py-2 [&_td]:align-middle
                     [&_thead_tr]:border-b [&_thead_tr]:border-gray-200
                     [&_tbody_tr:nth-child(even)]:bg-gray-50
                     [&_tbody_tr:hover]:bg-gray-100/60
                     [&_td:first-child]:text-left [&_td:first-child]:font-medium [&_td:first-child]:text-emerald-700
                     [&_th:first-child]:text-left [&_th:first-child]:font-semibold
                     [&_td]:break-words [&_td]:tabular-nums [&_th]:tabular-nums
                     [&_td:nth-child(1)]:min-w-[240px]
                     [&_th:nth-child(4)]:whitespace-nowrap
                     [&_th:nth-child(6)]:whitespace-nowrap
                     [&_th:nth-child(7)]:whitespace-nowrap
                     [&_td:nth-child(4)]:whitespace-nowrap [&_td:nth-child(4)]:px-2
                     [&_td:nth-child(5)]:whitespace-nowrap [&_td:nth-child(5)]:px-2
                     [&_td:nth-child(6)]:whitespace-nowrap [&_td:nth-child(6)]:px-2
                     [&_td:nth-child(7)]:whitespace-nowrap [&_td:nth-child(7)]:px-2
                     [&_td:nth-child(n+8)]:text-center
                     [&_th:last-child]:w-[28rem] [&_td:last-child]:w-[28rem]
                     [&_th:last-child]:whitespace-normal [&_td:last-child]:whitespace-normal
                     [&_td:last-child]:text-left [&_td:last-child]:align-top"
        >
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-center border-b">
              <th rowSpan={2} className="px-3 py-2 font-semibold text-left">Faculty</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Course</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Section</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Day</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Time</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Room</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold">No. of Students</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold">Lecture Hours</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold">Lab Hours</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold">Student Unit(s)</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold">On Leave</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold">Type of Course</th>
              <th colSpan={4} className="px-3 py-2 font-semibold border-l border-gray-300">NATURE OF LOAD</th>
              <th colSpan={3} className="px-3 py-2 font-semibold border-l border-gray-300">PREMIUMS</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Remarks</th>
            </tr>
            <tr className="bg-gray-50 text-gray-700 text-center border-b text-m">
              <th className="px-2 py-2 font-semibold">Teaching</th>
              <th className="px-2 py-2 font-semibold">Admin</th>
              <th className="px-2 py-2 font-semibold">Research</th>
              <th className="px-2 py-2 font-semibold">Faculty Unit(s)</th>
              <th className="px-2 py-2 font-semibold">Grad Load</th>
              <th className="px-2 py-2 font-semibold">Premium 4th Prep</th>
              <th className="px-2 py-2 font-semibold">Overload (NCA)</th>
            </tr>
          </thead>

            <tbody className="divide-y text-center">
              {/* Existing rows, Day cells now use <DayCell raw="..." /> */}
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">CABREDO, RAFAEL ANGSICO</td>
                <td>CCPROG3</td>
                <td>S12</td>
                <td><DayCell raw="M / H" /></td>
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
                <td className="p-3 text-left font-medium text-emerald-700">NICDAO, DIOSDADO R. III</td>
                <td>CCINOV8</td>
                <td>S12</td>
                <td><DayCell raw="M / H" /></td>
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

              {/* Updated faculty names 3–11 */}
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">SALES, NIÑA ANA MARIE</td>
                <td>CCPROG1</td>
                <td>S15</td>
                <td><DayCell raw="T / F" /></td>
                <td>8:00–9:30</td>
                <td>V309</td>
                <td>35</td>
                <td>1.5</td>
                <td>1.5</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Core</td>
                <td>9.0</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>12.0</td>
                <td>0.0</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Newly renovated lab</td>
              </tr>
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">SALVADOR, FLORANTE</td>
                <td>CCDSALG</td>
                <td>S02</td>
                <td><DayCell raw="T / F" /></td>
                <td>10:00–11:30</td>
                <td>GK305B</td>
                <td>38</td>
                <td>1.5</td>
                <td>1.5</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Core</td>
                <td>6.0</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>9.0</td>
                <td>0.0</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>—</td>
              </tr>
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">SAMSON, BRIANE PAUL</td>
                <td>CCINTDS</td>
                <td>S09</td>
                <td><DayCell raw="M / H" /></td>
                <td>1:00–2:30</td>
                <td>AG1901</td>
                <td>32</td>
                <td>1.5</td>
                <td>1.5</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Elective</td>
                <td>6.0</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>9.0</td>
                <td>0.0</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Capstone alignment</td>
              </tr>
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">SHRESTHA, ANISH</td>
                <td>CCAPDEV</td>
                <td>S05</td>
                <td><DayCell raw="T / F" /></td>
                <td>3:00–4:30</td>
                <td>V210</td>
                <td>28</td>
                <td>1.5</td>
                <td>1.5</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Core</td>
                <td>3.0</td>
                <td>6.0</td>
                <td>0.0</td>
                <td>9.0</td>
                <td>0.0</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>—</td>
              </tr>
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">SISON, RAYMUND</td>
                <td>STSTAT2</td>
                <td>S03</td>
                <td><DayCell raw="M / H" /></td>
                <td>7:30–9:00</td>
                <td>ONLINE</td>
                <td>41</td>
                <td>1.5</td>
                <td>1.5</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Core</td>
                <td>6.0</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>9.0</td>
                <td>0.0</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Online cohort</td>
              </tr>
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">SUAREZ, MERLIN TEODOSIA</td>
                <td>CCPROG2</td>
                <td>S10</td>
                <td><DayCell raw="T / F" /></td>
                <td>4:45–6:15</td>
                <td>GK306A</td>
                <td>36</td>
                <td>1.5</td>
                <td>1.5</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Core</td>
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
                <td className="p-3 text-left font-medium text-emerald-700">TIGHE, EDWARD PATRICK</td>
                <td>CCDSANL</td>
                <td>S06</td>
                <td><DayCell raw="M / H" /></td>
                <td>10:00–11:30</td>
                <td>V208</td>
                <td>29</td>
                <td>1.5</td>
                <td>1.5</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Elective</td>
                <td>6.0</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>9.0</td>
                <td>0.0</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>—</td>
              </tr>
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">URETA, JENNIFER</td>
                <td>CCSTRUC</td>
                <td>S04</td>
                <td><DayCell raw="S" /></td>
                <td>8:00–11:00</td>
                <td>AG1902</td>
                <td>24</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Core</td>
                <td>6.0</td>
                <td>0.0</td>
                <td>3.0</td>
                <td>9.0</td>
                <td>0.0</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Weekend class</td>
              </tr>
              <tr>
                <td className="p-3 text-left font-medium text-emerald-700">AGUILAR, EMERICO</td>
                <td>CCNGRML</td>
                <td>G01</td>
                <td><DayCell raw="T/ F" /></td>
                <td>6:00–9:00</td>
                <td>V211</td>
                <td>18</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Grad</td>
                <td>3.0</td>
                <td>0.0</td>
                <td>3.0</td>
                <td>6.0</td>
                <td>3.0</td>
                <td>N/A</td>
                <td>Yes</td>
                <td>Graduate load</td>
              </tr>
            </tbody>

        </table>
      </div>
    </section>
  );
}

/* ------------------ Page with Chair topbar/sidebar ------------------ */
export default function CHAIR_Plantilla() {
  const chairItems = [
    { to: "/chair/plantilla", label: "Plantilla", Icon: ListChecks },
    { to: "/chair/faculty-management", label: "Faculty Management", Icon: Users },
    { to: "/chair/course-management", label: "Course Management", Icon: BookOpen },
    { to: "/chair/reports-analytics", label: "Reports and Analytics", Icon: BarChart3 },
    { to: "/chair/faculty-service", label: "Faculty Service", Icon: FileText },
    { to: "/chair/student-petition", label: "Student Petition", Icon: FilePlus },
    { to: "/chair/class-retention", label: "Class Retention", Icon: BookMarked },
  ];

  return (
    <AppShell
      topbarProfileName="Neil Patrick DelGallego"
      topbarProfileSubtitle="Department Chair | Department of Software Technology"
      sidebarItems={chairItems}
    >
      <main className="w-full px-8 py-8">
        <header className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Plantilla</h1>
            <p className="text-sm text-gray-600">Manage and review faculty plantilla submissions</p>
          </div>
        </header>

        {/* ST ONLY */}
        <DepartmentPlantilla
          deptLabel="Department of Software Technology (ST)"
          plantillaFile="Faculty_Plantilla_CCS_ST_AY2025-2026_1stTerm.pdf"
        />
      </main>
    </AppShell>
  );
}
