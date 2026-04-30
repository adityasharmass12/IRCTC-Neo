import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowLeft, Plus, Trash2, CheckCircle, User,
  Phone, Mail, ShieldCheck, AlertTriangle, Train, Clock, MapPin, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type TrainResult } from "@/data/mockData";

export interface SelectedClass {
  code: string;
  name: string;
  price: number;
  available: "available" | "waitlist" | "rac" | "full";
  seats: number;
}

export interface Passenger {
  id: string;
  fullName: string;
  age: string;
  gender: "Male" | "Female" | "Other" | "";
  berthPreference: "Window" | "Aisle" | "No Preference" | "";
}

interface BookingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: TrainResult | null;
  selectedClass: SelectedClass | null;
  routeText: string;
  dateText: string;
  setBookingTrain: (train: TrainResult | null) => void;
  setBookingClass: (cls: SelectedClass | null) => void;
}

const GENDER_OPTIONS = [
  { code: "Male", label: "Male" },
  { code: "Female", label: "Female" },
  { code: "Other", label: "Other" },
];

const BERTH_OPTIONS = [
  { code: "Window", label: "Window" },
  { code: "Aisle", label: "Aisle" },
  { code: "No Preference", label: "No Preference" },
];

function createEmptyPassenger(): Passenger {
  return {
    id: `passenger-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fullName: "",
    age: "",
    gender: "",
    berthPreference: "",
  };
}

function createMockPassenger(): Passenger {
  return {
    id: `passenger-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fullName: "Aditya Sharma",
    age: "20",
    gender: "Male",
    berthPreference: "Window",
  };
}

// ── Glassmorphic Input Field ──────────────────────────────────────────────────
function GlassInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ElementType;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        className="text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ fontFamily: "var(--font-ui)", color: focused ? "var(--clr-primary)" : "var(--clr-muted)" }}
      >
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <motion.div
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            animate={{ scale: focused ? 1.15 : 1, color: focused ? "var(--clr-primary)" : "var(--clr-primary)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
        <motion.input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all duration-300",
            "bg-white/[0.06] border border-white/[0.12]",
            "placeholder:text-[var(--clr-muted)]/60",
            Icon ? "pl-11" : "pl-4"
          )}
          style={{
            fontFamily: "var(--font-ui)",
            color: "var(--clr-text)",
            borderColor: focused ? "var(--clr-primary)" : "rgba(255,255,255,0.12)",
            background: focused ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
            boxShadow: focused ? "0 0 0 3px var(--clr-primary-glow), 0 0 16px var(--clr-primary-glow)" : "none",
          }}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </div>
    </div>
  );
}

