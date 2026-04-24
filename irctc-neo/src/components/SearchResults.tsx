import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown, Clock, ArrowRight, Filter,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, X
} from "lucide-react";
import { trainResults, TRAIN_TYPES, type TrainType, type TrainResult } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  results: TrainResult[];
  isLoading: boolean;
  onBook: (train: TrainResult, classCode: string) => void;
  visible: boolean;
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

export default function SearchResults({ results, isLoading, onBook, visible }: SearchResultsProps) {
  const [filter, setFilter] = useState<TrainType>("all");
  const [sort, setSort] = useState<"time" | "price" | "duration">("time");

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
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="w-full max-w-4xl mx-auto mt-4"
        >
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
            {/* Train type filters */}
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

            {/* Sort */}
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

          {/* Results count */}
          <div className="mb-3 px-1">
            <p
              className="text-xs font-medium"
              style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
            >
              {isLoading ? "Searching..." : `${filtered.length} trains found`}
            </p>
          </div>

          {/* Loading skeletons */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Train cards */}
          {!isLoading && (
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div
                  className="text-center py-12 rounded-lg border"
                  style={{
                    borderColor: "var(--clr-border)",
                    background: "var(--clr-card-bg)",
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                  >
                    No trains found for the selected filter.
                  </p>
                </div>
              )}

              {filtered.map((train) => (
                <TrainCard key={train.id} train={train} onBook={onBook} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TrainCard({ train, onBook }: { train: TrainResult; onBook: (train: TrainResult, classCode: string) => void }) {
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
      {/* Train header */}
      <div
        className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          {/* Train name + type badge */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className="text-base font-semibold"
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

          {/* Train number */}
          <p
            className="text-xs mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "var(--clr-muted)" }}
          >
            {train.trainNo}
          </p>

          {/* Timing row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: "var(--clr-muted)" }} />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-mono)", color: "var(--clr-heading)" }}
              >
                {train.departTime}
              </span>
              <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--clr-muted)" }} />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-mono)", color: "var(--clr-heading)" }}
              >
                {train.arriveTime}
              </span>
            </div>
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
            >
              {train.duration}
            </span>
          </div>
        </div>

        {/* Expand/collapse icon */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium"
            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
          >
            {expanded ? "Hide classes" : "View classes"}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: "var(--clr-muted)" }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: "var(--clr-muted)" }} />
          )}
        </div>
      </div>

      {/* Expanded class rows */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="overflow-hidden"
          >
            {/* Header row */}
            <div
              className="flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--clr-muted)",
                background: "var(--clr-surface-2)",
                borderTop: "1px solid var(--clr-border)",
                borderBottom: "1px solid var(--clr-border)",
              }}
            >
              <span>Class</span>
              <span>Availability</span>
              <span>Fare (INR)</span>
              <span></span>
            </div>

            {train.classes.map((cls) => {
              const badge = getAvailBadge(cls.available);
              return (
                <div key={cls.code} className="class-row">
                  {/* Class info */}
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-heading)" }}
                    >
                      {cls.name}
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--clr-muted)" }}
                    >
                      {cls.code}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn("avail-badge", badge.cls)}>
                      {badge.label}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--clr-muted)" }}
                    >
                      {cls.seats > 0 ? `${cls.seats} seats` : "—"}
                    </span>
                  </div>

                  {/* Price */}
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                  >
                    ₹{cls.price.toLocaleString("en-IN")}
                  </span>

                  {/* Book button */}
                  <button
                    className="book-now-btn"
                    disabled={cls.available === "full"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBook(train, cls.code);
                    }}
                  >
                    {cls.available === "full" ? "Sold Out" : "Book"}
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}