import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Inbox,
  UserCircle,
  LogOut,
  Calendar,
  Clock,
  MapPin,
  Users2,
  Monitor,
  Check,
  LineChart,
  Clock3,
  Settings,
  MessageSquareText,
} from "lucide-react";

/* ---------- small utils ---------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");

const Tag = ({
  children,
  tone = "emerald",
}: {
  children: React.ReactNode;
  tone?: "emerald" | "amber" | "blue" | "gray";
}) => {
  const map = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  } as const;
  return (
    <span
      className={cls(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        map[tone]
      )}
    >
      {children}
    </span>
  );
};

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
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
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
    <header className="sticky top-0 z-40">
      <div className="w-full border-b border-emerald-900/30 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-4 text-white">
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

        {/* thin separator like screenshot */}
        <div className="h-[2px] w-full bg-neutral-200/80" />
      </div>

      {/* account popup */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute left-5 top-16 z-50 w-56 rounded-2xl border border-neutral-200 bg-white shadow-xl"
        >
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
    </header>
  );
}

/* ---------- sticky top buttons (tabs) ---------- */
function StickyTopNav() {
  const navigate = useNavigate();

  const Btn = ({
    label,
    active,
    to,
    icon: Icon,
  }: {
    label: string;
    active?: boolean;
    to: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={() => navigate(to)}
      className={cls(
        "mx-auto inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        active ? "bg-white text-emerald-700 shadow" : "text-gray-800 hover:bg-white/60"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="sticky top-[58px] z-40 w-full bg-gray-100/80 backdrop-blur">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-3">
        {/* pill container */}
        <div className="rounded-xl bg-gray-200 px-3 py-2 shadow-sm">
          {/* 3 equal columns -> evenly spaced buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Btn label="Overview"   active to="/faculty/overview"   icon={LineChart} />
            <Btn label="History"         to="/faculty/history"      icon={Clock3} />
            <Btn label="Preferences"     to="/faculty/preferences"  icon={Settings} />
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------- stat cards (placeholders) ---------- */
function StatCards() {
  const Card = ({
    title,
    value,
    subtitleLeft,
    subtitleRight,
    progress = 100,
  }: {
    title: string;
    value: string;
    subtitleLeft: string;
    subtitleRight: string;
    progress?: number;
  }) => (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
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
  );

  return (
    <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-3 px-4 sm:grid-cols-3">
      <Card
        title="Teaching Units"
        value="15/18"
        subtitleLeft="Current Load"
        subtitleRight="83%"
        progress={83}
      />
      <Card
        title="Different Courses"
        value="3/3"
        subtitleLeft="Course Preps"
        subtitleRight="100%"
        progress={100}
      />
      <Card
        title="Load Status"
        value="Confirmed"
        subtitleLeft="Load Status"
        subtitleRight="100%"
        progress={100}
      />
    </div>
  );
}


/* ---------- teaching load list (placeholders) ---------- */
type TL = {
  day: string;
  items: {
    code: string;
    sec: string;
    mode: "Hybrid" | "Online" | "Onsite";
    status: "Confirmed" | "Pending";
    title: string;
    time: string;
    campus: string;
    room: string | "Online";
    students: number;
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

function TeachingLoad() {
  const [tab, setTab] = useState<"List" | "Calendar">("List");

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Teaching Load Summary</h3>
            <p className="text-sm text-neutral-500">Term 1 AY 2025-2026</p>
          </div>
          <div className="inline-flex gap-2">
            <button
              onClick={() => setTab("List")}
              className={cls(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                tab === "List"
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              )}
            >
              List
            </button>
            <button
              onClick={() => setTab("Calendar")}
              className={cls(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                tab === "Calendar"
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              )}
            >
              Calendar
            </button>
          </div>
        </div>

        {tab === "Calendar" ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-neutral-200 p-16 text-sm text-neutral-500">
            Calendar view placeholder
          </div>
        ) : (
          <div className="space-y-6">
            {SAMPLE.map((day) => (
              <div key={day.day}>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <Calendar className="h-4 w-4" /> {day.day}
                </div>

                <div className="space-y-3">
                  {day.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{it.code}</span>
                            <Tag tone="gray">S{it.sec}</Tag>
                            <Tag
                              tone={
                                it.mode === "Hybrid"
                                  ? "amber"
                                  : it.mode === "Online"
                                  ? "blue"
                                  : "gray"
                              }
                            >
                              {it.mode}
                            </Tag>
                            <Tag tone="emerald">
                              <Check className="h-3 w-3" />
                              {it.status}
                            </Tag>
                          </div>
                          <div className="mt-1 text-sm text-neutral-700">{it.title}</div>
                        </div>
                        <div className="text-sm text-neutral-600">{it.units} units</div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral-600 sm:grid-cols-5">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {it.time}
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
                          <Users2 className="h-4 w-4" />
                          {it.students} students
                        </div>

                        {/* comment icon button (replaces "View details") */}
                        <div className="flex items-center justify-end">
                          <button
                            title="Comments"
                            className="grid h-10 w-10 place-items-center rounded-full bg-emerald-700 text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:brightness-110 active:scale-95"
                            onClick={() => console.log("open comments for", it.code, it.sec)}
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
    </section>
  );
}

/* ---------- page ---------- */
export default function FAC_Overview() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <FacultyTopBar
        fullName="Rafael Cabredo"
        role="Faculty"
        department="Department of Software Technology"
      />

      <StickyTopNav />

      <div className="my-4" />
      <StatCards />
      <div className="my-6" />
      <TeachingLoad />
      <div className="h-10" />
    </div>
  );
}

