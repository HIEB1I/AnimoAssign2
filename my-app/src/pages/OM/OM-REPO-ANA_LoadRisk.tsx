import React, { useEffect, useMemo, useRef, useState } from "react";
import AppShell from "../../base/AppShell";
import { cls } from "../../utilities/cls";
import { RotateCcw, FileDown, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

/** -----------------------------------------------------------
 * Mock data (ported from p2-ui-mockup.html)
 * ----------------------------------------------------------- */
type CourseRow = {
  course_id: string;
  course_code: string;
  course_name: string;
  sections_planned: number;
  cap_per_section: number;
  forecast_enrollees: number;
  qualified_ft_count: number;
  qualified_pt_pool: number;
  avg_sections_per_ft: number;
  leave_probability: number; // 0..1
  historical_fill_rate: number; // 0..1
  program_area: string;
};

const MOCK: CourseRow[] = [
  { course_id:"C001", course_code:"CCPROG1", course_name:"Computer Programming 1", sections_planned:6, cap_per_section:45, forecast_enrollees:260, qualified_ft_count:5, qualified_pt_pool:3, avg_sections_per_ft:1.2, leave_probability:0.18, historical_fill_rate:0.97, program_area:"Foundations" },
  { course_id:"C002", course_code:"CCPROG2", course_name:"Computer Programming 2", sections_planned:5, cap_per_section:45, forecast_enrollees:210, qualified_ft_count:4, qualified_pt_pool:2, avg_sections_per_ft:1.1, leave_probability:0.25, historical_fill_rate:0.94, program_area:"Foundations" },
  { course_id:"C003", course_code:"CCPROG3", course_name:"Data Structures", sections_planned:5, cap_per_section:45, forecast_enrollees:230, qualified_ft_count:4, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.22, historical_fill_rate:0.92, program_area:"Core" },
  { course_id:"C004", course_code:"CSADPRG", course_name:"Advanced Programming", sections_planned:4, cap_per_section:45, forecast_enrollees:190, qualified_ft_count:3, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.35, historical_fill_rate:0.89, program_area:"Core" },
  { course_id:"C005", course_code:"CSSWENG", course_name:"Software Engineering", sections_planned:6, cap_per_section:45, forecast_enrollees:270, qualified_ft_count:5, qualified_pt_pool:3, avg_sections_per_ft:1.1, leave_probability:0.28, historical_fill_rate:0.9, program_area:"SE" },
  { course_id:"C006", course_code:"CSINTSY", course_name:"Intelligent Systems", sections_planned:3, cap_per_section:45, forecast_enrollees:130, qualified_ft_count:2, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.32, historical_fill_rate:0.86, program_area:"AI/ML" },
  { course_id:"C007", course_code:"CSALGCM", course_name:"Algorithms", sections_planned:4, cap_per_section:45, forecast_enrollees:180, qualified_ft_count:3, qualified_pt_pool:1, avg_sections_per_ft:1.0, leave_probability:0.15, historical_fill_rate:0.95, program_area:"Core" },
  { course_id:"C008", course_code:"DATALG",  course_name:"Data Analytics", sections_planned:3, cap_per_section:45, forecast_enrollees:160, qualified_ft_count:2, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.4,  historical_fill_rate:0.84, program_area:"Data" },
  { course_id:"C009", course_code:"MOBDEVE", course_name:"Mobile Development", sections_planned:3, cap_per_section:45, forecast_enrollees:150, qualified_ft_count:2, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.3,  historical_fill_rate:0.88, program_area:"Platforms" },
  { course_id:"C010", course_code:"CSMODEL", course_name:"Modeling & Simulation", sections_planned:2, cap_per_section:45, forecast_enrollees:100, qualified_ft_count:1, qualified_pt_pool:1, avg_sections_per_ft:1.0, leave_probability:0.4,  historical_fill_rate:0.8,  program_area:"Core" },
  { course_id:"C011", course_code:"CSOPESY", course_name:"Operating Systems", sections_planned:3, cap_per_section:45, forecast_enrollees:130, qualified_ft_count:2, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.2,  historical_fill_rate:0.9,  program_area:"Systems" },
  { course_id:"C012", course_code:"CSMATH1", course_name:"Discrete Mathematics", sections_planned:4, cap_per_section:45, forecast_enrollees:190, qualified_ft_count:3, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.1,  historical_fill_rate:0.96, program_area:"Math" },
  { course_id:"C013", course_code:"CSMATH2", course_name:"Probability & Statistics", sections_planned:4, cap_per_section:45, forecast_enrollees:185, qualified_ft_count:3, qualified_pt_pool:2, avg_sections_per_ft:1.0, leave_probability:0.14, historical_fill_rate:0.93, program_area:"Math" },
  { course_id:"C014", course_code:"THS-ST2", course_name:"Thesis Studio 2", sections_planned:2, cap_per_section:45, forecast_enrollees:85,  qualified_ft_count:1, qualified_pt_pool:1, avg_sections_per_ft:1.0, leave_probability:0.33, historical_fill_rate:0.82, program_area:"Capstone" },
  { course_id:"C015", course_code:"THS-ST3", course_name:"Thesis Studio 3", sections_planned:2, cap_per_section:45, forecast_enrollees:90,  qualified_ft_count:1, qualified_pt_pool:1, avg_sections_per_ft:1.0, leave_probability:0.36, historical_fill_rate:0.81, program_area:"Capstone" },
];

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const RISK_THRESHOLD = 0.45;

/** -----------------------------------------------------------
 * Enrichment & metrics
 * ----------------------------------------------------------- */
type Enriched = CourseRow & {
  reqSections: number;
  ftCapacity: number;
  ptCapacity: number;
  gap: number;     // sections short (>= 0)
  risk: number;    // 0..1
};

function computeRow(c: CourseRow): Enriched {
  const reqSections = Math.ceil(c.forecast_enrollees / c.cap_per_section);
  const effectiveFT = c.qualified_ft_count * (1 - clamp(c.leave_probability));
    const ftCapacity = effectiveFT * c.avg_sections_per_ft;
  const ptCapacity = c.qualified_pt_pool * 1;
  const gapRaw = reqSections - (ftCapacity + ptCapacity);
  const gap = Math.max(0, Math.round(gapRaw * 10) / 10);
  const base = Math.tanh(gapRaw);
  const difficulty = 1 - c.historical_fill_rate;
  const risk = clamp(0.6 * base + 0.4 * difficulty);
  return { ...c, reqSections, ftCapacity, ptCapacity, gap, risk };
}

/** -----------------------------------------------------------
 * CSV helpers
 * ----------------------------------------------------------- */
function toCsv(rows: Record<string, any>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))];
  return lines.join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** -----------------------------------------------------------
 * Chart (vanilla SVG like the mockup)
 * ----------------------------------------------------------- */
