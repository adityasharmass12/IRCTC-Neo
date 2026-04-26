import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Train, MapPin, Calendar, CheckCircle, AlertCircle } from "lucide-react";

interface ChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainNumber: string;
  boardingStation: string;
  journeyDate: string;
}

type ClassCode = "1A" | "2A" | "3A" | "SL" | "2S";

interface SeatBlock {
  label: string;
  available: number;
  status: "available" | "rac" | "waitlist" | "full";
}

const CLASS_TABS: ClassCode[] = ["1A", "2A", "3A", "SL", "2S"];

const MOCK_VACANCY: Record<ClassCode, SeatBlock[]> = {
  "1A": [
    { label: "HA1",  available: 2,  status: "available" },
    { label: "HA2",  available: 0,  status: "full" },
    { label: "A1",   available: 4,  status: "available" },
    { label: "A2",   available: 1,  status: "available" },
    { label: "A3",   available: 0,  status: "full" },
    { label: "A4",   available: 3,  status: "available" },
    { label: "A5",   available: 0,  status: "full" },
    { label: "A6",   available: 6,  status: "available" },
  ],
  "2A": [
    { label: "HA1",  available: 1,  status: "available" },
    { label: "A1",   available: 8,  status: "available" },
    { label: "A2",   available: 0,  status: "full" },
    { label: "A3",   available: 5,  status: "available" },
    { label: "A4",   available: 3,  status: "available" },
    { label: "A5",   available: 0,  status: "full" },
    { label: "A6",   available: 12, status: "available" },
    { label: "A7",   available: 7,  status: "available" },
    { label: "A8",   available: 0,  status: "full" },
    { label: "A9",   available: 4,  status: "available" },
    { label: "A10",  available: 9,  status: "available" },
    { label: "A11",  available: 0,  status: "full" },
  ],
  "3A": [
    { label: "HA1",  available: 3,  status: "available" },
    { label: "B1",  available: 14, status: "available" },
    { label: "B2",  available: 0,  status: "full" },
    { label: "B3",  available: 8,  status: "available" },
    { label: "B4",  available: 22, status: "available" },
    { label: "B5",  available: 0,  status: "full" },
    { label: "B6",  available: 11, status: "available" },
    { label: "B7",  available: 0,  status: "full" },
    { label: "B8",  available: 6,  status: "available" },
    { label: "B9",  available: 18, status: "available" },
    { label: "B10", available: 0,  status: "full" },
    { label: "B11", available: 9,  status: "available" },
    { label: "B12", available: 15, status: "available" },
  ],
  "SL": [
    { label: "S1",  available: 45, status: "available" },
    { label: "S2",  available: 0,  status: "full" },
    { label: "S3",  available: 32, status: "available" },
    { label: "S4",  available: 0,  status: "full" },
    { label: "S5",  available: 28, status: "available" },
    { label: "S6",  available: 0,  status: "full" },
    { label: "S7",  available: 51, status: "available" },
    { label: "S8",  available: 0,  status: "full" },
    { label: "S9",  available: 40, status: "available" },
    { label: "S10", available: 0,  status: "full" },
    { label: "S11", available: 37, status: "available" },
    { label: "S12", available: 0,  status: "full" },
  ],
  "2S": [
    { label: "S1",  available: 82, status: "available" },
    { label: "S2",  available: 0,  status: "full" },
    { label: "S3",  available: 65, status: "available" },
    { label: "S4",  available: 0,  status: "full" },
    { label: "S5",  available: 74, status: "available" },
    { label: "S6",  available: 0,  status: "full" },
  ],
};

const CLASS_LABELS: Record<ClassCode, string> = {
  "1A": "AC First Class (1A)",
  "2A": "AC 2 Tier (2A)",
  "3A": "AC 3 Tier (3A)",
  "SL": "Sleeper (SL)",
  "2S": "Second Sitting (2S)",
};

