import React from "react";
import { NavLink } from "react-router-dom";
import {
  ListChecks,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  GitPullRequest,
  RotateCcw,
  ChevronsLeftRight,
} from "lucide-react";
import { cls } from "../utilities/cls";
import AA_Logo from "../assets/Images/AA_Logo.png"; // ← your logo

type SidebarProps = { open: boolean; onToggle: () => void };

const items = [
  { to: "/load-assignment", label: "Load Assignment", Icon: ListChecks },
  { to: "/faculty-management", label: "Faculty Management", Icon: Users },
  { to: "/course-offerings", label: "Course Offerings", Icon: BookOpen },
  { to: "/reports-analytics", label: "Reports and Analytics", Icon: BarChart3 },
  { to: "/faculty-forms", label: "Faculty Forms", Icon: FileText },
  { to: "/section-petitions", label: "Section Petitions", Icon: GitPullRequest },
  { to: "/class-retention", label: "Class Retention", Icon: RotateCcw },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <aside
      className={cls(
        "relative h-screen shrink-0 text-white",
        "bg-[linear-gradient(180deg,#0F6C4F_0%,#1D8B63_100%)]",
        "transition-all duration-300 ease-in-out",
        open ? "w-72" : "w-16"
      )}
    >
      {/* slider handle */}
      <button
        aria-label="Toggle sidebar"
        onClick={onToggle}
        className={cls(
          "absolute -right-3 top-4 z-20 h-10 w-6 rounded-r-md shadow",
          "bg-white/90 text-emerald-800 hover:bg-white"
        )}
        title="Slide menu"
      >
        <ChevronsLeftRight className="mx-auto" size={18} />
      </button>

      {/* Logo area */}
      <div className="flex items-center gap-2 px-4 py-5">
        <img
          src={AA_Logo}
          alt="AnimoAssign"
          className={cls("object-contain", open ? "h-9" : "h-8")}
        />
      </div>

      {/* Sections */}
      <nav className="mt-1 px-3">
        <p
          className={cls(
            "px-2 text-xs font-semibold uppercase tracking-wide text-emerald-100/90",
            open ? "block" : "sr-only"
          )}
        >
          Main Navigation
        </p>

        <ul className="mt-2 space-y-1">
          {items.slice(0, 4).map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cls(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-semibold",
                    isActive ? "bg-white/15" : "hover:bg-white/10"
                  )
                }
              >
                <Icon size={18} className="shrink-0 opacity-95" />
                <span className={open ? "truncate" : "sr-only"}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <p
          className={cls(
            "mt-6 px-2 text-xs font-semibold uppercase tracking-wide text-emerald-100/90",
            open ? "block" : "sr-only"
          )}
        >
          Data Management
        </p>
        <ul className="mt-2 space-y-1">
          {items.slice(4).map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cls(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-semibold",
                    isActive ? "bg-white/15" : "hover:bg-white/10"
                  )
                }
              >
                <Icon size={18} className="shrink-0 opacity-95" />
                <span className={open ? "truncate" : "sr-only"}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
