import React, { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  UserCircle, Bell, LogOut, Inbox, BookOpen, Users, 
  Building2, Eye, Pencil, ChevronDown, FlaskConical, MapPin, ArrowLeft
} from "lucide-react";

/* ---------------- Utilities ---------------- */
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");
const chipClass =
  "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700";

/* ---------------- Top Bar ---------------- */
function TopBar({ fullName, role }: { fullName: string; role: string }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = () => { localStorage.removeItem("authToken"); sessionStorage.clear(); navigate("/login"); };
  return (
    <header className="sticky top-0 z-[80]">
      <div className="w-full border-b border-emerald-900/30 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-4 text-white">
          <div className="relative">
            <button onClick={() => setMenuOpen(o => !o)}
              className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/10">
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
                <button onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-[15px] hover:bg-neutral-50">
                  <LogOut className="h-4 w-4" /> <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/apo/inbox")}
              className="rounded-md p-2 hover:bg-white/15" title="Inbox">
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

/* ---------------- Sticky Tabs ---------------- */
function ApoTabs() {
  const items = [
    { to: "/apo/preenlistment", label: "Pre-Enlistment", icon: Users },
    { to: "/apo/courseofferings", label: "Course Offerings", icon: BookOpen },
    { to: "/apo/roomallocation", label: "Room Allocation", icon: Building2 }
  ];
  return (
    <div className="sticky top-[var(--header-h,58px)] z-50 w-full bg-gray-100/80 backdrop-blur">
      <div className="mx-auto w-full px-4 py-3">
        <div className="rounded-xl bg-gray-200 px-3 py-2 shadow-sm">
          <div className="grid grid-cols-3 gap-2">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  cls(
                    "mx-auto inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    isActive ? "bg-white text-emerald-700 shadow" : "text-gray-800 hover:bg-white/60"
                  )
                }>
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SelectBox ---------------- */
function SelectBox({
  value, onChange, options, placeholder = "— Select —", className = "", disabled = false
}: {
  value: string; onChange: (v: string) => void; options: string[];
  placeholder?: string; className?: string; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number>(() => Math.max(0, options.findIndex(o => o === value)));
  const btnRef = useRef<HTMLButtonElement>(null); const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => open && !btnRef.current?.contains(e.target as Node)
      && !listRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <div className={cls("relative min-w-[180px]", className)}>
      <button ref={btnRef} type="button"
        onClick={() => !disabled && setOpen(v => !v)} disabled={disabled}
        className={cls(
          "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-left text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30",
          disabled && "cursor-not-allowed opacity-60"
        )}>
        {value || <span className="text-gray-400">{placeholder}</span>}
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
      </button>
      {open && (
        <div ref={listRef}
          className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-300 bg-white shadow-xl">
          {options.map((opt, i) => (
            <button key={opt} onMouseEnter={() => setHover(i)}
              onClick={() => { onChange(opt); setOpen(false); btnRef.current?.focus(); }}
              className={cls(
                "block w-full px-4 py-2 text-left text-sm",
                i === hover && "bg-emerald-50",
                value === opt && "bg-emerald-100 text-emerald-800 font-medium"
              )}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- MultiSelect ---------------- */
function MultiSelect({
  label, options, value, onChange, disabled = false
}: {
  label: string; options: string[]; value: string[];
  onChange: (vals: string[]) => void; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null); const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => open && !btnRef.current?.contains(e.target as Node)
      && !listRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const toggle = (opt: string) => value.includes(opt)
    ? onChange(value.filter(v => v !== opt))
    : onChange([...value, opt]);
  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <button ref={btnRef} type="button" onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
          className={cls(
            "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30",
            disabled && "cursor-not-allowed opacity-60"
          )}>
          <span className={value.length ? "" : "text-gray-400"}>
            {value.length ? `${value.length} selected` : "— Select option —"}
          </span>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
        </button>
        {open && !disabled && (
          <div ref={listRef}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-300 bg-white p-1 shadow-xl">
            {options.map(opt => {
              const checked = value.includes(opt);
              return (
                <label key={opt}
                  className={cls(
                    "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    checked ? "bg-emerald-50" : "hover:bg-neutral-50"
                  )}>
                  <input type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    checked={checked} onChange={() => toggle(opt)} />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map(v => <span key={v} className={chipClass}>{v}</span>)}
        </div>
      )}
    </div>
  );
}

/* ---------------- Types & Seed Data ---------------- */
type Room = {
  code: string; building: string; campus: string;
  status: "Available" | "Full Slots"; capacity: number;
  type: "Lab" | "Classroom"; timeSlots?: string[];
};
const initialRooms: Room[] = [
  { 
    code: "GK301", building: "Gokongwei Hall", campus: "Manila Campus", 
    status: "Available", capacity: 22, type: "Lab",
    timeSlots: ["07:30 – 09:00", "12:45 – 14:15", "14:30 – 16:00"] 
  },
  { 
    code: "GK302A", building: "Gokongwei Hall", campus: "Manila Campus", 
    status: "Full Slots", capacity: 22, type: "Lab",
    timeSlots: ["09:15 – 10:45"] 
  },
  { 
    code: "GK302B", building: "Gokongwei Hall", campus: "Manila Campus", 
    status: "Available", capacity: 22, type: "Lab", 
    timeSlots: [] 
  }
];

const TIME_SLOTS = [
  "07:30 – 09:00",
  "09:15 – 10:45",
  "11:00 – 12:30",
  "12:45 – 14:15",
  "14:30 – 16:00",
  "16:15 – 17:45",
  "18:00 – 19:30"
];


/* ---------------- Add Room Modal ---------------- */
function AddRoomModal({ onSave, onCancel }: { onSave: (room: Room) => void; onCancel: () => void; }) {
  const [campus, setCampus] = useState(""), [building, setBuilding] = useState(""),
        [code, setCode] = useState(""), [capacity, setCapacity] = useState(""),
        [type, setType] = useState<Room["type"] | "">(""), [timeSlots, setTimeSlots] = useState<string[]>([]);
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-semibold text-emerald-700">Add Room</h3>
        <div className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium">Campus</label>
            <SelectBox value={campus} onChange={setCampus} options={["Manila Campus", "Laguna Campus"]}
              placeholder="-- Select an option --" />
          </div>
          <div><label className="mb-1 block text-sm font-medium">Building</label>
            <SelectBox value={building} onChange={setBuilding}
              options={["Gokongwei Hall", "St. La Salle Hall", "Br. Andrew Gonzales Hall"]}
              placeholder="-- Select an option --" />
          </div>
          <div><label className="mb-1 block text-sm font-medium">Room Number</label>
            <input value={code} onChange={e => setCode(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Capacity</label>
              <input type="number" min={1} value={capacity} onChange={e => setCapacity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500/30" />
            </div>
            <div><label className="mb-1 block text-sm font-medium">Room Type</label>
              <SelectBox value={type} onChange={v => setType(v as Room["type"])}
                options={["Classroom", "Lab"]} placeholder="-- Select an option --" />
            </div>
          </div>
          <MultiSelect label="Time Slots" options={TIME_SLOTS} value={timeSlots} onChange={setTimeSlots} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel}
            className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200">Cancel</button>
          <button onClick={() => {
              if (!code || !campus || !building || !capacity || !type) return;
              onSave({ code, campus, building, capacity: Number(capacity), status: "Available", type, timeSlots });
            }}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110">Add</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Edit Room Modal ---------------- */
function EditRoomModal({
  room, onSave, onCancel, onRemove
}: { room: Room; onSave: (r: Room) => void; onCancel: () => void; onRemove: (code: string) => void; }) {
  const [timeSlots, setTimeSlots] = useState<string[]>(room.timeSlots || []);
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-semibold text-emerald-700">Edit Room</h3>
        <div className="space-y-4 text-sm">
          <div><div className="font-semibold">Campus</div><div>{room.campus}</div></div>
          <div><div className="font-semibold">Building</div><div>{room.building}</div></div>
          <div><div className="font-semibold">Room Number</div><div>{room.code}</div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><div className="font-semibold">Capacity</div><div>{room.capacity}</div></div>
            <div><div className="font-semibold">Room Type</div><div>{room.type}</div></div>
          </div>
          <MultiSelect label="Time Slots" options={TIME_SLOTS} value={timeSlots} onChange={setTimeSlots} />
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={() => onRemove(room.code)}
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">Remove Room</button>
          <div className="flex gap-2">
            <button onClick={onCancel}
              className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-sm hover:bg-neutral-200">Cancel</button>
            <button onClick={() => onSave({ ...room, timeSlots })}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:brightness-110">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Room Schedule ---------------- */
function RoomSchedule({ room, onBack }: { room: Room; onBack: () => void }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Room Allocation</h2>
        <p className="mb-4 text-sm text-gray-500">Manage room assignments and course scheduling for CCS</p>
        <div className="mb-4 flex items-center gap-2">
        <button onClick={onBack}     
            className="flex items-center gap-2 text-emerald-700 hover:underline">
            <ArrowLeft className="h-5 w-5" /> 
            <span className="text-lg font-semibold">Back</span>
        </button></div>
      <h2 className="text-lg font-bold mb-1">{room.code} Schedule</h2>
        <p className="mb-4 text-sm text-gray-500 flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-emerald-700" /> {room.campus}
        </span>
        <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4 text-emerald-700" /> {room.building}
        </span>
        <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-emerald-700" /> {room.capacity} students
        </span>
        </p>
      <div className="overflow-x-auto">
        <div className="min-w-[860px] rounded-xl border border-neutral-300">
          <div className="grid grid-cols-[140px_repeat(6,1fr)] bg-emerald-800 text-white">
            <div className="flex items-center justify-center px-3 py-2 text-sm font-semibold">Time</div>
            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((d) => (
              <div key={d} className="flex items-center justify-center px-3 py-2 text-sm font-semibold">{d}</div>
            ))}
          </div>
          <div className="relative grid grid-cols-[140px_repeat(6,1fr)]" style={{ gridAutoRows: "84px" }}>
            {TIME_SLOTS.map((band, r) => (
              <React.Fragment key={band}>
                <div className="flex items-center justify-center border-r border-neutral-300 bg-neutral-50 px-2 text-center text-[13px]"
                  style={{ gridColumn: 1, gridRow: r + 1 }}>{band}</div>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((_, c) => (
                  <div key={`${c}-${r}`} className="border border-neutral-300"
                    style={{ gridColumn: c + 2, gridRow: r + 1 }} />
                ))}
              </React.Fragment>
            ))}
            {room.timeSlots?.map((slot, idx) => (
              <div key={idx} className="p-2"
                style={{ gridColumn: 4, gridRow: `${TIME_SLOTS.indexOf(slot) + 1}` }}>
                <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/90 p-2 text-xs font-medium shadow-sm">
                  <div className="font-semibold">{room.code}</div>
                  <div>{slot}</div>
                  <div>{room.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Room Card ---------------- */
function RoomCard({ room, onEdit, onView }: { room: Room; onEdit: (r: Room) => void; onView: (r: Room) => void; }) {
  const typeIcon = room.type === "Lab"
    ? <FlaskConical className="h-4 w-4 text-emerald-700" />
    : <Building2 className="h-4 w-4 text-emerald-700" />;
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <h3 className="font-bold">{room.code}</h3>
      <p className="text-sm text-gray-600">{room.building} | {room.campus}</p>
      <p className={cls("mt-1 font-medium", room.status === "Available" ? "text-green-600" : "text-red-600")}>
        {room.status}
      </p>
      <div className="mt-2 flex items-center gap-4 text-sm text-gray-700">
        <span className="flex items-center gap-1"><Users className="h-4 w-4 text-emerald-700" />{room.capacity}</span>
        <span className="flex items-center gap-1">{typeIcon}{room.type}</span>
      </div>
      {room.timeSlots && room.timeSlots.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {room.timeSlots.map(t =>
            <span key={t} className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{t}</span>
          )}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <button onClick={() => onView(room)}
          className="flex items-center gap-1 rounded border px-3 py-1 text-sm hover:bg-gray-100">
          <Eye className="h-4 w-4" /> View Schedule
        </button>
        <button onClick={() => onEdit(room)}
          className="flex items-center gap-1 rounded border px-3 py-1 text-sm hover:bg-gray-100">
          <Pencil className="h-4 w-4" /> Edit
        </button>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function RoomAllocationScreen() {
  const [campus, setCampus] = useState("All Campuses"),
        [building, setBuilding] = useState("All Buildings"),
        [rooms, setRooms] = useState<Room[]>(initialRooms),
        [showAdd, setShowAdd] = useState(false),
        [editing, setEditing] = useState<Room | null>(null),
        [viewingRoom, setViewingRoom] = useState<Room | null>(null);

  const filteredRooms = rooms.filter(r =>
    (campus === "All Campuses" || r.campus === campus) &&
    (building === "All Buildings" || r.building === building)
  );

  const addRoom = (room: Room) => { setRooms(p => [...p, room]); setShowAdd(false); };
  const saveEditedRoom = (u: Room) => { setRooms(p => p.map(r => r.code === u.code ? u : r)); setEditing(null); };
  const removeRoom = (code: string) => { setRooms(p => p.filter(r => r.code !== code)); setEditing(null); };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-slate-900">
      <TopBar fullName="Hazel Ventura" role="Academic Programming Officer" />
      <ApoTabs />
      <main className="p-6 w-full">
        {!viewingRoom ? (
          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Room Allocation</h2>
            <p className="mb-4 text-sm text-gray-500">Manage room assignments and course scheduling for CCS</p>
            <div className="mb-6 flex flex-wrap gap-3">
              <SelectBox value={campus} onChange={setCampus}
                options={["All Campuses", "Manila Campus", "Laguna Campus"]} />
              <SelectBox value={building} onChange={setBuilding}
                options={["All Buildings", "Gokongwei Hall", "St. La Salle Hall", "Br. Andrew Gonzales Hall"]} />
              <button onClick={() => setShowAdd(true)}
                className="ml-auto rounded bg-emerald-700 px-4 py-2 text-sm text-white hover:brightness-110">+ Add Room</button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map(r => (
                <RoomCard
                  key={r.code}
                  room={r}
                  onEdit={setEditing}
                  onView={setViewingRoom}
                />
              ))}
            </div>
          </div>
        ) : (
          <RoomSchedule room={viewingRoom} onBack={() => setViewingRoom(null)} />
        )}
      </main>

      {showAdd && <AddRoomModal onSave={addRoom} onCancel={() => setShowAdd(false)} />}
      {editing && (
        <EditRoomModal
          room={editing}
          onSave={saveEditedRoom}
          onCancel={() => setEditing(null)}
          onRemove={removeRoom}
        />
      )}
    </div>
  );
}