type ChartDatum = { label: string; value: number }; // value in 0..100
function renderBarChart(container: HTMLDivElement, data: ChartDatum[]) {
  container.innerHTML = "";
  const width = container.clientWidth || 900;
  const height = container.clientHeight || 360;
  const margin = { top: 10, right: 10, bottom: 80, left: 40 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const maxVal = Math.max(100, ...data.map((d) => d.value));
  const ticks = [0, 20, 40, 60, 80, 100];

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));

  const g = document.createElementNS(svgNS, "g");
  g.setAttribute("transform", `translate(${margin.left},${margin.top})`);
  svg.appendChild(g);

  // grid + y labels
  ticks.forEach((t) => {
    const y = h - (t / maxVal) * h;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", String(y));
    line.setAttribute("x2", String(w));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", "#e5e7eb");
    line.setAttribute("stroke-width", "1");
    g.appendChild(line);

    const txt = document.createElementNS(svgNS, "text");
    txt.setAttribute("x", "-8");
    txt.setAttribute("y", String(y + 4));
    txt.setAttribute("text-anchor", "end");
    txt.setAttribute("font-size", "10");
    txt.setAttribute("fill", "#6b7280");
    txt.textContent = String(t);
    g.appendChild(txt);
  });

  // band scale
  const n = data.length;
  const padding = 0.2;
  const band = w / n;
  const barWidth = band * (1 - padding);

  data.forEach((d, i) => {
    const x = i * band + (band - barWidth) / 2;
    const barHeight = (d.value / maxVal) * h;
    const y = h - barHeight;

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(barWidth));
    rect.setAttribute("height", String(barHeight));
    rect.setAttribute("fill", "#94b49f"); // updated bar color
    rect.setAttribute("rx", "6");
    rect.setAttribute("class", "bar");

    const title = document.createElementNS(svgNS, "title");
    title.textContent = `${d.label}: ${d.value}%`;
    rect.appendChild(title);

    g.appendChild(rect);

    const lbl = document.createElementNS(svgNS, "text");
    lbl.setAttribute("x", String(x + barWidth / 2));
    lbl.setAttribute("y", String(h + 12));
    lbl.setAttribute("transform", `rotate(-40 ${x + barWidth / 2} ${h + 12})`);
    lbl.setAttribute("text-anchor", "end");
    lbl.setAttribute("font-size", "10");
    lbl.setAttribute("fill", "#374151");
    lbl.textContent = d.label;
    g.appendChild(lbl);
  });

  const ytitle = document.createElementNS(svgNS, "text");
  ytitle.setAttribute("x", String(-h / 2));
  ytitle.setAttribute("y", "-28");
  ytitle.setAttribute("transform", `rotate(-90)`);
  ytitle.setAttribute("text-anchor", "middle");
  ytitle.setAttribute("font-size", "10");
  ytitle.setAttribute("fill", "#6b7280");
  ytitle.textContent = "Risk (%)";
  g.appendChild(ytitle);

  container.appendChild(svg);
}

