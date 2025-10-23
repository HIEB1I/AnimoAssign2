import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";
import AppShell from "../../base/AppShell";

/* ---------- tiny utils ---------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

/* ---------- SelectBox (same vibe as FacTeachingHistory) ---------- */
function SelectBox({
  value,
  onChange,
  options,
  placeholder = "— Select —",
  className = "min-w-[180px]",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-left text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-300 bg-white shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
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

/* ---------- types & mock data (replace with API data) ---------- */
type FacultyHistory = { ay: string; term: "Term 1" | "Term 2" | "Term 3"; faculty: string };
type CourseRow = {
  code: string;
  title: string;
  history: FacultyHistory[]; // prior offerings (newest first)
};

const MOCK_ROWS: CourseRow[] = [
  {
    code: "CS 101",
    title: "Introduction to Programming",
    history: [
      { ay: "AY 2024–2025", term: "Term 1", faculty: "Alvarez, M." },
      { ay: "AY 2024–2025", term: "Term 2", faculty: "Alvarez, M." },
      { ay: "AY 2023–2024", term: "Term 3", faculty: "Santos, R." },
      { ay: "AY 2022–2023", term: "Term 1", faculty: "Alvarez, M." },
    ],
  },
  {
    code: "CS 201",
    title: "Data Structures",
    history: [
      { ay: "AY 2024–2025", term: "Term 3", faculty: "Lim, K." },
      { ay: "AY 2023–2024", term: "Term 2", faculty: "Tan, J." },
    ],
  },
  {
    code: "IT 135",
    title: "Web Technologies",
    history: [
      { ay: "AY 2025–2026", term: "Term 1", faculty: "Reyes, P." },
      { ay: "AY 2024–2025", term: "Term 2", faculty: "Cruz, A." },
      { ay: "AY 2023–2024", term: "Term 1", faculty: "Cruz, A." },
    ],
  },
];

/* ---------- grouping types ---------- */
type GroupedRow = {
  key: string; // `${code}__${faculty}`
  code: string;
  title: string;
  faculty: string;
  count: number; // times taught (after filters)
  instances: { ay: string; term: FacultyHistory["term"] }[];
};

/* ---------- details chips component ---------- */
function RowChips({ instances }: { instances: { ay: string; term: "Term 1" | "Term 2" | "Term 3" }[] }) {
  const [showAll, setShowAll] = useState(false);
  const MAX = 8;
  const visible = showAll ? instances : instances.slice(0, MAX);
  const remaining = instances.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((i, idx) => (
        <span
          key={`${i.ay}-${i.term}-${idx}`}
          className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700"
        >
          {i.term} · {i.ay}
        </span>
      ))}
      {remaining > 0 && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-xs font-medium text-emerald-700 hover:underline"
        >
          +{remaining} more
        </button>
      )}
      {showAll && instances.length > MAX && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="text-xs text-gray-600 hover:underline"
        >
          Show less
        </button>
      )}
    </div>
  );
}

/* ---------- Page ---------- */
export default function OM_REPO_ANA_CourseHistory() {
  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState("All Years");
  const [term, setTerm] = useState("All Terms");

  const academicYearOptions = useMemo(
    () => ["All Years", "AY 2025–2026", "AY 2024–2025", "AY 2023–2024", "AY 2022–2023"],
    []
  );
  const termOptions = useMemo(() => ["All Terms", "Term 1", "Term 2", "Term 3"], []);

  /* ---------- compute grouped rows (respect filters + search) ---------- */
  const grouped = useMemo<GroupedRow[]>(() => {
    const q = search.trim().toLowerCase();

    // 1) filter each row's history by AY/Term first
    const filteredRows = MOCK_ROWS.map((row) => {
      const items = row.history.filter((h) => {
        const ayOk = academicYear === "All Years" || h.ay === academicYear;
        const termOk = term === "All Terms" || h.term === term;
        return ayOk && termOk;
      });
      return { ...row, history: items };
    });

    // 2) group by course + faculty
    const acc = new Map<string, GroupedRow>();
    for (const row of filteredRows) {
      for (const h of row.history) {
        const key = `${row.code}__${h.faculty}`;
        const entry =
          acc.get(key) ??
          {
            key,
            code: row.code,
            title: row.title,
            faculty: h.faculty,
            count: 0,
            instances: [],
          };
        entry.count += 1;
        entry.instances.push({ ay: h.ay, term: h.term });
        acc.set(key, entry);
      }
    }

    // 3) search across code/title/faculty + flattened instances
    let list = [...acc.values()].filter((g) => {
      if (!q) return true;
      const hay =
        `${g.code} ${g.title} ${g.faculty} ` + g.instances.map((i) => `${i.term} ${i.ay}`).join(" ");
      return hay.toLowerCase().includes(q);
    });

    // 4) sort: course code asc, then faculty asc, then most taught desc
    list.sort((a, b) => a.code.localeCompare(b.code) || a.faculty.localeCompare(b.faculty) || b.count - a.count);

    return list;
  }, [search, academicYear, term]);

  /* ---------- expand/collapse state ---------- */
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const toggleRow = (key: string) => setOpenKeys((s) => ({ ...s, [key]: !s[key] }));

  return (
    <AppShell>
      <main className="w-full px-8 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Course History</h1>
        <p className="text-sm text-gray-600 mb-6">View courses and the faculty who previously taught them.</p>

        {/* Filter Bar: Back + Search + AY filter + Term filter */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Link
            to="/om/reports-analytics"
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="relative flex-1 min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, title, faculty, AY, or term..."
              className="w-full rounded-lg border border-gray-300 px-9 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <SelectBox
            value={academicYear}
            onChange={setAcademicYear}
            options={academicYearOptions}
            placeholder="Select Academic Year"
            className="min-w-[200px] ml-auto"
          />

          <SelectBox
            value={term}
            onChange={setTerm}
            options={termOptions}
            placeholder="Select Term"
            className="min-w-[160px]"
          />
        </div>

        {/* Table: compact 4 columns + expandable chips */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">Course Code</th>
                <th className="px-4 py-3 text-center font-semibold">Course Title</th>
                <th className="px-4 py-3 text-center font-semibold">Faculty</th>
                <th className="px-4 py-3 text-center font-semibold">Times Taught</th>
              </tr>
            </thead>
            <tbody>
              {grouped.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    No results. Try adjusting the search, academic year, or term filter.
                  </td>
                </tr>
              ) : (
                grouped.map((g) => (
                  <React.Fragment key={g.key}>
                    {/* primary row */}
                    <tr
                      className="border-t hover:bg-emerald-50/40 cursor-pointer"
                      onClick={() => toggleRow(g.key)}
                    >
                      <td className="px-4 py-3 text-center font-medium">{g.code}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="mx-auto max-w-[520px] truncate">{g.title}</div>
                      </td>
                      <td className="px-4 py-3 text-center">{g.faculty}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-2">
                          <span className="tabular-nums">{g.count}</span>
                          <ChevronDown
                            className={cls("h-4 w-4 transition-transform", openKeys[g.key] && "rotate-180")}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* details row (Term + AY chips) */}
                    {openKeys[g.key] && (
                      <tr className="border-t bg-gray-50/60">
                        <td colSpan={4} className="px-4 py-3 text-left">
                          <RowChips instances={g.instances} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </AppShell>
  );
}
