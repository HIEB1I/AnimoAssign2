import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../base/AppShell";
import { cls } from "../../utilities/cls";
import { ChevronDown, ChevronLeft, FileDown, X, Search } from "lucide-react";

/* ---------------- Small SelectBox (same look as OM_ReportAnalytics) ---------------- */
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
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                btnRef.current?.focus();
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

/* ---------------- Minimal Combobox for Faculty Search ---------------- */
/* ---------------- FacultyCombobox (styled to match OM_REPO_ANA_FacTeachingHistory search) ---------------- */
function FacultyCombobox({
  value,
  onChange,
  options,
  placeholder = "Search faculty…",
  className = "",
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  options: { id: string; name: string; email: string }[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const close = (e: MouseEvent) =>
      open &&
      !wrapRef.current?.contains(e.target as Node) &&
      setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selected = useMemo(
    () => options.find((o) => o.id === value) || null,
    [options, value]
  );

  const filtered = useMemo(() => {
  const q = (selected ? selected.name : query).trim().toLowerCase();
  if (!q) return options.slice(0, 50);
  return options
    .filter((o) => o.name.toLowerCase().includes(q))
    .slice(0, 50);
}, [options, query, selected]);

  const commit = (id: string | null) => {
    onChange(id);
    setOpen(false);
    if (!id) setQuery("");
  };

  // keyboard nav
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoverIndex((i) => Math.min((i < 0 ? -1 : i) + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoverIndex((i) => Math.max((i < 0 ? filtered.length : i) - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (hoverIndex >= 0 && filtered[hoverIndex]) commit(filtered[hoverIndex].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={cls("relative", className)}>
      {/* INPUT: matches the look in OM_REPO_ANA_FacTeachingHistory */}
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        value={selected ? selected.name : query}
        onChange={(e) => {
          // typing turns selection into free text (like a search)
          if (selected) onChange(null);
          setQuery(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-9 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30"
      />
      {(selected || query) && (
        <button
          type="button"
          onClick={() => commit(null)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
          aria-label="Clear"
          title="Clear"
        >
          ✕
        </button>
      )}

      {/* RESULTS LIST: full-width dropdown, same radius/shadow language as reference */}
      {open && !selected && (
      <div
        ref={listRef}
        className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-300 bg-white shadow-xl"
        role="listbox"
      >
        {filtered.length ? (
          filtered.map((opt, idx) => {
            const active = idx === hoverIndex;
            return (
              <button
                key={opt.id}
                role="option"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(-1)}
                onClick={() => commit(opt.id)}
                className={cls(
                  "block w-full px-4 py-2 text-left text-sm",
                  active ? "bg-emerald-50" : "hover:bg-emerald-50"
                )}
              >
                {/* name only */}
                <div className="font-medium">{opt.name}</div>
              </button>
            );
          })
        ) : (
          <div className="px-4 py-3 text-sm text-gray-500">No matches</div>
        )}
      </div>
    )}
    </div>
  );
}


/* ---------------- Data & Helpers ---------------- */

type DayPairId = "mon_thu" | "tue_fri" | "wed_sat";

const dayPairs: { id: DayPairId; label: string }[] = [
  { id: "mon_thu", label: "Mon–Thu" },
  { id: "tue_fri", label: "Tue–Fri" },
  { id: "wed_sat", label: "Wed–Sat" },
];

// Removed spaces around the en dash to shorten labels  ⬅ tightened
const timeSlots = [
  "07:30 – 09:00",
  "09:15 – 10:45",
  "11:00 – 12:30",
  "12:45 – 14:15",
  "14:30 – 16:00",
  "16:15 – 17:45",
  "18:00 – 19:30",
  "19:45 – 20:00",
];

const TERM_LABEL = "AY 2025–2026 T2";

const mockForecast: Record<DayPairId, number[]> = {
  mon_thu: [19, 22, 25, 18, 13, 9, 5],
  tue_fri: [21, 26, 24, 19, 14, 10, 6],
  wed_sat: [10, 15, 19, 17, 16, 9, 4],
};

type FacultyEntry = { id: string; name: string; email: string; p: number };
type SlotDetail = { available: FacultyEntry[]; unavailable: FacultyEntry[] };
type FacultyBySlot = Partial<Record<DayPairId, Partial<Record<number, SlotDetail>>>>;

const mockFacultyBySlot: FacultyBySlot = {
  mon_thu: {
    0: {
      available: [
        { id: "FAC004", name: "Rafael Cabrero", email: "rafael.cabrero@dlsu.edu.ph", p: 0.86 },
        { id: "FAC008", name: "Gregory Cu", email: "gregory.cu@dlsu.edu.ph", p: 0.79 },
        { id: "FAC016", name: "Justine Go", email: "justine.go@dlsu.edu.ph", p: 0.73 },
      ],
      unavailable: [
        { id: "FAC010", name: "Neil Del Gallego", email: "neil.delgallego@dlsu.edu.ph", p: 0.22 },
        { id: "FAC011", name: "Erica De Vera", email: "erica.devera@dlsu.edu.ph", p: 0.18 },
      ],
    },
    4: {
      available: [{ id: "FAC002", name: "Arnulfo Azcarraga", email: "arnulfo.azcarraga@dlsu.edu.ph", p: 0.61 }],
      unavailable: [{ id: "FAC007", name: "Unisse Chu", email: "unisse.chu@dlsu.edu.ph", p: 0.31 }],
    },
  },
  tue_fri: {
    1: {
      available: [
        { id: "FAC005", name: "Charibeth Cheng", email: "charibeth.cheng@dlsu.edu.ph", p: 0.88 },
        { id: "FAC006", name: "Shirley Chu", email: "shirley.chu@dlsu.edu.ph", p: 0.82 },
      ],
      unavailable: [{ id: "FAC003", name: "Allan Borra", email: "allan.borra@dlsu.edu.ph", p: 0.27 }],
    },
  },
  wed_sat: {
    5: {
      available: [{ id: "FAC004", name: "Rafael Cabrero", email: "rafael.cabrero@dlsu.edu.ph", p: 0.55 }],
      unavailable: [{ id: "FAC002", name: "Arnulfo Azcarraga", email: "arnulfo.azcarraga@dlsu.edu.ph", p: 0.29 }],
    },
  },
};

const maxForecast = (data: Record<string, number[]>) =>
  Math.max(0, ...Object.values(data).flat());

// Custom palette (High/Medium/Low/None)
const classForValue = (v: number, max: number) => {
  if (max === 0 || v === 0) return "bg-[#FCF8E8] text-slate-900"; // None
  const ratio = v / max;
  if (ratio >= 0.67) return "bg-[#94B49F] text-slate-900"; // High
  if (ratio >= 0.34) return "bg-[#ECB390] text-slate-900"; // Medium
  return "bg-[#DF7861] text-white"; // Low
};

/* Helpers to build faculty options and an index of where each faculty is available */
function buildFacultyOptionsAndIndex(data: FacultyBySlot) {
  const optsMap = new Map<string, { id: string; name: string; email: string }>();
  const index = new Map<string, Array<{ dp: DayPairId; i: number }>>();

  (Object.keys(data) as DayPairId[]).forEach((dp) => {
    const byIdx = data[dp] || {};
    Object.keys(byIdx).forEach((k) => {
      const i = Number(k);
      const detail = byIdx[i]!;
      (detail.available || []).forEach((f) => {
        if (!optsMap.has(f.id)) optsMap.set(f.id, { id: f.id, name: f.name, email: f.email });
        const arr = index.get(f.id) || [];
        arr.push({ dp, i });
        index.set(f.id, arr);
      });
    });
  });

  const options = Array.from(optsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  return { options, index };
}

/* ---------------- Page ---------------- */
export default function OM_REPO_ANA_AvailabilityForecasting() {
  const [campus, setCampus] = useState<string>("Manila");

  // NEW: faculty search selection
  const { options: facultyOptions, index: facultyIndex } = useMemo(
    () => buildFacultyOptionsAndIndex(mockFacultyBySlot),
    []
  );
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);

  // modal state
  const [open, setOpen] = useState(false);
  const [activePair, setActivePair] = useState<DayPairId | null>(null);
  const [activePairLabel, setActivePairLabel] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeValue, setActiveValue] = useState<number>(0);

  // compute max once
  const maxVal = useMemo(() => maxForecast(mockForecast), []);

  // low coverage list (ratio < 0.34)
  const lowCoverage = useMemo(() => {
    const lows: { dp: DayPairId; dpLabel: string; i: number; t: string; v: number }[] = [];
    for (const dp of dayPairs) {
      for (let i = 0; i < timeSlots.length; i++) {
        const v = mockForecast[dp.id][i];
        if (maxVal > 0 && v / maxVal < 0.34) lows.push({ dp: dp.id, dpLabel: dp.label, i, t: timeSlots[i], v });
      }
    }
    return lows.sort((a, b) => a.v - b.v);
  }, [maxVal]);

  const openModal = (dp: DayPairId, dpLabel: string, idx: number, value: number) => {
    setActivePair(dp);
    setActivePairLabel(dpLabel);
    setActiveIndex(idx);
    setActiveValue(value);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const handleExportCsv = () => {
    // Build CSV like the HTML version
    const rows: (string | number)[][] = [
      ["Term", TERM_LABEL],
      ["Campus", campus],
      selectedFacultyId ? ["Faculty Filter", selectedFacultyId] : [],
      [],
      ["Day Pair", "Time Slot", "Predicted Available"],
    ].filter((r) => r.length) as (string | number)[][];

    for (const dp of dayPairs) {
      for (let i = 0; i < timeSlots.length; i++) {
        // Only include rows that match the current faculty filter (if set)
        const match =
          !selectedFacultyId ||
          (mockFacultyBySlot?.[dp.id]?.[i]?.available || []).some((f) => f.id === selectedFacultyId);
        if (match) rows.push([dp.label, timeSlots[i], mockForecast[dp.id][i]]);
      }
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `availability-forecast-${TERM_LABEL.replace(/\s+/g, "_")}-${campus}${
      selectedFacultyId ? `-${selectedFacultyId}` : ""
    }.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyAvail = async () => {
    if (!activePair) return;
    const avail = mockFacultyBySlot?.[activePair]?.[activeIndex]?.available ?? [];
    const text = avail.map((f) => `${f.name} <${f.email}>`).join(", ");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy the list below:", text);
    }
  };

  // keyboard escape to close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const activeAvail = activePair ? mockFacultyBySlot?.[activePair]?.[activeIndex]?.available ?? [] : [];
  const activeUnavail = activePair ? mockFacultyBySlot?.[activePair]?.[activeIndex]?.unavailable ?? [] : [];

  // Precompute set of matching (dp,i) for selected faculty
  const matchSet = useMemo(() => {
    if (!selectedFacultyId) return null;
    const entries = facultyIndex.get(selectedFacultyId) || [];
    const s = new Set(entries.map((e) => `${e.dp}|${e.i}`));
    return s;
  }, [selectedFacultyId, facultyIndex]);

  // Helper: is this cell a match given filter?
  const isCellMatch = (dp: DayPairId, i: number) => {
    if (!matchSet) return true;
    return matchSet.has(`${dp}|${i}`);
  };

  const selectedFaculty = useMemo(
    () => (selectedFacultyId ? facultyOptions.find((o) => o.id === selectedFacultyId) || null : null),
    [selectedFacultyId, facultyOptions]
  );

  return (
    <AppShell>
      <main className="w-full px-8 py-8">
        {/* Header */}
        <header className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Faculty Availability Forecast (Pre-Survey)</h1>
            <p className="text-sm text-gray-600">
              Predictive forecast for <strong>{TERM_LABEL}</strong>
            </p>
          </div>
        </header>

        {/* Filter Bar with Back (left) and controls (right) */}
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {/* Back button */}
          <Link
            to="/om/reports-analytics"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 active:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>

          {/* NEW: Faculty search */}
          <FacultyCombobox
            value={selectedFacultyId}
            onChange={setSelectedFacultyId}
            options={facultyOptions}
            className="flex-1 min-w-[240px]" // optional: makes it flow like the reference search
          />

          {/* Right-aligned campus + export */}
          <div className="ml-auto flex items-center gap-3">
            <SelectBox
              value={campus}
              onChange={setCampus}
              options={["Manila", "Laguna"]}
              placeholder="— Campus —"
              className="min-w-[180px]"
            />
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-emerald-500/30"
              aria-label="Export CSV"
              title="Export CSV"
            >
              <FileDown className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Heatmap Card */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <colgroup>
                <col className="w-[112px] min-w-[112px] max-w-[112px]" />
                <col />
                <col />
                <col />
              </colgroup>

              <thead>
                <tr>
                  <th className="p-1.5 text-center align-middle text-[10px] uppercase tracking-wide text-gray-500 whitespace-nowrap">
                    Time Slot
                  </th>
                  {dayPairs.map((dp) => (
                    <th
                      key={dp.id}
                      className="p-2 text-left text-[11px] uppercase tracking-wide text-gray-500"
                    >
                      {dp.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {timeSlots.map((slot, i) => (
                  <tr key={i} className="align-top">
                    <td className="p-1.5 w-[112px] text-center align-middle text-xs font-medium whitespace-nowrap">
                      {slot}
                    </td>

                    {dayPairs.map((dp) => {
                      const v = mockForecast[dp.id][i] ?? 0;
                      const top = mockFacultyBySlot?.[dp.id]?.[i]?.available?.[0] ?? null;
                      const tooltip = `Pred. faculty: ${v}${
                        top ? ` | Top: ${top.name} (${top.p.toFixed(2)})` : ""
                      }`;

                      const match = isCellMatch(dp.id, i);

                      return (
                        <td key={dp.id} className="p-2">
                          <button
                            type="button"
                            title={tooltip}
                            aria-label={tooltip}
                            onClick={() => match && openModal(dp.id, dp.label, i, v)}
                            disabled={!match}
                            className={cls(
                              "slotbtn grid h-12 w-full place-items-center rounded-xl text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] focus:outline-none",
                              classForValue(v, maxVal),
                              match
                                ? "focus:ring-2 focus:ring-emerald-500/30"
                                : "opacity-40 grayscale pointer-events-none"
                            )}
                          >
                            <div className="text-base font-extrabold leading-none">{v}</div>
                            <div className="text-[10px] opacity-90">pred. faculty</div>
                            {/* Ring accent for matching cells when a faculty is selected */}
                            {selectedFacultyId && match && (
                              <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-emerald-400/50"></span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span className="inline-flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-black/5 bg-[#94B49F]"></i> High
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-black/5 bg-[#ECB390]"></i> Medium
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-black/5 bg-[#DF7861]"></i> Low
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-black/5 bg-[#FCF8E8]"></i> None
            </span>
            {selectedFaculty && (
              <span className="inline-flex items-center gap-2">
                <i className="h-3.5 w-3.5 rounded-md border border-emerald-300 ring-2 ring-emerald-400/50"></i>{" "}
                {selectedFaculty.name} available
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Numbers represent predicted counts prior to new preference forms. Click a cell to see faculty names with confidence.
          </p>
        </section>

        {/* Warning pill aligned bottom-right */}
        <div className="mt-3 flex justify-end">
          <div
            className={cls(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm",
              lowCoverage.length
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
            role="status"
            aria-live="polite"
          >
            {lowCoverage.length ? (
              <>
                <span>{lowCoverage.length} low-coverage slots detected.</span>
                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      lowCoverage[0].dp,
                      lowCoverage[0].dpLabel,
                      lowCoverage[0].i,
                      lowCoverage[0].v
                    )
                  }
                  className="rounded-md border border-amber-300 bg-white px-2 py-1 text-xs hover:bg-amber-100"
                >
                  View first
                </button>
              </>
            ) : (
              <span>No low-coverage windows detected.</span>
            )}
          </div>
        </div>

        {/* Modal */}
        {open && activePair && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            aria-hidden={false}
          >
            <div className="w-full max-w-[640px] overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    {activePairLabel}
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {timeSlots[activeIndex]} • Pred: {activeValue}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Available */}
                <div className="min-w-0 border-b border-gray-200 p-4 sm:border-b-0 sm:border-r">
                  <div className="mb-2 flex items-center justify-between">
                    <strong className="text-sm">Predicted Available</strong>
                    <span className="rounded-full border border-gray-300 px-2 py-0.5 text-[11px] text-gray-600">
                      {activeAvail.length}
                    </span>
                  </div>
                  <ul className="max-h-64 space-y-1 overflow-auto text-sm">
                    {activeAvail.map((f) => {
                      const isSelected = selectedFacultyId === f.id;
                      return (
                        <li
                          key={f.id}
                          className={cls(
                            "flex items-center justify-between gap-2 rounded-md px-1 py-0.5",
                            isSelected ? "bg-emerald-50 font-medium text-emerald-900" : ""
                          )}
                        >
                          <span className="truncate">{f.name}</span>
                          <span className="text-xs text-gray-500">{Math.round(f.p * 100)}%</span>
                        </li>
                      );
                    })}
                    {!activeAvail.length && (
                      <li className="text-sm text-gray-500">No predictions available.</li>
                    )}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={copyAvail}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Copy names/emails
                    </button>
                  </div>
                </div>

                {/* Unavailable */}
                <div className="min-w-0 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <strong className="text-sm">Likely Unavailable</strong>
                    <span className="rounded-full border border-gray-300 px-2 py-0.5 text-[11px] text-gray-600">
                      {activeUnavail.length}
                    </span>
                  </div>
                  <ul className="max-h-64 space-y-1 overflow-auto text-sm">
                    {activeUnavail.map((f) => (
                      <li key={f.id} className="flex items-center justify-between gap-2">
                        <span className="truncate">{f.name}</span>
                        <span className="text-xs text-gray-500">{Math.round(f.p * 100)}%</span>
                      </li>
                    ))}
                    {!activeUnavail.length && (
                      <li className="text-sm text-gray-500">No predictions available.</li>
                    )}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500">
                Tip: Export CSV respects the current faculty filter.
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
