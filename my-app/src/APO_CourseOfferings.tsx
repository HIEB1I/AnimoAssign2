import React, { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  UserCircle,
  Bell,
  LogOut,
  Inbox,
  Pencil,
  Trash2,
  Users,
  Clock,
  MapPin,
  Check,
  BookOpen,
  Search,
  Send,
  Building2,
  ChevronDown,
} from "lucide-react";

/* ----------------------- Utilities ----------------------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");
const fmtTime = (s: string) => {
  const t = (s || "").replace(/\D/g, "");
  if (t.length !== 4) return s || "—";
  return `${t.slice(0, 2)}:${t.slice(2)}`;
};

/* ----------------------- Section Shape ----------------------- */
// Note: Internally we still keep the 13-element tuple for compatibility with existing data,
// but UI editing now only allows Section, Room(s), Capacity.
// 0 Course Title (not shown/edited)
// 1 Units (read-only in UI)
// 2 Section (editable)
// 3 Faculty (read-only)
// 4 Day 1 (read-only)
// 5 Begin 1 (read-only)
// 6 End 1 (read-only)
// 7 Room 1 (editable)
// 8 Day 2 (read-only)
// 9 Begin 2 (read-only)
// 10 End 2 (read-only)
// 11 Room 2 (editable)
// 12 Capacity (editable)

type SectionRow = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

type Course = {
  code: string;
  title: string;
  level: "Undergraduate" | "Graduate" | "Senior High School";
  department:
    | "Department of Software Technology"
    | "Department of Computer Technology"
    | "Department of Information Technology";
  ids: string[]; // e.g. ["ID 122"]
  programs: string[]; // e.g. ["BSIT","BSCS-ST"]
  sections: SectionRow[];
};

/* tag color helper */
const tagColor = (t: string) => {
  const map: Record<string, string> = {
    Undergraduate: "bg-green-100 text-green-700",
    Graduate: "bg-green-100 text-green-700",
    "Senior High School": "bg-green-100 text-green-700",
    "Department of Software Technology": "bg-amber-100 text-amber-700",
    "Department of Information Technology": "bg-amber-100 text-amber-700",
    "Department of Computer Technology": "bg-amber-100 text-amber-700",
    "ID 120": "bg-violet-100 text-violet-700",
    "ID 121": "bg-violet-100 text-violet-700",
    "ID 122": "bg-violet-100 text-violet-700",
    "ID 123": "bg-violet-100 text-violet-700",
    "ID 124": "bg-violet-100 text-violet-700",
    "ID 125": "bg-violet-100 text-violet-700",
    "BSCS-ST": "bg-pink-100 text-pink-700",
    "BSCS-NIS": "bg-pink-100 text-pink-700",
    "BSCS-CSE": "bg-pink-100 text-pink-700",
    "BSMS-CS": "bg-pink-100 text-pink-700",
    BSIT: "bg-pink-100 text-pink-700",
    BSIS: "bg-pink-100 text-pink-700",
    Unassigned: "bg-red-100 text-red-700",
  };
  return map[t] || "bg-gray-100 text-gray-700";
};

/* ----------------------- Top Bar ----------------------- */
function ApoTopBar({ fullName, role }: { fullName: string; role: string }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const setVar = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
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
                <div className="px-4 pb-2 pt-3 text-[15px] font-semibold text-emerald-700">My Account</div>
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
            <button className="rounded-md p-2 hover:bg-white/15" title="Notifications">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-[2px] w-full bg-neutral-200/80" />
      </div>
    </header>
  );
}

