import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Train, Calendar, MapPin, Printer, Ban, Share2 } from "lucide-react";

interface PnrStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  pnrNumber: string;
}

export default function PnrStatusModal({ isOpen, onClose, pnrNumber }: PnrStatusModalProps) {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-4xl bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-white/10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 w-full pr-12">
                
                {/* Train Info */}
                <div className="flex flex-col">
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] mb-1 font-ui">Train Details</span>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-400">
                      <Train className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl text-white font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                        12951 • Mumbai Rajdhani Express
                      </h2>
                      <div className="flex items-center gap-4 text-white/60 text-sm mt-1" style={{ fontFamily: "var(--font-ui)" }}>
                        <span className="font-mono text-white/90">PNR: {pnrNumber || "8472910482"}</span>
                        <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 26-Apr-2026</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex gap-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10" style={{ fontFamily: "var(--font-ui)" }}>
                  <div>
                    <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold block mb-1">Quota</span>
                    <span className="text-white font-medium text-sm">General (GN)</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold block mb-1">Class</span>
                    <span className="text-white font-medium text-sm">3A</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase tracking-wider text-[10px] font-bold block mb-1">Charting Status</span>
                    <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">CHART PREPARED</span>
                  </div>
                </div>

              </div>
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Passenger Status Table */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>Passenger Status</h3>
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <table className="w-full text-left" style={{ fontFamily: "var(--font-ui)" }}>
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="py-3.5 px-5 text-[11px] font-bold text-white/50 uppercase tracking-wider">Passenger</th>
                      <th className="py-3.5 px-5 text-[11px] font-bold text-white/50 uppercase tracking-wider">Booking Status</th>
                      <th className="py-3.5 px-5 text-[11px] font-bold text-white/50 uppercase tracking-wider">Current Status</th>
                      <th className="py-3.5 px-5 text-[11px] font-bold text-white/50 uppercase tracking-wider">Coach</th>
                      <th className="py-3.5 px-5 text-[11px] font-bold text-white/50 uppercase tracking-wider">Berth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 text-sm text-white font-medium">Passenger 1</td>
                      <td className="py-4 px-5 text-sm text-orange-400 font-bold">WL/45</td>
                      <td className="py-4 px-5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded border border-emerald-500/20 tracking-wider">CNF</span></td>
                      <td className="py-4 px-5 text-sm text-white font-medium font-mono">B4</td>
                      <td className="py-4 px-5 text-sm text-white font-medium font-mono">72</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 text-sm text-white font-medium">Passenger 2</td>
                      <td className="py-4 px-5 text-sm text-orange-400 font-bold">WL/46</td>
                      <td className="py-4 px-5"><span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded border border-emerald-500/20 tracking-wider">CNF</span></td>
                      <td className="py-4 px-5 text-sm text-white font-medium font-mono">B4</td>
                      <td className="py-4 px-5 text-sm text-white font-medium font-mono">75</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mt-6" style={{ fontFamily: "var(--font-ui)" }}>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer border-none shadow-lg shadow-blue-900/20">
                  <Printer className="w-4 h-4" /> Print Ticket
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer border-none">
                  <Share2 className="w-4 h-4" /> Share Status
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 ml-auto border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-xl text-sm font-medium transition-colors cursor-pointer">
                  <Ban className="w-4 h-4" /> Cancel Ticket
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
