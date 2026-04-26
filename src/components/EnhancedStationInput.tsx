import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { stations } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { searchStationWithAliases } from "@/lib/stationAliasesAndWaitlist";

interface Station {
  code: string;
  name: string;
  city: string;
  confidence?: number;
}

interface StationInputProps {
  label: string;
  value: string;
  onChange: (val: string, station?: Station) => void;
  placeholder: string;
  id: string;
}

/**
 * Enhanced StationInput with Smart Autocomplete
 * Features:
 * - Alias recognition ("Bombay" → "Mumbai Central")
 * - Partial matching
 * - Confidence scoring for relevance
 */
export default function EnhancedStationInput({
  label,
  value,
  onChange,
  placeholder,
  id,
}: StationInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Smart search with alias support
  const filtered = searchStationWithAliases(query, stations);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <motion.label
        htmlFor={id}
        className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.12em]"
        style={{
          fontFamily: "var(--font-ui)",
          color: isFocused ? "var(--clr-primary)" : "var(--clr-muted)",
        }}
        animate={{
          scale: isFocused ? 1.02 : 1,
          color: isFocused ? "var(--clr-primary)" : "var(--clr-muted)",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
        {filtered.length > 0 && query && (
          <motion.span
            className="ml-2 inline-flex items-center gap-1 text-[10px] font-normal uppercase tracking-wide opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: "var(--clr-primary)" }}
          >
            <Sparkles className="w-3 h-3" />
            Smart Match
          </motion.span>
        )}
      </motion.label>

      <div className="relative group">
        <motion.div
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          animate={{
            scale: isFocused ? 1.15 : 1,
            color: isFocused ? "var(--clr-primary)" : "var(--clr-primary)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <MapPin className="w-4 h-4" style={{ color: "var(--clr-primary)" }} />
        </motion.div>

        <input
          id={id}
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => {
            setOpen(true);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onChange(e.target.value);
          }}
          className="input-field"
        />
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            className="autocomplete-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          >
            {filtered.slice(0, 8).map((station) => (
              <li key={station.code}>
                <button
                  type="button"
                  className="autocomplete-item group"
                  onClick={() => {
                    setQuery(`${station.name} (${station.code})`);
                    onChange(`${station.name} (${station.code})`, station);
                    setOpen(false);
                  }}
                >
                  <MapPin
                    className="w-3.5 h-3.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ color: "var(--clr-primary)" }}
                  />
                  <div className="text-left min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{ color: "var(--clr-heading)", fontWeight: 600 }}
                      >
                        {station.name}
                      </span>
                      {station.confidence && station.confidence < 1.0 && (
                        <motion.span
                          className="text-[9px] px-2 py-0.5 rounded"
                          style={{
                            background: "rgba(var(--clr-primary-rgb), 0.1)",
                            color: "var(--clr-primary)",
                            fontWeight: 500,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          {Math.round(station.confidence * 100)}% match
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "var(--clr-primary)" }}
                      >
                        {station.code}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--clr-muted)" }}
                      >
                        — {station.city}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
