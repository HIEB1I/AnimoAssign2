// ADMIN DASHBOARD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// pages
import ADMIN_Screen from "./ADMIN_Screen";
import ADMIN_Inbox from "./ADMIN_Inbox";
import STUDENT_Screen from "./STUDENT_Screen";
import APO_PreEnlistment from "./APO_PreEnlistment";
import APO_CourseOfferings from "./APO_CourseOfferings";
import APO_RoomAllocation from "./APO_RoomAllocation";
import OA_Screen from "./OA_Screen";
import DEAN_Screen from "./DEAN_Screen";
import PROVOST_Screen from "./PROVOST_Screen";

import FAC_Overview from "./FAC_Overview"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/apo/courseofferings" replace />} />

        {/* Faculty routes */}
        <Route path="/faculty/overview" element={<FAC_Overview />} />

        {/* (Optional) stubs so the top buttons & inbox links work */}
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
        
        {/* Office Assistant routes */}
        <Route path="/officeassistant/screen" element={<OA_Screen />} />
        
        {/* Dean routes */}
        <Route path="/dean/screen" element={<DEAN_Screen />} />
        
        {/* Provost routes */}
        <Route path="/provost/screen" element={<PROVOST_Screen />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Catch-all redirect -> FAC_Overview */}
        <Route path="*" element={<Navigate to="/faculty/overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
