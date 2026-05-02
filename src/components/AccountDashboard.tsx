import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  User, Calendar, Users, Wallet, Settings, Clock, 
  MapPin, Train, ShieldCheck, ChevronRight,
  Plus, Edit2, Trash2, ArrowLeft
} from "lucide-react";

type Tab = "dashboard" | "bookings" | "passengers" | "wallet" | "settings";

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [timeLeft, setTimeLeft] = useState({ h: 14, m: 22, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "passengers", label: "Master Passenger List", icon: Users },
    { id: "wallet", label: "Wallet & Refunds", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-24 pb-12 px-4 md:px-8 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back To Home
            </Link>

            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-xl">
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200 dark:border-white/10 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-heading)" }}>AS</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Aditya Sharma
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer border ${
                        isActive 
                          ? "bg-blue-50 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/50 text-blue-700 dark:text-white" 
                          : "bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="col-span-12 md:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === "dashboard" || activeTab === "bookings" ? (
                  <DashboardView timeLeft={timeLeft} />
                ) : activeTab === "passengers" ? (
                  <PassengersView />
                ) : activeTab === "wallet" ? (
                  <WalletView />
                ) : (
                  <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm backdrop-blur-xl h-full min-h-[400px] flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Settings panel under construction</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardView({ timeLeft }: { timeLeft: { h: number; m: number; s: number } }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
        My Dashboard
      </h1>
      
      {/* Upcoming Journey */}
      <div className="bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">Upcoming Journey</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-mono">PNR: 8432091234</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Mumbai Rajdhani (12952)
            </h2>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium" style={{ fontFamily: "var(--font-ui)" }}>
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" /> New Delhi (NDLS)</div>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Mumbai Central (MMCT)</div>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-white/5 backdrop-blur-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Departs In</span>
            <div className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
              <div className="flex flex-col items-center"><span className="text-blue-600 dark:text-blue-400">{timeLeft.h.toString().padStart(2, '0')}</span><span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">HRS</span></div>
              <span className="text-slate-300 dark:text-slate-600 pb-4">:</span>
              <div className="flex flex-col items-center"><span className="text-blue-600 dark:text-blue-400">{timeLeft.m.toString().padStart(2, '0')}</span><span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">MIN</span></div>
              <span className="text-slate-300 dark:text-slate-600 pb-4">:</span>
              <div className="flex flex-col items-center"><span className="text-emerald-600 dark:text-emerald-400">{timeLeft.s.toString().padStart(2, '0')}</span><span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">SEC</span></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-white/10 relative z-10" style={{ fontFamily: "var(--font-ui)" }}>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Date</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Tomorrow, 16:35</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Class</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">AC 2 Tier (2A)</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Passenger(s)</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">2 Adults</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Status</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">CNF • B2, 45, 46</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-4" style={{ fontFamily: "var(--font-heading)" }}>
        Past Trips
      </h3>
      <div className="flex flex-col gap-3">
        {[
          { train: "Vande Bharat Exp (22436)", date: "12 Oct 2025", route: "NDLS → BSB", status: "Completed" },
          { train: "Shatabdi Exp (12002)", date: "05 Sep 2025", route: "NDLS → RKMP", status: "Completed" },
        ].map((trip, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-400/10 transition-colors">
                <Train className="w-5 h-5" />
              </div>
              <div style={{ fontFamily: "var(--font-ui)" }}>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">{trip.train}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  <span>{trip.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span>{trip.route}</span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">
              {trip.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PassengersView() {
  const passengers = [
    { name: "Aditya Sharma", age: 28, gender: "Male", berth: "Lower" },
    { name: "Priya Sharma", age: 26, gender: "Female", berth: "Lower" },
    { name: "Ramesh Sharma", age: 58, gender: "Male", berth: "Lower" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Master Passenger List
        </h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors text-sm shadow-lg shadow-blue-900/20 cursor-pointer border-none">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {passengers.map((p, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm backdrop-blur-xl relative group hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1.5">
              <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-400/10 rounded-md transition-colors cursor-pointer border-none">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md transition-colors cursor-pointer border-none">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 pr-16" style={{ fontFamily: "var(--font-heading)" }}>{p.name}</h3>
            <div className="grid grid-cols-3 gap-2" style={{ fontFamily: "var(--font-ui)" }}>
              <div>
                <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1 tracking-wider">Age</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">{p.age} yrs</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1 tracking-wider">Gender</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">{p.gender}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1 tracking-wider">Pref. Berth</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">{p.berth}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletView() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
        Wallet & Refunds
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm dark:shadow-lg dark:shadow-emerald-900/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
            <Wallet className="w-32 h-32 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="relative z-10" style={{ fontFamily: "var(--font-ui)" }}>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Current iMudra Balance</p>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">₹ 1,450.00</h2>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer border-none shadow-lg shadow-emerald-900/20">
                + Add Money
              </button>
              <button className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold rounded-xl text-sm transition-colors cursor-pointer border-none">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-xl backdrop-blur-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>SBI Loyalty Points</p>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 mb-2 tracking-tight">
            1,200 Pts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium" style={{ fontFamily: "var(--font-ui)" }}>Redeemable for ₹300 off on your next booking.</p>
          <button className="px-5 py-2.5 w-full border border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-xl text-sm transition-colors cursor-pointer">
            View Rewards Catalog
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-4" style={{ fontFamily: "var(--font-heading)" }}>
        Recent Transactions
      </h3>
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm backdrop-blur-xl">
        <table className="w-full text-left border-collapse" style={{ fontFamily: "var(--font-ui)" }}>
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <th className="py-3 px-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Date</th>
              <th className="py-3 px-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Description</th>
              <th className="py-3 px-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Status</th>
              <th className="py-3 px-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 dark:text-slate-300">
            {[
              { date: "29 Oct", desc: "Refund: Cancelled Ticket (PNR: 81293)", status: "Credited", amt: "+₹ 1,845", positive: true },
              { date: "15 Oct", desc: "Booking: Mumbai Rajdhani", status: "Paid", amt: "-₹ 2,450", positive: false },
              { date: "10 Oct", desc: "Wallet Top-up", status: "Success", amt: "+₹ 1,000", positive: true },
            ].map((txn, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 font-medium">{txn.date}</td>
                <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-white">{txn.desc}</td>
                <td className="py-3.5 px-5">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${txn.positive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                    {txn.status}
                  </span>
                </td>
                <td className={`py-3.5 px-5 text-right font-mono font-bold text-[15px] ${txn.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {txn.amt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
