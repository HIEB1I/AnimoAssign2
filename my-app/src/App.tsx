import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// pages
import ADMIN_Screen from "./ADMIN_Screen";
import ADMIN_Inbox from "./ADMIN_Inbox";
import STUDENT_Screen from "./STUDENT_Screen";
import FAC_Overview from "./FAC_Overview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/faculty/overview" replace />} />

        {/* Faculty routes */}
        <Route path="/faculty/overview" element={<FAC_Overview />} />

        {/* Admin routes */}
        <Route path="/admin/screen" element={<ADMIN_Screen />} />
        <Route path="/admin/inbox" element={<ADMIN_Inbox />} />

        {/* Student routes */}
        <Route path="/student/screen" element={<STUDENT_Screen />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Catch-all redirect (send unknown paths to faculty overview) */}
        <Route path="*" element={<Navigate to="/faculty/overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