export default function ChartsModal({ isOpen, onClose, trainNumber, boardingStation, journeyDate }: ChartsModalProps) {
  const [activeClass, setActiveClass] = useState<ClassCode>("3A");
  const blocks = MOCK_VACANCY[activeClass];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full overflow-hidden"
            style={{ maxWidth: "680px" }}
            layout
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 40 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "rgba(15,23,42,0.94)",
                backdropFilter: "blur(32px) saturate(1.6)",
                WebkitBackdropFilter: "blur(32px) saturate(1.6)",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(74,130,184,0.10), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Header strip */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: "linear-gradient(90deg, var(--clr-primary), #0EA5E9, var(--clr-primary))",
                }}
              />

              {/* Title bar */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(74,130,184,0.15)" }}
                  >
                    <Train className="w-5 h-5" style={{ color: "var(--clr-primary)" }} />
                  </div>
                  <div>
                    <p
                      className="font-bold"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)", fontSize: "1rem" }}
                    >
                      Charts / Vacancy — {trainNumber || "Train"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      {boardingStation || "Station"} • {journeyDate || "Date"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "var(--clr-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.color = "#EF4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "var(--clr-muted)";
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Legend */}
              <div className="px-6 pt-4 flex flex-wrap items-center gap-4">
                {[
                  { label: "Available", color: "#22C55E", bg: "rgba(19,136,8,0.12)", border: "rgba(19,136,8,0.25)" },
                  { label: "Full / WL", color: "#EF4444", bg: "rgba(239,68,84,0.12)", border: "rgba(239,68,84,0.25)" },
                ].map(({ label, color, bg, border }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ background: bg, border: `1.5px solid ${border}` }}
                    />
                    <span className="text-xs font-medium" style={{ fontFamily: "var(--font-ui)", color }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Class Tabs */}
              <div className="px-6 pt-4 flex gap-2 flex-wrap">
                {CLASS_TABS.map((code) => (
                  <motion.button
                    key={code}
                    onClick={() => setActiveClass(code)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all"
                    style={{
                      fontFamily: "var(--font-ui)",
                      background: activeClass === code ? "var(--clr-primary)" : "rgba(255,255,255,0.06)",
                      color: activeClass === code ? "#fff" : "var(--clr-muted)",
                      border: `1px solid ${activeClass === code ? "var(--clr-primary)" : "rgba(255,255,255,0.10)"}`,
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {code}
                  </motion.button>
                ))}
              </div>

              {/* Seat Grid */}
              <div className="px-6 pb-6 pt-4">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                  style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                >
                  {CLASS_LABELS[activeClass]} — Seat Availability
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {blocks.map((block) => {
                    const isAvailable = block.status === "available";
                    return (
                      <motion.div
                        key={block.label}
                        className="relative flex flex-col items-center justify-center rounded-xl py-2.5 px-1 cursor-default"
                        style={{
                          background: isAvailable
                            ? "rgba(19,136,8,0.12)"
                            : "rgba(239,68,68,0.10)",
                          border: `1.5px solid ${isAvailable ? "rgba(19,136,8,0.28)" : "rgba(239,68,68,0.22)"}`,
                          minHeight: "56px",
                        }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        title={`${block.label}: ${block.available} seats`}
                      >
                        <span
                          className="text-[10px] font-bold"
                          style={{ fontFamily: "var(--font-mono)", color: "var(--clr-muted)" }}
                        >
                          {block.label}
                        </span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {isAvailable ? (
                            <CheckCircle className="w-3 h-3" style={{ color: "#22C55E" }} />
                          ) : (
                            <AlertCircle className="w-3 h-3" style={{ color: "#EF4444" }} />
                          )}
                          <span
                            className="text-xs font-bold"
                            style={{
                              fontFamily: "var(--font-ui)",
                              color: isAvailable ? "#22C55E" : "#EF4444",
                            }}
                          >
                            {block.available}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div
                  className="mt-4 p-3 rounded-xl flex items-center justify-between"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                    Chart Status
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      fontFamily: "var(--font-ui)",
                      background: "rgba(19,136,8,0.12)",
                      color: "#22C55E",
                      border: "1px solid rgba(19,136,8,0.25)",
                    }}
                  >
                    ✓ Prepared
                  </span>
                </div>
              </div>

              {/* Footer strip */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: "linear-gradient(90deg, var(--clr-primary), #0EA5E9, var(--clr-primary))",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
