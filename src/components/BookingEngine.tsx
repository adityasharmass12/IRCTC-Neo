import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowRightLeft, Calendar, ChevronDown, ChevronUp,
  MapPin, FileSearch, BarChart3, Accessibility, CreditCard,
  Users, CheckCircle, AlertCircle, Clock, Sparkles
} from "lucide-react";
import { stations, trainClasses, quotas, recentSearches, trainResults, type Station, type TrainResult } from "@/data/mockData";
import { cn } from "@/lib/utils";
import SearchResultsModal from "./SearchResultsModal";
import BookingCheckoutModal, { type SelectedClass } from "./BookingCheckoutModal";
import PnrStatusModal from "./PnrStatusModal";
import ChartsModal from "./ChartsModal";
import { useLang } from "@/i18n/LanguageProvider";
import AmbientButton from "./AmbientButton";
const tabIds = ["book", "pnr", "charts"] as const;
type TabId = (typeof tabIds)[number];
const tabIcons: Record<TabId, typeof Search> = {
  book: Search,
  pnr: FileSearch,
  charts: BarChart3,
};
interface Toast { id: number; message: string; type: "success" | "error" | "info"; }
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            onClick={() => onRemove(t.id)}
            className={cn(
              "rounded-xl px-5 py-3.5 cursor-pointer flex items-center gap-3 text-sm font-medium max-w-sm",
              t.type === "success" && "toast-success",
              t.type === "error"   && "toast-error",
              t.type === "info"    && "toast-info"
            )}
            style={{
              fontFamily: "var(--font-ui)",
              color: t.type === "success" ? "var(--clr-success)"
                   : t.type === "error"   ? "var(--clr-danger)"
                   : "var(--clr-primary)",
              background: "var(--clr-surface)",
              border: "1px solid var(--clr-border)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 12px 40px var(--clr-shadow)",
            }}
          >
            {t.type === "success" ? <CheckCircle  className="w-5 h-5 flex-shrink-0" style={{ color: "var(--clr-success)" }} /> :
             t.type === "error"   ? <AlertCircle  className="w-5 h-5 flex-shrink-0" style={{ color: "var(--clr-danger)" }} /> :
                                    <Search       className="w-5 h-5 flex-shrink-0" style={{ color: "var(--clr-primary)" }} />}
            <span style={{ color: "var(--clr-text)" }}>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);
  const remove = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, show, remove };
}
function useSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spotlight-x", `${x}px`);
    el.style.setProperty("--spotlight-y", `${y}px`);
    el.style.setProperty("--spotlight-opacity", "1");
  }, []);
  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
  }, []);
  return { ref, handleMouseMove, handleMouseLeave };
}
function StationInput({
  label, value, onChange, placeholder, id
}: {
  label: string; value: string; onChange: (val: string, station?: Station) => void;
  placeholder: string; id: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const filtered = stations.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.code.toLowerCase().includes(query.toLowerCase()) ||
    s.city.toLowerCase().includes(query.toLowerCase())
  );
  useEffect(() => { setQuery(value); }, [value]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <motion.label
        htmlFor={id}
        className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
        style={{ fontFamily: "var(--font-ui)", color: isFocused ? "var(--clr-primary)" : "var(--clr-muted)" }}
        animate={{
          scale: isFocused ? 1.02 : 1,
          color: isFocused ? "var(--clr-primary)" : "var(--clr-muted)",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <div className="relative group">
        <motion.div
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          animate={{
            scale: isFocused ? 1.15 : 1,
            color: isFocused ? "var(--clr-primary)" : "var(--clr-primary)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <MapPin className="w-4 h-4" style={{ color: "var(--clr-primary)" }} />
        </motion.div>
        <input
          id={id}
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => { setOpen(true); setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); onChange(e.target.value); }}
          className="input-field"
        />
      </div>
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            className="autocomplete-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          >
            {filtered.slice(0, 8).map((station) => (
              <li key={station.code}>
                <button
                  type="button"
                  className="autocomplete-item"
                  onClick={() => {
                    setQuery(`${station.name} (${station.code})`);
                    onChange(`${station.name} (${station.code})`, station);
                    setOpen(false);
                  }}
                >
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--clr-primary)" }} />
                  <div className="text-left min-w-0">
                    <span style={{ color: "var(--clr-heading)", fontWeight: 600 }}>{station.name}</span>
                    <span className="ml-2 text-xs font-mono" style={{ color: "var(--clr-primary)" }}>
                      {station.code}
                    </span>
                    <span className="ml-1 text-xs" style={{ color: "var(--clr-muted)" }}>
                      — {station.city}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
function CustomSelect({
  label, value, onChange, options, id
}: {
  label: string; value: string;
  onChange: (val: string) => void;
  options: { code: string; name: string }[];
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = options.find((o) => o.code === value);
  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className="custom-select-btn"
      >
        <span style={selected ? { color: "var(--clr-text)" } : { color: "var(--clr-muted)" }}>
          {selected?.name || "Select"}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")}
          style={{ color: "var(--clr-muted)" }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="autocomplete-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          >
            {options.map((opt) => (
              <li key={opt.code}>
                <button
                  type="button"
                  className="autocomplete-item text-sm"
                  style={
                    opt.code === value
                      ? { color: "var(--clr-primary)", fontWeight: 600, background: "var(--clr-primary-dim)" }
                      : { color: "var(--clr-text)" }
                  }
                  onClick={() => { onChange(opt.code); setOpen(false); }}
                >
                  {opt.name}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
const routeChips = [
  { from: "NDLS", to: "BCT",  label: "NDLS → BCT" },
  { from: "SBC",  to: "MAS",  label: "SBC → MAS"  },
  { from: "HWH",  to: "NDLS", label: "HWH → NDLS" },
  { from: "JP",   to: "ADI",  label: "JP → ADI"   },
  { from: "MAS",  to: "SBC",  label: "MAS → SBC"  },
  { from: "CNB",  to: "NDLS", label: "CNB → NDLS" },
];
export default function BookingEngine() {
  const [activeTab, setActiveTab] = useState<TabId>("book");
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [date, setDate] = useState(getTomorrow());
  const [trainClass, setTrainClass] = useState("ALL");
  const [quota, setQuota] = useState("GN");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [pnrNumber, setPnrNumber]     = useState("");
  const [trainNumber, setTrainNumber]   = useState("");
  const [boardingStation, setBoardingStation] = useState("");
  const [isSearching, setIsSearching]   = useState(false);
  const [showResults, setShowResults]   = useState(false);
  const [bookingTrain, setBookingTrain] = useState<TrainResult | null>(null);
  const [bookingClass, setBookingClass] = useState<SelectedClass | null>(null);
  const [swapRotated, setSwapRotated]  = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [pnrModalOpen, setPnrModalOpen] = useState(false);
  const [chartsModalOpen, setChartsModalOpen] = useState(false);
  const { toasts, show: showToast, remove: removeToast } = useToasts();
  const { t } = useLang();
  // Build tabs array from translations
  const tabs = [
    { id: "book" as TabId,   label: t.bookTicket,     icon: tabIcons.book    },
    { id: "pnr" as TabId,    label: t.pnrStatus,      icon: tabIcons.pnr     },
    { id: "charts" as TabId, label: t.chartsVacancy,   icon: tabIcons.charts  },
  ];
  const spotlight = useSpotlight();
  const swapStations = useCallback(() => {
    const t = from; setFrom(to); setTo(t);
    setSwapRotated(true);
    setTimeout(() => setSwapRotated(false), 400);
    showToast("Stations swapped", "info");
  }, [from, to, showToast]);
  const handleSearch = () => {
    if (!from || !to) { showToast("Please enter both departure and destination stations.", "error"); return; }
    setIsSearching(true);
    setShowResults(true);
    showToast("Searching available trains...", "info");
    setTimeout(() => {
      setIsSearching(false);
      const fromStation = stations.find((s) => from.includes(s.code));
      const toStation = stations.find((s) => to.includes(s.code));
      showToast(
        `Found ${trainResults.length} trains from ${fromStation?.name || ""} to ${toStation?.name || ""}`,
        "success"
      );
    }, 2000);
  };
  const handleBook = (train: TrainResult, classCode: string) => {
    const cls = train.classes.find((c) => c.code === classCode);
    if (!cls) return;
    setBookingTrain(train);
    setBookingClass({
      code: cls.code,
      name: cls.name,
      price: cls.price,
      available: cls.available,
      seats: cls.seats,
    });
    setShowResults(false);
  };
  const handlePnr = () => {
    if (pnrNumber.length !== 10) { showToast("Please enter a valid 10-digit PNR number.", "error"); return; }
    setIsSearching(true);
    showToast("Checking PNR status...", "info");
    setTimeout(() => {
      setIsSearching(false);
      setPnrModalOpen(true);
    }, 1200);
  };
  const handleVacancy = () => {
    if (!trainNumber) { showToast("Please enter a train number or name.", "error"); return; }
    setIsSearching(true);
    showToast("Loading charts...", "info");
    setTimeout(() => {
      setIsSearching(false);
      setChartsModalOpen(true);
    }, 1200);
  };
  return (
    <>
      <section id="booking" className="relative z-10 w-full">
        {}
        <div
          ref={spotlight.ref}
          onMouseMove={spotlight.handleMouseMove}
          onMouseLeave={spotlight.handleMouseLeave}
          className="glass-card glass-card-spotlight overflow-hidden"
          style={{ maxWidth: "56rem", margin: "0 auto" }}
        >
          {}
          <div
            className="flex relative z-10"
            style={{
              borderBottom: "1px solid var(--clr-border)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowResults(false); }}
                  className={cn("tab-btn", isActive && "active")}
                  style={{ fontFamily: "var(--font-ui)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
          {}
          <div className="p-5 sm:p-6 lg:p-8 relative z-10">
            <AnimatePresence mode="wait">
              {}
              {activeTab === "book" && (
                <motion.div
                  key="book"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                >
                  {}
                  <div className="flex flex-col lg:flex-row gap-3 items-stretch">
                    <StationInput
                      label={t.from}
                      value={from}
                      onChange={(val) => setFrom(val)}
                      placeholder={t.departureStation}
                      id="station-from"
                    />
                    <div className="flex items-end justify-center lg:px-2 lg:pb-0 self-center">
                      <motion.button
                        onClick={swapStations}
                        className={cn("swap-btn", swapRotated && "rotated")}
                        aria-label="Swap stations"
                        whileHover={{ scale: 1.12, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <StationInput
                      label={t.to}
                      value={to}
                      onChange={(val) => setTo(val)}
                      placeholder={t.destinationStation}
                      id="station-to"
                    />
                  </div>
                  {}
                  <div
                    className="mt-5 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
                    style={{ borderTop: "1px solid var(--clr-border)" }}
                  >
                    {}
                    <div className="min-w-0">
                      <motion.label
                        htmlFor="travel-date"
                        className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
                        style={{ fontFamily: "var(--font-ui)", color: dateFocused ? "var(--clr-primary)" : "var(--clr-muted)" }}
                        animate={{ scale: dateFocused ? 1.02 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {t.date}
                      </motion.label>
                      <div className="relative group">
                        <Calendar
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "var(--clr-primary)" }}
                        />
                        <input
                          id="travel-date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          onFocus={() => setDateFocused(true)}
                          onBlur={() => setDateFocused(false)}
                          className="input-field"
                          style={{ paddingLeft: "40px", fontFamily: "var(--font-ui)" }}
                        />
                      </div>
                    </div>
                    <CustomSelect
                      label={t.class}
                      value={trainClass}
                      onChange={setTrainClass}
                      options={trainClasses}
                      id="train-class"
                    />
                    <CustomSelect
                      label={t.quota}
                      value={quota}
                      onChange={setQuota}
                      options={quotas}
                      id="quota"
                    />
                  </div>
                  {}
                  <div className="mt-4">
                    <button
                      onClick={() => setAdvancedOpen(!advancedOpen)}
                      className="flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer bg-transparent border-none"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      {advancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {t.advancedOptions}
                    </button>
                    <AnimatePresence>
                      {advancedOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 pb-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { icon: Accessibility, label: t.divyaangConcession },
                              { icon: CreditCard,    label: t.railwayPass        },
                              { icon: Users,         label: t.flexibleDate       },
                            ].map(({ icon: Icon, label }) => (
                              <label
                                key={label}
                                className="flex items-center gap-2.5 text-sm cursor-pointer rounded-lg px-3 py-2 transition-colors"
                                style={{ fontFamily: "var(--font-ui)", color: "var(--clr-text)" }}
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded"
                                  style={{ accentColor: "var(--clr-primary)" }}
                                />
                                <Icon className="w-4 h-4" style={{ color: "var(--clr-muted)" }} />
                                {label}
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider self-center"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      {t.quick}
                    </span>
                    {routeChips.map((chip) => (
                      <motion.button
                        key={chip.label}
                        className="route-chip"
                        onClick={() => {
                          const f = stations.find((s) => s.code === chip.from);
                          const t = stations.find((s) => s.code === chip.to);
                          if (f) setFrom(`${f.name} (${f.code})`);
                          if (t) setTo(`${t.name} (${t.code})`);
                          showToast(`Route loaded: ${chip.label}`, "info");
                        }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        {chip.label}
                      </motion.button>
                    ))}
                  </div>
                  {}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recentSearches.slice(0, 3).map((rs, i) => (
                      <motion.button
                        key={i}
                        onClick={() => {
                          const f = stations.find((s) => s.code === rs.from);
                          const t = stations.find((s) => s.code === rs.to);
                          if (f) setFrom(`${f.name} (${f.code})`);
                          if (t) setTo(`${t.name} (${t.code})`);
                          setDate(rs.date);
                          showToast("Recent search loaded", "info");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-all"
                        style={{
                          fontFamily: "var(--font-ui)",
                          borderColor: "var(--clr-border)",
                          color: "var(--clr-muted)",
                          background: "transparent",
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Clock className="w-3 h-3" style={{ color: "var(--clr-primary)" }} />
                        {rs.from} → {rs.to}
                      </motion.button>
                    ))}
                  </div>
                  {}
                  <div className="mt-6">
                    <AmbientButton
                      onClick={handleSearch}
                      disabled={isSearching}
                      tooltipText={t.searchTrains === "ट्रेन खोजें" ? "उपलब्ध ट्रेनों की खोज करें" : "Find available trains on your route"}
                    >
                      {isSearching ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{t.searchTrains}</span>
                        </>
                      )}
                    </AmbientButton>
                  </div>
                </motion.div>
              )}
              {}
              {activeTab === "pnr" && (
                <motion.div
                  key="pnr"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                >
                  <div className="max-w-md">
                    <label
                      htmlFor="pnr-input"
                      className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      {t.pnrNumber}
                    </label>
                    <div className="relative group">
                      <FileSearch
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
                        style={{ color: "var(--clr-primary)" }}
                      />
                      <input
                        id="pnr-input"
                        type="text"
                        value={pnrNumber}
                        onChange={(e) =>
                          setPnrNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder={t.enterPnr}
                        maxLength={10}
                        className="input-field"
                        style={{
                          fontFamily: "var(--font-mono)",
                          paddingLeft: "48px",
                          fontSize: "1.375rem",
                          letterSpacing: "0.25em",
                          textAlign: "center",
                          height: "60px",
                        }}
                      />
                    </div>
                    {}
                    <div className="flex items-center gap-2 mt-3">
                      <div
                        className="h-1.5 flex-1 rounded-full overflow-hidden"
                        style={{ background: pnrNumber.length >= 10 ? "rgba(19,136,8,0.2)" : "var(--clr-border)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: pnrNumber.length >= 10 ? "var(--clr-success)" : "var(--clr-primary)" }}
                          animate={{ width: `${(pnrNumber.length / 10) * 100}%` }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: "var(--clr-muted)" }}>
                        {pnrNumber.length}/10
                      </span>
                    </div>
                    <p
                      className="text-xs mt-3"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      {t.pnrHelper}
                    </p>
                    <div className="mt-5" style={{ maxWidth: "240px" }}>
                      <AmbientButton
                        onClick={handlePnr}
                        disabled={isSearching}
                        tooltipText={t.checkPnrStatus === "PNR स्थिति जांचें" ? "अपने PNR की स्थिति देखें" : "Check your booking and berth details"}
                      >
                        {isSearching ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span>{t.checkPnrStatus}</span>
                          </>
                        )}
                      </AmbientButton>
                    </div>
                  </div>
                </motion.div>
              )}
              {}
              {activeTab === "charts" && (
                <motion.div
                  key="charts"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                >
                  <div className="max-w-md">
                    <label
                      htmlFor="train-number-input"
                      className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      {t.trainNumberName}
                    </label>
                    <div className="relative group">
                      <BarChart3
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--clr-primary)" }}
                      />
                      <input
                        id="train-number-input"
                        type="text"
                        value={trainNumber}
                        onChange={(e) => setTrainNumber(e.target.value)}
                        placeholder={t.trainNumberPlaceholder}
                        className="input-field"
                        style={{ fontFamily: "var(--font-ui)", paddingLeft: "44px" }}
                      />
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="boarding-station"
                        className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        Boarding Station
                      </label>
                      <div className="relative group">
                        <MapPin
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "var(--clr-primary)" }}
                        />
                        <input
                          id="boarding-station"
                          type="text"
                          value={boardingStation}
                          onChange={(e) => setBoardingStation(e.target.value)}
                          placeholder="Select boarding station"
                          className="input-field"
                          style={{ fontFamily: "var(--font-ui)", paddingLeft: "44px" }}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="chart-date"
                        className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        {t.journeyDate}
                      </label>
                      <div className="relative group">
                        <Calendar
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "var(--clr-primary)" }}
                        />
                        <input
                          id="chart-date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="input-field"
                          style={{ fontFamily: "var(--font-ui)", paddingLeft: "44px" }}
                        />
                      </div>
                    </div>
                    <p className="text-xs mt-3" style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
                      {t.chartsHelper}
                    </p>
                    <div className="mt-4" style={{ maxWidth: "220px" }}>
                      <AmbientButton
                        onClick={handleVacancy}
                        disabled={isSearching}
                        tooltipText={t.checkVacancy === "उपलब्धता जांचें" ? "सीट उपलब्धता देखें" : "View seat availability and chart status"}
                      >
                        {isSearching ? (
                          <motion.div
                            className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <BarChart3 className="w-4 h-4" />
                        )}
                        {isSearching ? t.checking : t.checkVacancy}
                      </AmbientButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {}
        <SearchResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          results={trainResults}
          isLoading={isSearching}
          onBook={handleBook}
          routeText={from && to ? `${from.split(' (')[0]} → ${to.split(' (')[0]}` : "Search Results"}
          dateText={date}
        />
        <BookingCheckoutModal
          isOpen={!!bookingTrain}
          onClose={() => { setBookingTrain(null); setBookingClass(null); setShowResults(false); }}
          train={bookingTrain}
          selectedClass={bookingClass}
          routeText={from && to ? `${from.split(' (')[0]} → ${to.split(' (')[0]}` : ""}
          dateText={date}
          setBookingTrain={setBookingTrain}
          setBookingClass={setBookingClass}
        />
        <PnrStatusModal
          isOpen={pnrModalOpen}
          onClose={() => setPnrModalOpen(false)}
          pnrNumber={pnrNumber}
        />
        <ChartsModal
          isOpen={chartsModalOpen}
          onClose={() => setChartsModalOpen(false)}
          trainNumber={trainNumber}
          boardingStation={boardingStation}
          journeyDate={date}
        />
      </section>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}