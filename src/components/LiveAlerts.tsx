import { motion } from "framer-motion";
import { AlertTriangle, Info, Bell } from "lucide-react";
import { liveAlerts, type LiveAlert } from "@/data/mockData";
function getPriorityIcon(p: LiveAlert["priority"]) {
  if (p === "high")   return <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />;
  if (p === "medium") return <Bell className="w-3.5 h-3.5 flex-shrink-0" />;
  return <Info className="w-3.5 h-3.5 flex-shrink-0" />;
}
function getPriorityStyles(p: LiveAlert["priority"]) {
  if (p === "high") {
    return {
      border: "var(--clr-border)",
      bg: "rgba(192,57,43,0.06)",
      color: "var(--clr-danger)",
      iconColor: "var(--clr-danger)",
    };
  }
  return {
    border: "var(--clr-border)",
    bg: "var(--clr-primary-dim)",
    color: "var(--clr-primary)",
    iconColor: "var(--clr-primary)",
  };
}
export default function LiveAlerts() {
  const doubled = [...liveAlerts, ...liveAlerts];
  return (
    <section className="relative z-10 w-full overflow-hidden py-2">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {}
        <div className="flex items-center gap-2 mb-2 px-1">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--clr-danger)" }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
          >
            Live Alerts & Announcements
          </span>
        </div>
        {}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: "var(--clr-card-bg)",
            border: "1px solid var(--clr-border)",
            boxShadow: "0 2px 8px var(--clr-shadow-sm)",
          }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--clr-card-bg), transparent)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--clr-card-bg), transparent)" }}
          />
          <div className="animate-marquee flex items-center gap-5 py-2.5 px-4 w-max">
            {doubled.map((alert, i) => {
              const s = getPriorityStyles(alert.priority);
              return (
                <div
                  key={`${alert.id}-${i}`}
                  className="flex items-center gap-2 px-3 py-1 rounded border text-xs font-medium whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-ui)",
                    borderColor: s.border,
                    background: s.bg,
                    color: s.color,
                  }}
                >
                  <span style={{ color: s.iconColor }}>{getPriorityIcon(alert.priority)}</span>
                  <span style={{ color: "var(--clr-text)" }}>{alert.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}