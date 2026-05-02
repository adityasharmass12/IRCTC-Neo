import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const handleComplete = useCallback(() => {
    setExiting(true);
    setTimeout(() => onComplete(), 500);
  }, [onComplete]);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => handleComplete(), 200);
          return 100;
        }
        return prev + 3;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [handleComplete]);
  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "var(--clr-surface)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {}
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 overflow-hidden"
            style={{ background: "transparent" }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img
              src="/irctc-logo.png"
              alt="IRCTC Logo"
              className="w-full h-full object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))" }}
            />
          </motion.div>
          {}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
            >
              IRCTC
            </h1>
            <p
              className="text-xs mt-1 tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
            >
              Indian Railway Catering & Tourism Corporation
            </p>
          </motion.div>
          {}
          <motion.div
            className="mt-8 w-64"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "var(--clr-border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  background: "var(--clr-primary)",
                }}
              />
            </div>
            <p
              className="text-[11px] text-center mt-2 font-medium"
              style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
            >
              Loading services... {Math.round(progress)}%
            </p>
          </motion.div>
          {}
          <motion.p
            className="absolute bottom-8 text-[10px] text-center tracking-wider"
            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)", opacity: 0.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
          >
            A Government of India Enterprise · Ministry of Railways
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}