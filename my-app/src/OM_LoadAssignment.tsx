import React from "react";
import Card from "./component/Card";
import SearchInput from "./component/SearchInput";
import Select from "./component/Select";
import Toolbar from "./component/Toolbar";
import AppShell from "./base/AppShell";

export default function OM_LoadAssignment() {
  return (
    <AppShell>
      {/* page title */}
      <div className="mb-1 mt-2 text-2xl font-extrabold">
        Load Assignment <span className="text-gray-400">|</span>{" "}
        <span className="font-black">Term 1 AY 2025 - 2026</span>
      </div>
      <p className="mb-4 text-[15px] text-gray-600">
        Manage course assignments and faculty workload distribution
      </p>

      {/* top toolbar bar */}
      <div className="mb-3 rounded-xl border bg-white/90 p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[260px] flex-1">
            <SearchInput placeholder="Search..." />
          </div>

          <Select aria-label="Levels" defaultValue="all">
            <option value="all">All Levels</option>
            <option value="ug">Undergraduate</option>
            <option value="grad">Graduate</option>
          </Select>

          <Select aria-label="All ID" defaultValue="all">
            <option value="all">All ID</option>
            <option value="124">124</option>
            <option value="123">123</option>
          </Select>

          <Select aria-label="Programs" defaultValue="all">
            <option value="all">All Programs</option>
            <option value="bs-cs">BSCS</option>
            <option value="bs-it">BSIT</option>
            <option value="bs-is">BSIS</option>
          </Select>

          <div className="ml-auto">
            <Toolbar />
          </div>
        </div>
      </div>

      {/* empty canvas area */}
      <Card className="h-[60vh] min-h-[360px] rounded-xl">
        <div className="h-full w-full rounded-xl bg-white" />
      </Card>
    </AppShell>
  );
}
