// src/FAC_History.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { CalendarDays, Clock, Map, MapPin, Users2, Search } from "lucide-react";

/* ---------- tiny utils ---------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

/* ---------- local Tag component ---------- */
const TAG_STYLES = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  gray: "bg-gray-50 text-gray-600 border-gray-200",
} as const;

function Tag({
  children,
  tone = "emerald",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TAG_STYLES;
}) {
  return (
    <span
      className={cls(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        TAG_STYLES[tone]
      )}
    >
      {children}
    </span>
  );
}

/* ---------- local Dropdown (copy of overview one) ---------- */
function Dropdown({
  value,
  onChange,
  options,
  className = "w-full",
  placeholder = "— Select an option —",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(() =>
    Math.max(0, options.findIndex((o) => o === value))
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => setHover(Math.max(0, options.findIndex((o) => o === value))),
    [value, options]
  );
  useEffect(() => {
    const close = (e: MouseEvent) =>
      open &&
      !btnRef.current?.contains(e.target as Node) &&
      !listRef.current?.contains(e.target as Node) &&
      setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!open && ["ArrowDown", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHover((i) => (i + 1) % options.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHover((i) => (i - 1 + options.length) % options.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      onChange(options[hover] ?? options[0]);
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  return (
    <div className={cls("relative", className)} onKeyDown={onKey}>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cls(
          "w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-left text-sm shadow-sm outline-none",
          "hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500/30"
        )}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          ▾
        </span>
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-gray-300 bg-white shadow-lg"
        >
          {options.map((opt, i) => (
            <button
              key={opt}
              role="option"
              aria-selected={value === opt}
              onMouseEnter={() => setHover(i)}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                btnRef.current?.focus();
              }}
              className={cls(
                "block w-full px-4 py-3 text-left text-sm",
                i === hover && "bg-emerald-50"
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

/* ---------- history: filters & data ---------- */
const TERM_OPTIONS = [
  "All Terms",
  "Term 3, AY 2024-2025",
  "Term 2, AY 2024-2025",
  "Term 1, AY 2024-2025",
];

type HistCourse = {
  code: string;
  sec: string;
  title: string;
  days: string; // e.g., "Tuesdays & Fridays"
  time: string; // e.g., "7:30–9:00 AM"
  mode: "Hybrid" | "Online" | "Onsite";
  campus: string; // e.g., "Manila"
  room: string | "Online"; // e.g., "GK306B"
  units: number;
  students: number;
  media: "MS Teams" | "Moodle" | "LMS" | "Canvas" | "Zoom" | "Leganto" | "Logins";
};

type HistTerm = {
  label: string;
  shortLabel: string;
  courses: HistCourse[];
};

/* sample data (split days/time to match the screenshot) */
const HISTORY_TERMS: HistTerm[] = [
  {
    label: "Term 3, AY 2024-2025",
    shortLabel: "Term 3, AY 2024-2025",
    courses: [
      {
        code: "CSMODEL",
        sec: "S12",
        title: "Data Modeling and Database Design",
        days: "Tuesdays & Thursdays",
        time: "7:30–9:00 AM",
        mode: "Hybrid",
        campus: "Manila",
        room: "Online",
        units: 3,
        students: 35,
        media: "Moodle",
      },
      {
        code: "CSMODEL",
        sec: "S13",
        title: "Data Modeling and Database Design",
        days: "Tuesdays & Thursdays",
        time: "9:15–10:45 AM",
        mode: "Hybrid",
        campus: "Manila",
        room: "GK208",
        units: 3,
        students: 31,
        media: "Moodle",
      },
    ],
  },
  {
    label: "Term 2, AY 2024-2025",
    shortLabel: "Term 2, AY 2024-2025",
    courses: [
      {
        code: "CSHUMAN",
        sec: "S12",
        title: "Software Engineering 1",
        days: "Mondays & Thursdays",
        time: "7:30–9:00 AM",
        mode: "Hybrid",
        campus: "Manila",
        room: "GK208",
        units: 3,
        students: 33,
        media: "Moodle",
      },
      {
        code: "CCPROG3",
        sec: "S22",
        title: "Object-Oriented Programming",
        days: "Saturdays",
        time: "12:40–2:15 PM",
        mode: "Online",
        campus: "Laguna",
        room: "Online",
        units: 3,
        students: 21,
        media: "Logins",
      },
    ],
  },
  { label: "Term 1, AY 2024-2025", shortLabel: "Term 1, AY 2024-2025", courses: [] },
];

/* ---------- UI bits ---------- */
const LineItem = ({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 text-sm text-neutral-600">
    <Icon className="h-4 w-4" />
    {children}
  </div>
);

function HistoryCourseCard({ c }: { c: HistCourse }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{c.code}</span>
            <Tag tone="gray"> {c.sec}</Tag>
            <Tag tone={c.mode === "Hybrid" ? "amber" : c.mode === "Online" ? "blue" : "gray"}>
              {c.mode}
            </Tag>
          </div>
          <div className="mt-1 text-sm text-neutral-700">{c.title}</div>
        </div>
        <div className="text-sm text-neutral-600">{c.units} units</div>
      </div>

      {/* Matches the screenshot: days | time | campus | room | students */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
        <LineItem icon={CalendarDays}>{c.days}</LineItem>
        <LineItem icon={Clock}>{c.time}</LineItem>
        <LineItem icon={Map}>{c.campus}</LineItem>
        <LineItem icon={MapPin}>{c.room}</LineItem>
        <LineItem icon={Users2}>{c.students} students</LineItem>
      </div>
    </div>
  );
}

/* ---------- main ---------- */
function HistoryMain() {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState<string>(TERM_OPTIONS[0]);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(HISTORY_TERMS.map((t) => [t.label, true]))
  );

  const visibleTerms = useMemo(() => {
    const base = term.startsWith("All")
      ? HISTORY_TERMS
      : HISTORY_TERMS.filter((t) => t.label === term);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    const match = (c: HistCourse) =>
      [c.code, c.title, c.sec, c.campus, c.room, c.mode, c.days, c.time, String(c.students)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return base.map((t) => ({ ...t, courses: t.courses.filter(match) }));
  }, [term, query]);

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-neutral-900">Teaching History</h3>
          <p className="text-sm text-neutral-500">Complete record of your teaching assignments</p>
        </div>

        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="col-span-2">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm">
              <Search className="h-4 w-4 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by course name…"
                className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          <Dropdown value={term} onChange={setTerm} options={TERM_OPTIONS} />
        </div>

        {/* Term groups */}
        <div className="space-y-4">
          {visibleTerms.map((t) => (
            <div key={t.label} className="rounded-xl border border-neutral-200 bg-neutral-50/50">
              {/* collapsible header */}
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [t.label]: !o[t.label] }))}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-neutral-700">{t.shortLabel}</span>
                  <span className="text-[12px] text-neutral-500">
                    | {t.courses.length} {t.courses.length === 1 ? "course" : "courses"}
                  </span>
                </div>
                <span className="text-neutral-500">{open[t.label] ? "▾" : "▸"}</span>
              </button>

              {open[t.label] && (
                <div className="space-y-3 px-4 pb-4">
                  {t.courses.length === 0 ? (
                    <div className="rounded-md border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-500">
                      No courses for this term.
                    </div>
                  ) : (
                    t.courses.map((c, i) => <HistoryCourseCard key={i} c={c} />)
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- export content-only for Overview tab ---------- */
export function HistoryContent() {
  return <HistoryMain />;
}

export default HistoryMain;
