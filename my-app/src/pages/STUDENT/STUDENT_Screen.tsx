import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserCircle, 
  LogOut, 
  Calendar } 
from "lucide-react";

/* ----------------------- Top Bar ----------------------- */
function TopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const setVar = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-[80]" ref={headerRef}>
      <div className="w-full border-b border-emerald-900/30 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-4 text-white">
          <div ref={wrapperRef} className="relative">
            <button
              onClick={() => setMenuOpen((o: boolean) => !o)}
              className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/10"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
                <UserCircle className="h-6 w-6" />
              </span>
              <span className="leading-tight text-left">
                <div className="text-[17px] font-semibold">Monica Santiago</div>
                <div className="text-[12px] opacity-90">Student</div>
              </span>
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full z-[90] mt-2 w-48 rounded-2xl border border-neutral-200 bg-white text-slate-800 shadow-2xl">
                <div className="px-4 pb-2 pt-3 text-[15px] font-semibold text-emerald-700">
                  My Account
                </div>
                <div className="mx-4 h-px bg-neutral-200" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-[15px] hover:bg-neutral-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-[2px] w-full bg-neutral-200/80" />
      </div>
    </header>
  );
}

/* ----------------------- SelectBox ----------------------- */
function SelectBox({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(Math.max(0, options.findIndex((o) => o === value)));
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        open &&
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const cx = (...s: Array<string | false | undefined>) => s.filter(Boolean).join(" ");

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-emerald-700 mb-1">{label}</label>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cx(
          "w-full rounded-xl border px-3 py-2 text-left text-sm outline-none",
          disabled
            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-gray-300 bg-white pr-9 focus:ring-2 focus:ring-emerald-500/30"
        )}
      >
        <span className={cx(!value && "text-gray-400")}>
          {value || "-- Select an option --"}
        </span>
        {!disabled && <span className="pointer-events-none absolute right-3 top-[38px]">▾</span>}
      </button>

      {open && !disabled && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-2xl border border-emerald-200 bg-white shadow-lg"
        >
          {options.map((opt, i) => (
            <button
              key={opt}
              role="option"
              onMouseEnter={() => setHover(i)}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                btnRef.current?.focus();
              }}
              className={cx(
                "block w-full px-4 py-2 text-left text-sm",
                hover === i && "bg-emerald-50",
                value === opt && "bg-emerald-100 text-emerald-800 font-medium"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------- Petition Status Card ----------------------- */
function StatusCard({
  code,
  title,
  submitted,
  reason,
  status,
}: {
  code: string;
  title: string;
  submitted: string;
  reason: string;
  status: string;
}) {
  const statusColors: Record<string, string> = {
    "New Class Opened": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "Slots Increased": "bg-amber-50 text-amber-700 border border-amber-200",
    "Less than Minimum": "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <div className="relative rounded-xl border border-gray-300 bg-white p-4 shadow-sm mb-4 overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-600 rounded-l-xl"></div>

      <div className="relative z-10 pl-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-emerald-700">{code}</h3>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              statusColors[status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          Submitted: {submitted}
        </div>
        <div className="mt-2 text-sm bg-gray-100 rounded-md px-2 py-1">
          <span className="font-medium">Reason:</span> {reason}
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Page ----------------------- */
export default function STUDENT_Screen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [degree, setDegree] = useState("");
  const [dept, setDept] = useState("");
  const [course, setCourse] = useState("");
  const [reason, setReason] = useState("");
  const [petitions, setPetitions] = useState<
    { code: string; title: string; submitted: string; reason: string; status: string }[]
  >([
    {
      code: "STCLOUD",
      title: "Cloud Computing",
      submitted: "08/24/2025",
      reason: "Schedule Conflicts",
      status: "New Class Opened",
    },
    {
      code: "CCPROG3",
      title: "Object-Oriented Programming",
      submitted: "08/21/2025",
      reason: "Out of Slots",
      status: "Slots Increased",
    },
  ]);
  const [error, setError] = useState("");

  // Course options by department
  const courseOptions: Record<string, string[]> = {
    "Department of Software Technology": ["AD-FUND", "AD-MOVE", "ADCHR-1", "ADCON-1"],
    "Department of Computer Technology": ["CCICOMP", "CE-MATH", "CSARCH2", "LBYARCH"],
    "Department of Information Technology": ["CAP-IS1", "CAPIT0A", "CAPIT0B", "CCAPDEV"],
  };

  const reasons = ["Out of Slots", "Schedule Conflict"];

  const handleSubmit = () => {
    if (!firstName || !lastName || !idNumber || !degree || !dept || !course || !reason) {
      setError("⚠ Please fill out all fields.");
      return;
    }
    if (!/^\d{8}$/.test(idNumber)) {
      setError("⚠ ID Number must be exactly 8 digits.");
      return;
    }
    setError("");

    const today = new Date().toLocaleDateString("en-US");
    const newPetition = {
      code: course,
      title: course,
      submitted: today,
      reason,
      status: "Less than Minimum",
    };

    setPetitions([newPetition, ...petitions]);

    setFirstName("");
    setLastName("");
    setIdNumber("");
    setDegree("");
    setDept("");
    setCourse("");
    setReason("");
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <TopBar />

      <main className="p-6 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Petition Form */}
          <section>
            <h2 className="text-xl font-bold mb-1">Section Petition Form</h2>
            <p className="text-sm text-gray-600 mb-4">
              Submit a petition to request additional sections or slots
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-5 text-sm text-amber-800">
              <h3 className="font-semibold mb-1">⚠ Petition Guidelines</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Only 1 course petition per student allowed</li>
                <li>Petitions are subject to faculty availability</li>
                <li>Invalid reasons: professor preference</li>
                <li>
                  Not offered; or Not listed in MLS View Course Offerings will NOT be entertained
                </li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-700 mb-1">
                    First Name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex. Juan"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-700 mb-1">
                    Last Name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex. Dela Cruz"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-700 mb-1">
                  ID Number
                </label>
                <input
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="12345678"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <SelectBox
                label="Degree Program"
                value={degree}
                onChange={setDegree}
                options={["BSCS-ST", "BSCS-NIS", "BSCS-CSE", "BSMS-CS", "BS IET-GD", "BS IET-AD", "BSIT", "BSIS", "Others"]}
              />

              <SelectBox
                label="Course Department"
                value={dept}
                onChange={(val) => {
                  setDept(val);
                  setCourse("");
                  setReason("");
                }}
                options={Object.keys(courseOptions)}
              />

              <SelectBox
                label="Course"
                value={course}
                onChange={setCourse}
                options={dept ? courseOptions[dept] : []}
                disabled={!dept}
              />

              <SelectBox
                label="Reason"
                value={reason}
                onChange={setReason}
                options={reasons}
                disabled={!dept}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 rounded-lg bg-[#21804A] px-6 py-2 text-white font-medium hover:bg-[#18693B]"
            >
              Submit Petition
            </button>
          </section>

          {/* Petition Status */}
          <section className="md:border-l md:pl-8 border-gray-200">
            <h2 className="text-xl font-bold mb-1">Petition Status</h2>
            <p className="text-sm text-gray-600 mb-4">
              Track your section petition requests and their status
            </p>

            {petitions.map((p, i) => (
              <StatusCard key={i} {...p} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