// ── Glassmorphic Select Dropdown ───────────────────────────────────────────────
function GlassSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { code: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const selected = options.find((o) => o.code === value);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ fontFamily: "var(--font-ui)", color: focused ? "var(--clr-primary)" : "var(--clr-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setOpen(!open)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 150); }}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all duration-300 text-left flex items-center justify-between"
          style={{
            fontFamily: "var(--font-ui)",
            color: selected ? "var(--clr-text)" : "var(--clr-muted)/60",
            background: open ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
            border: `1.5px solid ${open ? "var(--clr-primary)" : "rgba(255,255,255,0.12)"}`,
            boxShadow: open ? "0 0 0 3px var(--clr-primary-glow), 0 0 16px var(--clr-primary-glow)" : "none",
          }}
          whileFocus={{ scale: 1.01 }}
        >
          <span>{selected?.label || placeholder}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl overflow-hidden border"
              style={{
                background: "var(--clr-surface)",
                borderColor: "var(--clr-border)",
                boxShadow: "0 16px 48px var(--clr-shadow)",
                backdropFilter: "blur(16px)",
              }}
            >
              {options.map((opt) => (
                <li key={opt.code}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm transition-colors"
                    style={{
                      fontFamily: "var(--font-ui)",
                      color: opt.code === value ? "var(--clr-primary)" : "var(--clr-text)",
                      background: opt.code === value ? "var(--clr-primary-dim)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (opt.code !== value) e.currentTarget.style.background = "var(--clr-primary-dim)";
                    }}
                    onMouseLeave={(e) => {
                      if (opt.code !== value) e.currentTarget.style.background = "transparent";
                    }}
                    onClick={() => { onChange(opt.code); setOpen(false); }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Checkbox ───────────────────────────────────────────────────────────────────
function GlassCheckbox({
  label,
  sublabel,
  checked,
  onChange,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <motion.div
        className="w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
        style={{
          background: checked ? "var(--clr-primary)" : "rgba(255,255,255,0.06)",
          border: `1.5px solid ${checked ? "var(--clr-primary)" : "rgba(255,255,255,0.2)"}`,
          boxShadow: checked ? "0 0 12px var(--clr-primary-glow)" : "none",
        }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
            >
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="flex-1">
        <span
          className="text-sm font-medium block"
          style={{ fontFamily: "var(--font-ui)", color: "var(--clr-text)" }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className="text-xs block mt-0.5"
            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </label>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--clr-primary-dim)" }}
        >
          <Icon className="w-4 h-4" style={{ color: "var(--clr-primary)" }} />
        </div>
        <h3
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
        >
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Summary Card ───────────────────────────────────────────────────────────────
function SummaryCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <Icon className="w-4 h-4" style={{ color: "var(--clr-primary)" }} />
        <h3
          className="text-sm font-bold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-ui)", color: "var(--clr-heading)" }}
        >
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Fare Row ───────────────────────────────────────────────────────────────────
function FareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)", fontSize: "0.875rem" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", color: "var(--clr-text)", fontSize: "0.875rem", fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BookingCheckoutModal({
  isOpen,
  onClose,
  train,
  selectedClass,
  routeText,
  dateText,
  setBookingTrain,
  setBookingClass,
}: BookingCheckoutModalProps) {
  const [passengers, setPassengers] = useState<Passenger[]>([createMockPassenger()]);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [autoUpgrade, setAutoUpgrade] = useState(false);
  const [confirmOnly, setConfirmOnly] = useState(false);

  // Escape key listener
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setPassengers([createMockPassenger()]);
      setMobile("");
      setEmail("");
      setAutoUpgrade(false);
      setConfirmOnly(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleBack = () => {
    setBookingTrain(null);
    setBookingClass(null);
  };

  const addPassenger = () => setPassengers((p) => [...p, createEmptyPassenger()]);
  const removePassenger = (id: string) =>
    setPassengers((p) => p.filter((pass) => pass.id !== id));

  const updatePassenger = (id: string, field: keyof Passenger, value: string) =>
    setPassengers((p) =>
      p.map((pass) => (pass.id === id ? { ...pass, [field]: value } : pass))
    );

  // Fare calculations
  const baseFare = selectedClass ? selectedClass.price * passengers.length : 0;
  const reservationCharge = Math.round(baseFare * 0.05);
  const superfastCharge = Math.round(baseFare * 0.02);
  const convenienceFee = 35;
  const total = baseFare + reservationCharge + superfastCharge + convenienceFee;

  if (!isOpen || !train || !selectedClass) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — Click to close */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel — slides in from right with click-outside protection */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[61] w-full max-w-6xl flex flex-col"
            style={{
              background: "var(--clr-bg)",
              boxShadow: "-24px 0 80px rgba(0,0,0,0.5)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Top Bar (always visible) ─────────────────────── */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6 py-4"
              style={{
                background: "rgba(13,21,32,0.97)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: "var(--clr-muted)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  whileHover={{ scale: 1.03, background: "rgba(255,255,255,0.10)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Search
                </motion.button>
                <div
                  className="h-6 w-px"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                />
                <div>
                  <h1
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                  >
                    Review Your Booking
                  </h1>
                  <p
                    className="text-xs mt-0.5"
                    style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  >
                    Fill in passenger details to continue
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border-none cursor-pointer flex-shrink-0"
                style={{
                  color: "var(--clr-muted)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "#EF4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "var(--clr-muted)";
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* ── Scrollable Content ─────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
          {/* ── Content Grid ────────────────────────────────────── */}
          <div className="max-w-6xl mx-auto py-8 px-4 lg:px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* ── LEFT COLUMN (2 cols) ─────────────────────── */}
              <div className="lg:col-span-2 space-y-6">
                {/* ── Passenger Details ─── */}
                <SectionCard title="Passenger Details" icon={User}>
                  <div className="space-y-5">
                    {passengers.map((passenger, index) => (
                      <motion.div
                        key={passenger.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="p-5 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{
                                background: "var(--clr-primary)",
                                color: "#fff",
                                fontFamily: "var(--font-ui)",
                              }}
                            >
                              {index + 1}
                            </div>
                            <span
                              className="text-sm font-semibold"
                              style={{ fontFamily: "var(--font-ui)", color: "var(--clr-heading)" }}
                            >
                              Passenger {index + 1}
                            </span>
                            {index === 0 && (
                              <span
                                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                style={{
                                  background: "rgba(19,136,8,0.15)",
                                  color: "var(--clr-success)",
                                  fontFamily: "var(--font-ui)",
                                }}
                              >
                                Primary
                              </span>
                            )}
                          </div>
                          {passengers.length > 1 && (
                            <motion.button
                              onClick={() => removePassenger(passenger.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors"
                              style={{
                                color: "var(--clr-danger)",
                                background: "rgba(192,57,43,0.10)",
                              }}
                              whileHover={{ scale: 1.1, background: "rgba(192,57,43,0.20)" }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <GlassInput
                            label="Full Name"
                            value={passenger.fullName}
                            onChange={(v) => updatePassenger(passenger.id, "fullName", v)}
                            placeholder="As per government ID"
                            icon={User}
                          />
                          <GlassInput
                            label="Age"
                            value={passenger.age}
                            onChange={(v) => updatePassenger(passenger.id, "age", v.replace(/\D/g, "").slice(0, 3))}
                            placeholder="Age in years"
                            type="number"
                          />
                          <GlassSelect
                            label="Gender"
                            value={passenger.gender}
                            onChange={(v) => updatePassenger(passenger.id, "gender", v)}
                            options={GENDER_OPTIONS}
                            placeholder="Select gender"
                          />
                          <GlassSelect
                            label="Berth Preference"
                            value={passenger.berthPreference}
                            onChange={(v) => updatePassenger(passenger.id, "berthPreference", v)}
                            options={BERTH_OPTIONS}
                            placeholder="Select preference"
                          />
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Passenger Button */}
                    <motion.button
                      onClick={addPassenger}
                      className="w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border-none cursor-pointer"
                      style={{
                        fontFamily: "var(--font-ui)",
                        color: "var(--clr-primary)",
                        background: "rgba(74,130,184,0.08)",
                        border: "1.5px dashed rgba(74,130,184,0.30)",
                      }}
                      whileHover={{
                        scale: 1.02,
                        background: "rgba(74,130,184,0.14)",
                        borderColor: "rgba(74,130,184,0.50)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Passenger
                    </motion.button>
                  </div>
                </SectionCard>

                {/* ── Contact Information ─── */}
                <SectionCard title="Contact Information" icon={Phone}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GlassInput
                      label="Mobile Number"
                      value={mobile}
                      onChange={(v) => setMobile(v.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      type="tel"
                      icon={Phone}
                    />
                    <GlassInput
                      label="Email Address"
                      value={email}
                      onChange={(v) => setEmail(v)}
                      placeholder="For e-ticket delivery"
                      type="email"
                      icon={Mail}
                    />
                  </div>
                  <div
                    className="mt-4 p-3 rounded-lg flex items-start gap-3"
                    style={{
                      background: "rgba(74,130,184,0.06)",
                      border: "1px solid rgba(74,130,184,0.15)",
                    }}
                  >
                    <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--clr-primary)" }} />
                    <p className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                      Your contact details are used solely for sending booking confirmation and e-ticket. They are never shared with third parties.
                    </p>
                  </div>
                </SectionCard>

                {/* ── Additional Preferences ─── */}
                <SectionCard title="Additional Preferences" icon={AlertTriangle}>
                  <div className="space-y-4">
                    <GlassCheckbox
                      label="Consider for Auto Upgradation"
                      sublabel="Automatically upgrade your berth if a higher class becomes available at the same price."
                      checked={autoUpgrade}
                      onChange={setAutoUpgrade}
                    />
                    <GlassCheckbox
                      label="Book only if confirm berths are allotted"
                      sublabel="Do not book if only RAC or Waitlist berths are available."
                      checked={confirmOnly}
                      onChange={setConfirmOnly}
                    />
                  </div>
                </SectionCard>
              </div>

              {/* ── RIGHT COLUMN (1 col) — Sticky Summary ─────── */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-5">
                  {/* Train Summary */}
                  <SummaryCard title="Train Summary" icon={Train}>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--clr-primary-dim)" }}
                        >
                          <Train className="w-4 h-4" style={{ color: "var(--clr-primary)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-sm leading-tight"
                            style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                          >
                            {train.trainName}
                          </p>
                          <p
                            className="text-xs font-semibold mt-0.5"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--clr-primary)" }}
                          >
                            {train.trainNo}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" style={{ color: "var(--clr-muted)" }} />
                          <span
                            className="text-sm font-semibold"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--clr-text)" }}
                          >
                            {train.departTime} — {train.arriveTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" style={{ color: "var(--clr-muted)" }} />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                          >
                            {routeText}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" style={{ color: "var(--clr-muted)" }} />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                          >
                            {dateText}
                          </span>
                        </div>
                      </div>

                      {/* Class Badge */}
                      <div
                        className="mt-3 pt-3 flex items-center justify-between rounded-lg px-3 py-2"
                        style={{
                          background: "var(--clr-primary-dim)",
                          border: "1px solid rgba(74,130,184,0.15)",
                        }}
                      >
                        <span
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-ui)", color: "var(--clr-primary)" }}
                        >
                          {selectedClass.name} ({selectedClass.code})
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: selectedClass.available === "available" ? "rgba(19,136,8,0.15)" : "rgba(217,119,6,0.15)",
                            color: selectedClass.available === "available" ? "var(--clr-success)" : "var(--clr-warning)",
                            fontFamily: "var(--font-ui)",
                          }}
                        >
                          {selectedClass.available === "available" ? `${selectedClass.seats} Seats` : selectedClass.available.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </SummaryCard>

                  {/* Fare Breakdown */}
                  <SummaryCard title="Fare Breakdown" icon={ShieldCheck}>
                    <div className="space-y-0">
                      <FareRow label="Base Fare" value={`₹${baseFare.toLocaleString("en-IN")}`} />
                      <FareRow label="Reservation Charge" value={`₹${reservationCharge.toLocaleString("en-IN")}`} />
                      <FareRow label="Superfast Charge" value={`₹${superfastCharge.toLocaleString("en-IN")}`} />
                      <FareRow label="Convenience Fee" value={`₹${convenienceFee.toLocaleString("en-IN")}`} />
                      <div
                        className="mt-3 pt-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-bold"
                            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-heading)" }}
                          >
                            Total Amount
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ fontFamily: "var(--font-heading)", color: "var(--clr-accent)" }}
                          >
                            ₹{total.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p
                          className="text-[11px] mt-1"
                          style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                        >
                          Inclusive of all taxes • Upto 5% Cashback on payment
                        </p>
                      </div>
                    </div>
                  </SummaryCard>

                  {/* CTA */}
                  <motion.button
                    className="w-full py-5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 border-none cursor-pointer relative overflow-hidden"
                    style={{
                      fontFamily: "var(--font-heading)",
                      background: "linear-gradient(135deg, var(--clr-primary), #0EA5E9)",
                      color: "#fff",
                      boxShadow: "0 0 30px rgba(74,130,184,0.45), 0 8px 30px rgba(0,0,0,0.25)",
                      letterSpacing: "0.04em",
                    }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 50px rgba(74,130,184,0.65), 0 12px 40px rgba(0,0,0,0.30)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Sheen sweep */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{
                        x: ["-100%", "100%"],
                        transition: { duration: 0.7, ease: "easeInOut" },
                      }}
                    />
                    <span className="relative z-10">Proceed to Payment</span>
                    <svg
                      className="relative z-10 w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>

                  {/* Trust signals */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--clr-success)" }} />
                      <span
                        className="text-[10px] font-semibold"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        Secure Payment
                      </span>
                    </div>
                    <div
                      className="h-3 w-px"
                      style={{ background: "rgba(255,255,255,0.10)" }}
                    />
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--clr-success)" }} />
                      <span
                        className="text-[10px] font-semibold"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        Instant Confirmation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