/** -----------------------------------------------------------
 * Component
 * ----------------------------------------------------------- */
export default function OM_REPO_ANA_LoadRisk() {
  // activeTab: 'at' = At-Risk only, 'all' = All Courses
  const [activeTab, setActiveTab] = useState<"at" | "all">("at");
  const [seed, setSeed] = useState(0); // simple knob to force recompute on refresh
  const chartRef = useRef<HTMLDivElement>(null);

  // Optionally add tiny jitter on refresh to simulate new inputs
  const rows = useMemo(() => {
    const jitter = (v: number) => clamp(v + ((seed % 3) - 1) * 0.01); // -1%, 0, or +1%
    return MOCK.map((r) => ({ ...r, leave_probability: jitter(r.leave_probability) }));
  }, [seed]);

  const enriched = useMemo(() => rows.map(computeRow), [rows]);
  const atRisk = useMemo(() => enriched.filter((r) => r.risk >= RISK_THRESHOLD), [enriched]);

  const expectedGap = useMemo(
    () => Math.max(0, Math.round(atRisk.reduce((s, r) => s + r.gap, 0) * 10) / 10),
    [atRisk]
  );
  const fteNeed = useMemo(() => Math.max(0, Math.ceil(expectedGap / 4)), [expectedGap]);

  const chartData = useMemo<ChartDatum[]>(
    () => enriched.map((r) => ({ label: r.course_code, value: Math.round(r.risk * 100) })),
    [enriched]
  );

  // Render chart (and on resize)
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    renderBarChart(el, chartData);
    const onResize = () => renderBarChart(el, chartData);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [chartData]);

  const currentRows = activeTab === "at" ? atRisk : enriched;

  const handleRefresh = () => {
    // re-run with a different seed; keeps UX instant while simulating new computation
    setSeed((s) => s + 1);
  };

  const handleExportCsv = () => {
    const rowsForCsv = currentRows.map((r) => ({
      course_code: r.course_code,
      course_name: r.course_name,
      program_area: r.program_area,
      req_sections: r.reqSections,
      planned_sections: r.sections_planned,
      ft_capacity: Math.round(r.ftCapacity * 10) / 10,
      pt_capacity: Math.round(r.ptCapacity * 10) / 10,
      coverage_gap: r.gap,
      historical_fill_rate_pct: Math.round(r.historical_fill_rate * 100),
      leave_probability_pct: Math.round(r.leave_probability * 100),
      risk_pct: Math.round(r.risk * 100),
    }));
    const csv = toCsv(rowsForCsv);
    downloadCsv(
      `load-risk_${activeTab === "at" ? "at-risk" : "all"}_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
      csv
    );
  };

  return (
    <AppShell>
      <main className="w-full px-8 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Faculty Load Risk Forecast</h1>
        <p className="text-sm text-gray-600 mb-6">
          Risk indicators for over/under-loading by course and estimated section coverage needs.
        </p>

        

        {/* Filter Bar with Back (left) and controls (right) */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Back button on the left, like the screenshot */}
        <Link
            to="/om/reports-analytics"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 active:bg-gray-100"
        >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
        </Link>

        {/* Right-aligned controls */}
        <div className="ml-auto flex items-center gap-3">
            <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-emerald-500/30"
            title="Refresh"
            >
            <RotateCcw className="h-4 w-4" />
            <span>Refresh</span>
            </button>

            <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-emerald-500/30"
            title="Export CSV"
            >
            <FileDown className="h-4 w-4" />
            <span>Export CSV</span>
            </button>
        </div>
        </div>


        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <KpiCard
            title="Predicted At-Risk Courses"
            subtitle={`Risk ≥ ${Math.round(RISK_THRESHOLD * 100)}%`}
            value={atRisk.length}
          />
          <KpiCard
            title="Expected Section Deficit"
            subtitle="Total sections short across at-risk courses"
            value={expectedGap}
          />
          <KpiCard
            title="Estimated Part-Timer Need"
            subtitle="~1 FTE ≈ 4 sections"
            value={`${fteNeed} FTE`}
          />
        </div>

        {/* Chart */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Risk by Course</div>
              <div className="text-xs text-gray-500">
                Risk = coverage gap + difficulty (scaled)
              </div>
            </div>
            <div className="mt-4">
              <div ref={chartRef} className="w-full h-[360px]" />
            </div>
          </div>
        </div>

        {/* Tabs + Table */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 mt-6">
          <div className="border-b flex">
            <button
              className={cls(
                "w-1/2 p-3 text-sm font-semibold border-b-2",
                activeTab === "at"
                  ? "border-gray-900"
                  : "border-transparent text-gray-500"
              )}
              onClick={() => setActiveTab("at")}
            >
              At-Risk
            </button>
            <button
              className={cls(
                "w-1/2 p-3 text-sm font-semibold border-b-2",
                activeTab === "all"
                  ? "border-gray-900"
                  : "border-transparent text-gray-500"
              )}
              onClick={() => setActiveTab("all")}
            >
              All Courses
            </button>
          </div>

          <div className="p-0">
            <RiskTable rows={currentRows} />
          </div>
        </div>
      </main>
    </AppShell>
  );
}

/** -----------------------------------------------------------
 * Presentational bits
 * ----------------------------------------------------------- */
function KpiCard({ title, value, subtitle }: { title: string; value: React.ReactNode; subtitle: string }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-200">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{title}</span>
          <span aria-hidden>•</span>
        </div>
        <div className="text-3xl font-bold mt-3">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function RiskBadge({ v }: { v: number }) {
  let chips = "bg-gray-200 text-gray-800";
  if (v >= 0.7) chips = "bg-red-600 text-white";
  else if (v >= RISK_THRESHOLD) chips = "bg-blue-100 text-blue-700";
  return (
    <span className={cls("px-2 py-1 rounded-xl text-xs font-semibold", chips)}>
      {Math.round(v * 100)}%
    </span>
  );
}

function RiskTable({ rows }: { rows: Enriched[] }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-center">Prog Area</th>
            <th className="p-3 text-center">Sections (req/planned)</th>
            <th className="p-3 text-center">FT capacity</th>
            <th className="p-3 text-center">PT capacity</th>
            <th className="p-3 text-center">Hist. Fill</th>
            <th className="p-3 text-center">Leave Risk</th>
            <th className="p-3 text-center">Coverage Gap</th>
            <th className="p-3 text-center">Risk</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const action =
              r.gap > 0
                ? `${Math.ceil(r.gap)} PT section${Math.ceil(r.gap) === 1 ? "" : "s"}`
                : "OK";
            return (
              <tr key={r.course_id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-left">
                  {r.course_code}
                  <div className="text-xs text-gray-500">{r.course_name}</div>
                </td>
                <td className="p-3 text-center">{r.program_area}</td>
                <td className="p-3 text-center">
                  {r.reqSections}/{r.sections_planned}
                </td>
                <td className="p-3 text-center">{Math.round(r.ftCapacity * 10) / 10}</td>
                <td className="p-3 text-center">{Math.round(r.ptCapacity * 10) / 10}</td>
                <td className="p-3 text-center">{Math.round(r.historical_fill_rate * 100)}%</td>
                <td className="p-3 text-center">{Math.round(r.leave_probability * 100)}%</td>
                <td className="p-3 text-center">{r.gap}</td>
                <td className="p-3 text-center">
                  <RiskBadge v={r.risk} />
                </td>
                <td className="p-3 text-center">
                  {r.risk >= RISK_THRESHOLD ? (
                    <button
                      className={cls(
                        "px-3 py-1 rounded-xl text-xs inline-flex items-center justify-center",
                        r.gap > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-800"
                      )}
                    >
                      {action}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
