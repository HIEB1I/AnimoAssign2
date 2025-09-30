import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div
        className="text-white"
        style={{
          backgroundImage: `url(${Login_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex w-full items-center justify-between px-5 py-3">
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
            <button className="rounded-md p-2 hover:bg-white/10" title="Notifications">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-gray-200 w-full"></div>

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

      {/* Tabs */}
      <div className="bg-gray-100 px-6 py-2 flex justify-center gap-6 text-sm font-medium text-gray-700">
        <button
          onClick={() => navigate("/apo/preenlistment")}
          className="flex items-center gap-2 px-4 py-2 hover:text-black"
        >
          <UserCircle className="h-4 w-4" />
          Pre-Enlistment
        </button>
        <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 shadow-sm">
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

/* ----------------------- SelectBox ----------------------- */
function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(
    Math.max(0, options.findIndex((o) => o === value))
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        open &&
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const cx = (...s: Array<string | false | undefined>) =>
    s.filter(Boolean).join(" ");

  return (
    <div className="relative min-w-[150px]">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "w-full rounded-lg border px-3 py-2 text-left text-sm outline-none",
          "border-gray-300 bg-white pr-8",
          "focus:ring-2 focus:ring-emerald-500/30"
        )}
      >
        <span className={cx(!value && "text-gray-400")}>
          {value || "-- Select --"}
        </span>
        <span className="pointer-events-none absolute right-3 top-[10px]">▾</span>
      </button>

      {open && (
        <div
          ref={listRef}
          className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-emerald-200 bg-white shadow-lg"
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
                hover === i && "bg-emerald-50",
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

/* ----------------------- Course Card ----------------------- */
function CourseCard({
  courseCode,
  title,
  tags,
  sections: initialSections,
}: {
  courseCode: string;
  title: string;
  tags: string[];
  sections: string[][];
}) {
  const [sections, setSections] = useState<string[][]>(initialSections);
  const [adding, setAdding] = useState(false);
  const [newSection, setNewSection] = useState<string[]>(
    Array(8).fill("") as string[]
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editingCourse, setEditingCourse] = useState(false);
  const [addingCourse, setAddingCourse] = useState(false);
  
  const startEdit = (i: number) => {
    setEditingIndex(i);
    setNewSection([...sections[i]]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...sections];
    updated[editingIndex] = newSection;
    setSections(updated);
    setEditingIndex(null);
    setNewSection(Array(8).fill(""));
  };

  const saveNew = () => {
    if (newSection[0].trim() === "") return;
    setSections((prev) => [...prev, newSection]);
    setNewSection(Array(8).fill(""));
    setAdding(false);
  };

  const confirmDelete = (i: number) => {
    setDeleteIndex(i);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      setSections((prev) => prev.filter((_, idx) => idx !== deleteIndex));
    }
    setShowDelete(false);
    setDeleteIndex(null);
  };

  const tagColors: Record<string, string> = {
    Undergraduate: "bg-green-100 text-green-700",
    "Department of Software Technology": "bg-amber-100 text-amber-700",
    "Department of Information Technology": "bg-blue-100 text-blue-700",
    "Department of Computer Technology": "bg-purple-100 text-purple-700",
    Unassigned: "bg-red-100 text-red-700",
    "ID 122": "bg-violet-100 text-violet-700",
    "ID 123": "bg-violet-100 text-violet-700",
    "BSCS-ST": "bg-pink-100 text-pink-700",
    "BSCS-NIS": "bg-pink-100 text-pink-700",
    "BSCS-CSE": "bg-pink-100 text-pink-700",
    "BSMS-CS": "bg-pink-100 text-pink-700",
    BSIT: "bg-teal-100 text-teal-700",
    BSIS: "bg-cyan-100 text-cyan-700",
    Others: "bg-gray-200 text-gray-800",
  };

return (
  <div className="relative rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
    <div className="absolute left-0 top-0 h-full w-2 rounded-l-xl bg-[#21804A]" />

    {/* Course Header */}
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2 className="text-lg font-bold text-[#21804A]">{courseCode}</h2>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      <button className="text-xs text-emerald-700 hover:underline">
        Edit Course
      </button>
    </div>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((t) => (
        <span
          key={t}
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            tagColors[t] || "bg-gray-100 text-gray-700"
          }`}
        >
          {t}
        </span>
      ))}
    </div>


      {/* Sections list */}
      <div className="overflow-x-auto">
        <div className="space-y-2">
          {sections.map((row, i) => (
            <div
              key={`${row[0]}-${i}`}
              className="grid grid-cols-[80px_minmax(140px,1fr)_minmax(100px,1fr)_minmax(140px,1fr)_100px_120px_minmax(200px,2fr)_80px_60px] items-center gap-3 rounded-lg border px-3 py-2 text-sm bg-gray-50"
            >
              {editingIndex === i ? (
                <>
                  {newSection.map((val, idx) => (
                    <input
                      key={idx}
                      placeholder={[
                        "Section",
                        "Day 1 Schedule",
                        "Room 1",
                        "Day 2 Schedule",
                        "Room 2",
                        "Mode of Learning",
                        "Faculty",
                        "Capacity",
                      ][idx]}
                      value={val}
                      onChange={(e) => {
                        const copy = [...newSection];
                        copy[idx] = e.target.value;
                        setNewSection(copy);
                      }}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm"
                    />
                  ))}

                  {/* Save Button */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={saveEdit}
                      className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50"
                      title="Save Section"
                    >
                      ✓
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-medium">{row[0]}</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" /> {row[1]}
                  </span>
                  <span className="text-gray-600">{row[2]}</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" /> {row[3]}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" /> {row[4]}
                  </span>
                  <span className="text-gray-600">{row[5]}</span>
                  <span
                    className={
                      row[6] === "Unassigned"
                        ? "text-red-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {row[6]}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" /> {row[7]}
                  </span>

                {/* Action Buttons */}
                <div className="flex justify-center gap-2">
                <button
                    className={`text-gray-500 hover:text-black ${
                    adding || editingIndex !== null ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => !adding && editingIndex === null && startEdit(i)}
                    disabled={adding || editingIndex !== null}
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    className={`text-red-500 hover:text-red-700 ${
                    adding || editingIndex !== null ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => !adding && editingIndex === null && confirmDelete(i)}
                    disabled={adding || editingIndex !== null}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
                </div>

                </>
              )}
            </div>
          ))}

          {/* Add New Section Row */}
          {adding && (
            <div className="grid grid-cols-[80px_minmax(140px,1fr)_minmax(100px,1fr)_minmax(140px,1fr)_100px_120px_minmax(200px,2fr)_80px_60px] gap-3 rounded-lg border px-3 py-3 text-sm bg-gray-50">
              {newSection.map((val, idx) => (
                <input
                  key={idx}
                  placeholder={[
                    "Section",
                    "Day 1 Schedule",
                    "Room 1",
                    "Day 2 Schedule",
                    "Room 2",
                    "Mode of Learning",
                    "Faculty",
                    "Capacity",
                  ][idx]}
                  value={val}
                  onChange={(e) => {
                    const copy = [...newSection];
                    copy[idx] = e.target.value;
                    setNewSection(copy);
                  }}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm"
                />
              ))}
              <div className="flex items-center justify-end">
                <button
                  onClick={saveNew}
                  className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50"
                  title="Save Section"
                >
                  ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Add Section */}
        {!adding && editingIndex === null && (
        <button
            className="mt-4 flex items-center gap-2 rounded-md border border-[#21804A] px-3 py-2 text-sm text-[#21804A] hover:bg-[#21804A]/10"
            onClick={() => setAdding(true)}
        >
            + Add Section
        </button>
        )}

        {/* Add Course */}
        {editingIndex === null && !adding && (
        <button className="mt-4 flex items-center gap-2 rounded-md bg-[#21804A] px-4 py-2 text-sm text-white hover:bg-[#18693B]">
            + Add Course
        </button>
        )}


      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <div className="text-red-500 text-5xl mb-3">✕</div>
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <p className="text-gray-500 mb-4">
              Do you really want to delete this section? This process cannot be
              undone.
            </p>
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-md bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700"
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

/* ----------------------- Page ----------------------- */
export default function CourseOfferingsScreen() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All Levels");
  const [department, setDepartment] = useState("All Departments");
  const [program, setProgram] = useState("All Programs");

  const courses = [
    {
      courseCode: "CCPROG3",
      title: "Object-Oriented Programming",
      tags: [
        "Undergraduate",
        "Department of Software Technology",
        "ID 122",
        "BSCS-ST",
        "BSCS-NIS",
      ],
      sections: [
        [
          "S11",
          "M 7:30-9:00 AM",
          "ONLINE",
          "H 7:30-9:00 AM",
          "GK306A",
          "HYBRID",
          "LIM-CHENG, NATHALIE ROSE",
          "20",
        ],
        [
          "S12",
          "S 7:30-9:00 AM",
          "ONLINE",
          "S 9:15-10:45 AM",
          "—",
          "FOL",
          "CABREDO, RAFAEL ANGISCO",
          "20",
        ],
        [
          "S13",
          "T 7:30-9:00 AM",
          "ONLINE",
          "F 9:15-10:45 AM",
          "GK306B",
          "HYBRID",
          "Unassigned",
          "20",
        ],
        [
          "XX22",
          "M 7:30-9:00 AM",
          "ONLINE",
          "M 9:15-10:45 AM",
          "—",
          "FOL",
          "ENCARNACION, ALAN LIZARDO",
          "20",
        ],
      ],
    },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      !search ||
      c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.sections.some((s) => s[6].toLowerCase().includes(search.toLowerCase())); // faculty

    const matchesLevel = level === "All Levels" || c.tags.includes(level);
    const matchesDept =
      department === "All Departments" || c.tags.includes(department);
    const matchesProgram =
      program === "All Programs" || c.tags.includes(program);

    return matchesSearch && matchesLevel && matchesDept && matchesProgram;
  });

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <TopBar />

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3 items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by faculty, course code..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <SelectBox
            value={level}
            onChange={setLevel}
            options={[
              "All Levels",
              "Senior High School",
              "Undergraduate",
              "Graduate",
            ]}
          />
          <SelectBox
            value={department}
            onChange={setDepartment}
            options={[
              "All Departments",
              "Department of Software Technology",
              "Department of Information Technology",
              "Department of Computer Technology",
            ]}
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
              "BSIT",
              "BSIS",
              "Others",
            ]}
          />
          <button className="rounded-md bg-[#21804A] px-4 py-2 text-sm text-white hover:bg-[#18693B]">
            Forward
          </button>
        </div>

        {/* Filtered Courses */}
        {filteredCourses.map((c) => (
          <CourseCard key={c.courseCode} {...c} />
        ))}
      </main>
    </div>
  );
}
