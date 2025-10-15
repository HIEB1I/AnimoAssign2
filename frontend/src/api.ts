const BASE = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "/api";
const j = (a: string, b: string) => `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;
const okJson = async <T>(r: Response) =>
  r.ok ? ((await r.json()) as T) : Promise.reject(new Error((await r.text().catch(() => "")) || r.statusText));

// ---------- Types ----------
export type EnlistedCourse = { no: number; career: string; acadGroup: string; campus: string; courseCode: string; count: number; };
export type EnrollmentStat = { program: string; freshman: number; sophomore: number; junior: number; senior: number; };
export type CourseOffering = { id: string; courseCode: string; title: string; section: string; faculty?: string; units?: number; };
export type RoomSlot = { day: string; slot: string; sectionCode?: string };
export type Room = { code: string; building: string; campus: string; status: "Available" | "Full Slots"; capacity: number; type: "Lab" | "Classroom"; schedule: RoomSlot[]; };
export type Mail = { id: string; from: string; email: string; subject: string; preview: string; body: string; receivedAt: string };

// ---------- APO: Pre-Enlistment ----------
export const getEnlistedCourses = async () => okJson<EnlistedCourse[]>(await fetch(j(BASE, "/apo/enlisted-courses")));
export const importEnlistedCoursesCSV = async (file: File) => {
  const fd = new FormData(); fd.append("file", file);
  return okJson<{ imported: number }>(await fetch(j(BASE, "/apo/enlisted-courses/import"), { method: "POST", body: fd }));
};
export const updateEnlistedCourseCount = async (no: number, count: number) => {
  const r = await fetch(j(BASE, `/apo/enlisted-courses/${no}`), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ count }) });
  if (!r.ok) throw new Error("Update failed");
};
export const getEnrollmentStats = async () => okJson<EnrollmentStat[]>(await fetch(j(BASE, "/apo/enrollment-stats")));
export const importEnrollmentStatsCSV = async (file: File) => {
  const fd = new FormData(); fd.append("file", file);
  return okJson<{ imported: number }>(await fetch(j(BASE, "/apo/enrollment-stats/import"), { method: "POST", body: fd }));
};
export const updateEnrollmentStat = async (program: string, patch: Partial<EnrollmentStat>) => {
  const r = await fetch(j(BASE, `/apo/enrollment-stats/${encodeURIComponent(program)}`), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
  if (!r.ok) throw new Error("Update failed");
};

// ---------- APO: Course Offerings ----------
export const listCourseOfferings = async () => okJson<CourseOffering[]>(await fetch(j(BASE, "/apo/course-offerings")));
export const createCourseOffering = async (p: Omit<CourseOffering, "id">) =>
  okJson<CourseOffering>(await fetch(j(BASE, "/apo/course-offerings"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }));
export const updateCourseOffering = async (id: string, patch: Partial<CourseOffering>) =>
  okJson<CourseOffering>(await fetch(j(BASE, `/apo/course-offerings/${id}`), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }));
export const deleteCourseOffering = async (id: string) => {
  const r = await fetch(j(BASE, `/apo/course-offerings/${id}`), { method: "DELETE" });
  if (!r.ok) throw new Error("Delete failed");
};

// ---------- APO: Rooms ----------
export const listRooms = async () => okJson<Room[]>(await fetch(j(BASE, "/apo/rooms")));
export const addRoom = async (room: Room) =>
  okJson<Room>(await fetch(j(BASE, "/apo/rooms"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(room) }));
export const updateRoom = async (code: string, patch: Partial<Room>) =>
  okJson<Room>(await fetch(j(BASE, `/apo/rooms/${encodeURIComponent(code)}`), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }));
export const removeRoom = async (code: string) => {
  const r = await fetch(j(BASE, `/apo/rooms/${encodeURIComponent(code)}`), { method: "DELETE" });
  if (!r.ok) throw new Error("Remove failed");
};
export const allocateSection = async (code: string, day: string, slot: string, sectionCode: string) =>
  okJson<Room>(await fetch(j(BASE, `/apo/rooms/${encodeURIComponent(code)}/allocate`), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ day, slot, sectionCode }) }));
export const removeAllocation = async (code: string, day: string, slot: string) =>
  okJson<Room>(await fetch(j(BASE, `/apo/rooms/${encodeURIComponent(code)}/allocate`), { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ day, slot }) }));

// ---------- APO: Inbox ----------
export const listMessages = async () => okJson<Mail[]>(await fetch(j(BASE, "/apo/messages")));
export const sendMessage = async (p: { to: string; subject: string; body: string }) =>
  okJson<{ id: string }>(await fetch(j(BASE, "/apo/messages"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }));
