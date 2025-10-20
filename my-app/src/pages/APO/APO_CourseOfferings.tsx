import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Edit,
  Trash2,
  Check,
  Search,
  ChevronDown,
  Upload,
  MessageSquareText,
  X,
  Send
} from "lucide-react";
import TopBar from "../../component/TopBar";
import Tabs from "../../component/Tabs";
import SelectBox from "../../component/SelectBox";

/* ----------------------- Utilities ----------------------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");
const fmtTime = (s: string) => {
  const t = (s || "").replace(/\D/g, "");
  if (t.length !== 4) return s || "—";
  return `${t.slice(0, 2)}:${t.slice(2)}`;
};

// normalize text for keys/search: trim, collapse whitespace, handle NBSP, case-insensitive
const norm = (s: string, { upper = true } = {}) =>
  (s || "")
    .replace(/\u00A0/g, " ") // NBSP -> space
    .replace(/\s+/g, " ") // collapse spaces
    .trim()
    [upper ? "toUpperCase" : "toLowerCase"]();

/* ----------------------- Types ----------------------- */
// Section tuple (14 fields now, added Remarks):
// [0] Title, [1] Units, [2] Section, [3] Faculty,
// [4] Day1, [5] Begin1, [6] End1, [7] Room1,
// [8] Day2, [9] Begin2, [10] End2, [11] Room2,
// [12] Capacity, [13] Remarks
type SectionRow = [
  string, string, string, string, string, string, string,
  string, string, string, string, string, string,
  string // index 13 → Remarks
];

type Course = {
  code: string;
  title: string;
  level: "Undergraduate" | "Graduate" | "Senior High School";
  department:
    | "Department of Software Technology"
    | "Department of Computer Technology"
    | "Department of Information Technology";
  ids: string[];
  programs: string[];
  programCodes?: string[];
  sections: SectionRow[];
};

/* ----------------------- Tag colors ----------------------- */
const tagColor = (t: string) => {
  const map: Record<string, string> = {
    Undergraduate: "bg-[#C2CEA7] text-[#2E3D31]",
    Graduate: "bg-[#C2CEA7] text-[#2E3D31]",
    "Senior High School": "bg-[#C2CEA7] text-[#2E3D31]",
    "Department of Software Technology": "bg-[#88A376] text-white",
    "Department of Information Technology": "bg-[#88A376] text-white",
    "Department of Computer Technology": "bg-[#88A376] text-white",
    "ID 120": "bg-[#a6b697] text-white",
    "ID 121": "bg-[#a6b697] text-white",
    "ID 122": "bg-[#a6b697] text-white",
    "ID 123": "bg-[#a6b697] text-white",
    "ID 124": "bg-[#a6b697] text-white",
    "ID 125": "bg-[#a6b697] text-white",
    "BSCS-ST": "bg-[#88A78E] text-white",
    "BSCS-NIS": "bg-[#88A78E] text-white",
    "BSCS-CSE": "bg-[#88A78E] text-white",
    "BSMS-CS": "bg-[#88A78E] text-white",
    "BS IET-GD": "bg-[#88A78E] text-white",
    "BS IET-AD": "bg-[#88A78E] text-white",
    BSIT: "bg-[#88A78E] text-white",
    BSIS: "bg-[#88A78E] text-white",
    Unassigned: "bg-[#FEE2E2] text-[#B91C1C]",
  };
  return map[t] || "bg-[#CFDBB8] text-[#2E3D31]";
};

