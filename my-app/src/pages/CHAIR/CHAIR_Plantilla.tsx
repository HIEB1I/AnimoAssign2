// src/CHAIR_Plantilla.tsx
import React, { useRef, useState } from "react";
import AppShell from "../../base/AppShell";
import {
  ListChecks,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  FilePlus,
  BookMarked,
  CheckCheck,
  Send,
  Check,
  X,
} from "lucide-react";


import { NavLink } from "react-router-dom";
import { ClipboardList, FileSpreadsheet } from "lucide-react";

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


// tiny utility (mirrors the Dean version)
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");


/* ---------- Workflow: highlight Department Chair (not Dean) ---------- */
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
              step === "Department Chair"
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

/* ---------- Department Plantilla (same look/feel as Dean) ---------- */
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
      {/* Header (ST only) */}
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
              <span className="font-semibold">Dean</span> for faculty loading. Once submitted, this action cannot be undone.
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

      {/* Quick Message Modal */}
      {showMessagePrompt && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-emerald-700">Quick Message — {deptLabel}</h3>
              <button onClick={() => setShowMessagePrompt(false)} className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm flex items-center justify-between">
                <span>📎 Attached file: <strong>{plantillaFile}</strong></span>
                <button onClick={handleViewPlantilla} className="text-emerald-700 hover:underline text-sm">
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

      {/* Table (same visual structure as Dean) */}
      <div className="mt-8 w-full overflow-x-auto border border-gray-300 bg-white shadow-sm rounded-lg">
        <table ref={tableRef} className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-center border-b">
              <th rowSpan={2} className="px-3 py-2 font-semibold text-left">Faculty</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Rank</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Course</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Section</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Day</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Time</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Room</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">No. of Students</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">Lecture Hours</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">Lab Hours</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">Student Unit(s)</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">On Leave</th>
              <th rowSpan={2} className="px-2 py-2 font-semibold rotate-header">Type of Course</th>
              <th colSpan={4} className="px-3 py-2 font-semibold border-l border-gray-300">NATURE OF LOAD</th>
              <th colSpan={3} className="px-3 py-2 font-semibold border-l border-gray-300">PREMIUMS</th>
              <th rowSpan={2} className="px-3 py-2 font-semibold">Remarks</th>
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
              <td className="p-3 text-left font-medium text-emerald-700">CABREDO, RAFAEL ANGSICO</td>
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
              <td className="p-3 text-left font-medium text-emerald-700">NICDAO, DIOSDADO R. III</td>
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

/* ---------- Page with Chair topbar/sidebar ---------- */
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


        {/* Chair workflow */}
        <WorkflowChips />

        {/* ST ONLY (CT removed) */}
        <DepartmentPlantilla
          deptLabel="Department of Software Technology (ST)"
          plantillaFile="Faculty_Plantilla_CCS_ST_AY2025-2026_1stTerm.pdf"
        />
      </main>
    </AppShell>
  );
}
