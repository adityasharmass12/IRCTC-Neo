import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Menu, X, User, Globe, ChevronDown, LogOut,
  UserCircle, Receipt, XCircle, Settings, Train, Wallet, Bell, ChevronRight, MapPin, Clock
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLang } from "@/i18n/LanguageProvider";
import LiveClock from "./LiveClock";
import LoginModal from "./LoginModal";
const TOKEN_KEY = "irctc_access_token";
const REFRESH_KEY = "irctc_refresh_token";
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function storeTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    setLoginOpen(false);
  }, []);
  const handleLogout = useCallback(() => {
    clearTokens();
    setIsLoggedIn(false);
  }, []);

  // Escape key listener for dropdowns
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);
  const navLinks = [
    { label: t.bookTicket,    href: "#booking" },
    { label: t.pnrStatus,     href: "#booking" },
    { label: t.trainSchedule, href: "#" },
    { label: t.tourism,       href: "#services" },
    { label: t.eCatering,     href: "#services" },
    { label: t.help,          href: "#" },
  ];
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? "glass-strong" : "glass"}`}
        style={{ top: "0px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            {}
            <a href="#" className="flex items-center gap-2.5 group no-underline">
              <img
                src="/irctc-logo.png"
                alt="IRCTC Logo"
                className="h-10 w-10 object-cover rounded-full"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))" }}
              />
              <div className="flex flex-col justify-center">
                <span
                  className="text-base font-bold tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                >
                  IRCTC
                </span>
                {}
                <span
                  className="text-[9px] italic mt-1.5"
                  style={{
                    fontFamily: "\"Sora\", sans-serif",
                    color: "var(--clr-muted)",
                    letterSpacing: "0.18em",
                    fontStyle: "italic",
                    lineHeight: 1,
                  }}
                >
                  Lifeline of the nation
                </span>
              </div>
            </a>
            {}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
            {}
            <div className="flex items-center gap-2">
              {}
              <LiveClock />
              {}
              <motion.button
                onClick={toggleLang}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "var(--clr-muted)",
                  borderColor: "var(--clr-border)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--clr-primary)";
                  e.currentTarget.style.borderColor = "var(--clr-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--clr-muted)";
                  e.currentTarget.style.borderColor = "var(--clr-border)";
                }}
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    style={{ fontWeight: 600 }}
                  >
                    {lang === "en" ? "EN" : "हि"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              {}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-md transition-all"
                style={{ color: "var(--clr-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              {}
              {!isLoggedIn ? (
                <button
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md text-white transition-all cursor-pointer border-none"
                  style={{
                    fontFamily: "var(--font-ui)",
                    background: "var(--clr-primary)",
                  }}
                  onClick={() => setLoginOpen(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--clr-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--clr-primary)";
                  }}
                >
                  <User className="w-4 h-4" />{t.login}
                </button>
              ) : (
                <div className="relative">
                  <a
                    href="/account"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md text-white transition-all cursor-pointer border-none no-underline"
                    style={{
                      fontFamily: "var(--font-ui)",
                      background: "var(--clr-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--clr-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--clr-primary)";
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </a>
                </div>
              )}
              {}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                style={{ color: "var(--clr-muted)" }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-[65px] left-4 right-4 card-flat rounded-xl shadow-xl"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                    style={{ fontFamily: "var(--font-ui)", color: "var(--clr-text)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--clr-primary-dim)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="pt-3" style={{ borderTop: "1px solid var(--clr-border)" }}>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg text-white cursor-pointer border-none"
                    style={{ fontFamily: "var(--font-ui)", background: "var(--clr-primary)" }}
                    onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                  >
                    <User className="w-4 h-4" />{t.loginRegister}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}