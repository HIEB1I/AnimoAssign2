//ADMIN DASHBOARD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// pages
import ADMIN_Screen from "./ADMIN_Screen";
import ADMIN_Inbox from "./ADMIN_Inbox";
import STUDENT_Screen from "./STUDENT_Screen";
import APO_PreEnlistment from "./APO_PreEnlistment";
import APO_CourseOfferings from "./APO_CourseOfferings";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/apo/screen" replace />} />

        {/* Admin routes */}
        <Route path="/admin/screen" element={<ADMIN_Screen />} />
        <Route path="/admin/inbox" element={<ADMIN_Inbox />} />

        {/* Student routes */}
        <Route path="/student/screen" element={<STUDENT_Screen />} />

        {/* APO routes */}
        <Route path="/apo/preenlistment" element={<APO_PreEnlistment />} />
        <Route path="/apo/courseofferings" element={<APO_CourseOfferings />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/admin/screen" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
