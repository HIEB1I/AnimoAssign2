// src/base/Topbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageSquareText,
  PanelLeft,
  PanelRight,
  User as UserIcon,
  LogOut,
} from "lucide-react";

type TopbarProps = {
  open: boolean;
  onToggleSidebar?: () => void;
};

export default function Topbar({ open, onToggleSidebar }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or Escape
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

  const signOut = () => {
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-3 sm:px-4">
      {/* Sidebar toggle button */}
      <div className="flex items-center">
        <button
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
        >
          {open ? <PanelLeft size={18} /> : <PanelRight size={18} />}
        </button>
      </div>

      {/* Actions + Profile */}
      <div className="flex items-center gap-0.5">
        <button
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 transition"
          title="Messages"
        >
          <MessageSquareText size={18} />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>



        {/* Profile section */}
        <div ref={menuRef} className="relative ml-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-200">
              <UserIcon className="text-gray-800" size={20} />
            </span>
            <span className="hidden sm:block leading-tight text-left">
              <span className="block text-sm font-semibold text-gray-900">
                Jamaecha Dacanay
              </span>
              <span className="block text-[11px] text-gray-500 -mt-0.5">
                Office Manager
              </span>
            </span>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-md ring-1 ring-black/5"
            >
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-emerald-700">
                  My Account
                </div>
              </div>
              <hr />
              <button
                role="menuitem"
                onClick={signOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
