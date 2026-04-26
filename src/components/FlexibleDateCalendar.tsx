import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlexibleDateCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  isEnabled: boolean;
}

/**
 * FlexibleDateCalendar Component
 * Shows a horizontally scrolling 7-day calendar view
 * Helps users explore availability across nearby dates with one glance
 */
export default function FlexibleDateCalendar({
  selectedDate,
  onDateChange,
  isEnabled,
}: FlexibleDateCalendarProps) {
  const [baseDate, setBaseDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Start from tomorrow
    return d;
  });

  const [scrollPosition, setScrollPosition] = useState(0);

  // Generate 30 days starting from baseDate
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const dates = generateDates();

  const formatDateToISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString("en-IN", { weekday: "short" });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className="mt-4 pt-4"
      style={{
        borderTop: "1px solid var(--clr-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: "var(--clr-primary)" }} />
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}>
            Flexible Travel Dates
          </label>
        </div>
        <span
          className="text-[10px] font-mono"
          style={{
            color: "var(--clr-primary)",
            fontFamily: "var(--font-ui)",
          }}
        >
          Select any date in the next 30 days
        </span>
      </div>

      <div className="relative group">
        {/* Left scroll button */}
        <motion.button
          onClick={() => setScrollPosition(Math.max(0, scrollPosition - 100))}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: scrollPosition > 0 ? "var(--clr-primary)" : "var(--clr-border)",
            color: scrollPosition > 0 ? "white" : "var(--clr-muted)",
          }}
          whileHover={
            scrollPosition > 0
              ? { scale: 1.1 }
              : undefined
          }
          whileTap={
            scrollPosition > 0
              ? { scale: 0.95 }
              : undefined
          }
          disabled={scrollPosition === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Calendar scroller */}
        <div className="overflow-x-auto px-10 py-3 custom-scrollbar-hidden">
          <div className="flex gap-2 w-max">
            {dates.map((date, index) => {
              const dateISO = formatDateToISO(date);
              const isSelected = dateISO === selectedDate;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <motion.button
                  key={index}
                  onClick={() => onDateChange(dateISO)}
                  className={cn(
                    "flex flex-col items-center justify-center px-3 py-3 rounded-lg border transition-all cursor-pointer flex-shrink-0 w-20",
                    isSelected && "ring-2 ring-offset-2"
                  )}
                  style={{
                    borderColor: isSelected
                      ? "var(--clr-primary)"
                      : isWeekend
                        ? "var(--clr-warning)"
                        : "var(--clr-border)",
                    background: isSelected
                      ? "var(--clr-primary)"
                      : isWeekend
                        ? "rgba(var(--clr-warning-rgb), 0.05)"
                        : "transparent",
                    color: isSelected ? "white" : "var(--clr-text)",
                    ringOffsetColor: "var(--clr-surface)",
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <motion.span
                    className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                    style={{
                      fontFamily: "var(--font-ui)",
                      color: isSelected ? "white" : isToday(date) 
                        ? "var(--clr-success)" 
                        : isWeekend 
                          ? "var(--clr-warning)"
                          : "var(--clr-muted)",
                    }}
                  >
                    {getDayOfWeek(date)}
                  </motion.span>

                  <motion.span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: isSelected ? "white" : "var(--clr-heading)",
                    }}
                  >
                    {formatDisplayDate(date)}
                  </motion.span>

                  {isToday(date) && (
                    <motion.span
                      className="text-[9px] font-semibold uppercase mt-1 px-2 py-0.5 rounded"
                      style={{
                        background: isSelected
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(var(--clr-success-rgb), 0.15)",
                        color: isSelected
                          ? "white"
                          : "var(--clr-success)",
                      }}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Today
                    </motion.span>
                  )}

                  {isTomorrow(date) && !isToday(date) && (
                    <motion.span
                      className="text-[9px] font-semibold uppercase mt-1 px-2 py-0.5 rounded"
                      style={{
                        background: isSelected
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(var(--clr-primary-rgb), 0.15)",
                        color: isSelected
                          ? "white"
                          : "var(--clr-primary)",
                      }}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Tomorrow
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right scroll button */}
        <motion.button
          onClick={() => setScrollPosition(scrollPosition + 100)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: scrollPosition < 500 ? "var(--clr-primary)" : "var(--clr-border)",
            color: scrollPosition < 500 ? "white" : "var(--clr-muted)",
          }}
          whileHover={
            scrollPosition < 500
              ? { scale: 1.1 }
              : undefined
          }
          whileTap={
            scrollPosition < 500
              ? { scale: 0.95 }
              : undefined
          }
          disabled={scrollPosition >= 500}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <motion.p
        className="text-xs mt-2"
        style={{
          fontFamily: "var(--font-ui)",
          color: "var(--clr-muted)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span style={{ color: "var(--clr-warning)" }}>⚠</span> Weekend travel may have higher availability
      </motion.p>
    </motion.div>
  );
}
