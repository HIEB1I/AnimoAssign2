// ADMIN DASHBOARD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// existing pages
import ADMIN_Screen from "./ADMIN_Screen";
import ADMIN_Inbox from "./ADMIN_Inbox";
import STUDENT_Screen from "./STUDENT_Screen";
import APO_PreEnlistment from "./APO_PreEnlistment";
import APO_CourseOfferings from "./APO_CourseOfferings";
import APO_RoomAllocation from "./APO_RoomAllocation";
import APO_Inbox from "./APO_Inbox";
import OA_Plantilla from "./OA_Plantilla";
import OA_Inbox from "./OA_Inbox";
import DEAN_Plantilla from "./DEAN_Plantilla";
import DEAN_ClassRetention from "./DEAN_ClassRetention";
import DEAN_Inbox from "./DEAN_Inbox";
import PROVOST_Plantilla from "./PROVOST_Plantilla";
import PROVOST_ClassRetention from "./PROVOST_ClassRetention";
import PROVOST_Inbox from "./PROVOST_Inbox";
import FAC_Overview from "./FAC_Overview";

// Office Manager screens (kept directly under src/)
import OM_LoadAssignment from "./OM_LoadAssignment";
import OM_FacultyManagement from "./OM_FacultyManagement";
import OM_CourseManagement from "./OM_CourseManagement";
import OM_ReportAnalytics from "./OM_ReportAnalytics";
import OM_FacultyForm from "./OM_FacultyForm";
import OM_StudentPetition from "./OM_StudentPetition";
import OM_ClassRetention from "./OM_ClassRetention";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect (kept as-is) */}
        <Route path="/" element={<Navigate to="/faculty/screen" replace />} /> // /load-assignment

        {/* Faculty routes */}
        <Route path="/faculty/overview" element={<FAC_Overview />} />
        <Route path="/faculty/history" element={<div className="p-6">History (placeholder)</div>} />
        <Route path="/faculty/preferences" element={<div className="p-6">Preferences (placeholder)</div>} />
        <Route path="/faculty/inbox" element={<div className="p-6">Faculty Inbox (placeholder)</div>} />

        {/* Admin routes */}
        <Route path="/admin/screen" element={<ADMIN_Screen />} />
        <Route path="/admin/inbox" element={<ADMIN_Inbox />} />

        {/* Student routes */}
        <Route path="/student/screen" element={<STUDENT_Screen />} />

        {/* APO routes */}
        <Route path="/apo/preenlistment" element={<APO_PreEnlistment />} />
        <Route path="/apo/courseofferings" element={<APO_CourseOfferings />} />
        <Route path="/apo/roomallocation" element={<APO_RoomAllocation />} />
        <Route path="/apo/inbox" element={<APO_Inbox />} />

        {/* Office Assistant routes */}
        <Route path="/officeassistant/plantilla" element={<OA_Plantilla />} />
        <Route path="/officeassistant/inbox" element={<OA_Inbox />} />

        {/* Dean routes */}
        <Route path="/dean/plantilla" element={<DEAN_Plantilla />} />
        <Route path="/dean/classretention" element={<DEAN_ClassRetention />} />
        <Route path="/dean/inbox" element={<DEAN_Inbox />} />

        {/* Provost routes */}
        <Route path="/provost/plantilla" element={<PROVOST_Plantilla />} />
        <Route path="/provost/classretention" element={<PROVOST_ClassRetention />} />
        <Route path="/provost/inbox" element={<PROVOST_Inbox />} />

        {/* Office Manager routes (new) */}
        <Route path="/load-assignment" element={<OM_LoadAssignment />} />
        <Route path="/faculty-management" element={<OM_FacultyManagement />} />
        <Route path="/course-management" element={<OM_CourseManagement />} />
        <Route path="/reports-analytics" element={<OM_ReportAnalytics />} />
        <Route path="/faculty-form" element={<OM_FacultyForm />} />
        <Route path="/student-petition" element={<OM_StudentPetition/>} />
        <Route path="/class-retention" element={<OM_ClassRetention />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/faculty/overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
