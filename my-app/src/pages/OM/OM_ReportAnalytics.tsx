import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../base/AppShell";
import { cls } from "../../utilities/cls";
import {
  BookOpenCheck,
  GaugeCircle,
  Layers,
  CalendarClock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

/* ---------------- Small SelectBox (matches OM_ClassRetention look) ---------------- */
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

/* ---------------- Card Data ---------------- */
type CardItem = {
  title: string;
  to: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: {
    ring: string;
    iconWrap: string;
    icon: string;
    title: string;
  };
};

const INSIGHT_CARDS: CardItem[] = [
  {
    title: "Teaching History per Faculty",
    to: "/reports/teaching-history",
    Icon: BookOpenCheck,
    accent: {
      ring: "ring-emerald-500/30",
      iconWrap: "from-emerald-50 to-emerald-100",
      icon: "text-emerald-700",
      title: "text-emerald-800",
    },
  },
  {
    title: "Course Profile Report",
    to: "/reports/course-profile",
    Icon: Layers,
    accent: {
      ring: "ring-violet-500/30",
      iconWrap: "from-violet-50 to-violet-100",
      icon: "text-violet-700",
      title: "text-violet-800",
    },
  },
  {
    title: "Deloading Utilization Report",
    to: "/reports/deloading-utilization",
    Icon: GaugeCircle,
    accent: {
      ring: "ring-sky-500/30",
      iconWrap: "from-sky-50 to-sky-100",
      icon: "text-sky-700",
      title: "text-sky-800",
    },
  },
];

const FORECAST_CARDS: CardItem[] = [
  {
    title: "Faculty Availability Forecasting",
    to: "/reports/faculty-availability-forecast",
    Icon: CalendarClock,
    accent: {
      ring: "ring-amber-500/30",
      iconWrap: "from-amber-50 to-amber-100",
      icon: "text-amber-700",
      title: "text-amber-800",
    },
  },
  {
    title: "Faculty Load Risk Forecast",
    to: "/reports/faculty-load-risk",
    Icon: AlertTriangle,
    accent: {
      ring: "ring-rose-500/30",
      iconWrap: "from-rose-50 to-rose-100",
      icon: "text-rose-700",
      title: "text-rose-800",
    },
  },
];

/* ---------------- Page ---------------- */
export default function OM_ReportAnalytics() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [term, setTerm] = useState("Term 1 • AY 2025–2026");

  const renderCard = (card: CardItem, idxKey: string) => (
    <Link
      key={idxKey}
      to={card.to}
      onMouseEnter={() => setHovered(idxKey)}
      onMouseLeave={() => setHovered(null)}
      className={cls(
        "group relative isolate flex aspect-[5/4] items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-200 ease-out",
        hovered === idxKey && "scale-[1.04] shadow-md z-10",
        hovered && hovered !== idxKey && "scale-[0.97] opacity-90"
      )}
    >
      {/* soft panel tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-gray-50"
      />

      {/* center icon + title */}
      <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-4">
        <div
          className={cls(
            "grid h-20 w-20 place-items-center rounded-full bg-gradient-to-b shadow-inner border border-white/60",
            card.accent.iconWrap
          )}
        >
          <card.Icon className={cls("h-10 w-10", card.accent.icon)} strokeWidth={2.2} />
        </div>
        <h3 className={cls("text-base font-semibold", card.accent.title)}>{card.title}</h3>
        <p className="text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Click to open
        </p>
      </div>

      {/* hover ring */}
      <div
        aria-hidden
        className={cls(
          "absolute inset-0 rounded-2xl ring-0 transition-all duration-200",
          hovered === idxKey && "ring-4",
          card.accent.ring
        )}
      />
    </Link>
  );

  return (
    <AppShell>
      <main className="w-full px-8 py-8">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-gray-600">
            View insights, trends, and performance metrics
          </p>
        </header>

        {/* Filter Bar (same vibe as OM_ClassRetention) */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <SelectBox
            value={term}
            onChange={setTerm}
            options={[
              "Term 1 • AY 2025–2026",
              "Term 2 • AY 2025–2026",
              "Term 3 • AY 2025–2026",
              "Summer • AY 2025–2026",
            ]}
            className="min-w-[220px]"
          />
        </div>

        {/* Section 1: Faculty Load Insights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold">Faculty Load Insights</h2>
          <p className="text-sm text-gray-600">
            Current state monitoring and historical data
          </p>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSIGHT_CARDS.map((c, i) => renderCard(c, `insight-${i}`))}
          </div>
        </section>

        {/* Section 2: Forecast & Risk Analytics */}
        <section>
          <h2 className="text-xl font-semibold">Forecast & Risk Analytics</h2>
          <p className="text-sm text-gray-600">Forecasting and scenario planning</p>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FORECAST_CARDS.map((c, i) => renderCard(c, `forecast-${i}`))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
