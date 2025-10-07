import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryMain from "./FAC_History";
import PreferencesContent from "./FAC_Preferences";
import {
  Send as SendIcon,
  Bell,
  Inbox,
  UserCircle,
  LogOut,
  Calendar as CalIcon,
  CalendarDays,
  Clock,
  MapPin,
  Monitor,
  Check,
  LineChart,
  Clock3,
  Settings,
  MessageSquareText,
  X,
  BookOpen, // for "units"
} from "lucide-react";

/* ---------- utils ---------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

const TAG_STYLES = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  gray: "bg-gray-50 text-gray-600 border-gray-200",
} as const;

const Tag = ({
  children,
  tone = "emerald",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TAG_STYLES;
}) => (
  <span
    className={cls(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
      TAG_STYLES[tone]
    )}
  >
    {children}
  </span>
);

/* ---------- top bar ---------- */
function FacultyTopBar({
  fullName,
  role,
  department,
}: {
  fullName: string;
  role: string;
  department: string;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setMenuOpen(false);
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
                <div className="text-[12px] opacity-90">
                  {role} | {department}
                </div>
              </span>
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full z-[90] mt-2 w-56 rounded-2xl border border-neutral-200 bg-white text-slate-800 shadow-2xl">
                <div className="px-4 pb-2 pt-3 text-[15px] font-semibold text-emerald-700">
                  My Account
                </div>
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
              onClick={() => navigate("/faculty/inbox")}
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

type MainTab = "Overview" | "History" | "Preferences";

/* ---------- sticky top tabs ---------- */
function StickyTopNav({
  active,
  onChange,
}: {
  active: MainTab;
  onChange: (t: MainTab) => void;
}) {
  const items: { label: MainTab; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: "Overview", icon: LineChart },
    { label: "History", icon: Clock3 },
    { label: "Preferences", icon: Settings },
  ];

  return (
    <div className="sticky top-[var(--header-h,58px)] z-50 w-full bg-gray-100/80 backdrop-blur">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-3">
        <div className="rounded-xl bg-gray-200 px-3 py-2 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {items.map(({ label, icon: Icon }) => {
              const isActive = active === label;
              return (
                <button
                  key={label}
                  onClick={() => onChange(label)}
                  className={cls(
                    "mx-auto inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    isActive ? "bg-white text-emerald-700 shadow" : "text-gray-800 hover:bg-white/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- stat cards ---------- */
function StatCards() {
  const cards = [
    { title: "Teaching Units", value: "15/18", subtitleLeft: "Current Load", subtitleRight: "83%", progress: 83 },
    { title: "Different Courses", value: "3/3", subtitleLeft: "Course Preps", subtitleRight: "100%", progress: 100 },
    { title: "Load Status", value: "Confirmed", subtitleLeft: "Load Status", subtitleRight: "100%", progress: 100 },
  ];
  return (
    <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-3 px-4 sm:grid-cols-3">
      {cards.map(({ title, value, subtitleLeft, subtitleRight, progress }) => (
        <div key={title} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <div className="text-[13px] text-neutral-700">{title}</div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-600">
            <span>{subtitleLeft}</span>
            <span>{subtitleRight}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-emerald-700"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- data ---------- */
type TL = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  items: {
    code: string;
    sec: string;
    mode: "Hybrid" | "Online" | "Onsite";
    status: "Confirmed" | "Pending";
    title: string;
    time: string;
    campus: string;
    room: string | "Online";
    students: number; // kept in type, not displayed anymore
    units: number;
  }[];
};

const SAMPLE: TL[] = [
  {
    day: "Monday",
    items: [
      {
        code: "CSMODEL",
        sec: "S12",
        mode: "Hybrid",
        status: "Confirmed",
        title: "Data Modeling and Database Design",
        time: "7:30–9:00 AM",
        campus: "Manila",
        room: "Online",
        students: 35,
        units: 3,
      },
      {
        code: "CSMODEL",
        sec: "S13",
        mode: "Hybrid",
        status: "Confirmed",
        title: "Data Modeling and Database Design",
        time: "9:15–10:45 AM",
        campus: "Manila",
        room: "Online",
        students: 35,
        units: 3,
      },
    ],
  },
  {
    day: "Thursday",
    items: [
      {
        code: "CSMODEL",
        sec: "S12",
        mode: "Hybrid",
        status: "Confirmed",
        title: "Data Modeling and Database Design",
        time: "7:30–9:00 AM",
        campus: "Manila",
        room: "GK210",
        students: 35,
        units: 3,
      },
      {
        code: "CSMODEL",
        sec: "S13",
        mode: "Hybrid",
        status: "Confirmed",
        title: "Data Modeling and Database Design",
        time: "9:15–10:45 AM",
        campus: "Manila",
        room: "GK211",
        students: 35,
        units: 3,
      },
    ],
  },
  {
    day: "Saturday",
    items: [
      {
        code: "CCPROG3",
        sec: "S12",
        mode: "Online",
        status: "Confirmed",
        title: "Object-Oriented Programming",
        time: "9:00 AM – 12:00 PM",
        campus: "Laguna",
        room: "Online",
        students: 22,
        units: 3,
      },
    ],
  },
];

/* ---------- generic dropdown ---------- */
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

  useEffect(() => setHover(Math.max(0, options.findIndex((o) => o === value))), [value, options]);
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
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-80 overflow-auto rounded-2xl border border-gray-300 bg-white shadow-lg"
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
              className={cls("block w-full text-left px-4 py-3 text-sm", i === hover && "bg-emerald-50")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- change request modal ---------- */
type ChangeKind = "Change class time" | "Change class day" | "Other";
const TIME_SLOTS = [
  "7:30 – 9:00 AM",
  "9:15 – 10:45 AM",
  "11:00 – 12:30 PM",
  "12:30 – 2:15 PM",
  "2:30 – 4:00 PM",
  "4:15 – 5:45 PM",
  "6:00 – 7:30 PM",
  "7:45 – 9:00 PM",
];
const ALL_DAYS: TL["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function ChangeRequestModal({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: { day: TL["day"]; item: TL["items"][number] } | null;
}) {
  const normTime = (s: string) => s.replace(/[\s\u2013-]/g, "").replace(/\./g, "").toLowerCase();
  const timeOptions = useMemo(
    () => (!context ? TIME_SLOTS : TIME_SLOTS.filter((t) => normTime(t) !== normTime(context.item.time))),
    [context]
  );
  const [choices, setChoices] = useState<ChangeKind[]>([]);
  const [selTime, setSelTime] = useState("");
  const [selDay, setSelDay] = useState<TL["day"] | "">("");
  const [remarks, setRemarks] = useState("");
  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    if (!open) {
      setChoices([]);
      setSelTime("");
      setSelDay("");
      setRemarks("");
      setOtherText("");
    }
  }, [open]);

  const toggle = (label: ChangeKind) =>
    setChoices((prev) => (prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]));

  const mustTime = choices.includes("Change class time");
  const mustDay = choices.includes("Change class day");

  // remarks & "Other" text are optional; only time/day enforce field choices
  const disabled = choices.length === 0 || (mustTime && !selTime) || (mustDay && !selDay);

  const dayOptions = useMemo(() => (!context ? ALL_DAYS : ALL_DAYS.filter((d) => d !== context.day)), [context]);
  if (!open || !context) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/30 p-3">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-emerald-700">Request for Change</h3>
            <p className="text-sm text-neutral-500">
              {context.item.code} {context.item.sec} • {context.day} • {context.item.time}
            </p>
          </div>
          <button
            className="rounded-full p-1 hover:bg-neutral-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-700">Change</label>
          <div className="flex flex-wrap gap-2">
            {(["Change class time", "Change class day", "Other"] as ChangeKind[]).map((opt) => (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={cls(
                  "rounded-lg border px-3 py-2 text-sm",
                  choices.includes(opt)
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-neutral-300 bg-white hover:bg-neutral-50"
                )}
              >
                {opt}
              </button>
            ))}
          </div>

          {mustTime && (
            <div className="mt-2">
              <label className="mb-1 block text-sm font-medium text-neutral-700">New time slot</label>
              <Dropdown value={selTime} onChange={setSelTime} options={timeOptions} placeholder="— Select a time —" />
            </div>
          )}

          {mustDay && (
            <div className="mt-2">
              <label className="mb-1 block text-sm font-medium text-neutral-700">New class day</label>
              <Dropdown
                value={selDay}
                onChange={(v) => setSelDay(v as TL["day"])}
                options={ALL_DAYS.filter((d) => !context || d !== context.day)}
                placeholder="— Select a day —"
              />
            </div>
          )}

          {choices.includes("Other") && (
            <div className="mt-2">
              <label className="mb-1 block text-sm font-medium text-neutral-700">Specify change</label>
              <input
                type="text"
                className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                placeholder="Type your custom change…"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
              />
            </div>
          )}

          {!!choices.length && (
            <div className="mt-2">
              <label className="mb-1 block text-sm font-medium text-neutral-700">Remarks</label>
              <textarea
                rows={4}
                className="w-full resize-y rounded-lg border border-neutral-300 p-2 text-sm"
                placeholder="Provide context for this request…"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-[12px] border border-neutral-200 bg-neutral-100 px-4 text-sm text-slate-900 shadow-sm hover:bg-neutral-200/70 active:translate-y-[0.5px]"
          >
            Cancel
          </button>
          <button
            disabled={disabled}
            onClick={() => {
              console.log("SUBMIT", {
                context,
                choices,
                newTime: selTime || null,
                newDay: selDay || null,
                otherReason: choices.includes("Other") ? otherText || null : null,
                remarks: remarks || null,
              });
              onClose();
            }}
            className={cls(
              "inline-flex h-9 items-center gap-2 rounded-[12px] px-4 text-sm text-white shadow",
              "bg-[#1F7A49] hover:brightness-[1.06] active:translate-y-[0.5px] focus:outline-none focus:ring-2 focus:ring-emerald-600/40",
              disabled && "opacity-60 cursor-not-allowed"
            )}
            aria-disabled={disabled}
          >
            <SendIcon className="h-4 w-4" strokeWidth={2.2} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- calendar helpers ---------- */
const TIME_BANDS = [
  "7:30 – 9:00",
  "9:15 – 10:45",
  "11:00 – 12:30",
  "12:30 – 14:15",
  "14:30 – 16:00",
  "16:15 – 17:45",
  "18:00 – 19:30",
  "19:45 – 21:00",
];
const DAY_ORDER: TL["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Placed = { day: TL["day"]; row: number; rowSpan: number; data: TL["items"][number] };

function placeItems(data: TL[]): Placed[] {
  const norm = (s: string) => s.replace(/\s+/g, " ").replace(/\u2013/g, "–").trim().toLowerCase();
  const findRowSpan = (time: string) => {
    const t = norm(time);
    const idx = TIME_BANDS.findIndex((b) => t.includes(b.toLowerCase()));
    if (idx >= 0) return { row: idx, span: 1 };
    if (/(^| )9:00( |\u00a0)?am( | – |-).*12:00( |\u00a0)?pm/.test(t)) return { row: 1, span: 2 };
    const anchors: Array<{ rx: RegExp; row: number }> = [
      { rx: /\b7:30\b/, row: 0 },
      { rx: /\b9:15|\b9:00\b/, row: 1 },
      { rx: /\b11:00\b/, row: 2 },
      { rx: /\b12:30\b/, row: 3 },
      { rx: /\b14:30|\b2:30\b/, row: 4 },
      { rx: /\b16:15|\b4:15\b/, row: 5 },
      { rx: /\b18:00|\b6:00\b/, row: 6 },
      { rx: /\b19:45|\b7:45\b/, row: 7 },
    ];
    const hit = anchors.find((a) => a.rx.test(t));
    return { row: hit?.row ?? 0, span: 1 };
  };
  const out: Placed[] = [];
  data.forEach((d) =>
    d.items.forEach((it) => {
      const { row, span } = findRowSpan(it.time);
      out.push({
        day: d.day,
        row,
        rowSpan: Math.min(TIME_BANDS.length - row, span),
        data: it,
      });
    })
  );
  return out;
}

const ClassBlock = ({ onClick, it }: { onClick?: () => void; it: TL["items"][number] }) => (
  <button
    onClick={onClick}
    className={cls(
      "flex w-full flex-col items-center justify-center rounded-xl border shadow-sm",
      "border-emerald-200 bg-emerald-50/90 hover:bg-emerald-50"
    )}
    title={`${it.code} • ${it.sec} | ${it.room} • ${it.mode}`}
  >
    <div className="text-[13px] font-extrabold tracking-wide">{it.code}</div>
    <div className="text-[12px]">
      {it.sec} | {it.room}
    </div>
    <div className="text-[12px]">{it.mode}</div>
  </button>
);

/* ---------- teaching load ---------- */
function TeachingLoad() {
  // Default to Calendar view
  const [tab, setTab] = useState<"List" | "Calendar">("Calendar");
  const [modal, setModal] = useState<{ day: TL["day"]; item: TL["items"][number] } | null>(null);
  const placed = useMemo(() => placeItems(SAMPLE), []);

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Teaching Load Summary</h3>
            <p className="text-sm text-neutral-500">Term 1 AY 2025-2026</p>
          </div>
          <div className="inline-flex gap-2">
            {/* Calendar first, then List */}
            {["Calendar", "List"].map((label) => {
              const active = tab === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTab(label as typeof tab)}
                  aria-pressed={active}
                  className={cls(
                    "inline-flex h-9 min-w-[120px] items-center justify-center rounded-lg px-4 text-sm font-medium",
                    active ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "Calendar" ? (
          <div className="overflow-x-auto">
            <div className="min-w-[860px] rounded-xl border border-neutral-300">
              <div className="grid grid-cols-[140px_repeat(6,1fr)] bg-emerald-800 text-white">
                <div className="flex items-center justify-center px-3 py-2 text-sm font-semibold">
                  Time
                </div>
                {DAY_ORDER.map((d) => (
                  <div key={d} className="flex items-center justify-center px-3 py-2 text-sm font-semibold">
                    {d}
                  </div>
                ))}
              </div>

              <div className="relative grid grid-cols-[140px_repeat(6,1fr)]" style={{ gridAutoRows: "84px" }}>
                {TIME_BANDS.map((band, r) => (
                  <React.Fragment key={band}>
                    <div
                      className="flex items-center justify-center border-r border-neutral-300 bg-neutral-50 px-2 text-center text-[13px]"
                      style={{ gridColumn: 1, gridRow: r + 1 }}
                    >
                      {band}
                    </div>
                    {DAY_ORDER.map((_, c) => (
                      <div
                        key={`${c}-${r}`}
                        className="border border-neutral-300"
                        style={{ gridColumn: c + 2, gridRow: r + 1 }}
                      />
                    ))}
                  </React.Fragment>
                ))}

                {placed.map((p, i) => (
                  <div
                    key={`blk-${i}`}
                    className="p-2"
                    style={{ gridColumn: DAY_ORDER.indexOf(p.day) + 2, gridRow: `${p.row + 1} / span ${p.rowSpan}` }}
                  >
                    <ClassBlock it={p.data} onClick={() => setModal({ day: p.day, item: p.data })} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {SAMPLE.map((day) => (
              <div key={day.day}>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <CalIcon className="h-4 w-4" /> {day.day}
                </div>
                <div className="space-y-3">
                  {day.items.map((it, idx) => (
                    <div key={idx} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{it.code}</span>
                            <Tag tone="gray">{it.sec}</Tag>
                            <Tag tone={it.mode === "Hybrid" ? "amber" : it.mode === "Online" ? "blue" : "gray"}>
                              {it.mode}
                            </Tag>
                            <Tag tone="emerald">
                              <Check className="h-3 w-3" />
                              {it.status}
                            </Tag>
                          </div>
                          <div className="mt-1 text-sm text-neutral-700">{it.title}</div>
                        </div>

                        {/* Top-right units removed as requested */}
                      </div>

                      <div className="mt-3 grid grid-cols-1 items-center gap-3 text-sm text-neutral-600 sm:grid-cols-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {it.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {day.day}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {it.campus}
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          {it.room}
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {it.units} units
                        </div>
                        <div className="flex justify-end">
                          <button
                            title="Request for change"
                            className="grid h-10 w-10 place-items-center rounded-full bg-emerald-700 text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:brightness-110 active:scale-95"
                            onClick={() => setModal({ day: day.day, item: it })}
                          >
                            <MessageSquareText className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChangeRequestModal open={!!modal} onClose={() => setModal(null)} context={modal} />
    </section>
  );
}

/* ---------- page ---------- */
export default function FAC_Overview() {
  const [tab, setTab] = useState<MainTab>("Overview");

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <FacultyTopBar
        fullName="Rafael Cabredo"
        role="Faculty"
        department="Department of Software Technology"
      />

      {/* Tabs now only change local content */}
      <StickyTopNav active={tab} onChange={setTab} />

      <div className="my-4" />

      {tab === "Overview" && (
        <>
          <StatCards />
          <div className="my-6" />
          <TeachingLoad />
        </>
      )}

      {tab === "History" && <HistoryMain />}

      {tab === "Preferences" && <PreferencesContent />}

      <div className="h-10" />
    </div>
  );
}
