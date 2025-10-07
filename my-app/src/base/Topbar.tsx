import React from "react";
import { Bell, MessageSquareText, HelpCircle, Square } from "lucide-react";

type TopbarProps = { onToggleSidebar: () => void };

export default function Topbar(_: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4">
      {/* small square icon at left (visual only, like in the screenshot) */}
      <div className="flex items-center">
        <button
          aria-label="Layout"
          className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-gray-100"
          title="Layout"
        >
          <Square size={16} />
        </button>
      </div>

      {/* right icons + user badge */}
      <div className="flex items-center gap-1">
        <button className="h-9 w-9 rounded hover:bg-gray-100 flex items-center justify-center" title="Notifications">
          <Bell size={18} />
        </button>
        <button className="h-9 w-9 rounded hover:bg-gray-100 flex items-center justify-center" title="Messages">
          <MessageSquareText size={18} />
        </button>
        <button className="h-9 w-9 rounded hover:bg-gray-100 flex items-center justify-center" title="Help">
          <HelpCircle size={18} />
        </button>

        <div className="ml-2 flex items-center gap-2 rounded-full border px-3 py-1.5">
          <div className="h-7 w-7 rounded-full bg-emerald-600/90" />
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-semibold text-gray-800">Jamaecha Dacanay</div>
            <div className="text-[10px] text-gray-500 -mt-0.5">Office Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
}
