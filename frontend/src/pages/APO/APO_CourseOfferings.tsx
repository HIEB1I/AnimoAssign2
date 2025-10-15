import { useEffect, useState } from "react";
import { listCourseOfferings, createCourseOffering, deleteCourseOffering } from "../../api";

export default function APO_CourseOfferings() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ courseCode: "", title: "", section: "" });

  const load = async () => setRows(await listCourseOfferings());
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.courseCode || !form.title || !form.section) return;
    await createCourseOffering(form as any);
    setForm({ courseCode: "", title: "", section: "" });
    await load();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">APO — Course Offerings</h1>
      <div className="flex gap-2">
        <input className="border px-2 py-1" placeholder="Course Code" value={form.courseCode} onChange={e=>setForm(v=>({...v, courseCode:e.target.value}))}/>
        <input className="border px-2 py-1" placeholder="Title" value={form.title} onChange={e=>setForm(v=>({...v, title:e.target.value}))}/>
        <input className="border px-2 py-1" placeholder="Section" value={form.section} onChange={e=>setForm(v=>({...v, section:e.target.value}))}/>
        <button className="border px-3" onClick={create}>Add</button>
      </div>
      <table className="w-full text-sm border">
        <thead><tr className="bg-gray-50"><th className="p-2 text-left">Course</th><th className="p-2">Title</th><th className="p-2">Section</th><th className="p-2">Actions</th></tr></thead>
        <tbody>
          {rows.map((r:any)=>(
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.courseCode}</td>
              <td className="p-2">{r.title}</td>
              <td className="p-2 text-center">{r.section}</td>
              <td className="p-2 text-center">
                <button className="border px-2 py-0.5" onClick={async()=>{ await deleteCourseOffering(r.id); await load(); }}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length===0 && <tr><td className="p-3 text-center text-gray-500" colSpan={4}>No offerings</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
