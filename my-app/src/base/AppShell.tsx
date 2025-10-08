// src/base/AppShell.tsx
import React, { useEffect, useState, PropsWithChildren } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("om.sidebar");
    if (cached !== null) setOpen(cached === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("om.sidebar", open ? "1" : "0");
  }, [open]);

  const toggle = () => setOpen((v) => !v);

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar open={open} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar open={open} onToggleSidebar={toggle} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
