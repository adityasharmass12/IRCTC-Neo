import { useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AmbientButton — A button with an LED-like ambient glow that expands on hover,
 * plus a glassmorphic tooltip that scales up above the button.
 */
export default function AmbientButton({
  children,
  tooltipText,
  onClick,
  disabled = false,
  className = "",
  style = {},
}: {
  children: ReactNode;
  tooltipText?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative" style={{ display: "inline-block", width: "100%" }}>
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && tooltipText && (
          <motion.div
            className="absolute left-1/2 z-50 pointer-events-none"
            style={{
              bottom: "calc(100% + 10px)",
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 6 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div
              className="px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--clr-heading)",
                background: "var(--clr-glass-bg)",
                backdropFilter: "blur(20px) saturate(1.4)",
                WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                border: "1px solid var(--clr-glass-border)",
                boxShadow:
                  "0 8px 32px var(--clr-shadow), inset 0 1px 0 var(--glass-inner)",
              }}
            >
              {tooltipText}
              {/* Arrow */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: "-5px",
                  width: 10,
                  height: 10,
                  background: "var(--clr-glass-bg)",
                  border: "1px solid var(--clr-glass-border)",
                  borderTop: "none",
                  borderLeft: "none",
                  transform: "translateX(-50%) rotate(45deg)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button with ambient glow */}
      <motion.button
        ref={btnRef}
        onClick={onClick}
        disabled={disabled}
        className={`ambient-btn ${className}`}
        style={{
          ...style,
          boxShadow: hovered
            ? "0 0 30px rgba(74,130,184,0.6), 0 0 60px rgba(74,130,184,0.3), 0 8px 30px var(--clr-primary-glow)"
            : "0 0 12px rgba(74,130,184,0.25), 0 4px 16px var(--clr-primary-glow)",
          transition: "box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.button>
    </div>
  );
}
