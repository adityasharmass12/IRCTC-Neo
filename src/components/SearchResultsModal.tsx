import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ArrowRight, X, ChevronDown, ChevronUp, AlertCircle, CheckCircle
} from "lucide-react";
import { TRAIN_TYPES, type TrainType, type TrainResult } from "@/data/mockData";
import { cn } from "@/lib/utils";
import WaitlistIntelligenceBadge from "./WaitlistIntelligenceBadge";
import LoginModal from "./LoginModal";
import { getAuthToken } from "./Navbar";
interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: TrainResult[];
  isLoading: boolean;
  onBook: (train: TrainResult, classCode: string) => void;
  routeText: string;
  dateText: string;
}
function getAvailBadge(avail: TrainResult["classes"][0]["available"]) {
  if (avail === "available") return { label: "Available", cls: "avail-available" };
  if (avail === "waitlist") return { label: "WL", cls: "avail-waitlist" };
  if (avail === "rac") return { label: "RAC", cls: "avail-waitlist" };
  return { label: "Sold Out", cls: "avail-full" };
}
function SkeletonCard() {
  return (
    <div className="train-result-card p-0">
      <div className="p-4 border-b" style={{ borderColor: "var(--clr-border)" }}>
        <div className="skeleton h-5 w-48 mb-2" />
        <div className="skeleton h-3.5 w-32" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="class-row">
          <div className="flex items-center gap-3">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-16" />
          </div>
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-7 w-20" />
        </div>
      ))}
    </div>
  );
}
const typeLabels: Record<TrainType, string> = {
  all: "All Types",
  rajdhani: "Rajdhani",
  shatabdi: "Shatabdi",
  garib: "Garib Rath",
  superfast: "Superfast",
  express: "Express",
  mail: "Mail",
};
export default function SearchResultsModal({
  isOpen, onClose, results, isLoading, onBook, routeText, dateText
}: SearchResultsModalProps) {
  const [filter, setFilter] = useState<TrainType>("all");
  const [sort, setSort] = useState<"time" | "price" | "duration">("time");
  const [loginOpen, setLoginOpen] = useState(false);

  const isAuthenticated = !!getAuthToken();
  const handleAuthRequired = useCallback(() => {
    setLoginOpen(true);
  }, []);

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

  useEffect(() => {
    if (isOpen) {
      setFilter("all");
      setSort("time");
    }
  }, [isOpen]);
  const filtered = results
    .filter((t) => filter === "all" || t.type === filter)
    .sort((a, b) => {
      if (sort === "time") return a.departTime.localeCompare(b.departTime);
      if (sort === "price") {
        const aMin = Math.min(...a.classes.map((c) => c.price));
        const bMin = Math.min(...b.classes.map((c) => c.price));
        return aMin - bMin;
      }
      return 0;
    });
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 pb-10 px-4 pointer-events-none">
          {/* Backdrop — Click to close */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal Container — Prevents backdrop click propagation */}
          <motion.div
            className="relative w-full max-w-5xl h-[80vh] flex flex-col rounded-2xl pointer-events-auto shadow-2xl overflow-hidden"
            style={{
              background: "var(--clr-surface)",
              border: "1px solid var(--clr-border)",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Button */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
              style={{ borderColor: "var(--clr-border)", background: "var(--clr-surface-2)" }}
            >
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}>
                  {routeText || "Search Results"}
                </h2>
                <p className="text-sm mt-1" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-primary)" }}>
                  {dateText}
                </p>
              </div>
              {/* Prominent Close Button with Hover Effect */}
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all border-none cursor-pointer flex-shrink-0 ml-4"
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
            {}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-transparent">
                {}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  >
                    Filter:
                  </span>
                  {TRAIN_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={cn("train-filter-pill", filter === type && "active")}
                    >
                      {typeLabels[type]}
                    </button>
                  ))}
                </div>
                {}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  >
                    Sort:
                  </span>
                  <select
                    className="sort-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                  >
                    <option value="time">Departure Time</option>
                    <option value="price">Lowest Price</option>
                  </select>
                </div>
              </div>
              {}
              <div className="mb-4">
                <p
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                >
                  {isLoading ? "Searching trains..." : `${filtered.length} trains found`}
                </p>
              </div>
              {}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                </div>
              )}
              {}
              {!isLoading && (
                <div className="space-y-4">
                  {filtered.length === 0 && (
                    <div
                      className="text-center py-16 rounded-xl border flex flex-col items-center justify-center"
                      style={{
                        borderColor: "var(--clr-border)",
                        background: "var(--clr-surface-2)",
                      }}
                    >
                      <AlertCircle className="w-12 h-12 mb-4" style={{ color: "var(--clr-muted)" }} />
                      <p
                        className="text-lg font-medium mb-1"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                      >
                        No trains found
                      </p>
                      <p
                        className="text-sm"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        Try adjusting your filters or date to see more options.
                      </p>
                    </div>
                  )}
                  {filtered.map((train) => (
                    <TrainCard 
                      key={train.id} 
                      train={train} 
                      onBook={onBook} 
                      isAuthenticated={isAuthenticated}
                      onAuthRequired={handleAuthRequired}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <LoginModal 
            isOpen={loginOpen} 
            onClose={() => setLoginOpen(false)} 
            onLoginSuccess={() => setLoginOpen(false)} 
          />
        </div>
      )}
    </AnimatePresence>
  );
}
function TrainCard({ 
  train, 
  onBook,
  isAuthenticated,
  onAuthRequired
}: { 
  train: TrainResult; 
  onBook: (train: TrainResult, classCode: string) => void;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const typeLabel: Record<string, string> = {
    rajdhani: "Rajdhani",
    shatabdi: "Shatabdi",
    garib: "Garib Rath",
    superfast: "Superfast",
    express: "Express",
    mail: "Mail",
  };
  const typeBadgeStyle: Record<string, { bg: string; color: string }> = {
    rajdhani: { bg: "rgba(26,58,92,0.1)", color: "#1a3a5c" },
    shatabdi: { bg: "rgba(42,122,90,0.1)", color: "#2a7a5a" },
    garib: { bg: "rgba(90,58,26,0.1)", color: "#5a3a1a" },
    superfast: { bg: "rgba(90,26,90,0.1)", color: "#5a1a5a" },
    express: { bg: "rgba(58,58,106,0.1)", color: "#3a3a6a" },
    mail: { bg: "rgba(26,26,26,0.1)", color: "#3a3a3a" },
  };
  return (
    <motion.div
      className="train-result-card"
      layout
    >
      {}
      <div
        className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          {}
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
            >
              {train.trainName}
            </h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide"
              style={{
                fontFamily: "var(--font-ui)",
                background: typeBadgeStyle[train.type]?.bg,
                color: typeBadgeStyle[train.type]?.color,
              }}
            >
              {typeLabel[train.type]}
            </span>
          </div>
          {}
          <p
            className="text-sm mb-3 font-medium"
            style={{ fontFamily: "var(--font-mono)", color: "var(--clr-primary)" }}
          >
            {train.trainNo}
          </p>
          {}
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "var(--clr-muted)" }} />
              <span
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-mono)", color: "var(--clr-heading)" }}
              >
                {train.departTime}
              </span>
              <ArrowRight className="w-4 h-4 mx-1" style={{ color: "var(--clr-muted)" }} />
              <span
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-mono)", color: "var(--clr-heading)" }}
              >
                {train.arriveTime}
              </span>
            </div>
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
            >
              {train.duration}
            </span>
          </div>
        </div>
        {}
        <div className="flex items-center gap-3 self-end sm:self-center bg-transparent border border-transparent rounded-full px-4 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-primary)" }}
          >
            {expanded ? "Hide classes" : "View classes"}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: "var(--clr-primary)" }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: "var(--clr-primary)" }} />
          )}
        </div>
      </div>
      {}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="overflow-hidden"
          >
            {}
            <div
              className="flex items-center justify-between px-5 py-3 text-xs font-bold uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--clr-muted)",
                background: "var(--clr-surface-2)",
                borderTop: "1px solid var(--clr-border)",
                borderBottom: "1px solid var(--clr-border)",
              }}
            >
              <span className="w-1/4">Class</span>
              <span className="w-1/4 text-center">Availability</span>
              <span className="w-1/4 text-center">Fare (INR)</span>
              <span className="w-1/4"></span>
            </div>
            {train.classes.map((cls) => {
              const badge = getAvailBadge(cls.available);
              return (
                <div key={cls.code} className="class-row px-5 py-4 flex items-center justify-between border-b last:border-b-0" style={{ borderColor: "var(--clr-border)" }}>
                  {}
                  <div className="flex flex-col min-w-0 w-1/4">
                    <span
                      className="text-base font-bold mb-0.5"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-heading)" }}
                    >
                      {cls.name}
                    </span>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--clr-primary)" }}
                    >
                      {cls.code}
                    </span>
                  </div>
                  {}
                  <div className="flex flex-col items-center justify-center gap-1.5 w-1/4">
                    <div className="flex items-center gap-2">
                      <span className={cn("avail-badge text-xs px-3 py-1", badge.cls)}>
                        {badge.label}
                      </span>
                      {badge.cls === "avail-waitlist" && (
                        <WaitlistIntelligenceBadge
                          trainCode={train.trainNo}
                          classCode={cls.code}
                          isWaitlisted={true}
                        />
                      )}
                    </div>
                    <span
                      className="text-[11px] font-medium"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--clr-muted)" }}
                    >
                      {cls.seats > 0 ? `${cls.seats} seats` : "—"}
                    </span>
                  </div>
                  {}
                  <div className="w-1/4 text-center">
                    <span
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                    >
                      ₹{cls.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {}
                  <div className="w-1/4 flex justify-end">
                    <button
                      className="book-now-btn px-6 py-2"
                      disabled={cls.available === "full"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          onAuthRequired();
                          const toast = document.createElement("div");
                          toast.className = "fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-2xl z-[9999] transition-opacity duration-300 font-medium";
                          toast.style.fontFamily = "var(--font-ui)";
                          toast.innerText = "Please log in to book tickets.";
                          document.body.appendChild(toast);
                          setTimeout(() => {
                            toast.style.opacity = "0";
                            setTimeout(() => toast.remove(), 300);
                          }, 3000);
                        } else {
                          onBook(train, cls.code);
                        }
                      }}
                    >
                      {cls.available === "full" ? "Sold Out" : "Book Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
