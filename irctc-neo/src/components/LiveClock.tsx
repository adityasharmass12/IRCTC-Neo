import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

/**
 * LiveClock — Updates every second. Format: "Sat, 25 Apr | 10:45:30 AM"
 */
export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = dayNames[time.getDay()];
  const date = time.getDate();
  const month = monthNames[time.getMonth()];

  let hours = time.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const mins = time.getMinutes().toString().padStart(2, "0");
  const secs = time.getSeconds().toString().padStart(2, "0");

  const formatted = `${day}, ${date} ${month} | ${hours}:${mins}:${secs} ${ampm}`;

  return (
    <div
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide"
      style={{
        fontFamily: "var(--font-ui)",
        color: "var(--clr-muted)",
        letterSpacing: "0.03em",
      }}
    >
      <Clock className="w-3 h-3" style={{ opacity: 0.6 }} />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={secs}
          initial={{ opacity: 0.6, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