/* ----------------------- Sticky Tabs ----------------------- */
function ApoTabs() {
  const items = [
    { to: "/apo/preenlistment", label: "Pre-Enlistment", icon: Users },
    { to: "/apo/courseofferings", label: "Course Offerings", icon: BookOpen },
    { to: "/apo/roomallocation", label: "Room Allocation", icon: Building2 },
  ];
  return (
    <div className="sticky top-[var(--header-h,58px)] z-50 w-full bg-gray-100/80 backdrop-blur">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-3">
        <div className="rounded-xl bg-gray-200 px-3 py-2 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cls(
                    "mx-auto inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    isActive ? "bg-white text-emerald-700 shadow" : "text-gray-800 hover:bg-white/60"
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

/* ----------------------- Single-select dropdown ----------------------- */
function SelectBox({
  value,
  onChange,
  options,
  placeholder = "— Select —",
  className = "",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number>(() => Math.max(0, options.findIndex((o) => o === value)));
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHover(Math.max(0, options.findIndex((o) => o === value))), [value, options]);
  useEffect(() => {
    const close = (e: MouseEvent) =>
      open && !btnRef.current?.contains(e.target as Node) && !listRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const cx = (...s: Array<string | false | undefined>) => s.filter(Boolean).join(" ");
  const handleToggle = () => {
    if (!disabled) setOpen((v) => !v);
  };

  return (
    <div className={cls("relative min-w-[180px]", className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-disabled={disabled}
        className={cx(
          "w-full rounded-lg border px-3 py-2 text-left text-sm outline-none pr-8",
          "border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500/30",
          disabled && "cursor-not-allowed bg-gray-100 text-gray-400"
        )}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
      </button>
      {open && !disabled && (
        <div
          ref={listRef}
          className="absolute z-20 mt-2 maxh-72 max-h-72 w-full overflow-auto rounded-xl border border-gray-300 bg-white shadow-xl"
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
              className={cx(
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

/* ----------------------- Multi-select dropdown w/ chips ----------------------- */
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
      open && !btnRef.current?.contains(e.target as Node) && !listRef.current?.contains(e.target as Node) && setOpen(false);
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

/* ----------------------- Add Course Panel ----------------------- */
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
          options={["BSIT", "BSIS", "BSCS-ST", "BSCS-NIS", "BSCS-CSE", "BSMS-CS"]}
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

function EditCoursePanel({
  course,
  onSave,
  onCancel,
}: {
  course: Course;
  onSave: (updated: Course) => void;
  onCancel: () => void;
}) {
  const [ids, setIds] = useState(course.ids);
  const [programs, setPrograms] = useState(course.programs);

  return (
    <div className="rounded-2xl border border-neutral-300 bg-neutral-50 p-4">
      <h3 className="mb-3 text-lg font-semibold">Edit Course</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Course Code</label>
          <input
            value={course.code}
            disabled
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Course Title</label>
          <input
            value={course.title}
            disabled
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Level</label>
          <input
            value={course.level}
            disabled
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Department</label>
          <input
            value={course.department}
            disabled
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <MultiSelect
          label="ID"
          options={["ID 120", "ID 121", "ID 122", "ID 123", "ID 124", "ID 125"]}
          value={ids}
          onChange={setIds}
          placeholder="Choose ID(s)"
        />
        <MultiSelect
          label="Program"
          options={["BSIT", "BSIS", "BSCS-ST", "BSCS-NIS", "BSCS-CSE", "BSMS-CS"]}
          value={programs}
          onChange={setPrograms}
          placeholder="Choose Program(s)"
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onSave({ ...course, ids, programs })}
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

/* ----------------------- Course Card ----------------------- */
function CourseCard({
  course,
  onUpdateCourse,
  onEditingChange,
  onCardBusyChange,
  globalBusy,
}: {
  course: Course;
  onUpdateCourse: (updated: Course) => void;
  onEditingChange: (editing: boolean) => void;
  onCardBusyChange: (code: string, busy: boolean) => void;
  globalBusy: boolean;
}) {
  const [editingCourse, setEditingCourse] = useState(false);
  const [editData, setEditData] = useState<Course>(course);
  useEffect(() => setEditData(course), [course]);
  useEffect(() => {
    onEditingChange(editingCourse);
  }, [editingCourse, onEditingChange]);

  const [sections, setSections] = useState<SectionRow[]>(course.sections);
  const [adding, setAdding] = useState(false);
  const emptySection: SectionRow = ["","","","","","","","","","","","",""];
  const [newSection, setNewSection] = useState<SectionRow>(emptySection);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    if (sections !== course.sections) {
      onUpdateCourse({ ...course, sections });
    }
  }, [sections]); // eslint-disable-line

  // ---- BUSY REPORTING (local -> parent) ----
  const localBusy = editingCourse || adding || editingIndex !== null || showDelete;
  useEffect(() => {
    onCardBusyChange(course.code, localBusy);
  }, [localBusy, course.code, onCardBusyChange]);

  // Editable subset
  type SectionEditable = { section: string; room1: string; room2: string; capacity: string };
  const toEditable = (row: SectionRow): SectionEditable => ({
    section: row[2] || "",
    room1: row[7] || "",
    room2: row[11] || "",
    capacity: row[12] || "",
  });
  const fromEditable = (row: SectionRow, e: SectionEditable): SectionRow => {
    const copy = [...row] as SectionRow;
    copy[2] = e.section;
    copy[7] = e.room1;
    copy[11] = e.room2;
    copy[12] = e.capacity;
    return copy;
  };

  const [editRowDraft, setEditRowDraft] = useState<SectionEditable | null>(null);

  const startEditRow = (i: number) => {
    setEditingIndex(i);
    setEditRowDraft(toEditable(sections[i]));
  };
  const saveEditRow = () => {
    if (editingIndex === null || !editRowDraft) return;
    const updated = [...sections];
    updated[editingIndex] = fromEditable(sections[editingIndex], editRowDraft);
    setSections(updated);
    setEditingIndex(null);
    setEditRowDraft(null);
  };

  const confirmDelete = (i: number) => {
    setDeleteIndex(i);
    setShowDelete(true);
  };
  const handleDelete = () => {
    if (deleteIndex !== null) setSections((p) => p.filter((_, idx) => idx !== deleteIndex));
    setShowDelete(false);
    setDeleteIndex(null);
  };

  // FIXED auto-increment
const handleAddSection = () => {
  if (globalBusy) return;

  const sectionNums = sections
    .map((s) => {
      const code = s[2] || "";
      const match = /^S(\d+)$/.exec(code);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => n !== null);

  const nextNum = sectionNums.length ? Math.max(...sectionNums) + 1 : 1;
  const nextCode = `S${nextNum}`;

  // create a fresh row
  const copy = [...emptySection] as SectionRow;
  copy[0] = course.title;   // keep course title
  copy[1] = "3";            // or set default units if you have it
  copy[2] = nextCode;
  copy[3] = "Unassigned";   // default faculty

  // 👇 immediately add to sections
  setSections((prev) => [...prev, copy]);

  // 👇 and put into edit mode right away
  setEditingIndex(sections.length); // new row index
  setEditRowDraft(toEditable(copy));
};


  const tags = [course.level, course.department, ...course.ids, ...course.programs];
  const rowActionsDisabled = globalBusy || adding || editingIndex !== null || editingCourse;

  return (
    <div className="relative rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
      {/* left accent */}
      <div className="absolute left-0 top-0 h-full w-2 rounded-l-xl bg-[#21804A]" />

      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-[#21804A]">{course.code}</h2>
          <p className="truncate text-sm text-gray-600">{course.title}</p>
        </div>
        {!editingCourse && (
          <button
            onClick={() => setEditingCourse(true)}
            disabled={globalBusy}
            className={cls(
              "text-xs text-emerald-700 hover:underline",
              globalBusy && "cursor-not-allowed opacity-50 hover:no-underline"
            )}
          >
            Edit Course
          </button>
        )}
      </div>

      {/* Tags */}
      {!editingCourse && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className={cls("rounded-full px-2 py-1 text-xs font-medium", tagColor(t))}>
              {t}
            </span>
          ))}
        </div>
      )}
      
      {editingCourse && (
        <EditCoursePanel
          course={course}
          onSave={(updated) => {
            onUpdateCourse(updated);
            setEditingCourse(false);
          }}
          onCancel={() => setEditingCourse(false)}
        />
      )}

      {/* Sections */}
      <div>
        <div className="space-y-2">
          {sections.map((row, i) => (
            <div
              key={`${row[2]}-${i}`}
              className="grid items-center gap-1 rounded-lg border bg-gray-50 px-3 py-2 text-sm overflow-hidden
                          grid-cols-[minmax(70px,0.7fr)_minmax(70px,0.6fr)_minmax(220px,1.8fr)_minmax(180px,1.2fr)_minmax(120px,1fr)_minmax(180px,1.2fr)_minmax(120px,1fr)_minmax(90px,0.6fr)_max-content]"

            >
              {editingIndex === i ? (
                <>
                  {/* Section */}
                  <input
                    value={editRowDraft?.section || ""}
                    onChange={(e) => setEditRowDraft((p) => ({ ...(p as SectionEditable), section: e.target.value }))}
                    className="min-w-0 truncate rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm"
                  />
                  {/* Units */}
                  <span>{row[1]}</span>
                  {/* Faculty */}
                  <span className={row[3] === "Unassigned" ? "text-red-600 font-medium truncate" : "truncate"}>
                    {row[3]}
                  </span>
                  {/* Day 1 */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="truncate">{row[4] || "—"} {fmtTime(row[5])}–{fmtTime(row[6])}</span>
                  </span>
                  {/* Room 1 */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <input
                      value={editRowDraft?.room1 || ""}
                      onChange={(e) => setEditRowDraft((p) => ({ ...(p as SectionEditable), room1: e.target.value }))}
                      className="min-w-0 flex-1 truncate rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm"
                    />
                  </div>
                  {/* Day 2 */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="truncate">{row[8] || "—"} {fmtTime(row[9])}–{fmtTime(row[10])}</span>
                  </span>
                  {/* Room 2 */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <input
                      value={editRowDraft?.room2 || ""}
                      onChange={(e) => setEditRowDraft((p) => ({ ...(p as SectionEditable), room2: e.target.value }))}
                      className="min-w-0 flex-1 truncate rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm"
                    />
                  </div>
                  {/* Capacity */}
                  <input
                    value={editRowDraft?.capacity || ""}
                    onChange={(e) => setEditRowDraft((p) => ({ ...(p as SectionEditable), capacity: e.target.value }))}
                    className="min-w-0 truncate rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm"
                  />
                  {/* Save */}
                  <div className="flex justify-center">
                    <button
                      onClick={saveEditRow}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Section */}
                  <span className="font-medium">{row[2]}</span>
                  {/* Units */}
                  <span>{row[1]}</span>
                  {/* Faculty */}
                  <span className={row[3] === "Unassigned" ? "text-red-600 font-medium truncate" : "truncate"}>
                    {row[3]}
                  </span>
                  {/* Day 1 */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="truncate">{row[4] || "—"} {fmtTime(row[5])}–{fmtTime(row[6])}</span>
                  </span>
                  {/* Room 1 */}
                  <span className="flex items-center gap-1">
                    {row[7] ? <><MapPin className="h-4 w-4" /><span className="truncate">{row[7]}</span></> : "—"}
                  </span>
                  {/* Day 2 */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="truncate">{row[8] || "—"} {fmtTime(row[9])}–{fmtTime(row[10])}</span>
                  </span>
                  {/* Room 2 */}
                  <span className="flex items-center gap-1">
                    {row[11] ? <><MapPin className="h-4 w-4" /><span className="truncate">{row[11]}</span></> : "—"}
                  </span>
                  {/* Capacity */}
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {row[12] || "—"}
                  </span>
                  {/* Actions */}
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => !rowActionsDisabled && startEditRow(i)}
                      disabled={rowActionsDisabled}
                      className="text-gray-500 hover:text-black disabled:opacity-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => !rowActionsDisabled && confirmDelete(i)}
                      disabled={rowActionsDisabled}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {!adding && editingIndex === null && !editingCourse && (
            <button
              onClick={handleAddSection}
              disabled={globalBusy}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#21804A] px-3 py-2 text-sm text-[#21804A] hover:bg-[#21804A]/10"
            >
              + Add Section
            </button>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6 text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ----------------------- Workflow Chips ----------------------- */
const WorkflowChips = () => {
  const chips = [
    "APO",
    "Office Manager",
    "Office Assistant",
    "Department Chair",
    "Dean",
    "Office Assistant",
    "Provost",
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c, idx) => (
        <span
          key={c + idx}
          className={cls(
            "rounded-full border px-3 py-1 text-[12px]",
            c === "APO" ? "border-emerald-700 bg-emerald-700 text-white" : "border-gray-300 bg-white text-gray-800"
          )}
        >
          {c}
        </span>
      ))}
    </div>
  );
};

/* ----------------------- Page ----------------------- */
export default function CourseOfferingsScreen() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All Levels");
  const [department, setDepartment] = useState("All Departments");
  const [program, setProgram] = useState("All Programs");
  const [idFilter, setIdFilter] = useState("All ID");
  const [showForward, setShowForward] = useState(false);

  /* seed courses in structured shape (13 fields per section) */
  const [courses, setCourses] = useState<Course[]>([
    {
      code: "CCPROG3",
      title: "Object-Oriented Programming",
      level: "Undergraduate",
      department: "Department of Software Technology",
      ids: ["ID 122"],
      programs: ["BSCS-ST", "BSCS-NIS"],
      sections: [
        [
          "Object-Oriented Programming",
          "3",
          "S11",
          "LIM-CHENG, NATHALIE ROSE",
          "M",
          "0730",
          "0900",
          "ONLINE",
          "H",
          "0730",
          "0900",
          "GK306A",
          "20",
        ],
        [
          "Object-Oriented Programming",
          "3",
          "S12",
          "CABREDO, RAFAEL ANGISCO",
          "S",
          "0730",
          "0900",
          "ONLINE",
          "S",
          "0915",
          "1045",
          "—",
          "20",
        ],
        [
          "Object-Oriented Programming",
          "3",
          "S13",
          "Unassigned",
          "T",
          "0730",
          "0900",
          "ONLINE",
          "F",
          "0915",
          "1045",
          "GK306B",
          "20",
        ],
        [
          "Object-Oriented Programming",
          "3",
          "XX22",
          "ENCARNACION, ALAN LIZARDO",
          "M",
          "0730",
          "0900",
          "ONLINE",
          "M",
          "0915",
          "1045",
          "—",
          "20",
        ],
      ],
    },
  ]);

  const filteredCourses = courses.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.sections.some((s) => (s[3] || "").toLowerCase().includes(q)); // faculty index 3
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

  // Track per-card busy state and compute global busy
  const [busyByCourse, setBusyByCourse] = useState<Record<string, boolean>>({});
  const handleCardBusy = (code: string, busy: boolean) =>
    setBusyByCourse((prev) => (prev[code] === busy ? prev : { ...prev, [code]: busy }));

  // Busy if adding course OR a course edit is open OR any card reported busy
  const busy =
    addingCourse || editingCourseCode !== null || Object.values(busyByCourse).some(Boolean);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <ApoTopBar fullName="Hazel Ventura" role="Academic Programming Officer" />
      <ApoTabs />
      <main className="p-6 w-full">
        {/* search + filters card */}
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
          {/* header row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Course Offerings</h2>
              <p className="text-sm text-gray-500">Term 1 AY 2025-2026</p>
            </div>
          </div>

          {/* workflow chips */}
          <div className="my-4">
            <WorkflowChips />
          </div>

          {/* course cards */}
          <div className="space-y-6">
            {filteredCourses.map((c) => (
              <CourseCard
                key={c.code}
                course={c}
                onUpdateCourse={updateCourse}
                onEditingChange={(isEditing) => {
                  setEditingCourseCode(isEditing ? c.code : null);
                  if (!isEditing) handleCardBusy(c.code, false);
                }}
                onCardBusyChange={handleCardBusy}
                globalBusy={busy && !busyByCourse[c.code]}
              />
            ))}
          </div>

          {/* Forward confirmation modal */}
          {showForward && (
            <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-2 border-emerald-600 text-emerald-700">
                  <Check className="h-8 w-8" strokeWidth={2.5} />
                </div>
                <h3 className="mb-2 text-center text-2xl font-semibold">Are you sure?</h3>
                <p className="mx-auto mb-6 max-w-md text-center text-sm text-neutral-600">
                  Please confirm that this is the final version of the faculty load to be submitted to the
                  {" "}
                  <span className="font-semibold">Office Manager</span>. Once submitted, this action cannot be undone and the button will be disabled.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowForward(false)}
                    className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowForward(false)}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                  >
                    Forward
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add course panel */}
          {addingCourse && (
            <div className="mt-6">
              <AddCoursePanel onSave={addCourse} onCancel={() => setAddingCourse(false)} />
            </div>
          )}

          <button
            className={cls(
              "mt-6 rounded-md bg-[#21804A] px-4 py-2 text-sm text-white hover:bg-[#18693B]",
              busy && "opacity-50 cursor-not-allowed hover:bg-[#21804A]"
            )}
            onClick={() => !busy && setAddingCourse(true)}
            disabled={busy}
            title={busy ? "Finish current action first" : "Add a new course"}
          >
            + Add Course
          </button>
        </div>
      </main>
    </div>
  );
}
