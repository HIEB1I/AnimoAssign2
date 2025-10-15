import { useEffect, useState } from "react";
import { listRooms, addRoom, updateRoom, allocateSection, removeAllocation } from "../../api";

export default function APO_RoomAllocation() {
  const [rooms, setRooms] = useState<any[]>([]);
  const load = async () => setRooms(await listRooms());
  useEffect(() => { load(); }, []);

  const add = async () => {
    await addRoom({ code: "G301", building: "Gokongwei", campus: "Taft", status: "Available", capacity: 40, type: "Classroom", schedule: [] } as any);
    await load();
  };

  const alloc = async (code: string) => { await allocateSection(code, "Mon", "08:00-09:30", "CCPROG1-S16"); await load(); };
  const dealloc = async (code: string) => { await removeAllocation(code, "Mon", "08:00-09:30"); await load(); };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">APO — Room Allocation</h1>
      <button className="border px-3 py-1" onClick={add}>Add Sample Room</button>
      <ul className="space-y-2">
        {rooms.map((r:any)=>(
          <li key={r.code} className="border p-3 bg-white">
            <div className="font-semibold">{r.code} — {r.building} ({r.status})</div>
            <div className="text-sm text-gray-600">Capacity: {r.capacity}, Type: {r.type}</div>
            <div className="mt-2 flex gap-2">
              <button className="border px-2 py-0.5" onClick={()=>alloc(r.code)}>Allocate Mon 08:00</button>
              <button className="border px-2 py-0.5" onClick={()=>dealloc(r.code)}>Remove Allocation</button>
              <button className="border px-2 py-0.5" onClick={async()=>{ await updateRoom(r.code, { status: r.status==="Available"?"Full Slots":"Available" }); await load(); }}>
                Toggle Status
              </button>
            </div>
            <div className="mt-2 text-sm">Schedule: {(r.schedule||[]).map((s:any)=>`${s.day} ${s.slot} ${s.sectionCode}`).join(", ") || "—"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
