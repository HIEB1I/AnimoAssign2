// src/base/Topbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  PanelLeft,
  PanelRight,
  UserCircle,
  LogOut,
  Inbox
} from "lucide-react";

type TopbarProps = {
  open: boolean;
  onToggleSidebar?: () => void;
};

export default function Topbar({ open, onToggleSidebar }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="flex h-14 w-full items-center justify-between px-3 sm:px-5 text-gray-800 border-b border-black">
        {/* Sidebar toggle button */}
        <button
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          {open ? <PanelLeft size={18} /> : <PanelRight size={18} />}
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          <button
            className="rounded-md p-2 hover:bg-gray-100 transition"
            title="Messages"
          >
            <Inbox size={18} />
          </button>

          <button
            className="rounded-md p-2 hover:bg-gray-100 transition"
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          {/* Profile section */}
          <div ref={menuRef} className="relative ml-2">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50 transition"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100">
                <UserCircle className="h-5 w-5 text-emerald-700" />
              </span>
              <span className="hidden sm:block leading-tight text-left">
                <div className="text-[15px] font-semibold text-gray-900">
                  Jamaecha Dacanay
                </div>
                <div className="text-[12px] text-gray-500">
                  Office Manager
                </div>
              </span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white text-slate-800 shadow-2xl z-50"
                role="menu"
              >
                <div className="px-4 pb-2 pt-3 text-[15px] font-semibold text-emerald-700">
                  My Account
                </div>
                <div className="mx-4 h-px bg-neutral-200" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-[15px] text-gray-800 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
