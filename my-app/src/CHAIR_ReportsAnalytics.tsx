import AppShell from "./base/AppShell";
import { ListChecks, Users, BookOpen, BarChart3, FileText, FilePlus, BookMarked } from "lucide-react";

const chairItems = [
  { to: "/chair/plantilla", label: "Plantilla", Icon: ListChecks },
  { to: "/chair/faculty-management", label: "Faculty Management", Icon: Users },
  { to: "/chair/course-management", label: "Course Management", Icon: BookOpen },
  { to: "/chair/reports-analytics", label: "Reports and Analytics", Icon: BarChart3 },
  { to: "/chair/faculty-service", label: "Faculty Service", Icon: FileText },
  { to: "/chair/student-petition", label: "Student Petition", Icon: FilePlus },
  { to: "/chair/class-retention", label: "Class Retention", Icon: BookMarked },
];

export default function CHAIR_ReportsAnalytics() {
  return (
    <AppShell
      topbarProfileName="Neil Patrick DelGallego"
      topbarProfileSubtitle="Department Chair | Department of Software Technology"
      sidebarItems={chairItems}
    >
      <main className="w-full px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-gray-600">
            High-level trends and drill-downs for loads, class retention, petitions, and faculty utilization.
          </p>
        </header>

        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-500">
          Analytics modules will appear here.
        </div>
      </main>
    </AppShell>
  );
}