/* ----------------------- MultiSelect ----------------------- */
function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (vals: string[]) => void;
  placeholder: string;
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

  const toggle = (opt: string) =>
    value.includes(opt) ? onChange(value.filter((v) => v !== opt)) : onChange([...value, opt]);

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
        >
          <span className={value.length ? "" : "text-gray-400"}>
            {value.length ? `${value.length} selected` : placeholder}
          </span>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
        </button>
        {open && (
          <div
            ref={listRef}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-300 bg-white p-1 shadow-xl"
          >
            {options.map((opt) => {
              const checked = value.includes(opt);
              return (
                <label
                  key={opt}
                  className={cls(
                    "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    checked ? "bg-emerald-50" : "hover:bg-neutral-50"
                  )}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    checked={checked}
                    onChange={() => toggle(opt)}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((v) => (
            <span key={v} className={cls("rounded-full px-2 py-1 text-xs font-medium", tagColor(v))}>
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------- ID Card ----------------------- */
function IDCard({
  id,
  courses,
  globalBusy,
  onAddCourse,
  onReplaceCourse,
  onRemoveCourse,
  courseCatalog,
}: {
  id: string;
  courses: Course[];
  globalBusy: boolean;
  onAddCourse: (course: Course) => void;
  onReplaceCourse: (prev: Course, updated: Course) => void;
  onRemoveCourse: (target: Course) => void;
  courseCatalog: Record<string, string>;
}) {
  const programGroups = useMemo(() => {
    const map: Record<string, { courses: Course[]; codes: string[] }> = {};
    for (const course of courses) {
      const family = course.programs[0];
      const codeList = course.programCodes || [];
      if (!map[family]) map[family] = { courses: [], codes: [] };
      map[family].courses.push(course);
      for (const c of codeList) if (!map[family].codes.includes(c)) map[family].codes.push(c);
    }
    return map;
  }, [courses]);

  const [openPrograms, setOpenPrograms] = useState<Record<string, boolean>>(() =>
    Object.keys(programGroups).reduce((acc, k) => ((acc[k] = true), acc), {} as Record<string, boolean>)
  );
  const toggleProgram = (program: string) =>
    setOpenPrograms((prev) => ({ ...prev, [program]: !prev[program] }));

  // --- Row edit helpers ---
  type SectionEditable = { section: string; room1: string; room2: string; capacity: string; remarks: string };
  const toEditable = (row: SectionRow): SectionEditable => ({
    section: row[2] || "",
    room1: row[7] || "",
    room2: row[11] || "",
    capacity: row[12] || "",
    remarks: row[13] || "",
  });
  const fromEditable = (row: SectionRow, e: SectionEditable): SectionRow => {
    const copy = [...row] as SectionRow;
    copy[2] = e.section;
    copy[7] = e.room1;
    copy[11] = e.room2;
    copy[12] = e.capacity;
    copy[13] = e.remarks; // <-- persist remarks
    return copy;
  };

  const [editingRow, setEditingRow] = useState<{
    course: Course;
    index: number;
    draft: SectionEditable;
  } | null>(null);

  const startEditRow = (course: Course, index: number) =>
    setEditingRow({ course, index, draft: toEditable(course.sections[index]) });

  const saveEditRow = () => {
    if (!editingRow) return;
    const { course, index, draft } = editingRow;
    const updatedSections = course.sections.map((r, i) => (i === index ? fromEditable(r, draft) : r));
    onReplaceCourse(course, { ...course, sections: updatedSections });
    setEditingRow(null);
  };

  const cancelEditRow = () => setEditingRow(null);

  // Delete modal state
  const [deleteAsk, setDeleteAsk] = useState<{ course: Course; index: number } | null>(null);
  const requestDeleteRow = (course: Course, index: number) => setDeleteAsk({ course, index });
  const performDeleteRow = () => {
    if (!deleteAsk) return;
    const { course, index } = deleteAsk;
    const next = course.sections.filter((_, i) => i !== index);
    if (next.length === 0) onRemoveCourse(course);
    else onReplaceCourse(course, { ...course, sections: next });
    setDeleteAsk(null);
  };

  // --- Inline Add Course ---
  const [activeProgramForAdd, setActiveProgramForAdd] = useState<string | null>(null);
  const [addDraft, setAddDraft] = useState<{ programCode: string; code: string; title: string; capacity: string }>({
    programCode: "",
    code: "",
    title: "",
    capacity: "40",
  });

  const nextSectionCode = (progCourses: Course[], code: string, programCode: string) => {
    if (!code) return "";
    const nums: number[] = [];
    for (const c of progCourses) {
      if (c.code !== code) continue;
      if (programCode && !(c.programCodes || []).includes(programCode)) continue;
      for (const s of c.sections) {
        const m = /^S(\d+)$/.exec(s[2] || "");
        if (m) nums.push(parseInt(m[1], 10));
      }
    }
    const base = 11;
    const next = nums.length ? Math.max(...nums) + 1 : base;
    return `S${next}`;
  };

  const handleSaveAdd = (family: string, progCourses: Course[]) => {
    const code = addDraft.code.trim().toUpperCase();
    const title = addDraft.title || courseCatalog[code] || "";
    if (!code || !title || !addDraft.programCode) {
      alert("Please choose a Program Code and a valid Course Code (with title).");
      return;
    }
    const sectionCode = nextSectionCode(progCourses, code, addDraft.programCode);
    const newCourse: Course = {
      code,
      title,
      level: "Undergraduate",
      department: "Department of Software Technology",
      ids: [id],
      programs: [family],
      programCodes: [addDraft.programCode],
      sections: [
        [
          title, // 0
          "3", // 1
          sectionCode, // 2
          "Unassigned", // 3
          "", "", "", "", // 4..7
          "", "", "", "", // 8..11
          addDraft.capacity || "40", // 12
          "", // 13 → Remarks
        ] as SectionRow,
      ],
    };
    onAddCourse(newCourse);
    setActiveProgramForAdd(null);
    setAddDraft({ programCode: "", code: "", title: "", capacity: "40" });
  };

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-sm">
      <div className="bg-[#21804A] text-white rounded-t-xl px-4 py-3 flex items-center justify-center">
        <h2 className="text-lg font-semibold text-center">{id}</h2>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(programGroups).map(([family, { courses: progCourses, codes }]) => {
          const isOpen = openPrograms[family];
          const isAddingHere = activeProgramForAdd === family;

          return (
            <div key={family} className="relative rounded-lg border border-gray-300 bg-white overflow-visible">
              <button
                onClick={() => toggleProgram(family)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#A6B697]/30 hover:bg-[#A6B697]/40 transition"
              >
                <span className="font-semibold text-emerald-900 text-left">{family}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <>
                  <div className="overflow-x-auto">
                 <table className="w-full text-sm border-collapse table-fixed">
  <colgroup>
    <col className="w-[150px]" />
    <col className="w-[240px]" />
    <col className="w-[90px]" />
    <col className="w-[160px]" />
    <col className="w-[100px]" />
    <col className="w-[90px]" />
    <col className="w-[90px]" />
    <col className="w-[100px]" />
    <col className="w-[100px]" />
    <col className="w-[90px]" />
    <col className="w-[90px]" />
    <col className="w-[100px]" />
    <col className="w-[80px]" />
    <col className="w-[160px]" /> {/* Remarks column */}
    <col className="w-[100px]" /> {/* Actions */}
  </colgroup>

  <thead className="bg-gray-50 text-emerald-800">
    <tr className="text-[13px] font-semibold border-b border-gray-300">
      <th className="px-3 py-2 text-left border-r border-gray-300">Program Code</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Course Code &amp; Title</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Section</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Faculty</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Day 1</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Begin 1</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">End 1</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Room 1</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Day 2</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Begin 2</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">End 2</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Room 2</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Capacity</th>
      <th className="px-3 py-2 text-left border-r border-gray-300">Remarks</th>
      <th className="px-3 py-2 text-center">Actions</th>
    </tr>
  </thead>

  <tbody>
    {progCourses.flatMap((course) =>
      course.sections.map((s, i) => {
        const isEditing =
          !!editingRow &&
          editingRow.course === course &&
          editingRow.index === i;

        if (isEditing) {
          return (
            <tr
              key={`${family}-${course.code}-${i}`} 
              className="border-t bg-neutral-50"
            >
              <td className="px-3 py-2 border-r">{course.programCodes?.join(", ") || "—"}</td>
              <td className="px-4 py-3 border-r">
                <div className="font-semibold text-emerald-700">{course.code}</div>
                <div className="text-xs text-gray-500">{course.title}</div>
              </td>

              <td className="px-3 py-2 border-r">
                <input
                  value={editingRow.draft.section}
                  onChange={(e) =>
                    setEditingRow((p) =>
                      p ? { ...p, draft: { ...p.draft, section: e.target.value } } : p
                    )
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm shadow-sm
                  focus:ring-1 focus:ring-neutral-400/30 focus:border-neutral-500 outline-none"
                />
              </td>

              <td className="px-3 py-2 border-r">
                <span className={s[3] === "Unassigned" ? "text-red-600 font-medium" : ""}>
                  {s[3] || "—"}
                </span>
              </td>
              <td className="px-3 py-2 border-r">{s[4] || "—"}</td>
              <td className="px-3 py-2 border-r">{fmtTime(s[5])}</td>
              <td className="px-3 py-2 border-r">{fmtTime(s[6])}</td>

              <td className="px-3 py-2 border-r">
                <input
                  value={editingRow.draft.room1}
                  onChange={(e) =>
                    setEditingRow((p) =>
                      p ? { ...p, draft: { ...p.draft, room1: e.target.value } } : p
                    )
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm shadow-sm
                  focus:ring-1 focus:ring-neutral-400/30 focus:border-neutral-500 outline-none"
                />
              </td>

              <td className="px-3 py-2 border-r">{s[8] || "—"}</td>
              <td className="px-3 py-2 border-r">{fmtTime(s[9])}</td>
              <td className="px-3 py-2 border-r">{fmtTime(s[10])}</td>

              <td className="px-3 py-2 border-r">
                <input
                  value={editingRow.draft.room2}
                  onChange={(e) =>
                    setEditingRow((p) =>
                      p ? { ...p, draft: { ...p.draft, room2: e.target.value } } : p
                    )
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm shadow-sm
                  focus:ring-1 focus:ring-neutral-400/30 focus:border-neutral-500 outline-none"
                />
              </td>

              <td className="px-3 py-2 border-r">
                <input
                  value={editingRow.draft.capacity}
                  onChange={(e) =>
                    setEditingRow((p) =>
                      p ? { ...p, draft: { ...p.draft, capacity: e.target.value } } : p
                    )
                  }
                  className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm shadow-sm
                  focus:ring-1 focus:ring-neutral-400/30 focus:border-neutral-500 outline-none"
                />
              </td>

              <td className="px-3 py-2 border-r">
                <input
                  value={editingRow.draft.remarks}
                  onChange={(e) =>
                    setEditingRow((p) =>
                      p ? { ...p, draft: { ...p.draft, remarks: e.target.value } } : p
                    )
                  }
                  placeholder="Add remarks..."
                  className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm shadow-sm
                    focus:ring-1 focus:ring-neutral-400/30 focus:border-neutral-500 outline-none"
                />
              </td>

              <td className="px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={saveEditRow}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50"
                    title="Save"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={cancelEditRow}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-600 text-red-600 hover:bg-red-50"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              </td>
            </tr>
          );
        }

        // View row
        return (
          <tr
            key={`${family}-${course.code}-${i}`} // same key as the edit row
            className="border-t hover:bg-neutral-50"
          >
            <td className="px-3 py-2 border-r">{course.programCodes?.join(", ") || "—"}</td>
            <td className="px-4 py-3 border-r font-semibold text-emerald-700">
              {course.code}
              <div className="text-xs text-gray-500">{course.title}</div>
            </td>
            <td className="px-3 py-2 border-r">{s[2] || "—"}</td>
            <td className="px-3 py-2 border-r">
              <span className={s[3] === "Unassigned" ? "text-red-600 font-medium" : ""}>
                {s[3] || "—"}
              </span>
            </td>
            <td className="px-3 py-2 border-r">{s[4] || "—"}</td>
            <td className="px-3 py-2 border-r">{fmtTime(s[5])}</td>
            <td className="px-3 py-2 border-r">{fmtTime(s[6])}</td>
            <td className="px-3 py-2 border-r">{s[7] || "—"}</td>
            <td className="px-3 py-2 border-r">{s[8] || "—"}</td>
            <td className="px-3 py-2 border-r">{fmtTime(s[9])}</td>
            <td className="px-3 py-2 border-r">{fmtTime(s[10])}</td>
            <td className="px-3 py-2 border-r">{s[11] || "—"}</td>
            <td className="px-3 py-2 border-r">{s[12] || "—"}</td>

            {/* Remarks: view-only unless editing */}
            <td className="px-3 py-2 border-r">
              <span className="block text-sm text-gray-700">
                {s[13] || "—"}
              </span>
            </td>

            <td className="px-3 py-2 text-center">
              <div className="flex justify-center gap-3">
                <button
                  disabled={globalBusy}
                  className="text-emerald-700 hover:text-emerald-900 disabled:opacity-50"
                  title="Edit"
                  onClick={() => !globalBusy && startEditRow(course, i)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  disabled={globalBusy}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  title="Remove"
                  onClick={() => !globalBusy && requestDeleteRow(course, i)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        );
      })
    )}
  </tbody>
</table>

                  </div>

                  {/* Add Course button row */}
                  <div className="flex justify-end px-4 py-3 border-t bg-white">
                    <button
                      className={cls(
                        "mt-2 rounded-md bg-[#21804A] px-4 py-2 text-sm text-white hover:bg-[#18693B]",
                        globalBusy && "opacity-50 cursor-not-allowed hover:bg-[#21804A]"
                      )}
                      onClick={() => !globalBusy && setActiveProgramForAdd(family)}
                      disabled={globalBusy}
                    >
                      + Add Course
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete modal (per-ID card) */}
      {deleteAsk && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-red-600 text-red-700">
              <X className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h3 className="mb-2 text-center text-2xl font-semibold">Delete this section?</h3>
            <p className="mx-auto mb-6 max-w-md text-center text-sm text-neutral-600">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteAsk(null)}
                className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={performDeleteRow}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------- Add Course Panel (kept) ----------------------- */
function AddCoursePanel({
  onSave,
  onCancel,
}: {
  onSave: (course: Course) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<Course>({
    code: "",
    title: "",
    level: "Undergraduate",
    department: "Department of Software Technology",
    ids: [],
    programs: [],
    sections: [],
  });

  return (
    <div className="rounded-2xl border border-neutral-300 bg-neutral-50 p-4">
      <h3 className="mb-3 text-lg font-semibold">Add Course</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Course Code</label>
          <input
            value={data.code}
            onChange={(e) => setData({ ...data, code: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Course Title</label>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <SelectBox
          value={data.level}
          onChange={(v) => setData({ ...data, level: v as Course["level"] })}
          options={["Undergraduate", "Graduate", "Senior High School"]}
        />
        <SelectBox
          value={data.department}
          onChange={(v) => setData({ ...data, department: v as Course["department"] })}
          options={[
            "Department of Software Technology",
            "Department of Computer Technology",
            "Department of Information Technology",
          ]}
        />
        <div />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <MultiSelect
          label="ID"
          options={["ID 120", "ID 121", "ID 122", "ID 123", "ID 124", "ID 125"]}
          value={data.ids}
          onChange={(vals) => setData({ ...data, ids: vals })}
          placeholder="Choose ID(s)"
        />
        <MultiSelect
          label="Program"
          options={[
            "BSIT",
            "BSIS",
            "BSCS-ST",
            "BSCS-NIS",
            "BSCS-CSE",
            "BSMS-CS",
            "BS IET-GD",
            "BS IET-AD",
          ]}
          value={data.programs}
          onChange={(vals) => setData({ ...data, programs: vals })}
          placeholder="Choose Program(s)"
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            if (!data.code || !data.title) return;
            onSave(data);
          }}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ----------------------- Workflow Chips ----------------------- */
const WorkflowChips = () => {
  const steps = [
    "APO",
    "Office Manager",
    "APO",
    "Department Chair"
  ];

  let seenFirstApo = false;
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {steps.map((step, i) => {
        const isFirstApo = step === "APO" && !seenFirstApo;
        if (isFirstApo) seenFirstApo = true;
        return (
          <React.Fragment key={`${step}-${i}`}>
            <span
              className={cls(
                "rounded-full px-3 py-1 text-[13px] font-medium border",
                isFirstApo ? "border-emerald-700 bg-emerald-700 text-white" : "border-gray-300 bg-white text-gray-800"
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 && <span className="text-gray-400">—</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ----------------------- CSV helper ----------------------- */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some((c) => c !== ""));
}

/* ----------------------- Page ----------------------- */
export default function CourseOfferingsScreen() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All Levels");
  const [department, setDepartment] = useState("All Departments");
  const [program, setProgram] = useState("All Programs");
  const [idFilter, setIdFilter] = useState("All ID");
  const [showApprove, setShowApprove] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForward, setShowForward] = useState(false);

  const filteredCourses = courses.filter((c) => {
    const N = (s: string) => norm(s, { upper: false }); // lower, trimmed, spaces collapsed
    const q = N(search);

    const matchesSearch =
      !q ||
      N(c.code).includes(q) ||
      N(c.title).includes(q) ||
      N(c.level).includes(q) ||
      N(c.department).includes(q) ||
      c.ids.some((id) => N(id).includes(q)) ||
      c.programs.some((p) => N(p).includes(q)) ||
      c.sections.some((s) =>
        [
          s[2], s[3], s[4], s[5], s[6], s[7],
          s[8], s[9], s[10], s[11], s[12],
          fmtTime(s[5]), fmtTime(s[6]), fmtTime(s[9]), fmtTime(s[10])
        ]
          .filter(Boolean)
          .some((v) => N(v).includes(q))
      );

    const matchesLevel = level === "All Levels" || c.level === level;
    const matchesDept = department === "All Departments" || c.department === department;
    const matchesId = idFilter === "All ID" || c.ids.includes(idFilter);
    const matchesProgram = program === "All Programs" || c.programs.includes(program);

    return matchesSearch && matchesLevel && matchesDept && matchesId && matchesProgram;
  });

  const updateCourse = (updated: Course) =>
    setCourses((prev) => prev.map((c) => (c.code === updated.code ? updated : c)));

  const [addingCourse, setAddingCourse] = useState(false);
  const addCourse = (course: Course) => {
    setCourses((prev) => [...prev, course]);
    setAddingCourse(false);
  };

  const [editingCourseCode, setEditingCourseCode] = useState<string | null>(null);
  const [busyByCourse, setBusyByCourse] = useState<Record<string, boolean>>({});
  const handleCardBusy = (code: string, busy: boolean) =>
    setBusyByCourse((prev) => (prev[code] === busy ? prev : { ...prev, [code]: busy }));

  const busy = addingCourse || editingCourseCode !== null || Object.values(busyByCourse).some(Boolean);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const rows = parseCSV(text);
      if (!rows.length) {
        alert("⚠️ CSV is empty or invalid!");
        return;
      }

      const headerRow = rows[0].map((h, idx) =>
        idx === 0 ? h.replace(/^\uFEFF/, "").toLowerCase() : h.toLowerCase()
      );
      const dataRows = rows.slice(1);
      const idxOf = (key: string) => headerRow.indexOf(key.toLowerCase());
      const get = (cols: string[], key: string) => {
        const i = idxOf(key);
        return i === -1 ? "" : cols[i]?.trim() ?? "";
      };

      const courseMap: Record<string, Course> = {};
      const sectionCounter: Record<string, number> = {};

      for (const cols of dataRows) {
        const rawId = get(cols, "id");
        const rawProgram = get(cols, "program");
        const rawProgCode = get(cols, "program code");
        const rawCode = get(cols, "course code");
        const rawTitle = get(cols, "course title");
        const rawDept = get(cols, "department");
        const rawFaculty = get(cols, "faculty");
        const rawCap = get(cols, "capacity");

        const id = norm(rawId);
        const program = norm(rawProgram);
        const programCode = norm(rawProgCode);
        const code = norm(rawCode);
        const title = norm(rawTitle, { upper: false });
        const faculty = rawFaculty?.trim() ? rawFaculty.trim() : "Unassigned";
        const cap = rawCap?.trim() || "40";

        if (!id || !programCode || !code || !title) continue;

        // 🔹 The unique key should not include the ID — use only program + programCode + code.
        const uniqueKey = `${program}|${programCode}|${code}`;

        // 🔹 Initialize section counter per unique course
        if (!sectionCounter[uniqueKey]) sectionCounter[uniqueKey] = 11;
        const sectionCode = `S${sectionCounter[uniqueKey]++}`;

        // 🔹 Merge same course (avoid duplicates)
        if (!courseMap[uniqueKey]) {
          courseMap[uniqueKey] = {
            code,
            title: rawTitle.trim(),
            level: "Undergraduate",
            department:
              (rawDept as Course["department"]) ||
              "Department of Software Technology",
            ids: [id],
            programs: [program],
            programCodes: [programCode],
            sections: [],
          };
        } else {
          // Merge ID if new
          if (!courseMap[uniqueKey].ids.includes(id))
            courseMap[uniqueKey].ids.push(id);
        }

        // 🔹 Add section only if not already existing
        const existing = courseMap[uniqueKey].sections.find(
          (s) => s[2] === sectionCode && s[3] === faculty
        );
        if (!existing) {
          const newSection: SectionRow = [
            courseMap[uniqueKey].title,
            "3",
            sectionCode,
            faculty,
            "", "", "", "",
            "", "", "", "",
            cap,
            "", // Remarks
          ];
          courseMap[uniqueKey].sections.push(newSection);
        }
      }

      const loaded = Object.values(courseMap);
      if (!loaded.length) {
        alert("⚠️ No valid course data found in CSV!");
        return;
      }

      setCourses(loaded);
      alert("✅ CSV imported successfully!");
    };

    reader.readAsText(file);
  };

  const courseCatalog = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of courses) if (c.code && c.title && !map[c.code]) map[c.code] = c.title;
    return map;
  }, [courses]);

  const replaceCourse = (prevCourse: Course, updated: Course) => {
    setCourses((arr) => arr.map((c) => (c === prevCourse ? updated : c)));
  };
  const removeCourse = (target: Course) => {
    setCourses((arr) => arr.filter((c) => c !== target));
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <TopBar fullName="Hazel Ventura" role="Academic Programming Officer" />
      <Tabs />

      <main className="p-6 w-full">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by faculty, course code..."
              disabled={busy}
              className={cls(
                "w-full rounded-lg border px-9 py-2 text-sm",
                busy && "bg-gray-100 cursor-not-allowed opacity-50"
              )}
            />
          </div>

          <SelectBox
            value={level}
            onChange={setLevel}
            options={["All Levels", "Senior High School", "Undergraduate", "Graduate"]}
            disabled={busy}
          />
          <SelectBox
            value={department}
            onChange={setDepartment}
            options={[
              "All Departments",
              "Department of Software Technology",
              "Department of Computer Technology",
              "Department of Information Technology",
            ]}
            disabled={busy}
          />
          <SelectBox
            value={idFilter}
            onChange={setIdFilter}
            options={["All ID", "ID 125", "ID 124", "ID 123", "ID 122", "ID 121", "ID 120"]}
            disabled={busy}
          />
          <SelectBox
            value={program}
            onChange={setProgram}
            options={[
              "All Programs",
              "BSCS-ST",
              "BSCS-NIS",
              "BSCS-CSE",
              "BSMS-CS",
              "BS IET-GD",
              "BS IET-AD",
              "BSIT",
              "BSIS",
              "Others",
            ]}
            disabled={busy}
          />

        <button
          onClick={() => setShowForward(true)}
          disabled={busy}
          className={cls(
            "ml-auto inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-110",
            busy && "opacity-50 cursor-not-allowed hover:brightness-100"
          )}
          title={busy ? "Finish current action first" : "Forward"}
        >
          <Send className="h-4 w-4" />
          Forward
        </button>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Course Offerings</h2>
              <p className="text-sm text-gray-500">Term 1 AY 2025-2026</p>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110">
              <Upload className="h-4 w-4" />
              Import CSV
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>
          </div>

          {/* Workflow */}
          <div className="my-4">
            <WorkflowChips />
          </div>

          {/* ID Cards */}
          <div className="space-y-6">
            {[...new Set(filteredCourses.flatMap((c) => c.ids))].map((id) => {
              const idCourses = filteredCourses.filter((c) => c.ids.includes(id));
              if (!idCourses.length) return null;
              return (
                <IDCard
                  key={id}
                  id={id}
                  courses={idCourses}
                  globalBusy={busy}
                  onAddCourse={addCourse}
                  onReplaceCourse={replaceCourse}
                  onRemoveCourse={removeCourse}
                  courseCatalog={courseCatalog}
                />
              );
            })}
          </div>

          {showForward && (
            <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-emerald-700">
                    Forward Course Offerings, Term 1 AY 2025–2026
                  </h3>
                  <button
                    onClick={() => setShowForward(false)}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Attached file */}
                <div className="border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm flex items-center justify-between mb-4">
                  <span>
                    📎 Attached file:{" "}
                    <strong>Course_Offerings_Term1_AY2025-2026.pdf</strong>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      try {
                        const container =
                          document.querySelector(".space-y-6") ||
                          document.querySelector(".space-y-4") ||
                          document.querySelector("[data-course-offerings]");

                        if (!container) {
                          alert("⚠️ No course offerings data found on this page.");
                          return;
                        }

                        const courseData = container.cloneNode(true) as HTMLElement;
                        courseData.querySelectorAll("button, svg, select, input").forEach((el) => el.remove());
                        courseData.querySelectorAll("th:last-child, td:last-child").forEach((el) => el.remove());

                        // 🧩 Create an iframe dynamically
                        const iframe = document.createElement("iframe");
                        iframe.style.position = "fixed";
                        iframe.style.top = "0";
                        iframe.style.left = "0";
                        iframe.style.width = "100%";
                        iframe.style.height = "100%";
                        iframe.style.background = "white";
                        iframe.style.border = "none";
                        iframe.style.zIndex = "9999";
                        document.body.appendChild(iframe);

                        const doc = iframe.contentDocument || iframe.contentWindow?.document;
                        if (!doc) return;

                        doc.open();
                        doc.write(`
                          <html>
                            <head>
                              <title>Course Offerings — Term 1 AY2025–2026</title>
                              <style>
                                body {
                                  font-family: Arial, sans-serif;
                                  padding: 20px;
                                  background-color: #fff;
                                  color: #111;
                                }
                                h2 {
                                  color: #1e6f45;
                                  margin-bottom: 10px;
                                }
                                p {
                                  font-size: 14px;
                                  color: #333;
                                  margin-bottom: 20px;
                                }
                                table {
                                  width: 100%;
                                  border-collapse: collapse;
                                  margin-top: 15px;
                                }
                                th, td {
                                  border: 1px solid #ccc;
                                  padding: 6px 8px;
                                  text-align: center;
                                  font-size: 13px;
                                }
                                th {
                                  background-color: #f7f7f7;
                                  color: #064e3b;
                                }
                                .rounded-xl {
                                  border: 1px solid #ccc;
                                  border-radius: 8px;
                                  padding: 10px;
                                  margin-bottom: 20px;
                                  background: #fff;
                                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                                }
                                .pdf-button {
                                  background-color: #1e6f45;
                                  color: white;
                                  border: none;
                                  padding: 8px 14px;
                                  border-radius: 6px;
                                  cursor: pointer;
                                  font-size: 13px;
                                  font-weight: 500;
                                  margin-bottom: 15px;
                                }
                                .pdf-button:hover {
                                  background-color: #2f855a;
                                }
                                .close-button {
                                  background-color: #b91c1c;
                                  color: white;
                                  border: none;
                                  padding: 8px 14px;
                                  border-radius: 6px;
                                  cursor: pointer;
                                  font-size: 13px;
                                  font-weight: 500;
                                  margin-left: 8px;
                                }
                                .close-button:hover {
                                  background-color: #7f1d1d;
                                }
                                @media print {
                                  .pdf-button, .close-button {
                                    display: none;
                                  }
                                }
                              </style>
                            </head>
                            <body>
                              <button class="pdf-button" onclick="window.print()">📄 Download as PDF</button>
                              <button class="close-button" onclick="parent.document.body.removeChild(parent.document.querySelector('iframe'));">✖ Close</button>
                              <h2>Course Offerings — Term 1, AY 2025–2026</h2>
                              <p>This document shows all current course offerings forwarded for review.</p>
                              ${courseData.outerHTML}
                            </body>
                          </html>
                        `);
                        doc.close();
                      } catch (err) {
                        console.error(err);
                        alert("⚠️ Could not render preview. Check console for details.");
                      }
                    }}
                    className="text-emerald-700 hover:underline text-sm z-50 relative"
                  >
                    View
                  </button>

                </div>

                {/* Email fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium">To:</label>
                    <input
                      type="email"
                      placeholder="Recipient email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Subject:</label>
                    <input
                      placeholder="Forwarding Course Offerings for Approval"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Message:</label>
                    <textarea
                      placeholder=" "
                      className="h-40 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    onClick={() => setShowForward(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert("📧 Course Offerings forwarded successfully!");
                      setShowForward(false);
                    }}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* (Optional) Add course panel outside cards */}
          {false && (
            <div className="mt-6">
              <AddCoursePanel onSave={addCourse} onCancel={() => {}} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
