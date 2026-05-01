import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Eye, EyeOff, ArrowLeft, CheckCircle2,
  User, Lock, Shield, KeyRound, Loader2, AlertCircle, Mail
} from "lucide-react";
import { storeTokens } from "./Navbar";
type ModalState = "login" | "agent-confirm" | "agent-otp" | "register";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.97,
  }),
};
function ModalHeading({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.h2
      className="text-xl sm:text-2xl font-bold tracking-tight text-center"
      style={{
        fontFamily: "var(--font-heading)",
        color: "var(--clr-heading)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ letterSpacing: hovered ? "0.06em" : "0.01em" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <span className={`cinematic-line cinematic-sheen ${hovered ? "cinematic-sheen--active" : ""}`}>
        {text}
      </span>
    </motion.h2>
  );
}
function FloatingInput({
  id, label, type = "text", value, onChange, icon: Icon, rightAction,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon: typeof User;
  rightAction?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;
  return (
    <div className="relative group">
      {}
      <div
        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors duration-200"
        style={{ color: focused ? "var(--clr-primary)" : "var(--clr-muted)" }}
      >
        <Icon className="w-4 h-4" />
      </div>
      {}
      <motion.label
        htmlFor={id}
        className="absolute pointer-events-none z-10 font-medium"
        style={{
          fontFamily: "var(--font-ui)",
          left: "40px",
        }}
        animate={{
          top: isFloating ? "6px" : "50%",
          y: isFloating ? 0 : "-50%",
          fontSize: isFloating ? "10px" : "13px",
          color: focused ? "var(--clr-primary)" : "var(--clr-muted)",
          letterSpacing: isFloating ? "0.08em" : "0.01em",
        }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.label>
      {}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        className="login-modal-input"
        style={{
          paddingTop: isFloating ? "20px" : "14px",
          paddingBottom: isFloating ? "8px" : "14px",
          paddingLeft: "40px",
          paddingRight: rightAction ? "44px" : "14px",
          borderColor: focused ? "var(--clr-primary)" : "var(--clr-border)",
          boxShadow: focused
            ? "0 0 0 3px var(--clr-primary-glow), 0 2px 8px var(--clr-shadow-sm)"
            : "0 1px 4px var(--clr-shadow-sm)",
        }}
      />
      {}
      {rightAction && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {rightAction}
        </div>
      )}
    </div>
  );
}
function OtpInput({ value, onChange, length = 6 }: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (i: number, char: string) => {
    if (char && !/^\d$/.test(char)) return;
    const arr = value.padEnd(length, " ").split("");
    arr[i] = char || " ";
    const next = arr.join("").replace(/ /g, "");
    onChange(next);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(paste);
    refs.current[Math.min(paste.length, length - 1)]?.focus();
  };
  return (
    <div className="flex justify-center gap-2.5 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="otp-digit"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 25 }}
        />
      ))}
    </div>
  );
}
export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  const [state, setState] = useState<ModalState>("login");
  const [direction, setDirection] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [visuallyImpaired, setVisuallyImpaired] = useState(false);
  // Registration fields
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  // JWT auth state
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setState("login");
        setDirection(0);
        setUsername("");
        setPassword("");
        setShowPassword(false);
        setOtpValue("");
        setVisuallyImpaired(false);
        setAuthError(null);
        setSuccessMessage(null);
        setLoading(false);
        setRegUsername("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirm("");
        setShowRegPassword(false);
      }, 300);
    }
  }, [isOpen]);
  const goTo = useCallback((next: ModalState, dir: number) => {
    setDirection(dir);
    setState(next);
    setAuthError(null);
    setSuccessMessage(null);
  }, []);
  // ── JWT Sign-In ──────────────────────────────────────
  const handleSignIn = useCallback(async () => {
    if (!username.trim() || !password.trim()) {
      setAuthError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (res.ok) {
        const data = await res.json();
        storeTokens(data.access, data.refresh);
        onLoginSuccess();
      } else if (res.status === 401 || res.status === 400) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.detail || data?.non_field_errors?.[0] || "Invalid username or password.";
        setAuthError(msg);
      } else {
        setAuthError("Something went wrong. Please try again later.");
      }
    } catch {
      setAuthError("Cannot connect to server. Ensure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }, [username, password, onLoginSuccess]);
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop — Click to close */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* Modal Container — Prevents backdrop click propagation */}
          <motion.div
            className="login-modal-glass relative z-10 w-full overflow-hidden"
            style={{ maxWidth: "440px" }}
            layout
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              layout: { type: "spring", stiffness: 350, damping: 30 },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prominent Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "var(--clr-muted)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "#EF4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "var(--clr-muted)";
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </motion.button>
            {}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait" custom={direction}>
                {}
                {state === "login" && (
                  <motion.div
                    key="login"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  >
                    {}
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, var(--clr-primary), var(--clr-accent))",
                            boxShadow: "0 4px 20px var(--clr-primary-glow)",
                          }}
                        >
                          <Shield className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <ModalHeading text="LOGIN" />
                      <p
                        className="text-xs mt-1.5"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        Sign in to your IRCTC account
                      </p>
                    </div>
                    {}
                    <div className="space-y-4">
                      <FloatingInput
                        id="login-username"
                        label="User Name"
                        value={username}
                        onChange={setUsername}
                        icon={User}
                      />
                      <FloatingInput
                        id="login-password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={setPassword}
                        icon={Lock}
                        rightAction={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 rounded-md transition-colors cursor-pointer border-none bg-transparent"
                            style={{ color: "var(--clr-muted)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                    </div>
                    {}
                    <div className="mt-3 text-right">
                      <button
                        className="text-xs font-medium transition-colors cursor-pointer bg-transparent border-none"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-primary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-accent)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                      >
                        Forgot Account Details?
                      </button>
                    </div>
                    {}
                    <label
                      className="flex items-start gap-2.5 mt-4 cursor-pointer select-none"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      <input
                        type="checkbox"
                        checked={visuallyImpaired}
                        onChange={(e) => setVisuallyImpaired(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
                        style={{ accentColor: "var(--clr-primary)" }}
                      />
                      <span
                        className="text-[11px] leading-relaxed"
                        style={{ color: "var(--clr-muted)" }}
                      >
                        Visually impaired users may select this option to receive OTP instead of CAPTCHA
                      </span>
                    </label>
                    {}
                    <AnimatePresence>
                      {successMessage && (
                        <motion.div
                          className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                          style={{
                            background: "rgba(19,136,8,0.08)",
                            border: "1px solid rgba(19,136,8,0.25)",
                            color: "var(--clr-success)",
                            fontFamily: "var(--font-ui)",
                          }}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                        >
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          {successMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {}
                    <AnimatePresence>
                      {authError && (
                        <motion.div
                          className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                          style={{
                            background: "rgba(192,57,43,0.08)",
                            border: "1px solid rgba(192,57,43,0.25)",
                            color: "var(--clr-danger)",
                            fontFamily: "var(--font-ui)",
                          }}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {authError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {}
                    <motion.button
                      className="login-modal-cta mt-5"
                      whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={handleSignIn}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "SIGN IN"
                      )}
                    </motion.button>
                    {}
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px" style={{ background: "var(--clr-border)" }} />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        or
                      </span>
                      <div className="flex-1 h-px" style={{ background: "var(--clr-border)" }} />
                    </div>
                    {}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        className="login-modal-secondary"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => goTo("register", 1)}
                      >
                        REGISTER
                      </motion.button>
                      <motion.button
                        className="login-modal-secondary login-modal-secondary--accent"
                        onClick={() => goTo("agent-confirm", 1)}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        AGENT LOGIN
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                {}
                {state === "register" && (
                  <motion.div
                    key="register"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  >
                    {}
                    <motion.button
                      onClick={() => { goTo("login", -1); }}
                      className="flex items-center gap-1.5 text-xs font-medium mb-5 cursor-pointer bg-transparent border-none transition-colors"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                      whileHover={{ x: -3 }}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Login
                    </motion.button>
                    {}
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, var(--clr-primary), #0EA5E9)",
                            boxShadow: "0 4px 20px var(--clr-primary-glow)",
                          }}
                        >
                          <User className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <ModalHeading text="CREATE ACCOUNT" />
                      <p
                        className="text-xs mt-1.5"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      >
                        Register for a new IRCTC account
                      </p>
                    </div>
                    {}
                    <div className="space-y-4">
                      <FloatingInput
                        id="reg-username"
                        label="Username"
                        value={regUsername}
                        onChange={setRegUsername}
                        icon={User}
                      />
                      <FloatingInput
                        id="reg-email"
                        label="Email Address"
                        type="email"
                        value={regEmail}
                        onChange={setRegEmail}
                        icon={Mail}
                      />
                      <FloatingInput
                        id="reg-password"
                        label="Password"
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={setRegPassword}
                        icon={Lock}
                        rightAction={
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="p-1 rounded-md transition-colors cursor-pointer border-none bg-transparent"
                            style={{ color: "var(--clr-muted)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                            aria-label={showRegPassword ? "Hide password" : "Show password"}
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                      <FloatingInput
                        id="reg-confirm"
                        label="Confirm Password"
                        type={showRegPassword ? "text" : "password"}
                        value={regConfirm}
                        onChange={setRegConfirm}
                        icon={Lock}
                      />
                    </div>
                    {}
                    <AnimatePresence>
                      {authError && (
                        <motion.div
                          className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                          style={{
                            background: "rgba(192,57,43,0.08)",
                            border: "1px solid rgba(192,57,43,0.25)",
                            color: "var(--clr-danger)",
                            fontFamily: "var(--font-ui)",
                          }}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {authError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {}
                    <motion.button
                      className="login-modal-cta mt-5"
                      whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      disabled={loading}
                      onClick={async () => {
                        if (regPassword !== regConfirm) {
                          setAuthError("Passwords do not match.");
                          return;
                        }
                        if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
                          setAuthError("Please fill in all fields.");
                          return;
                        }
                        setLoading(true);
                        setAuthError(null);
                        try {
                          const res = await fetch(`${API_BASE}/api/register/`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              username: regUsername.trim(),
                              email: regEmail.trim(),
                              password: regPassword,
                              password_confirm: regConfirm,
                            }),
                          });
                          if (res.status === 201) {
                            setUsername(regUsername.trim());
                            setRegUsername("");
                            setRegEmail("");
                            setRegPassword("");
                            setRegConfirm("");
                            setSuccessMessage("Account created! Please log in.");
                            goTo("login", -1);
                          } else {
                            const data = await res.json().catch(() => ({}));
                            const msg =
                              data?.username?.[0] ||
                              data?.email?.[0] ||
                              data?.password?.[0] ||
                              data?.password_confirm?.[0] ||
                              data?.detail ||
                              "Registration failed. Please try again.";
                            setAuthError(msg);
                          }
                        } catch {
                          setAuthError("Cannot connect to server. Ensure the backend is running on port 8000.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "CREATE ACCOUNT"
                      )}
                    </motion.button>
                  </motion.div>
                )}
                {}
                {state === "agent-confirm" && (
                  <motion.div
                    key="agent-confirm"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  >
                    {}
                    <motion.button
                      onClick={() => goTo("login", -1)}
                      className="flex items-center gap-1.5 text-xs font-medium mb-5 cursor-pointer bg-transparent border-none transition-colors"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                      whileHover={{ x: -3 }}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </motion.button>
                    {}
                    <div className="text-center mb-5">
                      <div className="flex justify-center mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, var(--clr-accent), #D4692A)",
                            boxShadow: "0 4px 20px rgba(232,119,51,0.2)",
                          }}
                        >
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <ModalHeading text="Agent Confirmation" />
                    </div>
                    {}
                    <div
                      className="rounded-xl p-4 sm:p-5 mb-5"
                      style={{
                        background: "var(--clr-primary-dim)",
                        border: "1px solid var(--clr-border)",
                      }}
                    >
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-primary)" }}
                      >
                        I hereby confirm:
                      </p>
                      <ol className="space-y-2.5">
                        {[
                          "That I will not use IRCTC personal User ID to book tickets for my Customer.",
                          "That I will not overcharge the customer over and above the IRCTC Prescribed ticket fare.",
                          "That I will not alter the contents of ERS.",
                          "That I will abide by all the IRCTC Rules and Regulations and the Guidelines laid down for ticket booking/cancellations/refunds etc, by IRCTC/Ministry of Railways from time to time.",
                        ].map((rule, i) => (
                          <motion.li
                            key={i}
                            className="flex gap-2.5 text-xs leading-relaxed"
                            style={{ fontFamily: "var(--font-ui)", color: "var(--clr-text)" }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                          >
                            <span
                              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                              style={{
                                background: "var(--clr-primary)",
                                color: "#fff",
                                fontFamily: "var(--font-ui)",
                              }}
                            >
                              {i + 1}
                            </span>
                            <span>{rule}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>
                    {}
                    <motion.button
                      className="login-modal-cta"
                      onClick={() => goTo("agent-otp", 1)}
                      whileHover={{ scale: 1.015, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      I Agree
                    </motion.button>
                  </motion.div>
                )}
                {}
                {state === "agent-otp" && (
                  <motion.div
                    key="agent-otp"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  >
                    {}
                    <motion.button
                      onClick={() => goTo("login", -1)}
                      className="flex items-center gap-1.5 text-xs font-medium mb-5 cursor-pointer bg-transparent border-none transition-colors"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                      whileHover={{ x: -3 }}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </motion.button>
                    {}
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, var(--clr-primary), #0EA5E9)",
                            boxShadow: "0 4px 20px var(--clr-primary-glow)",
                          }}
                        >
                          <KeyRound className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <ModalHeading text="Agent Login With OTP" />
                      {}
                      <motion.div
                        className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full"
                        style={{
                          background: "var(--clr-primary-dim)",
                          border: "1px solid var(--clr-border)",
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: "var(--clr-success)" }}
                        />
                        <span
                          className="text-xs font-bold tracking-[0.15em] uppercase"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--clr-primary)",
                            fontSize: "11px",
                          }}
                        >
                          DC LOGIN
                        </span>
                      </motion.div>
                    </div>
                    {}
                    <p
                      className="text-center text-xs mb-5"
                      style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                    >
                      Enter the 6-digit OTP sent to your registered mobile number
                    </p>
                    {}
                    <OtpInput value={otpValue} onChange={setOtpValue} length={6} />
                    {}
                    <div className="mt-4 text-center">
                      <button
                        className="text-[11px] font-medium cursor-pointer bg-transparent border-none transition-colors"
                        style={{ fontFamily: "var(--font-ui)", color: "var(--clr-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--clr-muted)")}
                      >
                        Didn't receive OTP?{" "}
                        <span style={{ color: "var(--clr-primary)", fontWeight: 600 }}>Resend</span>
                      </button>
                    </div>
                    {}
                    <motion.button
                      className="login-modal-cta mt-6"
                      whileHover={{ scale: 1.015, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Shield className="w-4 h-4" />
                      VERIFY & LOGIN
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
