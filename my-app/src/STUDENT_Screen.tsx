import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Calendar } from "lucide-react";
import Login_BG from "./assets/Images/login_bg.png";

/* ----------------------- Top Bar ----------------------- */
function TopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20">
      <div
        className="text-white"
        style={{
          backgroundImage: `url(${Login_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex w-full items-center justify-between px-5 py-3">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/10"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
              <UserCircle className="h-6 w-6" />
            </span>
            <span className="leading-tight text-left">
              <div className="text-sm font-semibold">Monica Santiago</div>
              <div className="text-[11px] opacity-90">Student</div>
            </span>
          </button>
        </div>
      </div>
      <div className="h-[1px] bg-gray-200 w-full"></div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute left-5 top-14 z-30 w-40 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </header>
  );
}

/* ----------------------- SelectBox ----------------------- */
function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(
    Math.max(0, options.findIndex((o) => o === value))
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // close when clicking outside
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

  const cx = (...s: Array<string | false | undefined>) =>
    s.filter(Boolean).join(" ");

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-emerald-700 mb-1">
        {label}
      </label>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "w-full rounded-xl border px-3 py-2 text-left text-sm outline-none",
          "border-gray-300 bg-white pr-9",
          "focus:ring-2 focus:ring-emerald-500/30"
        )}
      >
        <span className={cx(!value && "text-gray-400")}>
          {value || "-- Select an option --"}
        </span>
        <span className="pointer-events-none absolute right-3 top-[38px]">
          ▾
        </span>
      </button>

      {open && (
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
    "New Class Opened":
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "Slots Increased": "bg-amber-50 text-amber-700 border border-amber-200",
    "Less than Minimum":
      "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <div className="relative rounded-xl border border-gray-300 bg-white p-4 shadow-sm mb-4 pl-6">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-emerald-600"></div>
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
  );
}

/* ----------------------- Page ----------------------- */
export default function STUDENT_Screen() {
  const [fullName, setFullName] = useState("");
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

  const handleSubmit = () => {
    // validation
    if (!fullName || !idNumber || !degree || !dept || !course || !reason) {
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

    // clear form
    setFullName("");
    setIdNumber("");
    setDegree("");
    setDept("");
    setCourse("");
    setReason("");
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      <TopBar />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section Petition Form */}
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
                  Not offered; or Not listed in MLS View Course Offerings will
                  NOT be entertained
                </li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-700 mb-1">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex. DELA CRUZ, Juan"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
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
                options={[
                  "BSCS-ST",
                  "BSCS-NIS",
                  "BSCS-CSE",
                  "BSMS-CS",
                  "BS IET-GD",
                  "BS IET-AD",
                  "BSIT",
                  "BSIS",
                  "Others",
                ]}
              />

              <SelectBox
                label="Course Department"
                value={dept}
                onChange={setDept}
                options={[
                  "Department of Software Technology",
                  "Department of Information Technology",
                  "Department of Computer Technology",
                ]}
              />

              <SelectBox
                label="Course"
                value={course}
                onChange={setCourse}
                options={[
                  "CCAPDEV",
                  "CCDSALG",
                  "CCINOV8",
                  "CCINFOM",
                  "CCPROG1",
                  "CCPROG3",
                ]}
              />

              <SelectBox
                label="Reason"
                value={reason}
                onChange={setReason}
                options={["Out of Slots", "Schedule Conflict"]}
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
