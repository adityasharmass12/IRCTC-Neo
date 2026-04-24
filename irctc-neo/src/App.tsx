import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider, useLang } from "@/i18n/LanguageProvider";
import Navbar from "@/components/Navbar";
import BookingEngine from "@/components/BookingEngine";
import LiveAlerts from "@/components/LiveAlerts";
import AncillaryServices from "@/components/AncillaryServices";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import InteractiveHeading from "@/components/InteractiveHeading";

// ── Counter hook ────────────────────────────────────────
function useCounter(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [start, target, duration]);

  return count;
}

// ── Animated stat counter ────────────────────────────────
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count = useCounter(value, 1500, started);

  return (
    <div ref={ref} className="text-center px-4 py-3">
      <div className="stat-counter">
        {count.toLocaleString()}{suffix}
      </div>
      <div
        className="text-xs font-medium mt-1"
        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
      >
        {label}
      </div>
    </div>
  );
}

// ── Main App Content (needs language context) ────────────
function AppContent() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);
  const { t } = useLang();

  // Parallax scrolling for hero background
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <div className={`transition-opacity duration-700 ${splashDone ? "opacity-100" : "opacity-0"}`}>

        {/* Cinematic Hero Background with Parallax */}
        <div className="hero-bg-wrapper" aria-hidden="true">
          <motion.div
            className="hero-bg-image"
            style={{ y: bgY }}
          />
          <div className="hero-bg-overlay" />
        </div>

        {/* Floating particles */}
        <div className="particles-container" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>

        <Navbar />

        <main>
          {/* Hero Section — Cinematic Entrance */}
          <motion.section
            className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-12"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={splashDone ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* Hero Text */}
            <motion.div
              className="text-center mb-10 max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={splashDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Label badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-bold uppercase tracking-[0.18em] mb-7"
                style={{
                  fontFamily: "var(--font-ui)",
                  borderColor: "var(--clr-primary)",
                  background: "var(--clr-primary-dim)",
                  color: "var(--clr-primary)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={splashDone ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.4 }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "var(--clr-primary)" }}
                />
                {t.badgeText}
              </motion.div>

              {/* Main Heading — Interactive Wave + Parallax Shadow */}
              <InteractiveHeading
                line1={t.heroLine1}
                line2={t.heroLine2}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] cinematic-heading"
              />

              {/* Subheading */}
              <motion.p
                className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed mt-5 hero-sub-shadow"
                style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                initial={{ opacity: 0, y: 15 }}
                animate={splashDone ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {t.heroSub}
              </motion.p>
            </motion.div>

            {/* Booking Engine */}
            <motion.div
              className="w-full max-w-4xl"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={splashDone ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookingEngine />
            </motion.div>

            {/* Live Alerts */}
            <motion.div
              className="w-full max-w-7xl mt-8"
              initial={{ opacity: 0 }}
              animate={splashDone ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <LiveAlerts />
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              className="mt-12 w-full max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={splashDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="card-flat rounded-2xl p-3 grid grid-cols-3 gap-2">
                <StatCounter value={14000} suffix="+" label={t.dailyTrains} />
                <div style={{ borderLeft: "1px solid var(--clr-border)", borderRight: "1px solid var(--clr-border)" }}>
                  <StatCounter value={8000000} suffix="+" label={t.passengersDay} />
                </div>
                <StatCounter value={7000} suffix="+" label={t.stations} />
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="mt-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={splashDone ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.25em] font-medium"
                style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
              >
                {t.exploreServices}
              </span>
              <motion.div
                className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
                style={{ borderColor: "var(--clr-border)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <motion.div
                  className="w-1 h-2 rounded-full"
                  style={{ background: "var(--clr-primary)" }}
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Services */}
          <AncillaryServices />
        </main>

        <Footer />

        <p className="footer-hint">
          © {new Date().getFullYear()} IRCTC — Indian Railway Catering and Tourism Corporation Ltd. · A Government of India Enterprise
        </p>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}