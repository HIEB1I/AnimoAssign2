import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// Admin screens
import ADMIN_Screen from "./pages/ADMIN/ADMIN_Screen";
import ADMIN_Inbox from "./pages/ADMIN/ADMIN_Inbox";

// Student screens
import STUDENT_Screen from "./pages/STUDENT/STUDENT_Screen";

// APO screens
import APO_PreEnlistment from "./pages/APO/APO_PreEnlistment";
import APO_CourseOfferings from "./pages/APO/APO_CourseOfferings";
import APO_RoomAllocation from "./pages/APO/APO_RoomAllocation";
import APO_Inbox from "./pages/APO/APO_Inbox";

// Office Assistant screens
import OA_Plantilla from "./OA_Plantilla";
import OA_Inbox from "./OA_Inbox";

// Dean screens
import DEAN_Plantilla from "./DEAN_Plantilla";
import DEAN_ClassRetention from "./DEAN_ClassRetention";
import DEAN_Inbox from "./DEAN_Inbox";

// Provost screens
import PROVOST_Plantilla from "./PROVOST_Plantilla";
import PROVOST_ClassRetention from "./PROVOST_ClassRetention";
import PROVOST_Inbox from "./PROVOST_Inbox";

// Faculty screens
import FAC_Overview from "./pages/FACULTY/FAC_Overview";
import FAC_Inbox from "./pages/FACULTY/FAC_Inbox";

// Office Manager screens
import OM_LoadAssignment from "./pages/OM/OM_LoadAssignment";
import OM_FacultyManagement from "./pages/OM/OM_FacultyManagement";
import OM_CourseManagement from "./pages/OM/OM_CourseManagement";
import OM_ReportAnalytics from "./pages/OM/OM_ReportAnalytics";
import OM_FacultyForm from "./pages/OM/OM_FacultyForm";
import OM_StudentPetition from "./pages/OM/OM_StudentPetition";
import OM_ClassRetention from "./pages/OM/OM_ClassRetention";
import OM_Inbox from "./pages/OM/OM_Inbox";

// Chair screens
import CHAIR_Plantilla from "./pages/CHAIR/CHAIR_Plantilla";
import CHAIR_ClassRetention from "./pages/CHAIR/CHAIR_ClassRetention"; 
import CHAIR_CourseManagement from "./pages/CHAIR/CHAIR_CourseManagement";
import CHAIR_FacultyManagement from "./pages/CHAIR/CHAIR_FacultyManagement";
import CHAIR_ReportsAnalytics from "./pages/CHAIR/CHAIR_ReportsAnalytics";
import CHAIR_StudentPetition from "./pages/CHAIR/CHAIR_StudentPetition";
import CHAIR_FacultyService from "./pages/CHAIR/CHAIR_FacultyService"; 
import CHAIR_Inbox from "./pages/CHAIR/CHAIR_Inbox";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect — now goes to Faculty Overview */}
        <Route path="/" element={<Navigate to="/chair/plantilla" replace />} />

        {/* Chair routes */}
        <Route path="/chair/plantilla" element={<CHAIR_Plantilla />} />
        <Route path="/chair/class-retention" element={<CHAIR_ClassRetention />} />
        <Route path="/chair/course-management" element={<CHAIR_CourseManagement />} />
        <Route path="/chair/faculty-management" element={<CHAIR_FacultyManagement />} />
        <Route path="/chair/faculty-service" element={<CHAIR_FacultyService />} /> 
        <Route path="/chair/reports-analytics" element={<CHAIR_ReportsAnalytics />} />
        <Route path="/chair/student-petition" element={<CHAIR_StudentPetition />} />
        <Route path="/chair/inbox" element={<CHAIR_Inbox />} /> 

        {/* Faculty routes */}
        <Route path="/faculty/overview" element={<FAC_Overview />} />
        <Route path="/faculty/history" element={<div className="p-6">History (placeholder)</div>} />
        <Route path="/faculty/preferences" element={<div className="p-6">Preferences (placeholder)</div>} />
        <Route path="/faculty/inbox" element={<FAC_Inbox />} />

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

        {/* Office Manager routes */}
        <Route path="/load-assignment" element={<OM_LoadAssignment />} />
        <Route path="/faculty-management" element={<OM_FacultyManagement />} />
        <Route path="/course-management" element={<OM_CourseManagement />} />
        <Route path="/reports-analytics" element={<OM_ReportAnalytics />} />
        <Route path="/faculty-form" element={<OM_FacultyForm />} />
        <Route path="/student-petition" element={<OM_StudentPetition />} />
        <Route path="/class-retention" element={<OM_ClassRetention />} />
        <Route path="/om/inbox" element={<OM_Inbox />} /> 

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/chair/plantilla" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
