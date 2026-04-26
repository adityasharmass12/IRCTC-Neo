import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import {
  getWaitlistProbability,
  getWaitlistMessage,
  getWaitlistGradient,
} from "@/lib/stationAliasesAndWaitlist";

interface WaitlistIntelligenceBadgeProps {
  trainCode: string;
  classCode: string;
  isWaitlisted: boolean;
}

/**
 * WaitlistIntelligenceBadge Component
 * Displays historical confirmation probability with Framer Motion tooltip
 * Shows gradient from Orange (low) → Green (high) based on probability
 */
export default function WaitlistIntelligenceBadge({
  trainCode,
  classCode,
  isWaitlisted,
}: WaitlistIntelligenceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isWaitlisted) return null;

  const { percentage, daysToConfirm, confidence } = getWaitlistProbability(
    trainCode,
    classCode
  );
  const message = getWaitlistMessage(percentage);
  const gradient = getWaitlistGradient(percentage);

  const confidenceDescription =
    confidence === "HIGH"
      ? "Based on 100+ recent bookings"
      : confidence === "MEDIUM"
        ? "Based on 30-100 recent bookings"
        : "Limited historical data (experimental)";

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: 0.1,
      }}
    >
      {/* Main badge with gradient background */}
      <motion.button
        className="relative px-3 py-1.5 rounded-full flex items-center gap-2 border-0 cursor-help overflow-hidden group"
        style={{
          fontFamily: "var(--font-ui)",
          color: "white",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: `0 8px 24px rgba(${gradient.from}, 0.4)`,
        }}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        {/* Gradient background */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <linearGradient id={`grad-${trainCode}-${classCode}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#grad-${trainCode}-${classCode})`}
          />
        </svg>

        {/* Content (relative to background) */}
        <span className="relative z-10">
          WL {percentage} •
        </span>
        <span className="relative z-10 font-bold">
          {percentage}% Chance
        </span>

        {/* Info icon */}
        <motion.div
          className="relative z-10 opacity-80 group-hover:opacity-100"
          whileHover={{ scale: 1.2, rotate: 10 }}
        >
          <Info className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-64 rounded-lg p-4"
            style={{
              background: "var(--clr-surface)",
              border: "1px solid var(--clr-border)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            }}
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          >
            {/* Arrow pointer */}
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: `8px solid var(--clr-surface)`,
              }}
            />

            <div className="space-y-3">
              {/* Percentage header */}
              <motion.div
                className="flex items-start justify-between"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{
                      fontFamily: "var(--font-ui)",
                      color: "var(--clr-muted)",
                    }}
                  >
                    Confirmation Probability
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-heading)",
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {percentage}%
                  </p>
                </div>

                {/* Circular progress indicator */}
                <motion.div
                  className="relative w-16 h-16 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
                >
                  <svg
                    className="transform -rotate-90 w-16 h-16"
                    style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))" }}
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="var(--clr-border)"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke={gradient.to}
                      strokeWidth="2"
                      strokeDasharray={2 * Math.PI * 28}
                      initial={{
                        strokeDashoffset: 2 * Math.PI * 28,
                      }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 28 * (1 - percentage / 100),
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    className="absolute text-[10px] font-bold"
                    style={{ color: gradient.to }}
                  >
                    {percentage}%
                  </span>
                </motion.div>
              </motion.div>

              {/* Message & days */}
              <motion.div
                className="pt-2 border-t"
                style={{ borderColor: "var(--clr-border)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p
                  className="text-sm font-semibold mb-1"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: "var(--clr-heading)",
                  }}
                >
                  {message}
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: "var(--clr-muted)",
                  }}
                >
                  Historically, waitlists for this train/class get confirmed in approximately{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--clr-primary)" }}
                  >
                    {daysToConfirm} days
                  </span>
                </p>
              </motion.div>

              {/* Confidence level */}
              <motion.div
                className="pt-2 border-t"
                style={{ borderColor: "var(--clr-border)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p
                  className="text-[10px] uppercase font-semibold tracking-wider mb-1.5"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: "var(--clr-muted)",
                  }}
                >
                  Data Reliability
                </p>
                <div
                  className="px-2 py-1.5 rounded text-xs"
                  style={{
                    background: `rgba(var(--clr-primary-rgb), 0.08)`,
                    border: `1px solid rgba(var(--clr-primary-rgb), 0.2)`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-ui)",
                      color: "var(--clr-primary)",
                    }}
                  >
                    <span className="font-semibold">{confidence}:</span> {confidenceDescription}
                  </p>
                </div>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                className="text-[10px] italic pt-1"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "var(--clr-muted)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                💡 Historical data from IRCTC. Individual cases may vary.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
