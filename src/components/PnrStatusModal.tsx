import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Train, Calendar, MapPin, User, CheckCircle, AlertCircle } from "lucide-react";

interface PnrStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  pnrNumber: string;
}

interface Passenger {
  name: string;
  status: "CNF" | "RAC" | "WL" | "CAN";
  coach: string;
  berth: string;
  seatNumber: number;
}

function StatusBadge({ status }: { status: Passenger["status"] }) {
  const config = {
    CNF: { label: "Confirmed", bg: "rgba(19,136,8,0.15)", color: "#22C55E", border: "rgba(19,136,8,0.3)" },
    RAC: { label: "RAC", bg: "rgba(217,119,6,0.15)", color: "#F59E0B", border: "rgba(217,119,6,0.3)" },
    WL:  { label: "Waitlist", bg: "rgba(239,68,68,0.12)", color: "#EF4444", border: "rgba(239,68,68,0.25)" },
    CAN: { label: "Cancelled", bg: "rgba(100,100,100,0.12)", color: "#9CA3AF", border: "rgba(100,100,100,0.2)" },
  };
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: "var(--font-ui)" }}
    >
      {status === "CNF" && <CheckCircle className="w-3 h-3" />}
      {status === "WL" && <AlertCircle className="w-3 h-3" />}
      {c.label}
    </span>
  );
}

const MOCK_PASSENGERS: Passenger[] = [
  { name: "Aditya Sharma",    status: "CNF", coach: "B2", berth: "Lower",  seatNumber: 45 },
  { name: "Priya Sharma",     status: "CNF", coach: "B2", berth: "Middle", seatNumber: 46 },
  { name: "Arjun Sharma",     status: "RAC", coach: "S4", berth: "Side Lower", seatNumber: 23 },
  { name: "Ananya Sharma",    status: "WL",  coach: "—",  berth: "—",      seatNumber: 8  },
];

export default function PnrStatusModal({ isOpen, onClose, pnrNumber }: PnrStatusModalProps) {
  // Escape key listener
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

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
          {/* Backdrop — Click to close */}
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

          {/* Modal Container — Prevents backdrop click propagation */}
          <motion.div
            className="relative z-10 w-full overflow-hidden"
            style={{ maxWidth: "520px" }}
            layout
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 40 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ticket-style card */}
            <div
              className="relative overflow-hidden"
              style={{
                background: "rgba(15,23,42,0.92)",
                backdropFilter: "blur(32px) saturate(1.6)",
                WebkitBackdropFilter: "blur(32px) saturate(1.6)",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(74,130,184,0.10), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Gold accent strip */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: "linear-gradient(90deg, var(--clr-primary), var(--clr-accent), var(--clr-primary))",
                }}
              />

              {/* Header */}
              <div
                className="flex items-start justify-between px-6 pt-6 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
                    style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  >
                    PNR Number
                  </p>
                  <p
                    className="text-3xl font-bold tracking-[0.18em]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--clr-heading)" }}
                  >
                    {pnrNumber}
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none"
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

              {/* Train Details */}
              <div className="px-6 py-4 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(74,130,184,0.15)" }}
                  >
                    <Train className="w-5 h-5" style={{ color: "var(--clr-primary)" }} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>Train</p>
                    <p className="font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)", fontSize: "0.9375rem" }}>12951 Mumbai Rajdhani</p>
                    <p className="text-xs font-mono" style={{ fontFamily: "var(--font-mono)", color: "var(--clr-primary)" }}>NDLS → BCT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(232,119,51,0.12)" }}
                  >
                    <Calendar className="w-5 h-5" style={{ color: "var(--clr-accent)" }} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>Journey Date</p>
                    <p className="font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)", fontSize: "0.9375rem" }}>27 Apr 2026</p>
                    <p className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>Dep: 16:35 → Arr: 08:15</p>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="px-6 pb-6">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                  style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                >
                  Passenger Status
                </p>
                <div className="space-y-2.5">
                  {MOCK_PASSENGERS.map((p, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3.5 px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(74,130,184,0.12)" }}
                      >
                        <User className="w-4.5 h-4.5" style={{ color: "var(--clr-primary)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-semibold truncate"
                            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-text)" }}
                          >
                            {p.name}
                          </span>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {p.status !== "WL" && p.status !== "CAN" && (
                            <>
                              <span className="text-xs font-mono" style={{ fontFamily: "var(--font-mono)", color: "var(--clr-muted)" }}>
                                Coach {p.coach}
                              </span>
                              <span className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                                Berth: <strong style={{ color: "var(--clr-text)" }}>{p.berth}</strong>
                              </span>
                            </>
                          )}
                          {p.status === "WL" && (
                            <span className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                              WL Position: <strong style={{ color: "#F59E0B" }}>{p.seatNumber}</strong>
                            </span>
                          )}
                          {p.status === "CAN" && (
                            <span className="text-xs" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                              Refund: Processed within 5 days
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer strip */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: "linear-gradient(90deg, var(--clr-primary), var(--clr-accent), var(--clr-primary))",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
