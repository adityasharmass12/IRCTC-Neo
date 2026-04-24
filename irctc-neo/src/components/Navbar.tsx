import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, User, Globe, Train } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Book Ticket",  href: "#booking" },
  { label: "PNR Status",  href: "#booking" },
  { label: "Train Schedule", href: "#" },
  { label: "Tourism",    href: "#services" },
  { label: "eCatering",  href: "#services" },
  { label: "Help",       href: "#" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? "glass-strong" : "glass"}`}
        style={{ top: "0px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group no-underline">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--clr-primary)" }}
              >
                <Train className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-base font-bold tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--clr-heading)" }}
                >
                  IRCTC
                </span>
                <span
                  className="text-[9px] tracking-[0.1em] uppercase font-medium"
                  style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                >
                  Indian Railways
                </span>
              </div>
            </a>

            {/* Nav Links */}
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

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all"
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
                aria-label="Language"
              >
                <Globe className="w-3.5 h-3.5" />EN
              </button>

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

              <button
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md text-white transition-all cursor-pointer border-none"
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
                <User className="w-4 h-4" />Login
              </button>

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

      {/* Mobile Menu */}
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
                  >
                    <User className="w-4 h-4" />Login / Register
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}