//ADMIN DASHBOARD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";


// pages
import ADMIN_Dashboard from "./ADMIN_Dashboard";
import ADMIN_UserMgt from "./ADMIN_UserMgt";
import ADMIN_AuditLogs from "./ADMIN_AuditLogs";
import ADMIN_Notifs from "./ADMIN_Notifs";
import ADMIN_Inbox from "./ADMIN_Inbox";

// optional: Login page (keep it if you’ll use later)
// import Login from "./Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ADMIN_Dashboard />} />
        <Route path="/admin/users" element={<ADMIN_UserMgt />} />
        <Route path="/admin/audit-logs" element={<ADMIN_AuditLogs />} />
        <Route path="/admin/notifications" element={<ADMIN_Notifs />} />
        <Route path="/admin/inbox" element={<ADMIN_Inbox />} />
        <Route path="/login" element={<Login />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


//LOGIN - uncomment when u want to be prompted to Login page. comment the admin
/*import Login from "./Login";

function App() {
  return <Login />;
}

export default App;*/