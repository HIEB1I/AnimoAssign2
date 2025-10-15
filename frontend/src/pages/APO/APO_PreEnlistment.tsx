import { useEffect, useState } from "react";
import { getEnlistedCourses, importEnlistedCoursesCSV, updateEnlistedCourseCount, getEnrollmentStats, importEnrollmentStatsCSV } from "../../api";

export default function APO_PreEnlistment() {
  const [enlisted, setEnlisted] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  const load = async () => {
    const [a,b] = await Promise.all([getEnlistedCourses(), getEnrollmentStats()]);
    setEnlisted(a); setStats(b);
  };
  useEffect(() => { load(); }, []);

  const importEnlisted = async (file: File) => { await importEnlistedCoursesCSV(file); await load(); };
  const importStats = async (file: File) => { await importEnrollmentStatsCSV(file); await load(); };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">APO — Pre-Enlistment</h1>

      <section className="space-y-2">
        <div className="font-semibold">Enlisted Courses</div>
        <input type="file" accept=".csv" onChange={e=>e.target.files && importEnlisted(e.target.files[0])}/>
        <table className="w-full text-sm border mt-2">
          <thead><tr className="bg-gray-50">
            <th className="p-2">No</th><th className="p-2">Course</th><th className="p-2">Count</th><th className="p-2">Actions</th></tr></thead>
          <tbody>
            {enlisted.map((r:any)=>(
              <tr key={r.no} className="border-t">
                <td className="p-2">{r.no}</td>
                <td className="p-2">{r.courseCode}</td>
                <td className="p-2">{r.count}</td>
                <td className="p-2">
                  <button className="border px-2 py-0.5" onClick={async()=>{ await updateEnlistedCourseCount(r.no, r.count+1); await load(); }}>+1</button>
                </td>
              </tr>
            ))}
            {enlisted.length===0 && <tr><td colSpan={4} className="p-3 text-center text-gray-500">No data</td></tr>}
          </tbody>
        </table>
      </section>

      <section className="space-y-2">
        <div className="font-semibold">Enrollment Stats</div>
        <input type="file" accept=".csv" onChange={e=>e.target.files && importStats(e.target.files[0])}/>
        <table className="w-full text-sm border mt-2">
          <thead><tr className="bg-gray-50"><th className="p-2">Program</th><th className="p-2">Fresh</th><th className="p-2">Soph</th><th className="p-2">Junior</th><th className="p-2">Senior</th></tr></thead>
          <tbody>
            {stats.map((s:any)=>(
              <tr key={s.program} className="border-t">
                <td className="p-2">{s.program}</td>
                <td className="p-2">{s.freshman}</td>
                <td className="p-2">{s.sophomore}</td>
                <td className="p-2">{s.junior}</td>
                <td className="p-2">{s.senior}</td>
              </tr>
            ))}
            {stats.length===0 && <tr><td colSpan={5} className="p-3 text-center text-gray-500">No data</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
