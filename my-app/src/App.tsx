//ADMIN DASHBOARD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";

// pages
import ADMIN_Screen from "./ADMIN_Screen";
import ADMIN_Inbox from "./ADMIN_Inbox";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/screen" replace />} />

        {/* Admin routes */}
        <Route path="/admin/screen" element={<ADMIN_Screen />} />
        <Route path="/admin/inbox" element={<ADMIN_Inbox />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/admin/screen" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
