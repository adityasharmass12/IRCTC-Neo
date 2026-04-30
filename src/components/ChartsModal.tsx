import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Train, Calendar, MapPin, Search } from "lucide-react";

interface ChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainNumber: string;
  boardingStation: string;
  journeyDate: string;
}

export default function ChartsModal({ isOpen, onClose, trainNumber, boardingStation, journeyDate }: ChartsModalProps) {
  const [activeTab, setActiveTab] = useState("CC");

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

  const coaches = [
    {
      id: "C1",
      status: "Available",
      vacantSeats: [12, 14, 45, 46]
    },
    {
      id: "C2",
      status: "Full",
      vacantSeats: []
    },
    {
      id: "C3",
      status: "Available",
      vacantSeats: [72]
    }
  ];

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
            className="w-full max-w-5xl bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-white/10 shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 w-full pr-12">
                <div className="flex flex-col">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] mb-1 font-ui">Reservation Chart</span>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl text-white font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                        12002 • Bhopal Shatabdi
                      </h2>
                      <div className="flex items-center gap-4 text-white/60 text-sm mt-1" style={{ fontFamily: "var(--font-ui)" }}>
                        <div className="flex items-center gap-1 font-medium"><MapPin className="w-4 h-4 text-white/40" /> Boarding: NDLS</div>
                        <div className="flex items-center gap-1 font-medium"><Calendar className="w-4 h-4 text-white/40" /> Date: 26-Apr-2026</div>
                      </div>
                    </div>
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

            {/* Content: Tabs and Visualization */}
            <div className="flex flex-col flex-1 overflow-hidden" style={{ fontFamily: "var(--font-ui)" }}>
              {/* Tabs */}
              <div className="flex border-b border-white/10 px-6 shrink-0 pt-2 gap-2">
                <button
                  onClick={() => setActiveTab("EC")}
                  className={`px-6 py-3.5 font-bold text-sm transition-colors border-b-2 ${activeTab === "EC" ? "border-emerald-400 text-emerald-400" : "border-transparent text-white/50 hover:text-white hover:border-white/30"} cursor-pointer bg-transparent uppercase tracking-wider`}
                >
                  Exec. Chair Car (EC)
                </button>
                <button
                  onClick={() => setActiveTab("CC")}
                  className={`px-6 py-3.5 font-bold text-sm transition-colors border-b-2 ${activeTab === "CC" ? "border-emerald-400 text-emerald-400" : "border-transparent text-white/50 hover:text-white hover:border-white/30"} cursor-pointer bg-transparent uppercase tracking-wider`}
                >
                  AC Chair Car (CC)
                </button>
              </div>

              {/* Vacancy Visualization */}
              <div className="p-6 overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>Coach Vacancy Details</h3>
                
                <div className="flex flex-col gap-6">
                  {coaches.map((coach) => (
                    <div key={coach.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-5">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-white font-mono bg-white/10 px-3 py-1 rounded-lg">{coach.id}</span>
                          {coach.status === "Full" ? (
                            <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider rounded border border-red-500/20">FULL</span>
                          ) : (
                            <span className="text-white/80 text-sm font-medium"><strong className="text-emerald-400">{coach.vacantSeats.length}</strong> Vacant Berth(s)</span>
                          )}
                        </div>
                      </div>
                      
                      {coach.status === "Full" ? (
                        <div className="flex justify-center items-center py-8">
                           <span className="text-red-400/80 font-bold text-sm flex items-center gap-2">
                             <X className="w-5 h-5" /> No vacant seats available in this coach.
                           </span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-white/40 mb-4 tracking-wider">Seat Map Preview (Vacant seats highlighted)</p>
                          <div className="flex flex-wrap gap-2.5">
                            {/* Render a grid of 78 seats for CC to simulate a coach */}
                            {Array.from({ length: 78 }, (_, i) => i + 1).map((seatNum) => {
                              const isVacant = coach.vacantSeats.includes(seatNum);
                              return (
                                <div 
                                  key={seatNum}
                                  className={`w-9 h-9 rounded-lg text-xs font-mono font-bold flex items-center justify-center border transition-all ${
                                    isVacant 
                                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 cursor-pointer hover:bg-emerald-500/30 hover:scale-110 shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
                                      : "bg-black/20 border-white/5 text-white/20"
                                  }`}
                                  title={isVacant ? `Seat ${seatNum} - Vacant` : `Seat ${seatNum} - Occupied`}
                                >
                                  {seatNum}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
