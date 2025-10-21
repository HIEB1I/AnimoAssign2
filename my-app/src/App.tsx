import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// ---------------- Admin ----------------
import ADMIN_Screen from "./pages/ADMIN/ADMIN_Screen";
import ADMIN_Inbox from "./pages/ADMIN/ADMIN_Inbox";

// ---------------- Student ----------------
import STUDENT_Screen from "./pages/STUDENT/STUDENT_Screen";

// ---------------- APO ----------------
import APO_PreEnlistment from "./pages/APO/APO_PreEnlistment";
import APO_CourseOfferings from "./pages/APO/APO_CourseOfferings";
import APO_RoomAllocation from "./pages/APO/APO_RoomAllocation";
import APO_Inbox from "./pages/APO/APO_Inbox";

// ---------------- Faculty ----------------
import FAC_Overview from "./pages/FACULTY/FAC_Overview";
import FAC_Inbox from "./pages/FACULTY/FAC_Inbox";

// ---------------- Office Manager ----------------
import OM_LoadAssignment from "./pages/OM/OM_LoadAssignment";
import OM_FacultyManagement from "./pages/OM/OM_FacultyManagement";
import OM_CourseManagement from "./pages/OM/OM_CourseManagement";
import OM_ReportAnalytics from "./pages/OM/OM_ReportAnalytics";
import OM_FacultyForm from "./pages/OM/OM_FacultyForm";
import OM_StudentPetition from "./pages/OM/OM_StudentPetition";
import OM_ClassRetention from "./pages/OM/OM_ClassRetention";
import OM_Inbox from "./pages/OM/OM_Inbox";

// Reports & Analytics subpages (new)
import OM_REPO_ANA_FacTeachingHistory from "./pages/OM/OM-REPO-ANA_FacTeachingHistory";
import OM_REPO_ANA_CourseHistory from "./pages/OM/OM-REPO-ANA_CourseHistory";
import OM_REPO_ANA_DeloadingUtilization from "./pages/OM/OM-REPO-ANA_DeloadingUtilization";
import OM_REPO_ANA_AvailabilityForecasting from "./pages/OM/OM-REPO-ANA_AvailabilityForecasting";
import OM_REPO_ANA_LoadRisk from "./pages/OM/OM-REPO-ANA_LoadRisk";

// ---------------- Chair ----------------
import CHAIR_Plantilla from "./pages/CHAIR/CHAIR_Plantilla";
import CHAIR_ClassRetention from "./pages/CHAIR/CHAIR_ClassRetention";
import CHAIR_CourseManagement from "./pages/CHAIR/CHAIR_CourseManagement";
import CHAIR_FacultyManagement from "./pages/CHAIR/CHAIR_FacultyManagement";
import CHAIR_ReportsAnalytics from "./pages/CHAIR/CHAIR_ReportsAnalytics";
import CHAIR_StudentPetition from "./pages/CHAIR/CHAIR_StudentPetition";
import CHAIR_FacultyService from "./pages/CHAIR/CHAIR_FacultyService";
import CHAIR_Inbox from "./pages/CHAIR/CHAIR_Inbox";

// If you later re-enable these, keep comments as line comments to avoid accidental bleed-through.
// // ---------------- Office Assistant ----------------
// // import OA_Plantilla from "./pages/OA/OA_Plantilla";
// // import OA_Inbox from "./pages/OA/OA_Inbox";

// // ---------------- Dean ----------------
// // import DEAN_Plantilla from "./pages/DEAN/DEAN_Plantilla";
// // import DEAN_ClassRetention from "./pages/DEAN/DEAN_ClassRetention";
// // import DEAN_Inbox from "./pages/DEAN/DEAN_Inbox";

// // ---------------- Provost ----------------
// // import PROVOST_Plantilla from "./pages/PROVOST/PROVOST_Plantilla";
// // import PROVOST_ClassRetention from "./pages/PROVOST/PROVOST_ClassRetention";
// // import PROVOST_Inbox from "./pages/PROVOST/PROVOST_Inbox";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default: land on CHAIR Plantilla */}
        <Route path="/" element={<Navigate to="/chair/plantilla" replace />} />

        {/* -------- Chair -------- */}
        <Route path="/chair/plantilla" element={<CHAIR_Plantilla />} />
        <Route path="/chair/class-retention" element={<CHAIR_ClassRetention />} />
        <Route path="/chair/course-management" element={<CHAIR_CourseManagement />} />
        <Route path="/chair/faculty-management" element={<CHAIR_FacultyManagement />} />
        <Route path="/chair/faculty-service" element={<CHAIR_FacultyService />} />
        <Route path="/chair/reports-analytics" element={<CHAIR_ReportsAnalytics />} />
        <Route path="/chair/student-petition" element={<CHAIR_StudentPetition />} />
        <Route path="/chair/inbox" element={<CHAIR_Inbox />} />

        {/* -------- Faculty -------- */}
        <Route path="/faculty/overview" element={<FAC_Overview />} />
        <Route path="/faculty/history" element={<div className="p-6">History (placeholder)</div>} />
        <Route path="/faculty/preferences" element={<div className="p-6">Preferences (placeholder)</div>} />
        <Route path="/faculty/inbox" element={<FAC_Inbox />} />

        {/* -------- Admin -------- */}
        <Route path="/admin/screen" element={<ADMIN_Screen />} />
        <Route path="/admin/inbox" element={<ADMIN_Inbox />} />

        {/* -------- Student -------- */}
        <Route path="/student/screen" element={<STUDENT_Screen />} />

        {/* -------- APO -------- */}
        <Route path="/apo/preenlistment" element={<APO_PreEnlistment />} />
        <Route path="/apo/courseofferings" element={<APO_CourseOfferings />} />
        <Route path="/apo/roomallocation" element={<APO_RoomAllocation />} />
        <Route path="/apo/inbox" element={<APO_Inbox />} />

        {/* -------- Office Manager -------- */}
        <Route path="/om/load-assignment" element={<OM_LoadAssignment />} />
        <Route path="/om/faculty-management" element={<OM_FacultyManagement />} />
        <Route path="/om/course-management" element={<OM_CourseManagement />} />
        <Route path="/om/reports-analytics" element={<OM_ReportAnalytics />} />
        <Route path="/om/faculty-form" element={<OM_FacultyForm />} />
        <Route path="/om/student-petition" element={<OM_StudentPetition />} />
        <Route path="/om/class-retention" element={<OM_ClassRetention />} />
        <Route path="/om/inbox" element={<OM_Inbox />} />

        {/* ---- OM Reports & Analytics subroutes ---- */}
        <Route path="/reports/teaching-history" element={<OM_REPO_ANA_FacTeachingHistory />} />
        <Route path="/reports/course-profile" element={<OM_REPO_ANA_CourseHistory />} />
        <Route path="/reports/deloading-utilization" element={<OM_REPO_ANA_DeloadingUtilization />} />
        <Route path="/reports/faculty-availability-forecast" element={<OM_REPO_ANA_AvailabilityForecasting />} />
        <Route path="/reports/faculty-load-risk" element={<OM_REPO_ANA_LoadRisk />} />

        {/* -------- Auth -------- */}
        <Route path="/login" element={<Login />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/om/load-assignment" replace />} />
      </Routes>
    </Router>
  );
}
