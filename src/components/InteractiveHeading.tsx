import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
export default function InteractiveHeading({
  line1,
  line2,
  className = "",
}: {
  line1: string;
  line2: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 4 });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setShadowOffset({ x: dx * 10, y: dy * 10 + 4 });
  }, []);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShadowOffset({ x: 0, y: 4 });
  };
  return (
    <motion.h1
      ref={ref}
      className={className}
      style={{
        fontFamily: "var(--font-heading)",
        cursor: "default",
        textShadow: `
          ${shadowOffset.x}px ${shadowOffset.y}px 30px rgba(0,0,0,0.5),
          0 0 80px rgba(74,130,184,0.15),
          0 2px 0 rgba(0,0,0,0.18)
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        letterSpacing: isHovered ? "0.04em" : "-0.01em",
      }}
      transition={{
        letterSpacing: { type: "spring", stiffness: 300, damping: 30 },
      }}
    >
      {}
      <span className="cinematic-line" style={{ display: "block" }}>
        {line1}
      </span>
      {}
      <span
        className={`cinematic-line cinematic-sheen ${isHovered ? "cinematic-sheen--active" : ""}`}
        style={{ display: "block" }}
      >
        {line2}
      </span>
    </motion.h1>
  );
}
